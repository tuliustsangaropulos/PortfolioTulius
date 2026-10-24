import { readdir, readFile } from "node:fs/promises"
import { gzipSync } from "node:zlib"

const assetsUrl = new URL("../dist/assets/", import.meta.url)
const files = (await readdir(assetsUrl))
  .filter((name) => /\.(js|css)$/.test(name))

const assets = await Promise.all(files.map(async (name) => {
  const contents = await readFile(new URL(name, assetsUrl))
  return {
    name,
    bytes: contents.byteLength,
    gzip: gzipSync(contents).byteLength,
    kind: name.endsWith(".js") ? "JS" : "CSS",
  }
}))

const js = assets.filter((asset) => asset.kind === "JS")
const kb = (value) => (value / 1000).toFixed(2)
for (const asset of assets.sort((a, b) => b.bytes - a.bytes)) {
  console.log(`P2 bundle: ${asset.name}: ${kb(asset.bytes)} kB; gzip ${kb(asset.gzip)} kB`)
}
console.log(`P2 bundle: ${js.length} JS chunks, ${kb(js.reduce((n, a) => n + a.bytes, 0))} kB total JS minified`)
const largest = js.reduce((max, chunk) => Math.max(max, chunk.bytes), 0)
if (largest > 500_000) {
  console.warn(`P2 budget: largest JS chunk ${kb(largest)} kB exceeds 500 kB; investigate splitting.`)
} else {
  console.log(`P2 budget: largest JS chunk ${kb(largest)} kB (within 500 kB target).`)
}
