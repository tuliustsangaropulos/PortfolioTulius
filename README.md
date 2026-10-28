# Portfólio editorial — Tulius Tsangaropulos

Site público e CMS editorial em **React 19, TypeScript, Vite, Tailwind CSS v4 e Supabase**, publicado em [tulius.work](https://tulius.work/) pela Vercel a partir de `main`.

> **Fonte operacional única:** [docs/ESTADO_ATUAL_VIGENTE.md](docs/ESTADO_ATUAL_VIGENTE.md). Contém o snapshot de dados mais recente, evidências P0–P3, o estado real de homologação e as pendências atuais. **Confirme GitHub, Supabase e Vercel ao vivo antes de cada alteração:** este arquivo não atualiza automaticamente contagens/SHAs.

## Leitura obrigatória antes de qualquer ajuste

1. [`AGENTS.md`](AGENTS.md) — regras de preservação, segurança, branches e escopo.
2. [Índice vigente](docs/ESTADO_ATUAL_VIGENTE.md) e [pendências abertas](docs/OPEN_ISSUES.md).
3. **Layout e conteúdo:** [Design system](docs/DESIGN_SYSTEM.md), [Responsividade](docs/RESPONSIVE_LAYOUT.md), [Modelo de conteúdo](docs/CONTENT_MODEL.md) e [CMS](docs/ADMIN_CMS.md).
4. **Infra/segurança:** [Deploy](docs/DEPLOYMENT.md), [RLS](docs/SECURITY_RLS.md), [arquitetura](docs/ARCHITECTURE.md).
5. **Históricos:** [README acumulado anterior](docs/historico/README_ACUMULADO_ATE_2026-10-28.md), [pendências cumulativas](docs/historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md), [auditoria de fases](docs/AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). Não usá-los como estado corrente.

Para novos chats do projeto, consultar o [guia de Fontes](docs/GUIA_FONTES_CHATGPT.md) e a Fonte exclusiva de produto/design. **Código e dados vivos têm precedência sobre snapshots históricos.**

## Situação de entrega (28/10/2026)

- **P0:** consolidação documental versionada; sincronização das Fontes do projeto ChatGPT continua manual.
- **P1:** investigação de mídias/Storage/importador/branches concluída; nenhuma exclusão aprovada. [Evidências](docs/P1_INVESTIGACAO_HIGIENE_2026-10-28.md).
- **P2:** [P5 autenticado de leitura 4/4 PASS](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), `contentMutations=0`; CRUD/publicação/restauração e Storage binário com fixture ainda não homologados.
- **P3:** [auditoria automatizada válida](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), 13 seções/25 painéis mobile/38 capturas, a11y/SEO 100; **LCP mobile 4,38 s**, meta ≤2,5 s pendente; aceite visual humano pendente.

Esses status têm evidências e limites detalhados no índice; P5 read-only **não** homologa gravações no CMS.

## Desenvolvimento local

Pré-requisitos: **Node.js compatível com Vite 8** e **pnpm**.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Configure **somente valores públicos** de `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em `.env.local`; não versionar o arquivo. Nunca usar chave `service_role` no frontend. Em outros ambientes, copiar `.env.example` manualmente conforme o sistema operacional.

## Testes e publicação

```bash
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

Rotas principais: `/` (pública), `/admin/login`, `/admin` (protegida), `/admin/preview` (protegida), demais rotas 404. O conteúdo tem fallback local e origem principal Supabase quando configurado.

A integração **GitHub `main` → Vercel Production** cria deployment automaticamente em pushes. Antes de atribuir uma medição Lighthouse ao código, conferir que o deployment `READY` e a execução Actions correspondem ao **mesmo SHA**. Build: `pnpm build`; saída `dist/`. `supabase/migrations/` **não** é aplicado por build e a baseline inicial **não deve ser reaplicada**.

**Não modificar design, textos, mídia, segurança, branches, migrations ou dados aprovados fora do pedido.** Trabalhar somente na `main` conforme `AGENTS.md`; verificar diff, CI e Vercel após commits.
