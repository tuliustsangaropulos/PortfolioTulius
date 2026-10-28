export type MediaFraming = { x: number; y: number; zoom: number }
export const defaultMediaFraming: MediaFraming = { x: 50, y: 50, zoom: 1 }
const limit = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback
export function normalizeMediaFraming(value?: Partial<MediaFraming> | null): MediaFraming {
  return { x: limit(value?.x, 0, 100, 50), y: limit(value?.y, 0, 100, 50),
    zoom: limit(value?.zoom, 1, 3, 1) }
}
export function imageFramingStyle(value?: Partial<MediaFraming> | null) {
  if (!value) return undefined
  const c = normalizeMediaFraming(value)
  return { objectPosition: `${c.x}% ${c.y}%`, transform: `scale(${c.zoom})`,
    transformOrigin: `${c.x}% ${c.y}%` }
}
export function mediaFileName(path: string) {
  return path.split("/").filter(Boolean).at(-1) ?? path
}
