import { useEffect, useId, useRef, useState } from "react"
import { Icon } from "../ui/Icons"
import { iconCategories } from "../../lib/icon-catalog"
import type { MetricIconName, ToolIconName } from "../../types/content"

function VisualIconSelector({
  label,
  selected,
  max,
  onSelect,
}: {
  label: string
  selected: string[]
  max: number
  onSelect: (name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    popoverRef.current?.querySelector<HTMLButtonElement>(".visual-icon-grid button")?.focus()
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="visual-icon-library"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="visual-icon-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{label}</span>
        <span className="visual-icon-current" aria-hidden="true">
          {selected.map((name) => (
            <Icon key={name} name={name as MetricIconName} size={20} />
          ))}
        </span>
        <Icon name={open ? "up" : "down"} size={18} />
      </button>
      {open && (
        <div ref={popoverRef} id={id} className="visual-icon-popover" aria-label={label}>
          {iconCategories.map((group) => (
            <div key={group.category}>
              <h4>{group.category}</h4>
              <div className="visual-icon-grid">
                {group.icons.map(([name, accessibleLabel]) => {
                  const active = selected.includes(name)
                  return (
                    <button
                      type="button"
                      key={name}
                      className={active ? "active" : ""}
                      aria-label={accessibleLabel}
                      aria-pressed={active}
                      title={accessibleLabel}
                      disabled={!active && selected.length >= max}
                      onClick={() => {
                        onSelect(name)
                        if (max === 1) {
                          setOpen(false)
                          triggerRef.current?.focus()
                        }
                      }}
                    >
                      <Icon name={name as MetricIconName} size={24} />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function VisualIconLibrary({
  value,
  onChange,
}: {
  value: MetricIconName
  onChange: (value: MetricIconName) => void
}) {
  return (
    <VisualIconSelector
      label="Escolher ícone do indicador"
      selected={value ? [value] : []}
      max={1}
      onSelect={(name) => onChange(name as MetricIconName)}
    />
  )
}

export function PlatformIconLibrary({
  selected,
  onChange,
}: {
  selected: ToolIconName[]
  onChange: (icons: ToolIconName[]) => void
}) {
  return (
    <VisualIconSelector
      label="Plataformas (até três)"
      selected={selected}
      max={3}
      onSelect={(name) => {
        const icon = name as ToolIconName
        onChange(
          selected.includes(icon)
            ? selected.filter((entry) => entry !== icon)
            : [...selected, icon],
        )
      }}
    />
  )
}
