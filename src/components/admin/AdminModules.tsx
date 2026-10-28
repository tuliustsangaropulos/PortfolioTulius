import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { isSafeEditorialImage, validateContentItems } from "../../lib/validation"
import { stagePrivateMediaChange } from "../../lib/media-operations"
import { resolveMediaPreview, type MediaPreview } from "../../lib/media-preview"
import { PublishedMediaPicker } from "./PublishedMediaPicker"
import { withOpenGraphImage } from "../../lib/media-selection"
import { COLLECTION_SOURCES, isCollectionSource } from "../../lib/collections"
import type {
  ContentItem,
  DeviceItemStyle,
  HeroDeviceStyle,
  HeroVisualConfig,
  MetricIconName,
  ExperienceMedia,
} from "../../types/content"
import { Icon } from "../ui/Icons"
import { toolIconOptions } from "../public/ToolIcons"

interface SectionOption {
  id: string
  title: string
  slug: string
}
type BlockRow = {
  id: string
  section_id: string
  block_type: string
  content_json: {
    items?: ContentItem[]
    source_collection?: string | null
    collection_start?: number
    collection_limit?: number
    experienceMedia?: ExperienceMedia
  }
  mobile_panel: "a" | "b"
  sort_order: number
  status: string
  is_placeholder: boolean
  editorial_note: string | null
}

const emptyItem: ContentItem = { title: "Novo item", text: "" }

function StatusMessage({ children }: { children: string }) {
  return children ? (
    <p className="save-message" role="status">
      {children}
    </p>
  ) : null
}

function optionalNumber(value: string) {
  return value === "" ? undefined : Number(value)
}

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string
  value?: string
  fallback: string
  onChange: (value: string) => void
}) {
  return (
    <label>
      {label}
      <input
        type="color"
        value={value || fallback}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function NumericField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value?: number
  min: number
  max: number
  onChange: (value?: number) => void
}) {
  return (
    <label>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        placeholder="Automático"
        onChange={(event) => onChange(optionalNumber(event.target.value))}
      />
    </label>
  )
}

function DeviceStyleEditor({
  device,
  value,
  onChange,
}: {
  device: "desktop" | "mobile"
  value?: DeviceItemStyle
  onChange: (patch: Partial<DeviceItemStyle>) => void
}) {
  return (
    <fieldset>
      <legend>{device === "desktop" ? "Desktop" : "Mobile"}</legend>
      <div className="field-grid compact-grid">
        <label className="toggle-field">
          <input
            type="checkbox"
            checked={value?.visible !== false}
            onChange={(event) => onChange({ visible: event.target.checked })}
          />
          Visível
        </label>
        <NumericField
          label="Ordem"
          value={value?.order}
          min={-20}
          max={20}
          onChange={(order) => onChange({ order })}
        />
        <NumericField
          label="Espaçamento (px)"
          value={value?.spacing}
          min={0}
          max={120}
          onChange={(spacing) => onChange({ spacing })}
        />
        <NumericField
          label="Largura (%)"
          value={value?.width}
          min={10}
          max={100}
          onChange={(width) => onChange({ width })}
        />
        <NumericField
          label="Título (px)"
          value={value?.titleSize}
          min={8}
          max={120}
          onChange={(titleSize) => onChange({ titleSize })}
        />
        <NumericField
          label="Texto (px)"
          value={value?.textSize}
          min={8}
          max={72}
          onChange={(textSize) => onChange({ textSize })}
        />
        <label>
          Alinhamento
          <select
            value={value?.textAlign ?? "left"}
            onChange={(event) =>
              onChange({
                textAlign: event.target.value as DeviceItemStyle["textAlign"],
              })
            }
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </label>
      </div>
    </fieldset>
  )
}

function HeroDeviceEditor({
  device,
  value,
  onChange,
}: {
  device: "desktop" | "mobile"
  value?: HeroDeviceStyle
  onChange: (patch: Partial<HeroDeviceStyle>) => void
}) {
  const fields: Array<{
    key: Exclude<keyof HeroDeviceStyle, "introAlign">
    label: string
    min: number
    max: number
    desktopOnly?: boolean
  }> = [
    {
      key: "visualHeight",
      label: "Altura da foto (% viewport)",
      min: 25,
      max: 65,
      desktopOnly: true,
    },
    { key: "imageWidth", label: "Largura da foto (%)", min: 20, max: 100 },
    { key: "imageHeight", label: "Altura da foto (%)", min: 20, max: 100 },
    { key: "imagePositionX", label: "Foco horizontal (%)", min: 0, max: 100 },
    { key: "imagePositionY", label: "Foco vertical (%)", min: 0, max: 100 },
    {
      key: "yearsX",
      label: "Indicador +15: posição X (%)",
      min: 0,
      max: 100,
      desktopOnly: true,
    },
    {
      key: "yearsY",
      label: "Indicador +15: posição Y (%)",
      min: 0,
      max: 100,
      desktopOnly: true,
    },
    {
      key: "yearsWidth",
      label: "Indicador +15: largura (%)",
      min: 15,
      max: 80,
      desktopOnly: true,
    },
    { key: "badgeSize", label: "Tamanho do selo (%)", min: 12, max: 70 },
    { key: "badgeX", label: "Selo: posição X (%)", min: 0, max: 100 },
    { key: "badgeY", label: "Selo: posição Y (%)", min: 0, max: 100 },
    {
      key: "contentGap",
      label: "Espaço entre conteúdos (px)",
      min: 0,
      max: 48,
      desktopOnly: true,
    },
    {
      key: "introSize",
      label: "Frase: tamanho (px)",
      min: 8,
      max: 48,
    },
    {
      key: "introSpacing",
      label: "Frase: espaçamento (px)",
      min: 0,
      max: 120,
    },
  ]
  return (
    <fieldset>
      <legend>Fotografia e selo · {device === "desktop" ? "Desktop" : "Mobile"}</legend>
      <div className="field-grid compact-grid">
        {fields
          .filter((field) => device === "desktop" || !field.desktopOnly)
          .map((field) => (
            <NumericField
              key={field.key}
              label={field.label}
              value={value?.[field.key]}
              min={field.min}
              max={field.max}
              onChange={(nextValue) => onChange({ [field.key]: nextValue })}
            />
          ))}
        <label>
          Frase: alinhamento
          <select
            value={value?.introAlign ?? (device === "desktop" ? "center" : "right")}
            onChange={(event) =>
              onChange({
                introAlign: event.target.value as HeroDeviceStyle["introAlign"],
              })
            }
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </label>
      </div>
    </fieldset>
  )
}

