import puppeteer from "puppeteer-core"

// P5: anonymous production contract. Uses only the publicly exposed browser API key.
// No Auth login, privileged key, modification, or Storage upload.
const browser = await puppeteer.launch({
  channel: "chrome", headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
let passed = 0
try {
  const page = await browser.newPage()
  let restOrigin = ""
  let publicHeaders = null
  page.on("request", (request) => {
    const url = request.url()
    if (publicHeaders || !url.includes(".supabase.co/rest/v1/sections")) return
    const headers = request.headers()
    if (!headers.apikey || !url.startsWith("https://")) return
    restOrigin = new URL(url).origin
    // Never log public key values. Only reuse the exact request's browser credentials.
    publicHeaders = { apikey: headers.apikey, authorization: headers.authorization ?? "" }
  })
  await page.goto("https://tulius.work/", { waitUntil: "networkidle2", timeout: 45000 })
  await page.waitForFunction(
    () => document.querySelectorAll("section.portfolio-section").length === 14,
    { timeout: 15000 },
  )
  if (!publicHeaders || !restOrigin) throw new Error("Public Supabase requests were not observed")

  const result = await page.evaluate(async ({ origin, headers }) => {
    const read = async (table, cols) => {
      const url = new URL("/rest/v1/" + table, origin)
      url.searchParams.set("select", cols)
      const response = await fetch(url.href, { headers })
      if ([401, 403].includes(response.status)) return { status: response.status, rows: [] }
      if (!response.ok) throw new Error(table + ": HTTP " + response.status)
      const rows = await response.json()
      if (!Array.isArray(rows)) throw new Error(table + ": response is not an array")
      return { status: response.status, rows }
    }
    const [sections, admins, issues, revisions, logs] = await Promise.all([
      read("sections", "slug,status,is_visible"),
      read("admin_users", "user_id"),
      read("editorial_issues", "id"),
      read("content_revisions", "id"),
      read("audit_logs", "id"),
    ])
    return {
      publicSections: sections.rows.length,
      nonPublished: sections.rows.filter(x => x.status !== "published" || !x.is_visible).length,
      adminsExposed: admins.rows.length,
      issuesExposed: issues.rows.length,
      revisionsExposed: revisions.rows.length,
      auditLogsExposed: logs.rows.length,
      privateStatuses: [admins.status, issues.status, revisions.status, logs.status],
    }
  }, { origin: restOrigin, headers: publicHeaders })

  if (result.publicSections !== 14 || result.nonPublished ||
      result.adminsExposed || result.issuesExposed ||
      result.revisionsExposed || result.auditLogsExposed) {
    throw new Error("Public RLS contract mismatch: " + JSON.stringify(result))
  }
  passed++
  console.log("P5_PUBLIC_RLS " + JSON.stringify({ result: "PASS", ...result }))

  for (const route of ["/admin", "/admin/preview"]) {
    await page.goto("https://tulius.work" + route, { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForFunction(() => location.pathname === "/admin/login", { timeout: 15000 })
    passed++
  }
  console.log("P5_PUBLIC_ADMIN_ROUTES " + JSON.stringify({ result: "PASS", routes: 2 }))
} finally {
  await browser.close()
}
console.log("P5_PUBLIC_RESULT " + JSON.stringify({ passed, expected: 3, mutations: 0 }))
if (passed !== 3) process.exitCode = 1
