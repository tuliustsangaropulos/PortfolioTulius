import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

// Conservative synthetic budgets. Use the median of three mobile samples, not
// whichever single run happens to be the first, while retaining the strictest
// accessibility/SEO checks across the samples.
const directory = process.argv[2]
if (!directory) throw new Error("Usage: node p6-lighthouse-guard.mjs <reports-directory>")
const bounds = {
  mobile: { performance: 0.55, lcpMs: 6500 },
  desktop: { performance: 0.90, lcpMs: 3000 },
}
const median = (values) => {
  if (!values.every((v) => typeof v === "number" && Number.isFinite(v))) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
const errors = []
for (const device of ["mobile", "desktop"]) {
  const names = [
    "lighthouse-" + device + ".json",
    "lighthouse-" + device + "-2.json",
    "lighthouse-" + device + "-3.json",
  ]
  const reports = []
  for (const name of names) {
    const file = path.join(directory, name)
    if (!existsSync(file)) {
      errors.push(device + ": missing sample " + name)
      continue
    }
    reports.push(JSON.parse(readFileSync(file, "utf8")))
  }
  if (reports.length !== names.length) continue
  const performance = median(reports.map((r) => r.categories?.performance?.score))
  const lcpMs = median(reports.map((r) => r.audits?.["largest-contentful-paint"]?.numericValue))
  const cls = Math.max(...reports.map((r) => r.audits?.["cumulative-layout-shift"]?.numericValue ?? Infinity))
  if (performance === null || performance < bounds[device].performance)
    errors.push(device + ": median performance below budget")
  for (const category of ["accessibility", "seo", "best-practices"]) {
    if (reports.some((r) => (r.categories?.[category]?.score ?? 0) < 0.95))
      errors.push(device + ": " + category + " below 95 on a sample")
  }
  if (lcpMs === null || lcpMs > bounds[device].lcpMs)
    errors.push(device + ": median LCP exceeds synthetic budget")
  if (!Number.isFinite(cls) || cls > 0.1)
    errors.push(device + ": maximum CLS exceeds 0.1")
  if (reports.some((r) => r.runtimeError)) errors.push(device + ": runtime error")
  console.log("P6_PERFORMANCE_BUDGET " + JSON.stringify({
    device, result: errors.some((x) => x.startsWith(device + ":")) ? "FAIL" : "PASS",
    sampleCount: reports.length, performance: performance === null ? null : Math.round(performance * 100),
    lcpMs, cls, statistic: "median_three_runs_worst_a11y",
  }))
}
if (errors.length) {
  console.error("P6_RELEASE_REGRESSIONS " + JSON.stringify(errors))
  process.exitCode = 1
}
