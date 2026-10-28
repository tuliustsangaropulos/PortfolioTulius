import { useEffect, useState } from "react"
const labels: Record<string, string> = {
  draft: "Rascunho",
  in_review: "Em revisão",
  published: "Publicado",
  archived: "Arquivado",
  open: "Aberto",
  resolved: "Resolvido",
}
export const statusPt = (status: string) => labels[status] ?? status
export function AdminNotice({ message }: { message: string }) {
  const [visible, setVisible] = useState(Boolean(message))
  useEffect(() => {
    setVisible(Boolean(message))
    if (!message) return
    const timer = window.setTimeout(() => setVisible(false), 7000)
    return () => window.clearTimeout(timer)
  }, [message])
  return visible && message ? (
    <div className="admin-toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" onClick={() => setVisible(false)} aria-label="Fechar aviso">
        ×
      </button>
    </div>
  ) : null
}
