import { useEffect, useRef, useState } from "react"
import type { PortfolioSection } from "../../types/content"
import type { PublicNavigationItem } from "../../lib/navigation"
import { Icon } from "../ui/Icons"

export function Navigation({
  sections,
  navigation,
  current,
}: {
  sections: PortfolioSection[]
  navigation: PublicNavigationItem[]
  current: string
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const activeSection = sections.find((section) => section.slug === current)
  const theme = current === "perfil" ? "profile" : (activeSection?.theme ?? "paper")

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
    let focusTimer: ReturnType<typeof setTimeout> | undefined
    if (open) {
      main?.setAttribute("inert", "")
      focusTimer = setTimeout(() => {
        drawerRef.current?.querySelector<HTMLButtonElement>(".icon-button")?.focus()
      }, 300)
    } else {
      main?.removeAttribute("inert")
    }
    return () => {
      if (focusTimer) clearTimeout(focusTimer)
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
      <header className={`site-header header-${theme}`}>
        <button className="brand-button" onClick={() => go("perfil")} aria-label="Voltar ao perfil">
          <span>TULIUS</span>
          <span>TSANGAROPULOS</span>
        </button>
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
