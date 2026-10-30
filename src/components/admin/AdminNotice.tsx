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
export function AdminNotice({
  message,
  tone,
}: {
  message: string
  tone?: "success" | "error" | "warning" | "info"
}) {
  const level =
    tone ??
    (/falha|erro|inválid|não foi possível|não encontrado|expirou|exige/i.test(message)
      ? "error"
      : /atenção|aviso|pendente|não salvas|confira|informe/i.test(message)
        ? "warning"
        : /salv|publicad|criad|concluíd|resolvid|atualizad/i.test(message)
          ? "success"
          : "info")
  const [visible, setVisible] = useState(Boolean(message))
  useEffect(() => {
    setVisible(Boolean(message))
    if (!message) return
    const timer = window.setTimeout(() => setVisible(false), 7000)
    return () => window.clearTimeout(timer)
  }, [message])
  return visible && message ? (
    <div
      className={`admin-toast admin-toast-${level}`}
      role={level === "error" ? "alert" : "status"}
      aria-live={level === "error" ? "assertive" : "polite"}
    >
      <span>
        <strong>
          {level === "error"
            ? "Erro"
            : level === "success"
              ? "Sucesso"
              : level === "warning"
                ? "Atenção"
                : "Informação"}
          :
        </strong>{" "}
        {message}
      </span>
      <button type="button" onClick={() => setVisible(false)} aria-label="Fechar aviso">
        ×
      </button>
    </div>
  ) : null
}
