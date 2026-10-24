import type { ContentItem, PortfolioSection } from "../types/content"

export const allowedLayouts: PortfolioSection["layout"][] = [
  "hero",
  "editorial",
  "metrics",
  "timeline",
  "quotes",
  "contact",
]

export const allowedMotion: NonNullable<PortfolioSection["animation"]>[] = [
  "none",
  "fade-in",
  "fade-up",
  "stagger",
  "image-reveal",
  "metric-count",
]

export function clampNumber(
  value: string | number,
  minimum: number,
  maximum: number,
  fallback: number,
) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(maximum, Math.max(minimum, parsed))
}

export function isSafePublicUrl(value: string) {
  if (value.startsWith("mailto:"))
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.slice(7))
  if (value.startsWith("https://")) {
    try {
      return new URL(value).protocol === "https:"
    } catch {
      return false
    }
  }
  return false
}

export function validateContentItems(items: ContentItem[]) {
  const errors: string[] = []
  items.forEach((item, index) => {
    if (!item.title.trim())
      errors.push(`Item ${index + 1}: título obrigatório.`)
    if (item.image && !item.alt?.trim())
      errors.push(
        `Item ${index + 1}: imagem informativa exige texto alternativo.`,
      )
    if (
      item.meta &&
      (/^(javascript|data|vbscript):/i.test(item.meta) ||
        (/^(https|mailto)/.test(item.meta) && !isSafePublicUrl(item.meta)))
    )
      errors.push(`Item ${index + 1}: URL inválida ou insegura.`)
  })
  return errors
}
