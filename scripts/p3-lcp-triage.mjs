import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

// Read-only diagnostic for Lighthouse 13+ JSON. Never changes score thresholds
// or asserts that synthetic Lighthouse is equivalent to field Core Web Vitals.
const directory = process.argv[2]
if (!directory) throw new Error("Usage: node p3-lcp-triage.mjs <reports-directory>")

function nodeSummary(value, depth = 0) {
  if (!value || typeof value !== "object" || depth > 4) return null
  if (Array.isArray(value)) {
    for (const entry of value.slice(0, 8)) {
      const candidate = nodeSummary(entry, depth + 1)
      if (candidate) return candidate
    }
    return null
  }
  if (value.selector || value.snippet) return {
    selector: value.selector ?? null,
    snippet: typeof value.snippet === "string" ? value.snippet.slice(0, 180) : null,
  }
  for (const entry of Object.values(value).slice(0, 12)) {
    const candidate = nodeSummary(entry, depth + 1)
    if (candidate) return candidate
  }
  return null
}

for (const device of ["mobile", "desktop"]) {
  const report = JSON.parse(readFileSync(path.join(directory, `lighthouse-${device}.json`), "utf8"))
  const audits = report.audits ?? {}
  const insights = [
    "lcp-breakdown-insight",
    "lcp-discovery-insight",
    "render-blocking-insight",
    "image-delivery-insight",
    "font-display-insight",
  ]
  const diagnostics = Object.fromEntries(insights.map((id) => {
    const audit = audits[id]
    if (!audit) return [id, { available: false }]
    const details = audit.details ?? {}
    // Use only compact, nonsensitive structural signals from the public-site audit.
    return [id, {
      available: true,
      score: audit.score ?? null,
      displayValue: audit.displayValue ?? null,
      metricSavings: audit.metricSavings ?? null,
      itemCount: details.items?.length ?? 0,
      lcpElement: nodeSummary(details.items),
    }]
  }))
  const breakdownParts = audits["lcp-breakdown-insight"]?.details?.items
    ?.find((item) => item.type === "table")?.items ?? []
  const longTasks = audits["long-tasks"]?.details?.items ?? []
  const mainThread = audits["mainthread-work-breakdown"]?.details?.items ?? []
  const blockers = audits["render-blocking-insight"]?.details?.items ?? []
  const bootup = audits["bootup-time"]?.details?.items ?? []
  console.log("P3_LCP_DIAGNOSTICS " + JSON.stringify({
    device,
    fetchTime: report.fetchTime,
    finalDisplayedUrl: report.finalDisplayedUrl,
    lighthouseVersion: report.lighthouseVersion,
    lcpMs: audits["largest-contentful-paint"]?.numericValue ?? null,
    fcpMs: audits["first-contentful-paint"]?.numericValue ?? null,
    tbtMs: audits["total-blocking-time"]?.numericValue ?? null,
    cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
    lcpNode: nodeSummary(audits["largest-contentful-paint-element"]?.details?.items) ??
      nodeSummary(audits["lcp-breakdown-insight"]?.details?.items) ??
      nodeSummary(audits["lcp-discovery-insight"]?.details?.items),
    diagnostics,
    breakdown: breakdownParts.map((item) => ({
      phase: item.subpart, durationMs: item.duration,
    })),
    topLongTasks: longTasks.slice(0,5).map((item) => ({
      resource: item.url?.split("/").at(-1), durationMs: item.duration,
    })),
    mainThread: mainThread.slice(0,4).map((item) => ({
      group: item.group, durationMs: item.duration,
    })),
    renderBlocking: blockers.slice(0,4).map((item) => ({
      resource: item.url?.split("/").at(-1)?.slice(0,90), wastedMs: item.wastedMs,
    })),
    bootup: bootup.slice(0,4).map((item) => ({
      resource: item.url?.split("/").at(-1), totalMs: item.total,
      scriptingMs: item.scripting,
    })),
  }))
  // These signals are diagnostic only. Lighthouse's simulated mobile LCP is
  // not field RUM and its modeled savings are not measured improvements.
  const requests = audits["network-requests"]?.details?.items ?? []
  const unusedScripts = audits["unused-javascript"]?.details?.items ?? []
  const fcp = audits["first-contentful-paint"]?.numericValue
  const lcp = audits["largest-contentful-paint"]?.numericValue
  const scriptName = (url) => {
    try {
      return new URL(url).pathname.split("/").at(-1)?.slice(0, 90) ?? "unknown"
    } catch {
      return "unknown"
    }
  }
  console.log("P3_LCP_CRITICAL_PATH " + JSON.stringify({
    device,
    fcpToLcpMs: Number.isFinite(fcp) && Number.isFinite(lcp)
      ? Math.round(lcp - fcp) : null,
    preflightCount: requests.filter((item) =>
      item.resourceType === "Preflight" &&
      typeof item.url === "string" &&
      item.url.includes(".supabase.co/rest/v1/")).length,
    initialScripts: requests.filter((item) => item.resourceType === "Script")
      .slice(0, 8).map((item) => ({
        resource: scriptName(item.url),
        transferBytes: item.transferSize ?? null,
        priority: item.priority ?? null,
      })),
    unusedScripts: unusedScripts.slice(0, 6).map((item) => ({
      resource: scriptName(item.url),
      transferBytes: item.totalBytes ?? null,
      wastedBytes: item.wastedBytes ?? null,
      wastedPercent: item.wastedPercent ?? null,
    })),
    largestOtherImages: requests.filter((item) =>
      item.resourceType === "Image" &&
      typeof item.url === "string" &&
      !item.url.includes("/media/tulius-site-"))
      .sort((a, b) => (b.transferSize ?? 0) - (a.transferSize ?? 0))
      .slice(0, 4).map((item) => ({
        transferBytes: item.transferSize ?? null,
        priority: item.priority ?? null,
      })),
  }))
}


