import { useEffect, useId, useRef, useState } from "react"
import { Icon } from "../ui/Icons"

export function AdminInfoTip({ label, description }: { label: string; description: string }) {
  const id = useId()
  const wrapper = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!open) return
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapper.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", dismissOutside)
    return () => document.removeEventListener("pointerdown", dismissOutside)
  }, [open])

  return (
    <span
      ref={wrapper}
      className="admin-info-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="admin-info-trigger"
        aria-label={`Informações sobre ${label}`}
        aria-controls={id}
        aria-expanded={open}
        aria-describedby={open || hovered ? id : undefined}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
            event.stopPropagation()
          }
        }}
      >
        <Icon name="info" size={16} />
      </button>
      <span id={id} role="tooltip" className="admin-info-tooltip" hidden={!open && !hovered}>
        {description}
      </span>
    </span>
  )
}
