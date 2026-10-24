import type { PortfolioSection } from "../types/content"

export type NavigationRow = {
  label: string
  target_slug: string
  group_name: string
  sort_order: number
  is_visible: boolean
  status: string
}

export type PublicNavigationItem = {
  slug: string
  label: string
  group: string
  number: number
}

export function buildPublicNavigation(
  sections: PortfolioSection[],
  records: NavigationRow[],
): PublicNavigationItem[] {
  const published = new Map(
    sections
      .filter((section) => section.status === "published" && section.visible)
      .map((section) => [section.slug, section]),
  )
  const targets = new Set<string>()
  return records
    .filter((record) => record.status === "published" && record.is_visible)
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((record) => {
      const section = published.get(record.target_slug)
      if (!section || targets.has(record.target_slug)) return []
      targets.add(record.target_slug)
      return [
        {
          slug: section.slug,
          label: record.label.trim() || section.title,
          group: record.group_name.trim() || "Principal",
          number: section.number,
        },
      ]
    })
}
