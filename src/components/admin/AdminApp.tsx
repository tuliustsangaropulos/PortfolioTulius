import { FormEvent, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { defaultTokens } from "../../content/fallback"
import { isAdmin, isSupabaseConfigured, supabase } from "../../lib/supabase"
import { PublicSite } from "../public/PublicSite"
import { Icon } from "../ui/Icons"
import {
  CollectionsStudio,
  ContentStudio,
  EditorialStudio,
  EnhancedMediaLibrary,
  NavigationStudio,
  SeoStudio,
} from "./AdminModules"

type SectionRow = {
  id: string
  page_id: string
  title: string
  slug: string
  intro: string | null
  eyebrow: string | null
  sort_order: number
  status: string
  is_visible: boolean
  theme: string
  layout_variant: string
  animation_preset: string
}

function useAdminGuard() {
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading")
  useEffect(() => {
    isAdmin().then((allowed) => setState(allowed ? "allowed" : "denied"))
  }, [])
  return state
}

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return setMessage("Configure as variáveis públicas do Supabase.")
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(error.message)
      setBusy(false)
      return
    }
    if (!(await isAdmin())) {
      await supabase.auth.signOut()
      setMessage("Esta conta não possui autorização administrativa.")
      setBusy(false)
      return
    }
    navigate("/admin")
  }

  return (
    <main className="login-page">
      <Link to="/" className="admin-back">
        ← Voltar ao site
      </Link>
      <form className="login-card" onSubmit={submit}>
        <div className="admin-mark">TT</div>
        <p>Área administrativa</p>
        <h1>Conteúdo em boas mãos.</h1>
        <label>
          E-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {message && (
          <div className="form-message" role="alert">
            {message}
          </div>
        )}
        <button className="primary-button" disabled={busy || !isSupabaseConfigured}>
          {busy ? "Entrando…" : "Entrar com segurança"}
        </button>
        <small>
          O acesso exige uma conta no Supabase Auth vinculada à tabela protegida de administradores.
        </small>
      </form>
    </main>
  )
}

function AdminShell({
  children,
  active,
  setActive,
}: {
  children: React.ReactNode
  active: string
  setActive: (value: string) => void
}) {
  const navigate = useNavigate()
  const items = [
    ["dashboard", "Visão geral", "edit"],
    ["sections", "Seções", "edit"],
    ["blocks", "Blocos", "edit"],
    ["content", "Coleções", "edit"],
    ["design", "Identidade", "palette"],
    ["media", "Mídia", "image"],
    ["navigation", "Navegação", "arrow"],
    ["seo", "SEO", "edit"],
    ["editorial", "Revisões", "edit"],
    ["preview", "Prévia", "arrow"],
  ] as const
  async function logout() {
    await supabase?.auth.signOut()
    navigate("/admin/login")
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          <span>TT</span>
          <strong>
            Tulius
            <br />
            Admin
          </strong>
        </Link>
        <nav aria-label="Administração">
          {items.map(([id, label, icon]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => setActive(id)}
            >
              <Icon name={icon} size={19} />
              {label}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={logout}>
          <Icon name="logout" /> Sair
        </button>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  )
}

function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <header className="admin-header">
      <div>
        <p>Portfólio editorial</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>
      {action}
    </header>
  )
}

