import { useEffect, useId, useMemo, useState } from "react"
import { usePortfolio } from "../../hooks/usePortfolio"
import type {
  ContentItem,
  HeroVisualConfig,
  PortfolioSection,
} from "../../types/content"
import { Icon } from "../ui/Icons"
import { Navigation } from "./Navigation"

const heroDefaults = {
  badgeText: "VISÃO 360° DA COMUNICAÇÃO ·",
  panelBackground: "#171617",
  badgeBackground: "#FF5414",
  badgeColor: "#171617",
  introColor: "#FFFFFF",
}

function Badge360({ config }: { config?: HeroVisualConfig }) {
  const pathId = `badge-path-${useId().replace(/:/g, "")}`
  if (config?.badgeVisible === false) return null
  return (
    <div className="badge-360" aria-label="Visão 360 graus da comunicação">
      <svg viewBox="0 0 160 160" role="img">
        <defs>
          <path
            id={pathId}
            d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
          />
        </defs>
        <text>
          <textPath href={`#${pathId}`}>
            {config?.badgeText || heroDefaults.badgeText}
          </textPath>
        </text>
        <path d="M55 100 102 53M70 53h32v32" />
      </svg>
    </div>
  )
}

function ItemCard({
  item,
  index,
  layout,
  showArrow = false,
}: {
  item: ContentItem
  index: number
  layout: PortfolioSection["layout"]
  showArrow?: boolean
}) {
  const contact = layout === "contact" && item.meta?.match(/^(https|mailto)/)
  const presentation = item.placement
  const variant = ["compact", "featured", "wide"].includes(
    presentation?.layoutVariant ?? "",
  ) ? presentation?.layoutVariant : "default"
  const motionPreset = [
    "none", "fade-in", "fade-up", "stagger", "image-reveal", "metric-count",
  ].includes(String(presentation?.motionConfig?.preset ?? ""))
    ? String(presentation?.motionConfig?.preset) : undefined
  const className = [
    "content-item",
    "reveal",
    variant !== "default" ? `placement-${variant}` : "",
    motionPreset ? `placement-motion-${motionPreset}` : "",
    motionPreset === "fade-up" &&
    typeof presentation?.motionConfig?.distance === "number" &&
    presentation.motionConfig.distance !== 18
      ? "placement-motion-distance-custom" : "",
    item.image ? "has-image" : "",
    item.desktop?.visible === false ? "item-hidden-desktop" : "",
    item.mobile?.visible === false ? "item-hidden-mobile" : "",
  ]
    .filter(Boolean)
    .join(" ")
  const style = itemStyle(item)
  const content = (
    <>
      {item.image && (
        <img
          src={item.image}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
          fetchPriority={index === 0 ? "auto" : "low"}
        />
      )}
      <div className="item-copy">
        {item.label && <span className="item-label">{item.label}</span>}
        {item.value && <strong className="item-value">{item.value}</strong>}
        <h3>{item.title}</h3>
        {item.meta && !contact && <p className="item-meta">{item.meta}</p>}
        {item.text && <p>{item.text}</p>}
        {item.tags && (
          <ul className="tags">
            {item.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        {item.placeholder && (
          <span className="draft-chip">Rascunho editorial</span>
        )}
      </div>
      {(contact || (showArrow && item.icon !== "none")) && (
        <span className="item-arrow">
          <Icon name="arrow" />
        </span>
      )}
    </>
  )
  return contact ? (
    <a
      className={`${className} contact-link`}
      data-motion-once={presentation?.motionConfig?.once === false ? "false" : undefined}
      style={style}
      href={item.meta}
      target={item.meta?.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <article
      className={className}
      data-motion-once={presentation?.motionConfig?.once === false ? "false" : undefined}
      style={style}
    >
      {content}
    </article>
  )
}

function ProfileDesktop({ section }: { section: PortfolioSection }) {
  const panelA = section.desktopPanelA ?? section.panelA
  const panelB = section.desktopPanelB ?? section.panelB
  const areas = panelB.slice(0, 5)
  const careers = panelB.slice(5)
  const profile = panelA[0]
  const hero = profile?.hero
  if (!profile) return (
    <div className="desktop-editorial">
      <h2>{section.title}</h2>
      <p>Nenhum conteúdo publicado para este painel.</p>
    </div>
  )
  return (
    <div className="profile-desktop">
      <aside
        className="profile-sidebar"
        style={{ ...itemStyle(profile), ...heroStyle(hero) }}
      >
        <div className="profile-portrait">
          <img
              src={profile.image}
              alt={profile.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          <div className="years">
            <strong>{profile.title}</strong>
            <span>{profile.text}</span>
          </div>
          <Badge360 config={hero} />
        </div>
        <div className="profile-sidebar-content">
          <p className="profile-intro">{section.intro}</p>
          <div className="profile-highlights">
            {panelA.slice(1).map((item, i) => (
              <ItemCard
                key={item.title}
                item={item}
                index={i}
                layout="hero"
                showArrow
              />
            ))}
          </div>
        </div>
      </aside>
      <div className="profile-main">
        <div className="name-lockup">
          <span>TULIUS</span>
          <span>TSANGAROPULOS</span>
        </div>
        <p className="profile-role">{section.eyebrow}</p>
        <div className="area-grid">
          {areas.map((item) => (
            <ItemCard key={item.label} item={item} index={0} layout="hero" />
          ))}
        </div>
        <h2>Experiência e atuação</h2>
        <div className="career-grid">
          {careers.map((item, i) => (
            <ItemCard key={item.title} item={item} index={i} layout="hero" />
          ))}
        </div>
      </div>
    </div>
  )
}

function MobilePanel({
  section,
  panel,
  items,
}: {
  section: PortfolioSection
  panel: "a" | "b"
  items: ContentItem[]
}) {
  const isProfile = section.slug === "perfil"
  const profile = items[0]
  const hero = profile?.hero
  return (
    <div
      id={`${section.slug}-${panel}`}
      data-panel={panel}
      className={`mobile-panel panel-${panel}`}
    >
      {isProfile && panel === "a" && profile ? (
        <>
          <div className="mobile-name">
            <span>TULIUS</span>
            <span>TSANGAROPULOS</span>
          </div>
          <p className="mobile-role">{section.eyebrow}</p>
          <div
            className="mobile-profile-hero"
            style={{ ...itemStyle(profile), ...heroStyle(hero) }}
          >
            <img
              src={profile.image}
              alt={profile.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div>
              <strong>{profile.title}</strong>
              <p>{profile.text}</p>
            </div>
            <Badge360 config={hero} />
          </div>
          <p
            className="mobile-intro"
            style={{
              ...heroStyle(hero),
              color: hero?.introColor ?? undefined,
            }}
          >
            {section.intro}
          </p>
          <div className="mobile-highlights">
            <h2>Destaques</h2>
            <div>
              {items.slice(1).map((item, i) => (
                <ItemCard
                  key={item.title}
                  item={item}
                  index={i}
                  layout={section.layout}
                  showArrow
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="panel-heading">
            <span>
              {String(section.number).padStart(2, "0")} · {panel.toUpperCase()}
            </span>
            <h2>{isProfile ? "Experiência e atuação" : section.title}</h2>
            {panel === "a" && section.eyebrow && <p>{section.eyebrow}</p>}
            {panel === "a" && section.intro && (
              <p className="section-intro">{section.intro}</p>
            )}
          </header>
          <div
            className={`mobile-items ${
              isProfile && panel === "b" ? "profile-b-items" : ""
            }`}
          >
            {items.map((item, i) => (
              <ItemCard
                key={`${item.title}-${i}`}
                item={item}
                index={i}
                layout={section.layout}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function itemStyle(item: ContentItem) {
  const placement = item.placement
  const config = placement?.styleConfig ?? {}
  const number = (key: string, min: number, max: number): number | undefined => {
    const value = config[key]
    return typeof value === "number" && Number.isFinite(value)
      ? Math.max(min, Math.min(max, value)) : undefined
  }
  const align = ["left", "center", "right"].includes(String(config.textAlign))
    ? String(config.textAlign) : undefined
  const motion = placement?.motionConfig ?? {}
  const motionNumber = (key: string, max: number) => {
    const value = motion[key]
    return typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.min(max, value)) : undefined
  }
  return {
    "--placement-duration": toPixels(motionNumber("duration", 1200)),
    "--placement-delay": toPixels(motionNumber("delay", 600)),
    "--placement-distance": toPixels(motionNumber("distance", 48)),
    "--placement-width": toPercent(number("width", 10, 100)),
    "--placement-spacing": toPixels(number("spacing", 0, 120)),
    "--placement-title-size": toPixels(number("titleSize", 8, 120)),
    "--placement-text-size": toPixels(number("textSize", 8, 72)),
    "--placement-align": align,
    "--item-title-color": item.titleColor || undefined,
    "--item-text-color": item.textColor || undefined,
    "--item-background": item.backgroundColor || undefined,
    "--item-desktop-order": number("order", -20, 20) ?? item.desktop?.order,
    "--item-desktop-spacing": toPixels(number("spacing", 0, 120) ?? item.desktop?.spacing),
    "--item-desktop-width": toPercent(number("width", 10, 100) ?? item.desktop?.width),
    "--item-desktop-title-size": toPixels(number("titleSize", 8, 120) ?? item.desktop?.titleSize),
    "--item-desktop-text-size": toPixels(number("textSize", 8, 72) ?? item.desktop?.textSize),
    "--item-desktop-align": align ?? item.desktop?.textAlign ?? undefined,
    "--item-mobile-order": number("order", -20, 20) ?? item.mobile?.order,
    "--item-mobile-spacing": toPixels(number("spacing", 0, 120) ?? item.mobile?.spacing),
    "--item-mobile-width": toPercent(number("width", 10, 100) ?? item.mobile?.width),
    "--item-mobile-title-size": toPixels(number("titleSize", 8, 120) ?? item.mobile?.titleSize),
    "--item-mobile-text-size": toPixels(number("textSize", 8, 72) ?? item.mobile?.textSize),
    "--item-mobile-align": align ?? item.mobile?.textAlign ?? undefined,
  } as React.CSSProperties
}

function heroStyle(config?: HeroVisualConfig) {
  const desktop = config?.desktop
  const mobile = config?.mobile
  return {
    "--hero-panel-background":
      config?.panelBackground || heroDefaults.panelBackground,
    "--hero-badge-background":
      config?.badgeBackground || heroDefaults.badgeBackground,
    "--hero-badge-color": config?.badgeColor || heroDefaults.badgeColor,
    "--hero-intro-color": config?.introColor || heroDefaults.introColor,
    "--hero-desktop-visual-height": toDvh(desktop?.visualHeight),
    "--hero-desktop-image-width": toPercent(desktop?.imageWidth),
    "--hero-desktop-image-height": toPercent(desktop?.imageHeight),
    "--hero-desktop-image-x": toPercent(desktop?.imagePositionX),
    "--hero-desktop-image-y": toPercent(desktop?.imagePositionY),
    "--hero-desktop-years-x": toPercent(desktop?.yearsX),
    "--hero-desktop-years-y": toPercent(desktop?.yearsY),
    "--hero-desktop-years-width": toPercent(desktop?.yearsWidth),
    "--hero-desktop-badge-size": toPercent(desktop?.badgeSize),
    "--hero-desktop-badge-x": toPercent(desktop?.badgeX),
    "--hero-desktop-badge-y": toPercent(desktop?.badgeY),
    "--hero-desktop-content-gap": toPixels(desktop?.contentGap),
    "--hero-desktop-intro-size": toPixels(desktop?.introSize),
    "--hero-desktop-intro-spacing": toPixels(desktop?.introSpacing),
    "--hero-desktop-intro-align": desktop?.introAlign ?? undefined,
    "--hero-mobile-image-width": toPercent(mobile?.imageWidth),
    "--hero-mobile-image-height": toPercent(mobile?.imageHeight),
    "--hero-mobile-image-x": toPercent(mobile?.imagePositionX),
    "--hero-mobile-image-y": toPercent(mobile?.imagePositionY),
    "--hero-mobile-badge-size": toPercent(mobile?.badgeSize),
    "--hero-mobile-badge-x": toPercent(mobile?.badgeX),
    "--hero-mobile-badge-y": toPercent(mobile?.badgeY),
    "--hero-mobile-intro-size": toPixels(mobile?.introSize),
    "--hero-mobile-intro-spacing": toPixels(mobile?.introSpacing),
    "--hero-mobile-intro-align": mobile?.introAlign ?? undefined,
  } as React.CSSProperties
}

function toPixels(value?: number) {
  return value == null ? undefined : `${value}px`
}

function toPercent(value?: number) {
  return value == null ? undefined : `${value}%`
}

function toDvh(value?: number) {
  return value == null ? undefined : `${value}dvh`
}

function Section({ section, total }: { section: PortfolioSection; total: number }) {
  return (
    <section
      id={section.slug}
      data-section={section.slug}
      className={`portfolio-section theme-${section.theme} layout-${section.layout} motion-${section.animation ?? "fade-up"}`}
    >
      <div className="desktop-panel">
        {section.slug === "perfil" ? (
          <ProfileDesktop section={section} />
        ) : (
          <div className="desktop-editorial">
            <header className="section-heading">
              <span>{String(section.number).padStart(2, "0")} / {total}</span>
              <h2>{section.title}</h2>
              {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
              {section.intro && (
                <p className="section-intro">{section.intro}</p>
              )}
            </header>
            <div className="desktop-content">
              <div>
                {(section.desktopPanelA ?? section.panelA).map((item, i) => (
                  <ItemCard
                    key={`${item.title}-${i}`}
                    item={item}
                    index={i}
                    layout={section.layout}
                  />
                ))}
              </div>
              <div>
                {(section.desktopPanelB ?? section.panelB).map((item, i) => (
                  <ItemCard
                    key={`${item.title}-${i}`}
                    item={item}
                    index={i}
                    layout={section.layout}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mobile-panels">
        <MobilePanel section={section} panel="a" items={section.panelA} />
        <MobilePanel section={section} panel="b" items={section.panelB} />
      </div>
    </section>
  )
}

export function PublicSite({ preview = false }: { preview?: boolean }) {
  const { sections, navigation, tokens, source, loading, error } = usePortfolio(preview)
  const visible = useMemo(
    () => sections.filter((section) => preview || section.visible),
    [sections, preview],
  )
  const [current, setCurrent] = useState("perfil")
  const [panel, setPanel] = useState<"a" | "b">("a")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const item of entries) {
          if (!item.isIntersecting) {
            item.target
              .querySelectorAll('.reveal[data-motion-once="false"]')
              .forEach((element) => element.classList.remove("is-visible"))
          }
        }
        const entry = entries
          .filter((item) => item.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!entry) return
        const section = (entry.target as HTMLElement).closest(
          "[data-section]",
        ) as HTMLElement | null
        if (section) setCurrent(section.dataset.section ?? "perfil")
        setPanel(
          (entry.target as HTMLElement).dataset.panel as "a" | "b" ?? "a",
        )
        entry.target
          .querySelectorAll(".reveal")
          .forEach((element) => element.classList.add("is-visible"))
      },
      { threshold: [0.2, 0.55], rootMargin: "-10% 0px -25%" },
    )
    document
      .querySelectorAll("[data-section], [data-panel]")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    const restoreHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1)).replace(/-b$/, "")
      if (!slug) return
      const target =
        document.getElementById(location.hash.slice(1)) ??
        document.getElementById(slug)
      if (!target) return
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      })
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    }
    addEventListener("popstate", restoreHash)
    addEventListener("hashchange", restoreHash)
    if (!loading) requestAnimationFrame(restoreHash)
    return () => {
      removeEventListener("popstate", restoreHash)
      removeEventListener("hashchange", restoreHash)
    }
  }, [loading, visible])

  const style = {
    "--orange": tokens.orange,
    "--ink": tokens.ink,
    "--paper": tokens.paper,
    "--cream": tokens.cream,
    "--muted": tokens.muted,
    "--orange-dark": tokens.orangeDark,
    "--container": `${tokens.container}px`,
    "--section-space": `${tokens.sectionSpace}px`,
    "--motion-duration": `${tokens.motionDuration}ms`,
    "--font-heading": `"${tokens.headingFont}", "Arial Narrow", sans-serif`,
    "--font-body": `"${tokens.bodyFont}", system-ui, sans-serif`,
  } as React.CSSProperties

  return (
    <div className="public-site" style={style}>
      <a className="skip-link" href="#perfil">
        Pular para o conteúdo
      </a>
      {preview && (
        <div className="preview-banner">
          Pré-visualização protegida · conteúdo em rascunho
        </div>
      )}
      <Navigation sections={visible} navigation={navigation} current={current} panel={panel} />
      {loading && <div className="data-status">Sincronizando conteúdo…</div>}
      {error && (
        <div className="data-error" role="status">
          {error}
        </div>
      )}
      {source === "fallback" && (
        <div className="sr-only" role="status">
          Conteúdo editorial local exibido enquanto a base Supabase aguarda as
          migrations.
        </div>
      )}
      <main>
        {!loading && !error && visible.length === 0 && (
          <div className="data-status" role="status">
            Nenhuma seção publicada no momento.
          </div>
        )}
        <h1 className="sr-only">
          Tulius Tsangaropulos — Comunicação e Estratégia
        </h1>
        {visible.map((section) => (
          <Section key={section.id} section={section} total={visible.length} />
        ))}
      </main>
    </div>
  )
}
