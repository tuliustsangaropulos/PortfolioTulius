import fs from "node:fs"
import path from "node:path"

const directory = process.argv[2]
if (!directory) throw new Error("Usage: node scripts/p3-lcp-repeats.mjs <reports-directory>")

const samples = ["lighthouse-mobile.json", "lighthouse-mobile-2.json", "lighthouse-mobile-3.json"]
  .map((name) => {
    const report = JSON.parse(fs.readFileSync(path.join(directory, name), "utf8"))
    const metric = (id) => report.audits[id]?.numericValue ?? null
    return {
      fetchTime: report.fetchTime,
      score: Math.round((report.categories.performance.score ?? 0) * 100),
      lcpMs: metric("largest-contentful-paint"),
      fcpMs: metric("first-contentful-paint"),
      tbtMs: metric("total-blocking-time"),
      cls: metric("cumulative-layout-shift"),
      runtimeError: Boolean(report.runtimeError),
    }
  })

const median = (values) => {
  if (values.some((value) => !Number.isFinite(value))) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[1]
}
if (samples.some((sample) => sample.runtimeError || !Number.isFinite(sample.lcpMs))) {
  console.log("P3_MOBILE_REPEAT_FAILURE " + JSON.stringify(samples))
  process.exitCode = 1
} else {
  console.log("P3_MOBILE_REPEATS " + JSON.stringify({
    samples,
    median: {
      performance: median(samples.map((s) => s.score)),
      lcpMs: median(samples.map((s) => s.lcpMs)),
      fcpMs: median(samples.map((s) => s.fcpMs)),
      tbtMs: median(samples.map((s) => s.tbtMs)),
      cls: median(samples.map((s) => s.cls)),
    },
    lcpRangeMs: [Math.min(...samples.map((s) => s.lcpMs)), Math.max(...samples.map((s) => s.lcpMs))],
  }))
}