export function ContentStudio({ sections }: { sections: SectionOption[] }) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "")
  const [blocks, setBlocks] = useState<BlockRow[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [draft, setDraft] = useState<BlockRow | null>(null)
  const [message, setMessage] = useState("")
  const initialPlacement = {
    layout_variant: "default",
    is_visible: true,
    preset: "fade-up",
    duration: 520,
    delay: 0,
    distance: 18,
    once: true,
  }
  type PanelKey = "desktop" | "mobile-a" | "mobile-b"
  type PlacementForm = typeof initialPlacement
  const [placementPanel, setPlacementPanel] = useState<PanelKey>("desktop")
  const [placementsByPanel, setPlacementsByPanel] = useState<
    Partial<Record<PanelKey, PlacementForm>>
  >({})
  const [loadedPanelKeys, setLoadedPanelKeys] = useState<PanelKey[]>([])
  const [editedPanelKeys, setEditedPanelKeys] = useState<PanelKey[]>([])
  const [placementsLoading, setPlacementsLoading] = useState(true)
  const [placementsReadError, setPlacementsReadError] = useState(false)
  const placement = placementsByPanel[placementPanel] ?? initialPlacement
  const setPlacement = (next: PlacementForm) => {
    setPlacementsByPanel((current) => ({ ...current, [placementPanel]: next }))
    setEditedPanelKeys((current) =>
      current.includes(placementPanel) ? current : [...current, placementPanel],
    )
  }

  useEffect(() => {
    if (!sectionId && sections[0]) setSectionId(sections[0].id)
  }, [sections, sectionId])

  const load = async () => {
    if (!supabase || !sectionId) return
    const { data, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("section_id", sectionId)
      .order("sort_order")
    setBlocks((data as BlockRow[]) ?? [])
    setMessage(error?.message ?? "")
    if (data?.length && !data.some((block) => block.id === selectedId)) setSelectedId(data[0].id)
  }

  useEffect(() => {
    void load()
  }, [sectionId])

  useEffect(() => {
    let cancelled = false
    const selected = blocks.find((block) => block.id === selectedId)
    setDraft(selected ? structuredClone(selected) : null)
    setPlacementPanel("desktop")
    setPlacementsByPanel({})
    setLoadedPanelKeys([])
    setEditedPanelKeys([])
    setPlacementsLoading(true)
    setPlacementsReadError(false)
    if (!selectedId || !supabase || !selected) {
      setPlacementsLoading(false)
      return
    }

    // Resolve panels independently to avoid relying on an ambiguous join shape.
    void Promise.all([
      supabase.from("section_panels").select("id,panel_key").eq("section_id", selected.section_id),
      supabase
        .from("block_placements")
        .select("panel_id,layout_variant,is_visible,motion_config")
        .eq("block_id", selectedId),
    ]).then(([panelResult, placementResult]) => {
      if (cancelled) return
      if (panelResult.error || placementResult.error) {
        setMessage(
          panelResult.error?.message ??
            placementResult.error?.message ??
            "Falha ao carregar placements.",
        )
        setPlacementsReadError(true)
        setPlacementsLoading(false)
        return
      }
      const panelNames = new Map(
        (panelResult.data ?? []).map((panel) => [panel.id, panel.panel_key]),
      )
      const byPanel: Partial<Record<PanelKey, PlacementForm>> = {}
      const keys: PanelKey[] = []
      for (const row of placementResult.data ?? []) {
        const key = panelNames.get(row.panel_id) as PanelKey | undefined
        if (key !== "desktop" && key !== "mobile-a" && key !== "mobile-b") continue
        const motion = row.motion_config as Record<string, unknown> | null
        byPanel[key] = {
          layout_variant: row.layout_variant ?? "default",
          is_visible: row.is_visible ?? true,
          preset: typeof motion?.preset === "string" ? motion.preset : "fade-up",
          duration: typeof motion?.duration === "number" ? motion.duration : 520,
          delay: typeof motion?.delay === "number" ? motion.delay : 0,
          distance: typeof motion?.distance === "number" ? motion.distance : 18,
          once: typeof motion?.once === "boolean" ? motion.once : true,
        }
        keys.push(key)
      }
      setPlacementsByPanel(byPanel)
      setLoadedPanelKeys(keys)
      setPlacementsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [blocks, selectedId])

  async function createBlock() {
    if (!supabase || !sectionId) return
    const { data, error } = await supabase
      .from("content_blocks")
      .insert({
        section_id: sectionId,
        block_type: "cards",
        content_json: { items: [emptyItem] },
        mobile_panel: "a",
        sort_order: blocks.length + 1,
        status: "draft",
      })
      .select("*")
      .single()
    if (error) return setMessage(error.message)
    setMessage("Bloco criado como rascunho.")
    await load()
    setSelectedId(data.id)
  }

  async function saveBlock() {
    if (!supabase || !draft) return
    if (placementsLoading || placementsReadError)
      return setMessage("Carregue os placements antes de salvar.")
    const validationErrors = isCollectionSource(draft.content_json.source_collection)
      ? []
      : validateContentItems(draft.content_json.items ?? [])
    if (validationErrors.length) return setMessage(validationErrors.join(" "))
    const media = draft.content_json.experienceMedia
    if (media) {
      if (media.logo && (!isSafeEditorialImage(media.logo) || !media.logoAlt?.trim()))
        return setMessage("Logo exige URL segura e texto alternativo.")
      for (const [index, slide] of (media.slides ?? []).entries()) {
        if (!slide.title.trim()) return setMessage(`Slide ${index + 1}: título obrigatório.`)
        if (slide.image && (!isSafeEditorialImage(slide.image) || !slide.alt?.trim()))
          return setMessage(`Slide ${index + 1}: imagem exige URL segura e texto alternativo.`)
      }
    }

    // Preserve existing independent placements: send only edited panels
    // and create the required desktop/mobile placements if they are missing.
    const requiredKeys: PanelKey[] = [
      "desktop",
      draft.mobile_panel === "a" ? "mobile-a" : "mobile-b",
    ]
    const changedKeys = Array.from(
      new Set([
        ...editedPanelKeys,
        ...requiredKeys.filter((key) => !loadedPanelKeys.includes(key)),
      ]),
    )
    const placementUpdates = changedKeys.map((key) => {
      const form = placementsByPanel[key] ?? initialPlacement
      return {
        panel_key: key,
        sort_order: draft.sort_order,
        layout_variant: form.layout_variant,
        is_visible: form.is_visible,
        motion_config: {
          preset: form.preset,
          duration: Math.min(1200, Math.max(0, form.duration)),
          delay: Math.min(600, Math.max(0, form.delay)),
          distance: Math.min(48, Math.max(0, form.distance)),
          once: form.once,
        },
      }
    })

    const { error } = await supabase.rpc("save_content_block_atomic", {
      p_block_id: draft.id,
      p_block_type: draft.block_type,
      p_content_json: draft.content_json,
      p_mobile_panel: draft.mobile_panel,
      p_sort_order: draft.sort_order,
      p_status: draft.status,
      p_is_placeholder: draft.is_placeholder,
      p_editorial_note: draft.editorial_note,
      p_placements: placementUpdates,
    })
    if (error) return setMessage(error.message)
    setMessage("Bloco e placements salvos em uma transação.")
    await load()
  }

  async function archiveBlock() {
    if (!supabase || !draft || !confirm("Arquivar este bloco?")) return
    const { error } = await supabase
      .from("content_blocks")
      .update({ status: "archived" })
      .eq("id", draft.id)
    setMessage(error?.message ?? "Bloco arquivado.")
    if (!error) await load()
  }

  function updateItem(index: number, patch: Partial<ContentItem>) {
    if (!draft) return
    const items = [...(draft.content_json.items ?? [])]
    items[index] = { ...items[index], ...patch }
    setDraft({ ...draft, content_json: { ...draft.content_json, items } })
  }

  function updateDeviceStyle(
    index: number,
    device: "desktop" | "mobile",
    patch: Partial<DeviceItemStyle>,
  ) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    updateItem(index, {
      [device]: { ...item[device], ...patch },
    })
  }

  function updateHero(index: number, patch: Partial<HeroVisualConfig>) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    updateItem(index, { hero: { ...item.hero, ...patch } })
  }

  function updateHeroDevice(
    index: number,
    device: "desktop" | "mobile",
    patch: Partial<HeroDeviceStyle>,
  ) {
    if (!draft) return
    const item = draft.content_json.items?.[index]
    if (!item) return
    updateHero(index, {
      [device]: { ...item.hero?.[device], ...patch },
    })
  }

  function moveItem(index: number, direction: -1 | 1) {
    if (!draft) return
    const items = [...(draft.content_json.items ?? [])]
    const target = index + direction
    if (target < 0 || target >= items.length) return
    ;[items[index], items[target]] = [items[target], items[index]]
    setDraft({ ...draft, content_json: { ...draft.content_json, items } })
  }

  function removeItem(index: number) {
    if (!draft || !confirm("Remover este item do bloco?")) return
    const items = (draft.content_json.items ?? []).filter((_, i) => i !== index)
    setDraft({ ...draft, content_json: { ...draft.content_json, items } })
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Conteúdo modular</p>
          <h1>Blocos e painéis</h1>
          <span>Uma fonte de conteúdo, composições desktop e mobile A/B</span>
        </div>
        <button className="primary-button" onClick={createBlock}>
          Novo bloco
        </button>
      </header>
      <div className="studio-toolbar">
        <label>
          Seção
          <select value={sectionId} onChange={(event) => setSectionId(event.target.value)}>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="section-editor-layout">
        <div className="section-list">
          {blocks.map((block) => (
            <button
              key={block.id}
              className={selectedId === block.id ? "active" : ""}
              onClick={() => setSelectedId(block.id)}
            >
              <span>{block.mobile_panel.toUpperCase()}</span>
              <div>
                <strong>{block.content_json.items?.[0]?.title ?? block.block_type}</strong>
                <small>
                  {block.status} · {block.content_json.items?.length ?? 0} itens
                </small>
              </div>
            </button>
          ))}
        </div>
        {draft ? (
          <section className="admin-card editor-form">
            <div className="field-grid compact-grid">
              <label>
                Tipo
                <select
                  value={draft.block_type}
                  onChange={(event) => setDraft({ ...draft, block_type: event.target.value })}
                >
                  {[
                    "hero",
                    "rich_text",
                    "metric",
                    "cards",
                    "timeline",
                    "skills",
                    "media",
                    "quote",
                    "contact",
                    "tools",
                  ].map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Painel mobile
                <select
                  value={draft.mobile_panel}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      mobile_panel: event.target.value as "a" | "b",
                    })
                  }
                >
                  <option value="a">Painel A</option>
                  <option value="b">Painel B</option>
                </select>
              </label>
              <label>
                Ordem
                <input
                  type="number"
                  min="1"
                  value={draft.sort_order}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      sort_order: Number(event.target.value),
                    })
                  }
                />
              </label>
              {sections.find((section) => section.id === draft.section_id)?.slug !== "perfil" && (
                <label className="field-wide">
                  Fonte do conteúdo exibido
                  <select
                    value={draft.content_json.source_collection ?? ""}
                    onChange={(event) => {
                      const next = event.target.value
                      if (
                        next &&
                        !confirm(
                          "Vincular esta coleção fará o site exibir os registros publicados da coleção no lugar dos cards manuais deste bloco. O conteúdo manual será preservado. Continuar?",
                        )
                      )
                        return
                      setDraft({
                        ...draft,
                        content_json: {
                          ...draft.content_json,
                          source_collection: next || null,
                        },
                      })
                    }}
                  >
                    <option value="">Cards manuais (atual)</option>
                    {COLLECTION_SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {collectionConfigs.find((config) => config.table === source)?.label ??
                          source}
                      </option>
                    ))}
                  </select>
                  {draft.content_json.source_collection && (
                    <>
                      <small>
                        Fonte vinculada: edite e publique registros na aba Coleções. Os cards
                        manuais abaixo continuam armazenados e voltam a aparecer quando o vínculo
                        for removido.
                      </small>
                      {draft.content_json.source_collection === "testimonials" && (
                        <div className="field-grid compact-grid">
                          <NumericField
                            label="Primeiro depoimento na coleção (índice inicial, começando em 0)"
                            value={draft.content_json.collection_start ?? 0}
                            min={0}
                            max={500}
                            onChange={(collection_start) =>
                              setDraft({
                                ...draft,
                                content_json: { ...draft.content_json, collection_start },
                              })
                            }
                          />
                          <NumericField
                            label="Quantidade neste painel (vazio = todos os restantes)"
                            value={draft.content_json.collection_limit}
                            min={1}
                            max={100}
                            onChange={(collection_limit) =>
                              setDraft({
                                ...draft,
                                content_json: { ...draft.content_json, collection_limit },
                              })
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                </label>
              )}
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  <option value="in_review">Em revisão</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </label>
              <label className="toggle-field field-wide">
                <input
                  type="checkbox"
                  checked={draft.is_placeholder}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      is_placeholder: event.target.checked,
                    })
                  }
                />
                Contém conteúdo provisório
              </label>
              <label className="field-wide">
                Nota editorial
                <textarea
                  value={draft.editorial_note ?? ""}
                  onChange={(event) => setDraft({ ...draft, editorial_note: event.target.value })}
                />
              </label>
            </div>
            <fieldset className="motion-editor">
              <legend>Placement e animação</legend>
              <label>
                Painel a editar (demais painéis são preservados)
                <select
                  value={placementPanel}
                  onChange={(event) => setPlacementPanel(event.target.value as PanelKey)}
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile-a">Mobile A</option>
                  <option value="mobile-b">Mobile B</option>
                </select>
              </label>
              <div className="field-grid compact-grid">
                <label>
                  Variante de layout
                  <select
                    value={placement.layout_variant}
                    onChange={(event) =>
                      setPlacement({
                        ...placement,
                        layout_variant: event.target.value,
                      })
                    }
                  >
                    <option value="default">Padrão</option>
                    <option value="compact">Compacto</option>
                    <option value="featured">Destaque</option>
                    <option value="wide">Largo</option>
                  </select>
                </label>
                <label>
                  Preset
                  <select
                    value={placement.preset}
                    onChange={(event) => setPlacement({ ...placement, preset: event.target.value })}
                  >
                    <option value="none">Nenhum</option>
                    <option value="fade-in">Fade</option>
                    <option value="fade-up">Fade vertical</option>
                    <option value="stagger">Stagger</option>
                    <option value="image-reveal">Reveal de imagem</option>
                    <option value="metric-count">Métrica</option>
                  </select>
                </label>
                <label>
                  Duração (ms)
                  <input
                    type="number"
                    min="0"
                    max="1200"
                    value={placement.duration}
                    onChange={(event) =>
                      setPlacement({
                        ...placement,
                        duration: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Atraso (ms)
                  <input
                    type="number"
                    min="0"
                    max="600"
                    value={placement.delay}
                    onChange={(event) =>
                      setPlacement({
                        ...placement,
                        delay: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Deslocamento
                  <input
                    type="number"
                    min="0"
                    max="48"
                    value={placement.distance}
                    onChange={(event) =>
                      setPlacement({
                        ...placement,
                        distance: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="toggle-field">
                  <input
                    type="checkbox"
                    checked={placement.is_visible}
                    onChange={(event) =>
                      setPlacement({
                        ...placement,
                        is_visible: event.target.checked,
                      })
                    }
                  />
                  Placement visível
                </label>
              </div>
            </fieldset>
            {[
                    "invest-rs",
                    "prefeitura-sp",
                    "vale",
                    "globo-sportv",
                    "inpress",
                    "cdi",
                  ].includes(
              sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
            ) &&
              draft.mobile_panel === "a" && (
                <fieldset className="admin-card">
                  <legend>Identidade da empresa e galeria de projetos</legend>
                  <p>
                    Use arquivos próprios/autorizados. Sem imagens aprovadas, o site mostra um
                    espaço reservado identificado, não uma fotografia fictícia.
                  </p>
                  <div className="field-grid">
                    <PublishedMediaPicker
                      label="Logotipo da empresa"
                      value={draft.content_json.experienceMedia?.logo ?? ""}
                      onChange={(logo, alt) =>
                        setDraft({
                          ...draft,
                          content_json: {
                            ...draft.content_json,
                            experienceMedia: {
                              ...draft.content_json.experienceMedia,
                              logo,
                              logoAlt: alt,
                            },
                          },
                        })
                      }
                    />
                    <label>
                      Descrição alternativa do logo
                      <input
                        value={draft.content_json.experienceMedia?.logoAlt ?? ""}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            content_json: {
                              ...draft.content_json,
                              experienceMedia: {
                                ...draft.content_json.experienceMedia,
                                logoAlt: event.target.value,
                              },
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                  <h3>Slides relacionados aos projetos</h3>
                  {(draft.content_json.experienceMedia?.slides ?? []).map((slide, slideIndex) => (
                    <div className="block-item-editor" key={slideIndex}>
                      <div className="block-item-head">
                        <strong>Slide {slideIndex + 1}</strong>
                        <div className="order-buttons">
                          <button
                            type="button"
                            aria-label="Slide anterior na ordem"
                            onClick={() => {
                              if (slideIndex === 0) return
                              const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                              ;[slides[slideIndex - 1], slides[slideIndex]] = [
                                slides[slideIndex],
                                slides[slideIndex - 1],
                              ]
                              setDraft({
                                ...draft,
                                content_json: {
                                  ...draft.content_json,
                                  experienceMedia: {
                                    ...draft.content_json.experienceMedia,
                                    slides,
                                  },
                                },
                              })
                            }}
                          >
                            <Icon name="up" size={17} />
                          </button>
                          <button
                            type="button"
                            aria-label="Slide seguinte na ordem"
                            onClick={() => {
                              const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                              if (slideIndex >= slides.length - 1) return
                              ;[slides[slideIndex + 1], slides[slideIndex]] = [
                                slides[slideIndex],
                                slides[slideIndex + 1],
                              ]
                              setDraft({
                                ...draft,
                                content_json: {
                                  ...draft.content_json,
                                  experienceMedia: {
                                    ...draft.content_json.experienceMedia,
                                    slides,
                                  },
                                },
                              })
                            }}
                          >
                            <Icon name="down" size={17} />
                          </button>
                          <button
                            type="button"
                            aria-label="Excluir slide"
                            onClick={() => {
                              if (!confirm("Excluir este slide?")) return
                              const slides = (
                                draft.content_json.experienceMedia?.slides ?? []
                              ).filter((_, i) => i !== slideIndex)
                              setDraft({
                                ...draft,
                                content_json: {
                                  ...draft.content_json,
                                  experienceMedia: {
                                    ...draft.content_json.experienceMedia,
                                    slides,
                                  },
                                },
                              })
                            }}
                          >
                            <Icon name="close" size={17} />
                          </button>
                        </div>
                      </div>
                      <div className="field-grid">
                        {(
                          [
                            ["title", "Título do projeto"],
                            ["alt", "Descrição alternativa da foto"],
                            ["caption", "Legenda da imagem"],
                          ] as const
                        ).map(([key, label]) => (
                          <label key={key}>
                            {label}
                            <input
                              value={slide[key] ?? ""}
                              onChange={(event) => {
                                const slides = [
                                  ...(draft.content_json.experienceMedia?.slides ?? []),
                                ]
                                slides[slideIndex] = { ...slide, [key]: event.target.value }
                                setDraft({
                                  ...draft,
                                  content_json: {
                                    ...draft.content_json,
                                    experienceMedia: {
                                      ...draft.content_json.experienceMedia,
                                      slides,
                                    },
                                  },
                                })
                              }}
                            />
                          </label>
                        ))}
                        <PublishedMediaPicker
                          label="Fotografia do slide"
                          value={slide.image ?? ""}
                          onChange={(image, alt) => {
                            const slides = [...(draft.content_json.experienceMedia?.slides ?? [])]
                            slides[slideIndex] = { ...slide, image, alt }
                            setDraft({
                              ...draft,
                              content_json: {
                                ...draft.content_json,
                                experienceMedia: {
                                  ...draft.content_json.experienceMedia,
                                  slides,
                                },
                              },
                            })
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      const slides = [
                        ...(draft.content_json.experienceMedia?.slides ?? []),
                        { title: "Novo projeto" },
                      ]
                      setDraft({
                        ...draft,
                        content_json: {
                          ...draft.content_json,
                          experienceMedia: { ...draft.content_json.experienceMedia, slides },
                        },
                      })
                    }}
                  >
                    Adicionar slide
                  </button>
                </fieldset>
              )}
            <div className="block-items">
              {sections.find((entry) => entry.id === draft.section_id)?.slug === "sobre" &&
                draft.mobile_panel === "b" && (
                  <div className="admin-card">
                    <strong>Textos da seção 02 — coluna direita</strong>
                    <p>
                      Cada item corresponde a um título e texto. Use Adicionar item, as setas de
                      ordenação e Remover item para gerenciar a lista completa. O primeiro item
                      também aparece junto à foto no painel A mobile. Clique em Salvar alterações
                      para publicar suas edições no bloco.
                    </p>
                  </div>
                )}
              {(draft.content_json.items ?? []).map((item, index) => (
                <article className="block-item-editor" key={index}>
                  <div className="block-item-head">
                    <strong>
                      Item {String(index + 1).padStart(2, "0")}
                      {item.isHidden === true && (
                        <span className="admin-hidden-label"> · Ocultado</span>
                      )}
                    </strong>
                    <div className="order-buttons">
                      <button onClick={() => moveItem(index, -1)} aria-label="Mover item para cima">
                        <Icon name="up" size={17} />
                      </button>
                      <button onClick={() => moveItem(index, 1)} aria-label="Mover item para baixo">
                        <Icon name="down" size={17} />
                      </button>
                      <button onClick={() => removeItem(index)} aria-label="Remover item">
                        <Icon name="close" size={17} />
                      </button>
                    </div>
                  </div>
                  {["invest-rs", "prefeitura-sp", "vale", "globo-sportv", "inpress", "cdi"].includes(
                    sections.find((entry) => entry.id === draft.section_id)?.slug ?? "",
                  ) && (
                    <label className="toggle-field admin-visibility-toggle">
                      <input
                        type="checkbox"
                        checked={item.isHidden !== true}
                        onChange={(event) => updateItem(index, { isHidden: !event.target.checked })}
                      />
                      Exibir este item em Projetos e realizações (desmarcado = ocultado, sem
                      excluir)
                    </label>
                  )}
                  <div className="field-grid">
                    <label>
                      Título
                      <input
                        value={item.title}
                        onChange={(event) => updateItem(index, { title: event.target.value })}
                      />
                    </label>
                    <label>
                      Rótulo / número
                      <input
                        value={item.label ?? ""}
                        onChange={(event) => updateItem(index, { label: event.target.value })}
                      />
                    </label>
                    <label className="field-wide">
                      Texto
                      <textarea
                        value={item.text ?? ""}
                        onChange={(event) => updateItem(index, { text: event.target.value })}
                      />
                    </label>
                    <label>
                      Valor/métrica
                      <input
                        value={item.value ?? ""}
                        onChange={(event) => updateItem(index, { value: event.target.value })}
                      />
                    </label>
                    <label>
                      Metadado/URL
                      <input
                        value={item.meta ?? ""}
                        onChange={(event) => updateItem(index, { meta: event.target.value })}
                      />
                    </label>
                    {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                      "resultados" &&
                      draft.mobile_panel === "a" && (
                        <div className="field-wide">
                          <label>
                            Ícone do indicador (substitui o número)
                            <select
                              value={item.metricIcon ?? "chart"}
                              onChange={(event) =>
                                updateItem(index, {
                                  metricIcon: event.target.value as MetricIconName,
                                })
                              }
                            >
                              {[
                                ["chart", "Gráfico de barras"],
                                ["trending", "Crescimento"],
                                ["users", "Públicos / pessoas"],
                                ["newspaper", "Imprensa"],
                                ["target", "Meta / objetivo"],
                                ["megaphone", "Comunicação"],
                                ["briefcase", "Projetos"],
                                ["calendar", "Eventos"],
                                ["award", "Destaque"],
                                ["layers", "Estratégia"],
                              ].map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <fieldset>
                            <legend>Exibir este indicador nos temas</legend>
                            {(
                              blocks.find(
                                (entry) =>
                                  entry.section_id === draft.section_id &&
                                  entry.mobile_panel === "b",
                              )?.content_json.items ?? []
                            ).map((theme, themeIndex) => {
                              const key =
                                theme.themeKey ||
                                ["corporativa", "projetos", "eventos", "marketing", "imprensa"][
                                  themeIndex
                                ] ||
                                `tema-${themeIndex + 1}`
                              return (
                                <label key={key} className="toggle-field">
                                  <input
                                    type="checkbox"
                                    checked={(item.relatedThemeKeys ?? []).includes(key)}
                                    onChange={(event) => {
                                      const selected = item.relatedThemeKeys ?? []
                                      updateItem(index, {
                                        relatedThemeKeys: event.target.checked
                                          ? [...selected, key]
                                          : selected.filter((value) => value !== key),
                                      })
                                    }}
                                  />
                                  {theme.title}
                                </label>
                              )
                            })}
                          </fieldset>
                        </div>
                      )}
                    {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                      "resultados" &&
                      draft.mobile_panel === "b" && (
                        <div className="field-wide">
                          <label>
                            Identificador do tema (para os links da abertura)
                            <input
                              value={item.themeKey ?? ""}
                              onChange={(event) =>
                                updateItem(index, { themeKey: event.target.value })
                              }
                              placeholder="corporativa, projetos, eventos, marketing ou imprensa"
                            />
                          </label>
                          <label>
                            Eixo central
                            <input
                              value={item.themeAxis ?? ""}
                              onChange={(event) =>
                                updateItem(index, { themeAxis: event.target.value })
                              }
                            />
                          </label>
                          <label>
                            Título do conteúdo central
                            <input
                              value={item.themeTitle ?? ""}
                              onChange={(event) =>
                                updateItem(index, { themeTitle: event.target.value })
                              }
                            />
                          </label>
                          <label>
                            Subtítulo do conteúdo central
                            <textarea
                              value={item.themeSubtitle ?? ""}
                              onChange={(event) =>
                                updateItem(index, { themeSubtitle: event.target.value })
                              }
                            />
                          </label>
                          <label>
                            Temas relacionados
                            <textarea
                              value={item.themeTopics ?? ""}
                              onChange={(event) =>
                                updateItem(index, { themeTopics: event.target.value })
                              }
                            />
                          </label>
                          <label>
                            Texto curto
                            <textarea
                              value={item.themeSummary ?? ""}
                              onChange={(event) =>
                                updateItem(index, { themeSummary: event.target.value })
                              }
                            />
                          </label>
                          <label>
                            Conteúdo reaproveitado da antiga seção 04 (uma linha por item)
                            <textarea
                              value={(item.inheritedHighlights ?? []).join("\n")}
                              onChange={(event) =>
                                updateItem(index, {
                                  inheritedHighlights: event.target.value
                                    .split("\n")
                                    .map((value) => value.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </label>
                        </div>
                      )}
                    {sections.find((entry) => entry.id === draft.section_id)?.slug === "perfil" &&
                      draft.mobile_panel === "b" &&
                      index < 5 && (
                        <>
                          <label className="field-wide">
                            Destino do card (seção interna)
                            <select
                              value={item.targetSlug ?? "resultados"}
                              onChange={(event) =>
                                updateItem(index, { targetSlug: event.target.value })
                              }
                            >
                              {sections
                                .filter((entry) => entry.slug !== "perfil")
                                .map((entry) => (
                                  <option key={entry.id} value={entry.slug}>
                                    {entry.title} (#{entry.slug})
                                  </option>
                                ))}
                            </select>
                            <small>
                              Padrão: seção 03. O clique funciona em toda a área do card.
                            </small>
                          </label>
                          <label className="field-wide">
                            Tema selecionado na seção 03
                            <select
                              value={
                                item.themeKey ||
                                ["corporativa", "projetos", "eventos", "marketing", "imprensa"][
                                  index
                                ]
                              }
                              onChange={(event) =>
                                updateItem(index, { themeKey: event.target.value })
                              }
                            >
                              <option value="corporativa">Comunicação Corporativa</option>
                              <option value="projetos">Gestão e execução de projetos</option>
                              <option value="eventos">Relações Públicas e Gestão de Eventos</option>
                              <option value="marketing">
                                Marketing Digital, Branding e Performance
                              </option>
                              <option value="imprensa">Imprensa e Influenciadores</option>
                            </select>
                          </label>
                        </>
                      )}
                    {sections.find((entry) => entry.id === draft.section_id)?.slug === "perfil" &&
                      draft.mobile_panel === "b" &&
                      index >= 5 &&
                      index < 11 && (
                        <label className="field-wide">
                          Empresa de destino (card clicável)
                          <select
                            value={item.targetSlug ?? ""}
                            onChange={(event) =>
                              updateItem(index, { targetSlug: event.target.value })
                            }
                          >
                            <option value="">Sem link</option>
                            {sections
                              .filter((entry) =>
                                [
                                  "invest-rs",
                                  "prefeitura-sp",
                                  "vale",
                                  "globo-sportv",
                                  "inpress",
                                  "cdi",
                                ].includes(entry.slug),
                              )
                              .map((entry) => (
                                <option key={entry.id} value={entry.slug}>
                                  {entry.title}
                                </option>
                              ))}
                          </select>
                          <small>
                            O card inteiro direciona para a seção da empresa, incluindo no mobile.
                          </small>
                        </label>
                      )}
                    {sections.find((entry) => entry.id === draft.section_id)?.slug ===
                      "ferramentas" && (
                      <fieldset className="field-wide">
                        <legend>Ícones de plataformas (até três)</legend>
                        {toolIconOptions.map(({ value, label }) => (
                          <label className="toggle-field" key={value}>
                            <input
                              type="checkbox"
                              checked={(item.toolIcons ?? []).includes(value)}
                              disabled={
                                !(item.toolIcons ?? []).includes(value) &&
                                (item.toolIcons?.length ?? 0) >= 3
                              }
                              onChange={(checked) => {
                                const next = item.toolIcons ?? []
                                updateItem(index, {
                                  toolIcons: checked.target.checked
                                    ? [...next, value]
                                    : next.filter((icon) => icon !== value),
                                })
                              }}
                            />
                            {label}
                          </label>
                        ))}
                        <small>
                          Ícones vetoriais locais, associados às plataformas indicadas no texto.
                        </small>
                      </fieldset>
                    )}
                    <PublishedMediaPicker
                      label="Imagem do item"
                      value={item.image ?? ""}
                      onChange={(image, alt) => updateItem(index, { image, alt })}
                    />
                    <label>
                      Texto alternativo
                      <input
                        value={item.alt ?? ""}
                        onChange={(event) => updateItem(index, { alt: event.target.value })}
                      />
                    </label>
                    {sections.find((entry) => entry.id === draft.section_id)?.slug === "sobre" &&
                      draft.mobile_panel === "a" &&
                      index === 0 && (
                        <>
                          <div className="field-wide">
                            <PublishedMediaPicker
                              label="Imagem central da seção 02 (desktop)"
                              value={item.aboutDesktopImage ?? ""}
                              onChange={(aboutDesktopImage, alt) =>
                                updateItem(index, { aboutDesktopImage, aboutDesktopAlt: alt })
                              }
                            />
                            <small>
                              Se vazio, usa /media/tulius-contact.jpg. A imagem do painel mobile
                              continua no campo Imagem acima.
                            </small>
                          </div>
                          <label className="field-wide">
                            Descrição da imagem central (desktop)
                            <input
                              value={item.aboutDesktopAlt ?? ""}
                              placeholder="Tulius Tsangaropulos segurando um tablet"
                              onChange={(event) =>
                                updateItem(index, { aboutDesktopAlt: event.target.value })
                              }
                            />
                          </label>
                          <p className="field-wide">
                            Este item guarda apenas as imagens da seção 02. Os cinco títulos e
                            textos da direita são gerenciados juntos no painel B. A coluna esquerda
                            usa título, subtítulo e introdução da seção.
                          </p>
                        </>
                      )}
                  </div>
                  <details className="visual-config">
                    <summary>Estilo, visibilidade e responsividade</summary>
                    <fieldset>
                      <legend>Compartilhado entre desktop e mobile</legend>
                      <div className="field-grid compact-grid">
                        <label>
                          Ícone
                          <select
                            value={item.icon ?? "none"}
                            onChange={(event) =>
                              updateItem(index, {
                                icon: event.target.value as "arrow" | "none",
                              })
                            }
                          >
                            <option value="none">Sem ícone</option>
                            <option value="arrow">Seta diagonal</option>
                          </select>
                        </label>
                        <ColorField
                          label="Cor do título"
                          value={item.titleColor}
                          fallback="#FF5414"
                          onChange={(titleColor) => updateItem(index, { titleColor })}
                        />
                        <ColorField
                          label="Cor da descrição"
                          value={item.textColor}
                          fallback="#FFFFFF"
                          onChange={(textColor) => updateItem(index, { textColor })}
                        />
                        <ColorField
                          label="Cor de fundo"
                          value={item.backgroundColor}
                          fallback="#171617"
                          onChange={(backgroundColor) => updateItem(index, { backgroundColor })}
                        />
                      </div>
                    </fieldset>
                    <div className="responsive-style-grid">
                      {(["desktop", "mobile"] as const).map((device) => (
                        <DeviceStyleEditor
                          key={device}
                          device={device}
                          value={item[device]}
                          onChange={(patch) => updateDeviceStyle(index, device, patch)}
                        />
                      ))}
                    </div>
                    {item.image && (
                      <fieldset>
                        <legend>Fotografia e selo da abertura</legend>
                        <div className="field-grid compact-grid">
                          <label className="field-wide">
                            Texto do selo circular
                            <input
                              value={
                                item.hero?.badgeText ?? "VISÃO 360° DA COMUNICAÇÃO E MARKETING ·"
                              }
                              onChange={(event) =>
                                updateHero(index, {
                                  badgeText: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="toggle-field">
                            <input
                              type="checkbox"
                              checked={item.hero?.badgeVisible !== false}
                              onChange={(event) =>
                                updateHero(index, {
                                  badgeVisible: event.target.checked,
                                })
                              }
                            />
                            Exibir selo
                          </label>
                          <ColorField
                            label="Fundo da coluna"
                            value={item.hero?.panelBackground}
                            fallback="#171617"
                            onChange={(panelBackground) => updateHero(index, { panelBackground })}
                          />
                          <ColorField
                            label="Fundo do selo"
                            value={item.hero?.badgeBackground}
                            fallback="#FF5414"
                            onChange={(badgeBackground) => updateHero(index, { badgeBackground })}
                          />
                          <ColorField
                            label="Traço do selo"
                            value={item.hero?.badgeColor}
                            fallback="#171617"
                            onChange={(badgeColor) => updateHero(index, { badgeColor })}
                          />
                          <ColorField
                            label="Cor da frase"
                            value={item.hero?.introColor}
                            fallback="#FFFFFF"
                            onChange={(introColor) => updateHero(index, { introColor })}
                          />
                        </div>
                        <div className="responsive-style-grid">
                          <HeroDeviceEditor
                            device="desktop"
                            value={item.hero?.desktop}
                            onChange={(patch) => updateHeroDevice(index, "desktop", patch)}
                          />
                          <HeroDeviceEditor
                            device="mobile"
                            value={item.hero?.mobile}
                            onChange={(patch) => updateHeroDevice(index, "mobile", patch)}
                          />
                        </div>
                      </fieldset>
                    )}
                  </details>
                </article>
              ))}
              <button
                className="secondary-button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    content_json: {
                      ...draft.content_json,
                      items: [...(draft.content_json.items ?? []), { ...emptyItem }],
                    },
                  })
                }
              >
                Adicionar item
              </button>
            </div>
            <StatusMessage>{message}</StatusMessage>
            <div className="form-actions">
              <button className="danger-button" onClick={archiveBlock}>
                Arquivar bloco
              </button>
              <button
                className="primary-button"
                onClick={saveBlock}
                disabled={placementsLoading || placementsReadError}
              >
                Salvar bloco
              </button>
            </div>
          </section>
        ) : (
          <div className="admin-card empty-state">
            <h2>Selecione ou crie um bloco</h2>
          </div>
        )}
      </div>
    </>
  )
}

type FieldConfig = {
  key: string
  label: string
  multiline?: boolean
  type?: "number" | "url"
}
type CollectionConfig = {
  table: string
  label: string
  titleKey: string
  fields: FieldConfig[]
}

const collectionConfigs: CollectionConfig[] = [
  {
    table: "career_experiences",
    label: "Experiências",
    titleKey: "company",
    fields: [
      { key: "company", label: "Empresa" },
      { key: "role", label: "Cargo" },
      { key: "location", label: "Local" },
      { key: "start_date", label: "Início" },
      { key: "end_date", label: "Fim" },
      { key: "description", label: "Descrição", multiline: true },
      { key: "editorial_note", label: "Nota editorial", multiline: true },
    ],
  },
  {
    table: "portfolio_projects",
    label: "Projetos",
    titleKey: "title",
    fields: [
      { key: "title", label: "Título" },
      { key: "summary", label: "Resumo", multiline: true },
      { key: "details", label: "Detalhes", multiline: true },
      { key: "project_status", label: "Estado do projeto" },
    ],
  },
  {
    table: "metrics",
    label: "Métricas",
    titleKey: "label",
    fields: [
      { key: "label", label: "Rótulo" },
      { key: "value_text", label: "Valor" },
      { key: "unit", label: "Unidade" },
      { key: "context", label: "Contexto", multiline: true },
      { key: "editorial_note", label: "Nota editorial", multiline: true },
    ],
  },
  {
    table: "skills",
    label: "Competências",
    titleKey: "name",
    fields: [
      { key: "name", label: "Nome" },
      { key: "category", label: "Categoria" },
    ],
  },
  {
    table: "education",
    label: "Formação",
    titleKey: "course",
    fields: [
      { key: "institution", label: "Instituição" },
      { key: "course", label: "Curso" },
      { key: "degree_type", label: "Tipo" },
      { key: "start_date", label: "Início" },
      { key: "end_date", label: "Fim" },
    ],
  },
  {
    table: "language_levels",
    label: "Idiomas",
    titleKey: "language",
    fields: [
      { key: "language", label: "Idioma" },
      { key: "level_label", label: "Nível" },
      { key: "evidence_note", label: "Evidência", multiline: true },
      { key: "editorial_note", label: "Nota editorial", multiline: true },
    ],
  },
  {
    table: "tool_categories",
    label: "Ferramentas",
    titleKey: "title",
    fields: [
      { key: "title", label: "Categoria" },
      {
        key: "tools_text",
        label: "Ferramentas, uma por linha",
        multiline: true,
      },
    ],
  },
  {
    table: "testimonials",
    label: "Depoimentos",
    titleKey: "author_name",
    fields: [
      { key: "author_name", label: "Pessoa" },
      { key: "author_role", label: "Cargo" },
      { key: "quote_text", label: "Depoimento", multiline: true },
    ],
  },
  {
    table: "contact_channels",
    label: "Contato",
    titleKey: "label",
    fields: [
      { key: "channel_type", label: "Tipo" },
      { key: "label", label: "Rótulo" },
      { key: "value", label: "Valor" },
      { key: "url", label: "URL", type: "url" },
    ],
  },
]

export function CollectionsStudio() {
  const [config, setConfig] = useState(collectionConfigs[0])
  const [records, setRecords] = useState<Record<string, any>[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [draft, setDraft] = useState<Record<string, any> | null>(null)
  const [message, setMessage] = useState("")

  const load = async () => {
    if (!supabase) return
    const { data, error } = await supabase.from(config.table).select("*").order("sort_order")
    const normalized = (data ?? []).map((record) => ({
      ...record,
      tools_text: Array.isArray(record.tools)
        ? record.tools.map((tool: any) => tool.name ?? String(tool)).join("\n")
        : "",
    }))
    setRecords(normalized)
    setMessage(error?.message ?? "")
    if (normalized.length && !normalized.some((r) => r.id === selectedId))
      setSelectedId(normalized[0].id)
  }

  useEffect(() => {
    setSelectedId("")
    void load()
  }, [config.table])

  useEffect(() => {
    const record = records.find((item) => item.id === selectedId)
    setDraft(record ? structuredClone(record) : null)
  }, [records, selectedId])

  function newRecord() {
    const base = Object.fromEntries(config.fields.map((field) => [field.key, ""]))
    setSelectedId("")
    setDraft({
      ...base,
      sort_order: records.length + 1,
      status: "draft",
    })
  }

  async function save() {
    if (!supabase || !draft) return
    const payload = { ...draft }
    delete payload.id
    delete payload.updated_at
    if (config.table === "tool_categories") {
      payload.tools = String(payload.tools_text ?? "")
        .split("\n")
        .filter(Boolean)
        .map((name) => ({ name: name.trim() }))
      delete payload.tools_text
    }
    const result = draft.id
      ? await supabase.from(config.table).update(payload).eq("id", draft.id)
      : await supabase.from(config.table).insert(payload)
    setMessage(result.error?.message ?? "Registro salvo.")
    if (!result.error) await load()
  }

  async function archive() {
    if (!supabase || !draft?.id || !confirm("Arquivar este registro?")) return
    const { error } = await supabase
      .from(config.table)
      .update({ status: "archived" })
      .eq("id", draft.id)
    setMessage(error?.message ?? "Registro arquivado.")
    if (!error) await load()
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Fonte estruturada</p>
          <h1>Coleções</h1>
          <span>Experiências, resultados, formação e referências</span>
        </div>
        <button className="primary-button" onClick={newRecord}>
          Novo registro
        </button>
      </header>
      <div className="collection-tabs" role="tablist">
        {collectionConfigs.map((item) => (
          <button
            key={item.table}
            role="tab"
            aria-selected={item.table === config.table}
            className={item.table === config.table ? "active" : ""}
            onClick={() => setConfig(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="section-editor-layout">
        <div className="section-list">
          {records.map((record, index) => (
            <button
              key={record.id}
              className={selectedId === record.id ? "active" : ""}
              onClick={() => setSelectedId(record.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{record[config.titleKey] || "Sem título"}</strong>
                <small>{record.status}</small>
              </div>
            </button>
          ))}
        </div>
        {draft && (
          <section className="admin-card editor-form">
            <div className="field-grid">
              {config.fields.map((field) => (
                <label key={field.key} className={field.multiline ? "field-wide" : ""}>
                  {field.label}
                  {field.multiline ? (
                    <textarea
                      rows={4}
                      value={draft[field.key] ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          [field.key]: event.target.value,
                        })
                      }
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={draft[field.key] ?? ""}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          [field.key]: event.target.value,
                        })
                      }
                    />
                  )}
                </label>
              ))}
              <label>
                Ordem
                <input
                  type="number"
                  min="1"
                  value={draft.sort_order ?? 1}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      sort_order: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={draft.status ?? "draft"}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  {!["skills", "tool_categories", "contact_channels"].includes(config.table) && (
                    <option value="in_review">Em revisão</option>
                  )}
                  <option value="published">Publicado</option>
                  {!["skills", "tool_categories", "contact_channels"].includes(config.table) && (
                    <option value="archived">Arquivado</option>
                  )}
                </select>
              </label>
            </div>
            <StatusMessage>{message}</StatusMessage>
            <div className="form-actions">
              <button className="danger-button" onClick={archive} disabled={!draft.id}>
                Arquivar
              </button>
              <button className="primary-button" onClick={save}>
                Salvar registro
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export function NavigationStudio() {
  const [items, setItems] = useState<Record<string, any>[]>([])
  const [message, setMessage] = useState("")
  const load = async () => {
    const { data, error } = (await supabase
      ?.from("navigation_items")
      .select("*")
      .order("sort_order")) ?? { data: [], error: null }
    setItems(data ?? [])
    setMessage(error?.message ?? "")
  }
  useEffect(() => {
    void load()
  }, [])
  function patch(index: number, values: Record<string, any>) {
    const next = [...items]
    next[index] = { ...next[index], ...values }
    setItems(next)
  }
  function create() {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        label: "Novo item",
        target_slug: "perfil",
        group_name: "Principal",
        sort_order: items.length + 1,
        is_visible: false,
        status: "draft",
      },
    ])
  }
  async function save() {
    if (!supabase) return
    const rows = items.map(
      ({ id, label, target_slug, group_name, sort_order, is_visible, status }) => ({
        id,
        label,
        target_slug,
        group_name,
        sort_order,
        is_visible,
        status,
      }),
    )
    const { error } = await supabase.from("navigation_items").upsert(rows, { onConflict: "id" })
    setMessage(error?.message ?? "Navegação salva.")
    if (!error) await load()
  }
  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next.map((item, order) => ({ ...item, sort_order: order + 1 })))
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Menu público</p>
          <h1>Navegação</h1>
          <span>Rótulos, grupos, ordem e visibilidade</span>
        </div>
        <div className="header-actions">
          <button className="secondary-button" onClick={create}>
            Novo item
          </button>
          <button className="primary-button" onClick={save}>
            Salvar menu
          </button>
        </div>
      </header>
      <section className="admin-card navigation-form">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="order-buttons">
              <button onClick={() => move(index, -1)} aria-label="Mover item para cima">
                <Icon name="up" size={17} />
              </button>
              <button onClick={() => move(index, 1)} aria-label="Mover item para baixo">
                <Icon name="down" size={17} />
              </button>
            </div>
            <label>
              Rótulo
              <input
                value={item.label}
                onChange={(event) => patch(index, { label: event.target.value })}
              />
            </label>
            <label>
              Grupo
              <input
                value={item.group_name}
                onChange={(event) => patch(index, { group_name: event.target.value })}
              />
            </label>
            <label>
              Âncora
              <input
                value={item.target_slug}
                onChange={(event) => patch(index, { target_slug: event.target.value })}
              />
            </label>
            <label className="toggle-field">
              <input
                type="checkbox"
                checked={item.is_visible}
                onChange={(event) => patch(index, { is_visible: event.target.checked })}
              />
              Visível
            </label>
            <label>
              Status
              <select
                value={item.status}
                onChange={(event) => patch(index, { status: event.target.value })}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </label>
          </div>
        ))}
        <StatusMessage>{message}</StatusMessage>
      </section>
    </>
  )
}

export function SeoStudio() {
  const [page, setPage] = useState<Record<string, any> | null>(null)
  const [settings, setSettings] = useState<Record<string, any> | null>(null)
  const [message, setMessage] = useState("")
  useEffect(() => {
    void Promise.all([
      supabase?.from("pages").select("*").eq("slug", "home").maybeSingle(),
      supabase?.from("site_settings").select("*").limit(1).maybeSingle(),
    ]).then(([pageResult, settingsResult]) => {
      setPage(pageResult?.data ?? null)
      setSettings(
        settingsResult?.data ?? {
          site_title: "",
          locale: "pt-BR",
          description: "",
          seo_json: {},
          status: "draft",
        },
      )
    })
  }, [])
  async function save() {
    if (!supabase || !page || !settings) return
    if (!page.id || !settings.id)
      return setMessage("Página ou configurações de SEO ausentes. Nada foi alterado.")
    const { error } = await supabase.rpc("save_home_seo_atomic", {
      p_page_id: page.id,
      p_settings_id: settings.id,
      p_page_seo_title: page.seo_title,
      p_page_seo_description: page.seo_description,
      p_site_title: settings.site_title,
      p_site_description: settings.description,
      p_locale: settings.locale,
      p_seo_json: settings.seo_json ?? {},
      p_status: settings.status,
    })
    setMessage(
      error?.message ??
        "SEO salvo atomicamente. Metadados para robôs serão regenerados no próximo deploy.",
    )
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <p>Descoberta</p>
          <h1>SEO e metadados</h1>
          <span>Configurações globais e da página principal</span>
        </div>
        <button className="primary-button" onClick={save}>
          Salvar SEO
        </button>
      </header>
      {page && settings && (
        <section className="admin-card editor-form">
          <div className="field-grid">
            <label>
              Título do site
              <input
                value={settings.site_title}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    site_title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Idioma
              <input
                value={settings.locale}
                onChange={(event) => setSettings({ ...settings, locale: event.target.value })}
              />
            </label>
            <label className="field-wide">
              Descrição global
              <textarea
                value={settings.description ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    description: event.target.value,
                  })
                }
              />
            </label>
            <label className="field-wide">
              Título SEO
              <input
                value={page.seo_title ?? ""}
                onChange={(event) => setPage({ ...page, seo_title: event.target.value })}
              />
            </label>
            <label className="field-wide">
              Descrição SEO
              <textarea
                value={page.seo_description ?? ""}
                onChange={(event) => setPage({ ...page, seo_description: event.target.value })}
              />
            </label>
            <div className="field-wide">
              <PublishedMediaPicker
                label="Imagem Open Graph (compartilhamento)"
                value={settings.seo_json?.ogImage ?? ""}
                onChange={(ogImage) =>
                  setSettings({
                    ...settings,
                    seo_json: withOpenGraphImage(settings.seo_json, ogImage),
                  })
                }
              />
              <small>
                Selecione uma imagem publicada. A alteração dos metadados HTML será aplicada no
                próximo deploy após salvar o SEO.
              </small>
            </div>
            <label className="field-wide">
              Canonical
              <input
                value={settings.seo_json?.canonical ?? ""}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    seo_json: {
                      ...(settings.seo_json ?? {}),
                      canonical: event.target.value,
                    },
                  })
                }
                placeholder="Definir após o domínio final"
              />
            </label>
            <label>
              Status
              <select
                value={settings.status}
                onChange={(event) => setSettings({ ...settings, status: event.target.value })}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </label>
          </div>
          <StatusMessage>{message}</StatusMessage>
        </section>
      )}
    </>
  )
}

export function EditorialStudio() {
  const [issues, setIssues] = useState<Record<string, any>[]>([])
  const [revisions, setRevisions] = useState<Record<string, any>[]>([])
  const [message, setMessage] = useState("")
  const load = async () => {
    const [issueResult, revisionResult] = await Promise.all([
      supabase?.from("editorial_issues").select("*, sections(title)").order("created_at"),
      supabase
        ?.from("content_revisions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ])
    setIssues(issueResult?.data ?? [])
    setRevisions(revisionResult?.data ?? [])
  }
  useEffect(() => {
    void load()
  }, [])
  async function resolve(id: string, resolution: string) {
    if (!supabase || !resolution.trim()) return setMessage("Informe a resolução editorial.")
    const { error } = await supabase
      .from("editorial_issues")
      .update({ status: "resolved", resolution, reviewed_at: new Date() })
      .eq("id", id)
    setMessage(error?.message ?? "Pendência resolvida.")
    if (!error) await load()
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Governança editorial</p>
          <h1>Revisões e pendências</h1>
          <span>Conflitos de fonte, decisões e histórico automático</span>
        </div>
      </header>
      <div className="editorial-columns">
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <p>Em aberto</p>
              <h2>Pendências editoriais</h2>
            </div>
            <span className="status-chip">
              {issues.filter((issue) => issue.status === "open").length}
            </span>
          </div>
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} onResolve={resolve} />
          ))}
          <StatusMessage>{message}</StatusMessage>
        </section>
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <p>Últimas 50</p>
              <h2>Revisões</h2>
            </div>
          </div>
          <div className="revision-list">
            {revisions.map((revision) => (
              <div key={revision.id}>
                <strong>{revision.entity_type}</strong>
                <span>{new Date(revision.created_at).toLocaleString("pt-BR")}</span>
                <code>{revision.entity_id}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function IssueRow({
  issue,
  onResolve,
}: {
  issue: Record<string, any>
  onResolve: (id: string, resolution: string) => void
}) {
  const [resolution, setResolution] = useState(issue.resolution ?? "")
  return (
    <article className="issue-row">
      <span>{issue.sections?.title ?? issue.field_path}</span>
      <strong>{issue.description}</strong>
      {(issue.source_a || issue.source_b) && (
        <p>
          {issue.source_a || "—"} <b>×</b> {issue.source_b || "—"}
        </p>
      )}
      {issue.status === "open" ? (
        <div>
          <input
            aria-label={`Resolução para ${issue.description}`}
            value={resolution}
            onChange={(event) => setResolution(event.target.value)}
            placeholder="Decisão editorial"
          />
          <button className="secondary-button" onClick={() => onResolve(issue.id, resolution)}>
            Resolver
          </button>
        </div>
      ) : (
        <small>Resolvido: {issue.resolution}</small>
      )}
    </article>
  )
}

export function EnhancedMediaLibrary() {
  const [assets, setAssets] = useState<Record<string, any>[]>([])
  const [previews, setPreviews] = useState<Record<string, MediaPreview>>({})
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [message, setMessage] = useState("")
  const load = async () => {
    const client = supabase
    if (!client) return
    const { data, error } = await client
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
    const nextAssets = data ?? []
    setAssets(nextAssets)
    setFailedImages({})
    if (error) {
      setPreviews({})
      setMessage(error.message)
      return
    }
    const resolved = await Promise.all(
      nextAssets.map(async (asset) => ({
        id: asset.id,
        preview: await resolveMediaPreview(client.storage, asset),
      })),
    )
    setPreviews(Object.fromEntries(resolved.map(({ id, preview }) => [id, preview])))
  }
  useEffect(() => {
    void load()
  }, [])
  function patch(index: number, values: Record<string, any>) {
    const next = [...assets]
    next[index] = { ...next[index], ...values }
    setAssets(next)
  }
  async function save(asset: Record<string, any>) {
    if (!supabase) return
    if (asset.storage_bucket === "portfolio-public" && asset.status !== "published")
      return setMessage(
        "Arquivos públicos não podem virar rascunho apenas alterando o status. Faça um novo upload privado.",
      )
    if (asset.storage_bucket === "portfolio-private" && asset.status === "published")
      return setMessage("Use o botão Publicar para mover a mídia para o bucket público.")
    if (asset.status === "published" && !asset.alt_text.trim())
      return setMessage("Alt text é obrigatório para publicar uma mídia.")
    const { error } = await supabase
      .from("media_assets")
      .update({
        alt_text: asset.alt_text,
        title: asset.title,
        credit: asset.credit,
        status: asset.status,
      })
      .eq("id", asset.id)
    setMessage(error?.message ?? "Metadados salvos.")
    if (!error) await load()
  }
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !supabase) return
    if (
      !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type) ||
      file.size > 8_000_000
    )
      return setMessage("Use JPG, PNG, WebP ou SVG de até 8 MB.")
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
    const client = supabase
    const result = await stagePrivateMediaChange({
      stage: () => client.storage.from("portfolio-private").upload(path, file),
      persist: async () =>
        client.from("media_assets").insert({
          storage_bucket: "portfolio-private",
          storage_path: path,
          mime_type: file.type,
          file_size: file.size,
          alt_text: "",
          status: "draft",
        }),
      undoStage: () => client.storage.from("portfolio-private").remove([path]),
    })
    setMessage(result.ok ? "Upload concluído como rascunho privado." : result.message)
    if (result.ok) await load()
  }
  async function promote(asset: Record<string, any>) {
    if (!supabase || !asset.alt_text.trim())
      return setMessage("Preencha o alt text antes de publicar.")
    if (asset.storage_bucket === "portfolio-public") return save(asset)
    const { data, error } = await supabase.storage
      .from("portfolio-private")
      .download(asset.storage_path)
    if (error || !data) return setMessage(error?.message ?? "Arquivo não encontrado.")
    const upload = await supabase.storage
      .from("portfolio-public")
      .upload(asset.storage_path, data, {
        contentType: asset.mime_type,
        upsert: false,
      })
    if (upload.error) return setMessage(upload.error.message)
    const update = await supabase
      .from("media_assets")
      .update({ storage_bucket: "portfolio-public", status: "published" })
      .eq("id", asset.id)
    if (update.error) {
      const cleanup = await supabase.storage.from("portfolio-public").remove([asset.storage_path])
      return setMessage(
        update.error.message +
          (cleanup.error
            ? " Atenção: a cópia pública precisa de remoção manual."
            : " Cópia pública revertida."),
      )
    }
    setMessage("Mídia promovida ao bucket público.")
    await load()
  }
  async function replace(event: React.ChangeEvent<HTMLInputElement>, asset: Record<string, any>) {
    const file = event.target.files?.[0]
    if (!file || !supabase) return
    if (
      !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type) ||
      file.size > 8_000_000
    )
      return setMessage("Use JPG, PNG, WebP ou SVG de até 8 MB.")
    if (asset.storage_bucket !== "portfolio-private")
      return setMessage(
        "Substituição direta de mídia pública bloqueada para evitar expor um rascunho. Envie um novo arquivo privado e publique após revisar.",
      )
    // Never overwrite existing bytes before the metadata pointer is committed.
    const client = supabase
    const newPath = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
    const result = await stagePrivateMediaChange({
      stage: () =>
        client.storage.from("portfolio-private").upload(newPath, file, {
          contentType: file.type,
          upsert: false,
        }),
      persist: async () =>
        client
          .from("media_assets")
          .update({
            storage_path: newPath,
            mime_type: file.type,
            file_size: file.size,
            status: "draft",
          })
          .eq("id", asset.id)
          .select("id")
          .single(),
      undoStage: () => client.storage.from("portfolio-private").remove([newPath]),
      cleanupOld: () => client.storage.from("portfolio-private").remove([asset.storage_path]),
    })
    setMessage(
      result.ok
        ? `Arquivo substituído; revise e publique.${result.warning ? ` ${result.warning}` : ""}`
        : result.message,
    )
    if (result.ok) await load()
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Assets editoriais</p>
          <h1>Biblioteca de mídia</h1>
          <span>Originais privados, alt, créditos e publicação</span>
        </div>
        <label className="primary-button upload-button">
          Enviar mídia
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={upload}
          />
        </label>
      </header>
      <StatusMessage>{message}</StatusMessage>
      <div className="media-grid media-editor-grid">
        {assets.map((asset, index) => (
          <article className="admin-card" key={asset.id}>
            <div className="media-placeholder media-preview">
              {previews[asset.id]?.url && !failedImages[asset.id] ? (
                <img
                  src={previews[asset.id].url}
                  alt={asset.alt_text?.trim() || asset.title?.trim() || "Prévia da mídia"}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailedImages((current) => ({ ...current, [asset.id]: true }))}
                />
              ) : (
                <div className="media-preview-fallback">
                  <Icon name="image" size={32} />
                  <small>
                    {failedImages[asset.id]
                      ? "Imagem indisponível. Confira o arquivo no Storage."
                      : (previews[asset.id]?.error ?? "Carregando prévia…")}
                  </small>
                </div>
              )}
            </div>
            <strong>{asset.storage_path}</strong>
            <small>
              {asset.storage_bucket} · {asset.mime_type}
            </small>
            <label>
              Título
              <input
                value={asset.title ?? ""}
                onChange={(event) => patch(index, { title: event.target.value })}
              />
            </label>
            <label>
              Alt text
              <textarea
                value={asset.alt_text ?? ""}
                onChange={(event) => patch(index, { alt_text: event.target.value })}
              />
            </label>
            <label>
              Crédito/licença
              <input
                value={asset.credit ?? ""}
                onChange={(event) => patch(index, { credit: event.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={asset.status}
                onChange={(event) => patch(index, { status: event.target.value })}
              >
                <option value="draft">Rascunho</option>
                <option value="in_review">Em revisão</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </label>
            <div className="media-actions">
              <label className="secondary-button replace-button">
                Substituir
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(event) => replace(event, asset)}
                />
              </label>
              <button className="secondary-button" onClick={() => save(asset)}>
                Salvar
              </button>
              <button className="primary-button" onClick={() => promote(asset)}>
                Publicar
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
