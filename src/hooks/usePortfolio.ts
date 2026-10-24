import { useEffect, useState } from "react"
import {
  defaultTokens,
  sections as fallbackSections,
} from "../content/fallback"
import { supabase } from "../lib/supabase"
import {
  composeSectionPlacements,
  type BlockPlacementRow,
  type ContentBlockRow,
  type SectionPanelRow,
} from "../lib/placements"
import type { DesignTokens, PortfolioSection } from "../types/content"

type SectionResult = {
  id: string
  slug: string
  sort_order: number
  title: string
  eyebrow: string | null
  intro: string | null
  theme: PortfolioSection["theme"] | null
  layout_variant: PortfolioSection["layout"] | null
  animation_preset: PortfolioSection["animation"] | null
  status: PortfolioSection["status"]
  is_visible: boolean
  content_blocks?: ContentBlockRow[]
}

function toSection(
  row: SectionResult,
  panels: SectionPanelRow[],
  placements: BlockPlacementRow[],
  includeDrafts: boolean,
): PortfolioSection {
  const composition = composeSectionPlacements(
    row.id, row.content_blocks ?? [], panels, placements, includeDrafts,
  )
  return {
    id: row.id,
    slug: row.slug,
    number: row.sort_order,
    title: row.title,
    eyebrow: row.eyebrow ?? undefined,
    intro: row.intro ?? undefined,
    theme: row.theme ?? "paper",
    layout: row.layout_variant ?? "editorial",
    animation: row.animation_preset ?? "fade-up",
    status: row.status,
    visible: row.is_visible,
    panelA: composition.mobileA,
    panelB: composition.mobileB,
    desktopPanelA: composition.desktopA,
    desktopPanelB: composition.desktopB,
  }
}

export function usePortfolio(includeDrafts = false) {
  const [data, setData] = useState<PortfolioSection[]>(
    supabase ? [] : fallbackSections,
  )
  const [tokens, setTokens] = useState(defaultTokens)
  const [source, setSource] = useState<"supabase" | "fallback">(
    supabase ? "supabase" : "fallback",
  )
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    setLoading(true)
    let query = supabase
      .from("sections")
      .select("*, content_blocks(*)")
      .order("sort_order")
    if (!includeDrafts)
      query = query.eq("status", "published").eq("is_visible", true)

    void Promise.all([
      query,
      supabase.from("section_panels")
        .select("id,section_id,panel_key"),
      supabase.from("block_placements")
        .select("block_id,panel_id,sort_order,layout_variant,is_visible,style_config,motion_config"),
      supabase.from("design_tokens")
        .select("token_key,token_value").eq("status", "published"),
      supabase.from("navigation_items")
        .select("label,target_slug,sort_order")
        .eq("status", "published").eq("is_visible", true).order("sort_order"),
      supabase.from("pages")
        .select("seo_title,seo_description")
        .eq("slug", "home").eq("status", "published").maybeSingle(),
      supabase.from("site_settings")
        .select("site_title,description,seo_json")
        .eq("status", "published").limit(1).maybeSingle(),
    ]).then(([
      sectionsResult, panelsResult, placementsResult,
      tokenResult, navigationResult, pageResult, settingsResult,
    ]) => {
      if (cancelled) return
      const contentError =
        sectionsResult.error ?? panelsResult.error ?? placementsResult.error
      if (contentError) {
        // Fail closed: never substitute stale fallback content when
        // an explicitly configured publication database is unavailable.
        setData([])
        setSource("supabase")
        setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
      } else {
        const labels = new Map(
          (navigationResult.data ?? []).map((item) => [
            item.target_slug, item.label,
          ]),
        )
        setData(
          (sectionsResult.data as SectionResult[]).map((section) => ({
            ...toSection(
              section,
              (panelsResult.data ?? []) as SectionPanelRow[],
              (placementsResult.data ?? []) as BlockPlacementRow[],
              includeDrafts,
            ),
            navLabel: labels.get(section.slug) ?? section.title,
          })),
        )
        setSource("supabase")
        setError(null)
      }
        if (!tokenResult.error && tokenResult.data?.length) {
          const next = { ...defaultTokens }
          tokenResult.data.forEach((t) => {
            const key = t.token_key.replace("color.", "")
            if (
              [
                "orange",
                "ink",
                "paper",
                "cream",
                "muted",
                "orangeDark",
              ].includes(key)
            )
              Object.assign(next, { [key]: t.token_value })
            if (t.token_key === "font.heading")
              next.headingFont =
                t.token_value === "Inter" ? "Inter" : "Big Shoulders Display"
            if (t.token_key === "font.body")
              next.bodyFont =
                t.token_value === "Big Shoulders Display"
                  ? "Big Shoulders Display"
                  : "Inter"
            if (t.token_key === "layout.container")
              next.container = Math.min(
                1920,
                Math.max(960, Number(t.token_value) || 1680),
              )
            if (t.token_key === "space.section")
              next.sectionSpace = Math.min(
                120,
                Math.max(32, Number(t.token_value) || 64),
              )
            if (t.token_key === "motion.duration")
              next.motionDuration = Math.min(
                1200,
                Math.max(0, Number(t.token_value) || 520),
              )
          })
          setTokens(next)
        }
        const title =
          pageResult.data?.seo_title ?? settingsResult.data?.site_title
        const description =
          pageResult.data?.seo_description ?? settingsResult.data?.description
        if (title) document.title = title
        if (description) setMeta("description", description)
        const seo = settingsResult.data?.seo_json as {
          ogImage?: string
          canonical?: string
        } | undefined
        if (seo?.ogImage?.startsWith("https://"))
          setMeta("og:image", seo.ogImage, "property")
        if (seo?.canonical?.startsWith("https://")) setCanonical(seo.canonical)
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setData([])
      setSource("supabase")
      setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [includeDrafts])

  return { sections: data, tokens, source, loading, error }
}

function setMeta(name: string, content: string, attribute = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${name}"]`,
  )
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )
  if (!element) {
    element = document.createElement("link")
    element.rel = "canonical"
    document.head.appendChild(element)
  }
  element.href = href
}
