import { useEffect, useRef, useState } from "react"

export type AdminConfirmOptions = {
  title?: string
  confirmLabel?: string
  tone?: "warning" | "danger"
}
type Confirmation = {
  message: string
  options: AdminConfirmOptions
  resolve: (answer: boolean) => void
}
let requestConfirmation: ((request: Confirmation) => void) | null = null

/** Fail closed when the administrative dialog is not mounted. */
export function adminConfirm(message: string, options: AdminConfirmOptions = {}): Promise<boolean> {
  if (!requestConfirmation) return Promise.resolve(false)
  return new Promise<boolean>((resolve) => requestConfirmation?.({ message, options, resolve }))
}

export function AdminConfirmationHost() {
  const [current, setCurrent] = useState<Confirmation | null>(null)
  const pending = useRef<Confirmation | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestConfirmation = (request) => {
      if (pending.current) {
        request.resolve(false)
        return
      }
      pending.current = request
      setCurrent(request)
    }
    return () => {
      requestConfirmation = null
      pending.current?.resolve(false)
      pending.current = null
    }
  }, [])

  function finish(accept: boolean) {
    const active = pending.current
    pending.current = null
    setCurrent(null)
    active?.resolve(accept)
  }

  useEffect(() => {
    if (!current) return
    const former = document.activeElement instanceof HTMLElement ? document.activeElement : null
    cancelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        finish(false)
        return
      }
      if (event.key !== "Tab") return
      const buttons = Array.from(
        dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? [],
      )
      if (!buttons.length) return
      const first = buttons[0],
        last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      former?.focus()
    }
  }, [current])

  if (!current) return null
  return (
    <div className="admin-confirm-overlay">
      <div
        ref={dialogRef}
        className="admin-confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
      >
        <span className="admin-confirm-eyebrow">PORTFÓLIO EDITORIAL</span>
        <h2 id="admin-confirm-title">{current.options.title ?? "Confirmar alteração"}</h2>
        <p id="admin-confirm-description">{current.message}</p>
        <div className="admin-confirm-actions">
          <button
            type="button"
            ref={cancelRef}
            className="secondary-button"
            onClick={() => finish(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={current.options.tone === "danger" ? "danger-button" : "primary-button"}
            onClick={() => finish(true)}
          >
            {current.options.confirmLabel ?? "Continuar"}
          </button>
        </div>
      </div>
    </div>
  )
}
