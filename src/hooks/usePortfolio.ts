import { useEffect, useState } from "react"
import {
  defaultTokens,
  sections as fallbackSections,
} from "../content/fallback"
import { supabase } from "../lib/supabase"
import { buildPublicNavigation, type PublicNavigationItem, type NavigationRow } from "../lib/navigation"
import {
  collectionToItems, isCollectionSource, resolveCollectionBlocks,
  type CollectionSource,
} from "../lib/collections"
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
  collectionItems: Map<CollectionSource, import("../types/content").ContentItem[]>,
): PortfolioSection {
  const blocks = resolveCollectionBlocks(row.content_blocks ?? [], collectionItems)
  const composition = composeSectionPlacements(
    row.id, blocks, panels, placements, includeDrafts,
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
  const [navigation, setNavigation] = useState<PublicNavigationItem[]>([])
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
        .select("label,target_slug,group_name,sort_order,is_visible,status")
        .eq("status", "published").eq("is_visible", true).order("sort_order"),
      supabase.from("pages")
        .select("seo_title,seo_description")
        .eq("slug", "home").eq("status", "published").maybeSingle(),
      supabase.from("site_settings")
        .select("site_title,description,seo_json,locale")
        .eq("status", "published").limit(1).maybeSingle(),
    ]).then(async ([
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
        setNavigation([])
        setSource("supabase")
        setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
      } else {
        const sectionRows = sectionsResult.data as SectionResult[]
        const activeSources = new Set<CollectionSource>()
        for (const section of sectionRows) {
          for (const block of section.content_blocks ?? []) {
            if (isCollectionSource(block.content_json?.source_collection)) {
              activeSources.add(block.content_json.source_collection)
            }
          }
        }
        // Fetch only explicitly bound collections; existing manual blocks
        // require no extra queries and retain their exact visual content.
        const collectionItems = new Map<
          CollectionSource, import("../types/content").ContentItem[]
        >()
        if (activeSources.size) {
          const results = await Promise.all(
            Array.from(activeSources).map(async (source) => {
              const query = supabase.from(source).select("*").order("sort_order")
              const response = includeDrafts
                ? await query.neq("status", "archived")
                : await query.eq("status", "published")
              if (response.error) throw response.error
              return [source, collectionToItems(source, response.data ?? [], includeDrafts)] as const
            }),
          )
          if (cancelled) return
          for (const [source, items] of results) collectionItems.set(source, items)
        }
        const mappedSections = sectionRows.map(
          (section) => toSection(
            section,
            (panelsResult.data ?? []) as SectionPanelRow[],
            (placementsResult.data ?? []) as BlockPlacementRow[],
            includeDrafts,
            collectionItems,
          ),
        )
        const navRecords = (navigationResult.data ?? []) as NavigationRow[]
        const linked = buildPublicNavigation(mappedSections, navRecords)
        setNavigation(
          navigationResult.error
            ? mappedSections
                .filter((section) => section.status === "published" && section.visible)
                .map((section) => ({
                  slug: section.slug,
                  label: section.title,
                  group: "Principal",
                  number: section.number,
                }))
            : linked,
        )
        setData(
          mappedSections.map((section) => ({
            ...section,
            navLabel: navRecords.find((record) =>
              record.target_slug === section.slug && record.is_visible &&
              record.status === "published"
            )?.label ?? section.title,
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
        if (title) {
          document.title = title
          setMeta("og:title", title, "property")
        }
        if (description) {
          setMeta("description", description)
          setMeta("og:description", description, "property")
          setMeta("twitter:description", description)
        }
        const seo = settingsResult.data?.seo_json as {
          ogImage?: string
          canonical?: string
          robots?: string
        } | undefined
        if (seo?.ogImage?.startsWith("https://")) {
          setMeta("og:image", seo.ogImage, "property")
          setMeta("twitter:image", seo.ogImage)
          setMeta("twitter:card", "summary_large_image")
        }
        if (/^(index|noindex),(follow|nofollow)$/.test(seo?.robots ?? ""))
          setMeta("robots", seo!.robots!)
        if (settingsResult.data?.locale?.match(/^[a-z]{2}-[A-Z]{2}$/))
          setMeta("og:locale", settingsResult.data.locale.replace("-", "_"), "property")
        setCanonical(
          seo?.canonical?.startsWith("https://")
            ? seo.canonical
            : "https://tulius.work/",
        )
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setData([])
      setNavigation([])
      setSource("supabase")
      setError("Não foi possível carregar o conteúdo do site. Tente novamente.")
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [includeDrafts])

  return { sections: data, navigation, tokens, source, loading, error }
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
