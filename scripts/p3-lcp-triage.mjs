import { readFileSync } from "node:fs"
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
}