function Dashboard({ sections }: { sections: SectionRow[] }) {
  const published = sections.filter((s) => s.status === "published").length
  return (
    <>
      <AdminHeader title="Visão geral" subtitle="Status editorial e atalhos de publicação" />
      <div className="admin-stats">
        <article>
          <span>Seções publicadas</span>
          <strong>{published}/14</strong>
          <small>{14 - published} aguardando publicação</small>
        </article>
        <article>
          <span>Pendências editoriais</span>
          <strong>9</strong>
          <small>Conflitos preservados no seed</small>
        </article>
        <article>
          <span>Fonte de dados</span>
          <strong>{supabase ? "Online" : "Pendente"}</strong>
          <small>Projeto zfnrhzplwpjpdljraypt</small>
        </article>
      </div>
      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Checklist de publicação</p>
            <h2>Qualidade antes de publicar</h2>
          </div>
          <span className="status-chip">Rascunho seguro</span>
        </div>
        <ul className="check-list">
          <li>
            <span className="check done">✓</span>
            <div>
              <strong>Estrutura editorial</strong>
              <p>14 seções e duas distribuições mobile por seção.</p>
            </div>
          </li>
          <li>
            <span className="check done">✓</span>
            <div>
              <strong>Conteúdo do PDF</strong>
              <p>Textos, métricas e depoimentos sem duplicações gráficas.</p>
            </div>
          </li>
          <li>
            <span className="check">!</span>
            <div>
              <strong>Aplicação das migrations</strong>
              <p>Necessária no projeto Supabase antes do CRUD persistir.</p>
            </div>
          </li>
          <li>
            <span className="check">!</span>
            <div>
              <strong>Revisão editorial</strong>
              <p>Cargos, idiomas e indicadores divergentes aguardam decisão.</p>
            </div>
          </li>
        </ul>
      </section>
    </>
  )
}

