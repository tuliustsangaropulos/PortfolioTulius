import { useEffect, useState } from "react"
import type { ExperienceSlide, PortfolioSection } from "../../types/content"

export const EXPERIENCE_SLUGS = [
  "invest-rs",
  "prefeitura-sp",
  "vale",
  "globo-sportv",
  "inpress",
  "cdi",
] as const

function Monogram({ name }: { name: string }) {
  const letters = name
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
  return (
    <span className="experience-monogram" aria-hidden="true">
      {letters}
    </span>
  )
}

function CompanyMark({ section, small = false }: { section: PortfolioSection; small?: boolean }) {
  const { logo, logoAlt } = section.experienceMedia ?? {}
  return (
    <span className={small ? "company-mark company-mark-small" : "company-mark"}>
      {logo && logoAlt ? (
        <img src={logo} alt={logoAlt} loading="lazy" decoding="async" />
      ) : (
        <Monogram name={section.title} />
      )}
    </span>
  )
}

function PhotoGallery({ section }: { section: PortfolioSection }) {
  const slides = section.experienceMedia?.slides ?? []
  const [active, setActive] = useState(0)
  const count = slides.length
  const index = count ? Math.min(active, count - 1) : 0
  const slide: ExperienceSlide | undefined = slides[index]
  const hasImage = Boolean(slide?.image && slide.alt)

  return (
    <div className="experience-gallery" aria-label={`Galeria de projetos: ${section.title}`}>
      <div
        className={hasImage ? "experience-media-frame" : "experience-media-frame media-awaiting"}
      >
        {hasImage ? (
          <img src={slide!.image} alt={slide!.alt} loading="lazy" decoding="async" />
        ) : (
          <div className="experience-image-pending">
            <span>REGISTRO VISUAL</span>
            <strong>{slide?.title ?? "Galeria de projetos"}</strong>
            <p>Fotografia do projeto pendente de inclusão no painel administrativo.</p>
          </div>
        )}
      </div>
      <div className="experience-gallery-footer">
        <div>
          <span className="experience-gallery-kicker">PROJETO EM DESTAQUE</span>
          <h3>{slide?.title ?? "Galeria de projetos"}</h3>
          {slide?.caption && <p>{slide.caption}</p>}
        </div>
        {count > 1 && (
          <div className="experience-gallery-controls">
            <button
              type="button"
              aria-label={`Foto anterior de ${section.title}`}
              onClick={() => setActive((index + count - 1) % count)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <span aria-live="polite">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              aria-label={`Próxima foto de ${section.title}`}
              onClick={() => setActive((index + 1) % count)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
      {count > 1 && (
        <div className="experience-gallery-dots" aria-label="Selecionar projeto">
          {slides.map((item, slideIndex) => (
            <button
              type="button"
              key={`${item.title}-${slideIndex}`}
              className={slideIndex === index ? "is-active" : ""}
              onClick={() => setActive(slideIndex)}
              aria-label={`Exibir projeto ${item.title}`}
              aria-current={slideIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExperienceCard({ section, order }: { section: PortfolioSection; order: number }) {
  const items = [
    ...(section.desktopPanelA ?? section.panelA),
    ...(section.desktopPanelB ?? section.panelB),
  ]
  return (
    <section
      id={section.slug}
      data-section={section.slug}
      className="portfolio-section experience-card theme-paper"
      style={{ zIndex: order + 1 }}
    >
      <div className="desktop-panel experience-desktop">
        <header className="experience-heading">
          <CompanyMark section={section} />
          <h2>{section.title}</h2>
          {section.eyebrow && <p className="experience-eyebrow">{section.eyebrow}</p>}
          {section.intro && <p>{section.intro}</p>}
        </header>
        <div className="experience-projects">
          <h3>Projetos e realizações</h3>
          {items.map((item, index) => (
            <article className="experience-project" key={`${item.title}-${index}`}>
              <h4>{item.title}</h4>
              {item.value && <strong className="experience-value">{item.value}</strong>}
              {item.text && <p>{item.text}</p>}
              {item.tags && <p>{item.tags.join(" · ")}</p>}
            </article>
          ))}
        </div>
        <PhotoGallery section={section} />
      </div>
      <div className="mobile-panels">
        <div
          id={`${section.slug}-a`}
          className="mobile-panel experience-mobile-copy"
          data-panel="a"
        >
          <header className="experience-heading">
            <CompanyMark section={section} />
            <h2>{section.title}</h2>
            {section.eyebrow && <p className="experience-eyebrow">{section.eyebrow}</p>}
            {section.intro && <p>{section.intro}</p>}
          </header>
          <div className="experience-projects">
            <h3>Projetos e realizações</h3>
            {items.map((item, index) => (
              <article className="experience-project" key={`${item.title}-${index}`}>
                <h4>{item.title}</h4>
                {item.value && <strong className="experience-value">{item.value}</strong>}
                {item.text && <p>{item.text}</p>}
                {item.tags && <p>{item.tags.join(" · ")}</p>}
              </article>
            ))}
          </div>
        </div>
        <div
          id={`${section.slug}-b`}
          className="mobile-panel experience-mobile-gallery"
          data-panel="b"
        >
          <PhotoGallery section={section} />
        </div>
      </div>
    </section>
  )
}

export function ExperienceStack({ sections }: { sections: PortfolioSection[] }) {
  const [active, setActive] = useState(sections[0]?.slug ?? "")

  useEffect(() => {
    const onScroll = () => {
      let selected = sections[0]?.slug ?? ""
      for (const section of sections) {
        const node = document.getElementById(section.slug)
        if (node && node.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          selected = section.slug
        }
      }
      setActive(selected)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [sections])

  return (
    <div className="experience-stack" aria-label="Experiências profissionais">
      <nav className="experience-index" aria-label="Selecionar empresa">
        {sections.map((section) => (
          <a
            href={`#${section.slug}`}
            key={section.slug}
            className={active === section.slug ? "is-active" : ""}
            aria-current={active === section.slug ? "location" : undefined}
            onClick={() => setActive(section.slug)}
          >
            <CompanyMark section={section} small />
            <span>{section.title}</span>
          </a>
        ))}
      </nav>
      {sections.map((section, index) => (
        <ExperienceCard key={section.id} section={section} order={index} />
      ))}
    </div>
  )
}