// The regular Lighthouse mobile score is calculated under simulated network/CPU
// conditions. Insights above describe the browser's observed trace, which was
// gathered before that simulation. Compare like with like; never reinterpret
// an unthrottled observation as a mobile field Core Web Vital.
const sampleFiles = [
  "lighthouse-mobile.json",
  "lighthouse-mobile-2.json",
  "lighthouse-mobile-3.json",
]
const samples = sampleFiles.map((file) => {
  const report = JSON.parse(readFileSync(path.join(directory, file), "utf8"))
  const metrics = report.audits?.metrics?.details?.items?.[0] ?? {}
  return {
    file,
    observedLcpMs: metrics.observedLargestContentfulPaint ?? null,
    simulatedLcpMs: report.audits?.["largest-contentful-paint"]?.numericValue ?? null,
    observedFcpMs: metrics.observedFirstContentfulPaint ?? null,
    simulatedFcpMs: report.audits?.["first-contentful-paint"]?.numericValue ?? null,
    throttlingMethod: report.configSettings?.throttlingMethod ?? null,
  }
})
const median = (numbers) => {
  if (numbers.some((number) => !Number.isFinite(number))) return null
  return [...numbers].sort((a, b) => a - b)[1]
}
const appliedFile = path.join(directory, "lighthouse-mobile-devtools.json")
let applied = null
if (existsSync(appliedFile)) {
  const report = JSON.parse(readFileSync(appliedFile, "utf8"))
  const metrics = report.audits?.metrics?.details?.items?.[0] ?? {}
  applied = {
    throttlingMethod: report.configSettings?.throttlingMethod ?? null,
    lcpMs: report.audits?.["largest-contentful-paint"]?.numericValue ?? null,
    fcpMs: report.audits?.["first-contentful-paint"]?.numericValue ?? null,
    observedLcpMs: metrics.observedLargestContentfulPaint ?? null,
    observedFcpMs: metrics.observedFirstContentfulPaint ?? null,
    runtimeError: Boolean(report.runtimeError),
  }
}
console.log("P3_LCP_THROTTLING_COMPARISON " + JSON.stringify({
  samples,
  median: {
    observedLcpMs: median(samples.map((sample) => sample.observedLcpMs)),
    simulatedLcpMs: median(samples.map((sample) => sample.simulatedLcpMs)),
    observedFcpMs: median(samples.map((sample) => sample.observedFcpMs)),
    simulatedFcpMs: median(samples.map((sample) => sample.simulatedFcpMs)),
  },
  applied,
  // Do not mix this secondary result into performance budgets or field p75.
  appliedIsDiagnosticOnly: true,
}))