function SectionsEditor({ sections, reload }: { sections: SectionRow[]; reload: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(sections[0]?.id ?? null)
  const selected = sections.find((s) => s.id === selectedId)
  const [draft, setDraft] = useState<SectionRow | null>(selected ?? null)
  const [message, setMessage] = useState("")
  useEffect(() => setDraft(selected ?? null), [selectedId, selected])
  useEffect(() => {
    if (!selectedId && sections[0]) setSelectedId(sections[0].id)
  }, [sections, selectedId])

  async function save() {
    if (!draft || !supabase) return
    setMessage("Salvando…")
    const { error } = await supabase
      .from("sections")
      .update({
        title: draft.title,
        intro: draft.intro,
        eyebrow: draft.eyebrow,
        status: draft.status,
        is_visible: draft.is_visible,
        theme: draft.theme,
        layout_variant: draft.layout_variant,
        animation_preset: draft.animation_preset,
      })
      .eq("id", draft.id)
    setMessage(error ? error.message : "Alterações salvas.")
    if (!error) reload()
  }
  async function move(direction: -1 | 1) {
    if (!selected || !supabase) return
    const target = sections.find((s) => s.sort_order === selected.sort_order + direction)
    if (!target) return
    setMessage("Reordenando…")
    const { error } = await supabase.rpc("swap_section_order", {
      section_a: selected.id,
      section_b: target.id,
    })
    setMessage(error?.message ?? "Ordem atualizada.")
    if (!error) reload()
  }
  async function duplicate() {
    if (!selected || !supabase) return
    const { data, error } = await supabase.rpc("duplicate_section", {
      source_section: selected.id,
    })
    setMessage(error ? error.message : "Seção duplicada como rascunho.")
    if (data) {
      reload()
      setSelectedId(data)
    }
  }
  async function create() {
    if (!supabase || !sections[0]) return
    setMessage("Criando seção e painéis…")
    const { data, error } = await supabase.rpc("create_section_with_panels", {
      p_page_id: sections[0].page_id,
    })
    setMessage(error?.message ?? "Seção e painéis criados como rascunho.")
    if (!error && data) {
      reload()
      setSelectedId(data)
    }
  }

  async function publish() {
    if (!selected || !supabase) return
    const allowPlaceholders = confirm(
      "Publicar mesmo se a seção contiver placeholders editoriais? OK permite; Cancelar bloqueia placeholders.",
    )
    const { error } = await supabase.rpc("publish_section", {
      section_to_publish: selected.id,
      allow_placeholders: allowPlaceholders,
    })
    setMessage(error?.message ?? "Seção e blocos publicados.")
    if (!error) reload()
  }
  async function remove() {
    if (!selected || !supabase || !confirm(`Arquivar “${selected.title}”?`)) return
    const { error } = await supabase
      .from("sections")
      .update({ status: "archived", is_visible: false })
      .eq("id", selected.id)
    setMessage(error ? error.message : "Seção arquivada.")
    reload()
  }
  return (
    <>
      <AdminHeader
        title="Seções"
        subtitle="Ordem, visibilidade, conteúdo e apresentação"
        action={
          <div className="header-actions">
            <button className="secondary-button" onClick={create}>
              Nova seção
            </button>
            <button className="primary-button" onClick={duplicate}>
              Duplicar seção
            </button>
          </div>
        }
      />
      <div className="section-editor-layout">
        <div className="section-list" aria-label="Seções do site">
          {sections.map((section) => (
            <button
              key={section.id}
              className={selectedId === section.id ? "active" : ""}
              onClick={() => setSelectedId(section.id)}
            >
              <span>{String(section.sort_order).padStart(2, "0")}</span>
              <div>
                <strong>{section.title}</strong>
                <small>{section.status}</small>
              </div>
            </button>
          ))}
        </div>
        {draft && (
          <section className="editor-form admin-card">
            <div className="card-heading">
              <div>
                <p>Seção {String(draft.sort_order).padStart(2, "0")}</p>
                <h2>{draft.title}</h2>
              </div>
              <div className="order-buttons">
                <button onClick={() => move(-1)} aria-label="Mover para cima">
                  <Icon name="up" />
                </button>
                <button onClick={() => move(1)} aria-label="Mover para baixo">
                  <Icon name="down" />
                </button>
              </div>
            </div>
            <div className="field-grid">
              <label>
                Título
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label>
                Âncora
                <input value={draft.slug} disabled title="Âncoras publicadas são estáveis" />
              </label>
              <label className="field-wide">
                Linha editorial
                <input
                  value={draft.eyebrow ?? ""}
                  onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                />
              </label>
              <label className="field-wide">
                Introdução
                <textarea
                  rows={4}
                  value={draft.intro ?? ""}
                  onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
                />
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                >
                  <option value="draft">Rascunho</option>
                  <option value="in_review">Em revisão</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </label>
              <label>
                Tema
                <select
                  value={draft.theme}
                  onChange={(e) => setDraft({ ...draft, theme: e.target.value })}
                >
                  <option value="paper">Papel</option>
                  <option value="cream">Creme</option>
                  <option value="ink">Grafite</option>
                  <option value="orange">Laranja</option>
                </select>
              </label>
              <label>
                Layout
                <select
                  value={draft.layout_variant}
                  onChange={(e) => setDraft({ ...draft, layout_variant: e.target.value })}
                >
                  <option value="editorial">Editorial</option>
                  <option value="metrics">Métricas</option>
                  <option value="timeline">Timeline</option>
                  <option value="quotes">Depoimentos</option>
                  <option value="contact">Contato</option>
                </select>
              </label>
              <label>
                Animação
                <select
                  value={draft.animation_preset}
                  onChange={(e) => setDraft({ ...draft, animation_preset: e.target.value })}
                >
                  <option value="none">Sem animação</option>
                  <option value="fade-in">Fade</option>
                  <option value="fade-up">Fade vertical</option>
                  <option value="stagger">Cards em sequência</option>
                  <option value="image-reveal">Reveal de imagem</option>
                  <option value="metric-count">Métricas</option>
                </select>
              </label>
              <label className="toggle-field">
                <input
                  type="checkbox"
                  checked={draft.is_visible}
                  onChange={(e) => setDraft({ ...draft, is_visible: e.target.checked })}
                />{" "}
                Exibir no site
              </label>
            </div>
            {message && (
              <p className="save-message" role="status">
                {message}
              </p>
            )}
            <div className="form-actions">
              <button className="danger-button" onClick={remove}>
                Arquivar
              </button>
              <button className="secondary-button" onClick={publish}>
                Publicar seção
              </button>
              <button className="primary-button" onClick={save}>
                Salvar alterações
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function DesignEditor() {
  const [tokens, setTokens] = useState({
    orange: defaultTokens.orange,
    ink: defaultTokens.ink,
    paper: defaultTokens.paper,
    cream: defaultTokens.cream,
    muted: defaultTokens.muted,
    orangeDark: defaultTokens.orangeDark,
  })
  const [extraTokens, setExtraTokens] = useState<Record<string, string>>({
    "font.heading": "Big Shoulders Display",
    "font.body": "Inter",
    "layout.container": "1680",
    "space.section": "64",
    "radius.card": "4",
    "motion.duration": "520",
  })
  const [message, setMessage] = useState("")
  useEffect(() => {
    supabase
      ?.from("design_tokens")
      .select("token_key,token_value")
      .then(({ data }) => {
        if (!data?.length) return
        const next = { ...tokens }
        data.forEach((item) => {
          const key = item.token_key.replace("color.", "") as keyof typeof next
          if (key in next) next[key] = item.token_value
        })
        setTokens(next)
        setExtraTokens((current) => ({
          ...current,
          ...Object.fromEntries(
            data
              .filter((item) => !item.token_key.startsWith("color."))
              .map((item) => [item.token_key, item.token_value]),
          ),
        }))
      })
  }, [])
  async function save() {
    if (!supabase) return
    setMessage("Salvando…")
    const rows = Object.entries(tokens).map(([key, value]) => ({
      token_key: `color.${key}`,
      token_value: value,
      value_type: "color",
      scope: "global",
      status: "published",
    }))
    rows.push(
      ...Object.entries(extraTokens).map(([key, value]) => ({
        token_key: key,
        token_value: value,
        value_type: key.startsWith("font.")
          ? "font"
          : key.startsWith("motion.")
            ? "motion"
            : key.startsWith("radius.")
              ? "radius"
              : key.startsWith("space.")
                ? "space"
                : "size",
        scope: "global",
        status: "published",
      })),
    )
    const { error } = await supabase.from("design_tokens").upsert(rows, { onConflict: "token_key" })
    setMessage(error ? error.message : "Tokens publicados.")
  }
  return (
    <>
      <AdminHeader
        title="Identidade"
        subtitle="Tokens seguros e famílias tipográficas autorizadas"
        action={
          <button className="primary-button" onClick={save}>
            Publicar tokens
          </button>
        }
      />
      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Paleta global</p>
            <h2>Cores da marca</h2>
          </div>
        </div>
        <div className="token-grid">
          {Object.entries(tokens).map(([key, value]) => (
            <label key={key}>
              <span className="color-preview" style={{ background: value }} />
              <span>{key}</span>
              <input
                type="color"
                value={value}
                onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })}
              />
              <input
                value={value}
                onChange={(e) => setTokens({ ...tokens, [key]: e.target.value })}
              />
            </label>
          ))}
        </div>
        {message && <p className="save-message">{message}</p>}
      </section>
      <section className="admin-card license-card">
        <p>Escala e movimento</p>
        <h2>Tokens de layout</h2>
        <div className="field-grid">
          {Object.entries(extraTokens).map(([key, value]) => (
            <label key={key}>
              {key}
              {key.startsWith("font.") ? (
                <select
                  value={value}
                  onChange={(event) =>
                    setExtraTokens({
                      ...extraTokens,
                      [key]: event.target.value,
                    })
                  }
                >
                  <option>Inter</option>
                  <option>Big Shoulders Display</option>
                </select>
              ) : (
                <input
                  type="number"
                  min="0"
                  max={key.startsWith("motion.") ? "1200" : "2000"}
                  value={value}
                  onChange={(event) =>
                    setExtraTokens({
                      ...extraTokens,
                      [key]: event.target.value,
                    })
                  }
                />
              )}
            </label>
          ))}
        </div>
      </section>
      <section className="admin-card license-card">
        <p>Tipografia</p>
        <h2>Fontes autorizadas</h2>
        <div>
          <strong>Big Shoulders Display</strong>
          <span>Google Fonts · títulos e numerais</span>
        </div>
        <div>
          <strong>Inter</strong>
          <span>Google Fonts · textos e interface</span>
        </div>
        <small>
          Neue Montreal permanece em fallback Inter até confirmação da licença web. Heading Now
          Trial não é distribuída.
        </small>
      </section>
    </>
  )
}

function MediaLibrary() {
  const [assets, setAssets] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const load = () => {
    void supabase
      ?.from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAssets(data ?? []))
  }
  useEffect(() => {
    load()
  }, [])
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !supabase) return
    if (
      !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type) ||
      file.size > 8_000_000
    )
      return setMessage("Use JPG, PNG, WebP ou SVG de até 8 MB.")
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
    setMessage("Enviando para a biblioteca privada…")
    const { error } = await supabase.storage.from("portfolio-private").upload(path, file)
    if (error) return setMessage(error.message)
    const result = await supabase.from("media_assets").insert({
      storage_bucket: "portfolio-private",
      storage_path: path,
      mime_type: file.type,
      file_size: file.size,
      alt_text: "",
      status: "draft",
    })
    setMessage(
      result.error
        ? result.error.message
        : "Upload concluído. Adicione alt e crédito antes de publicar.",
    )
    load()
  }
  return (
    <>
      <AdminHeader
        title="Biblioteca de mídia"
        subtitle="Originais privados, metadados e publicação controlada"
        action={
          <label className="primary-button upload-button">
            Enviar mídia
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={upload}
            />
          </label>
        }
      />
      {message && <p className="save-message">{message}</p>}
      <div className="media-grid">
        {assets.length ? (
          assets.map((asset) => (
            <article className="admin-card" key={asset.id}>
              <div className="media-placeholder">
                <Icon name="image" size={32} />
              </div>
              <strong>{asset.storage_path}</strong>
              <span>
                {asset.status} · {asset.mime_type}
              </span>
              <small>{asset.alt_text || "Alt text pendente"}</small>
            </article>
          ))
        ) : (
          <div className="admin-card empty-state">
            <Icon name="image" size={40} />
            <h2>Biblioteca pronta</h2>
            <p>
              Nenhuma mídia cadastrada no banco. Os ativos iniciais permanecem no pacote até serem
              promovidos para o Storage.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function NavigationEditor({ sections }: { sections: SectionRow[] }) {
  return (
    <>
      <AdminHeader title="Navegação" subtitle="14 âncoras estáveis e ordenação acessível" />
      <section className="admin-card">
        <div className="card-heading">
          <div>
            <p>Menu público</p>
            <h2>Estrutura de navegação</h2>
          </div>
          <span className="status-chip">14 destinos</span>
        </div>
        <div className="navigation-editor">
          {sections.map((section) => (
            <div key={section.id}>
              <span>{String(section.sort_order).padStart(2, "0")}</span>
              <strong>{section.title}</strong>
              <code>#{section.slug}</code>
              <span>{section.is_visible ? "Visível" : "Oculto"}</span>
            </div>
          ))}
        </div>
        <p className="admin-note">
          A ordem acompanha as seções. Para preservar links externos e histórico, slugs publicados
          não são alterados neste editor.
        </p>
      </section>
    </>
  )
}

export function AdminApp() {
  const guard = useAdminGuard()
  const [active, setActive] = useState("dashboard")
  const [sections, setSections] = useState<SectionRow[]>([])
  const [loadError, setLoadError] = useState("")
  const load = () => {
    void supabase
      ?.from("sections")
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        setSections(data ?? [])
        setLoadError(error?.message ?? "")
      })
  }
  useEffect(() => {
    load()
  }, [])
  if (guard === "loading") return <div className="admin-loading">Verificando autorização…</div>
  if (guard === "denied") return <Navigate to="/admin/login" replace />
  const screens: Record<string, React.ReactNode> = {
    dashboard: <Dashboard sections={sections} />,
    sections: <SectionsEditor sections={sections} reload={load} />,
    blocks: <ContentStudio sections={sections} />,
    content: <CollectionsStudio />,
    design: <DesignEditor />,
    media: <EnhancedMediaLibrary />,
    navigation: <NavigationStudio />,
    seo: <SeoStudio />,
    editorial: <EditorialStudio />,
    preview: (
      <div className="embedded-preview">
        <AdminHeader
          title="Pré-visualização"
          subtitle="Rascunhos visíveis somente em sessão administrativa"
        />
        <iframe title="Prévia do portfólio" src="/admin/preview" />
      </div>
    ),
  }
  return (
    <AdminShell active={active} setActive={setActive}>
      {loadError && (
        <div className="admin-warning">
          <strong>Schema ainda não aplicado.</strong> {loadError}. Execute as migrations
          documentadas; a interface pública permanece com o seed editorial local.
        </div>
      )}
      {screens[active]}
    </AdminShell>
  )
}

export function AdminPreview() {
  const guard = useAdminGuard()
  if (guard === "loading") return <div className="admin-loading">Abrindo prévia…</div>
  if (guard === "denied") return <Navigate to="/admin/login" replace />
  return <PublicSite preview />
}
