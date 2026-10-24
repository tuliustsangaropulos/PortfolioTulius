import { useEffect, useRef, useState } from "react"
import type { PortfolioSection } from "../../types/content"
import type { PublicNavigationItem } from "../../lib/navigation"
import { Icon } from "../ui/Icons"

export function Navigation({
  sections,
  navigation,
  current,
  panel,
}: {
  sections: PortfolioSection[]
  navigation: PublicNavigationItem[]
  current: string
  panel: "a" | "b"
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const currentIndex = Math.max(
    0,
    sections.findIndex((s) => s.slug === current),
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!open) return
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (event.key !== "Tab") return
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    document.body.classList.toggle("nav-open", open)
    const main = document.querySelector<HTMLElement>(".public-site main")
    if (open) {
      main?.setAttribute("inert", "")
      requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLElement>("button")?.focus())
    } else {
      main?.removeAttribute("inert")
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.classList.remove("nav-open")
      main?.removeAttribute("inert")
    }
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const go = (slug: string) => {
    setOpen(false)
    const element = document.getElementById(slug)
    history.pushState(null, "", `#${slug}`)
    element?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    })
    if (element) {
      element.tabIndex = -1
      setTimeout(() => element.focus({ preventScroll: true }), 350)
    }
  }

  return (
    <>
      <header className="site-header">
        <button className="brand-button" onClick={() => go("perfil")} aria-label="Voltar ao perfil">
          <span>TULIUS</span>
          <span>TSANGAROPULOS</span>
        </button>
        <div className="section-count" aria-live="polite">
          {String(currentIndex + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}{" "}
          <span className="mobile-panel-count">· {panel === "a" ? "1" : "2"}/2</span>
        </div>
        <button
          ref={triggerRef}
          className="menu-button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label="Abrir menu"
        >
          <span>MENU</span>
          <Icon name="menu" />
        </button>
      </header>
      <div
        className={`nav-backdrop ${open ? "is-open" : ""}`}
        onMouseDown={(event) => event.target === event.currentTarget && closeMenu()}
      >
        <nav
          ref={drawerRef}
          id="site-menu"
          className="nav-drawer"
          aria-label="Navegação principal"
          aria-hidden={!open}
          aria-modal="true"
          role="dialog"
        >
          <div className="drawer-head">
            <p>Índice / {sections.length} seções</p>
            <button className="icon-button" onClick={closeMenu} aria-label="Fechar menu">
              <Icon name="close" />
            </button>
          </div>
          <ol>
            {navigation.map((item, index) => (
              <li key={item.slug}>
                {(index === 0 || navigation[index - 1]?.group !== item.group) && (
                  <span className="menu-group-label">{item.group}</span>
                )}
                <button
                  className={current === item.slug ? "active" : ""}
                  onClick={() => go(item.slug)}
                >
                  <span>{String(item.number).padStart(2, "0")}</span>
                  {item.label}
                  <Icon name="arrow" size={18} />
                </button>
              </li>
            ))}
          </ol>
          {navigation.length === 0 && <p className="drawer-foot">Nenhum item de menu publicado.</p>}
          <p className="drawer-foot">Comunicação · Estratégia · Reputação</p>
        </nav>
      </div>
    </>
  )
}
