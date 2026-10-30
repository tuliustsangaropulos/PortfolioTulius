import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { isSafeEditorialImage } from "../../lib/validation"
import { MediaFramingDialog } from "./MediaFramingDialog"
import { AdminInfoTip } from "./AdminInfoTip"
import { Icon } from "../ui/Icons"
import type { MediaFraming } from "../../lib/media-framing"
import {
  getPublishedImageChoices,
  type MediaLibraryRow,
  type PublishedImageChoice,
} from "../../lib/media-selection"

export function PublishedMediaPicker({
  label,
  value,
  onChange,
  framing,
  onFramingChange,
  guidance = "Imagem responsiva: conferir desktop e mobile.",
  ratio = "16 / 9",
  guidanceAsInfo = false,
  iconOnlyActions = false,
}: {
  label: string
  value: string
  onChange: (url: string, alt: string) => void
  framing?: MediaFraming
  onFramingChange?: (framing: MediaFraming) => void
  guidance?: string
  ratio?: string
  guidanceAsInfo?: boolean
  iconOnlyActions?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [assets, setAssets] = useState<PublishedImageChoice[]>([])
  const [previewFailed, setPreviewFailed] = useState(false)
  const [framingOpen, setFramingOpen] = useState(false)

  useEffect(() => {
    setPreviewFailed(false)
  }, [value])

  useEffect(() => {
    if (!open) return
    let active = true
    async function load() {
      if (!supabase) {
        setError("Supabase não está configurado.")
        return
      }
      setLoading(true)
      setError("")
      try {
        const { data, error: loadError } = await supabase
          .from("media_assets")
          .select("id,title,alt_text,mime_type,storage_bucket,storage_path,status")
          .eq("storage_bucket", "portfolio-public")
          .eq("status", "published")
          .order("created_at", { ascending: false })
        if (!active) return
        if (loadError) {
          setError(loadError.message)
          setAssets([])
        } else {
          setAssets(
            getPublishedImageChoices(
              data as MediaLibraryRow[],
              (path) =>
                supabase!.storage.from("portfolio-public").getPublicUrl(path).data.publicUrl,
            ),
          )
        }
      } catch {
        if (active) {
          setError("Não foi possível consultar a Biblioteca de mídia.")
          setAssets([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [open])

  const filtered = assets.filter((asset) =>
    `${asset.title} ${asset.path} ${asset.alt}`
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR").trim()),
  )

  return (
    <div className="published-media-picker">
      <div className="published-media-label-row">
        <strong className="published-media-picker-label">{label}</strong>
        {guidanceAsInfo && (
          <AdminInfoTip label={label} description={`Área de destino: ${guidance}`} />
        )}
      </div>
      {!guidanceAsInfo && (
        <p className="published-media-guidance">Área de destino: {guidance}</p>
      )}
      {value && isSafeEditorialImage(value) && !previewFailed ? (
        <div className="published-media-current">
          <img
            src={value}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setPreviewFailed(true)}
          />
          <span>Imagem atual preservada. Escolha outra imagem para substituí-la.</span>
        </div>
      ) : (
        <p className="published-media-current-note">
          {value
            ? "Prévia indisponível. A referência atual será preservada até você substituí-la."
            : "Nenhuma imagem selecionada."}
        </p>
      )}
      <div className="published-media-actions">
        <button
          type="button"
          className={iconOnlyActions ? "secondary-button media-icon-action" : "secondary-button"}
          aria-label={iconOnlyActions ? (open ? "Fechar biblioteca" : "Escolher da biblioteca") : undefined}
          title={iconOnlyActions ? (open ? "Fechar biblioteca" : "Escolher da biblioteca") : undefined}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {iconOnlyActions ? <Icon name="image" size={20} /> : open ? "Fechar biblioteca" : "Escolher da biblioteca"}
        </button>
        {value && onFramingChange && (
          <button
            type="button"
            className={iconOnlyActions ? "secondary-button media-icon-action" : "secondary-button"}
            aria-label={iconOnlyActions ? "Ajustar posição e zoom" : undefined}
            title={iconOnlyActions ? "Ajustar posição e zoom" : undefined}
            onClick={() => setFramingOpen(true)}
          >
            {iconOnlyActions ? <Icon name="sliders" size={20} /> : "Ajustar posição e zoom"}
          </button>
        )}
        {value && (
          <button
            type="button"
            className={iconOnlyActions ? "secondary-button media-icon-action" : "secondary-button"}
            aria-label={iconOnlyActions ? "Remover imagem" : undefined}
            title={iconOnlyActions ? "Remover imagem" : undefined}
            onClick={() => onChange("", "")}
          >
            {iconOnlyActions ? <Icon name="trash" size={20} /> : "Remover imagem"}
          </button>
        )}
      </div>
      {framingOpen && value && onFramingChange && (
        <MediaFramingDialog
          src={value}
          label={label}
          guidance={guidance}
          ratio={ratio}
          value={framing}
          onChange={onFramingChange}
          onClose={() => setFramingOpen(false)}
        />
      )}
      {open && (
        <div className="published-media-panel" role="region" aria-label={`Biblioteca: ${label}`}>
          <p>Somente imagens publicadas na aba Mídia podem ser escolhidas.</p>
          <label>
            Buscar imagem
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Título ou nome do arquivo"
            />
          </label>
          {loading ? (
            <p role="status">Carregando imagens…</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : filtered.length ? (
            <div className="published-media-grid">
              {filtered.map((asset) => (
                <button
                  type="button"
                  key={asset.id}
                  className="published-media-option"
                  aria-pressed={value === asset.url}
                  onClick={() => {
                    onChange(asset.url, asset.alt)
                    setOpen(false)
                  }}
                >
                  <img src={asset.url} alt="" loading="lazy" decoding="async" />
                  <span>{asset.title}</span>
                  {value === asset.url && <small>Selecionada</small>}
                </button>
              ))}
            </div>
          ) : (
            <p>
              {assets.length
                ? "Nenhuma imagem corresponde à busca."
                : "Não há imagens publicadas. Envie e publique o arquivo na aba Mídia."}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
