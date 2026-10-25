import { readFileSync } from "node:fs"
import path from "node:path"

// P6 release guard for synthetic Lighthouse runs. Scores vary across CI runners,
// so thresholds flag severe regressions without pretending to be field Web Vitals.
const directory = process.argv[2]
if (!directory) throw new Error("Usage: node p6-lighthouse-guard.mjs <reports-directory>")
const bounds = {
  mobile: { performance: 0.55, lcpMs: 6500 },
  desktop: { performance: 0.90, lcpMs: 3000 },
}
const errors = []
for (const device of ["mobile", "desktop"]) {
  const file = path.join(directory, "lighthouse-" + device + ".json")
  const report = JSON.parse(readFileSync(file, "utf8"))
  const categories = report.categories ?? {}
  const performance = categories.performance?.score ?? 0
  const lcpMs = report.audits?.["largest-contentful-paint"]?.numericValue
  const cls = report.audits?.["cumulative-layout-shift"]?.numericValue
  if (performance < bounds[device].performance)
    errors.push(device + ": performance below budget")
  for (const category of ["accessibility", "seo", "best-practices"]) {
    if ((categories[category]?.score ?? 0) < 0.95)
      errors.push(device + ": " + category + " below 95")
  }
  if (typeof lcpMs !== "number" || lcpMs > bounds[device].lcpMs)
    errors.push(device + ": LCP exceeds synthetic budget")
  if (typeof cls !== "number" || cls > 0.1)
    errors.push(device + ": CLS exceeds 0.1")
  if (report.runtimeError) errors.push(device + ": runtime error")
  console.log("P6_PERFORMANCE_BUDGET " + JSON.stringify({
    device, result: errors.some(x => x.startsWith(device + ":")) ? "FAIL" : "PASS",
    performance: Math.round(performance * 100), lcpMs, cls,
  }))
}
if (errors.length) {
  console.error("P6_RELEASE_REGRESSIONS " + JSON.stringify(errors))
  process.exitCode = 1
}
