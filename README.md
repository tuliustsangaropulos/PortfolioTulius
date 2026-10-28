# Portfólio editorial — Tulius Tsangaropulos

Site público e CMS editorial em **React 19, TypeScript, Vite, Tailwind CSS v4 e Supabase**, publicado em [tulius.work](https://tulius.work/) pela Vercel a partir de `main`.

> **Etapa 5 — aceite automatizado aprovado:** [reexecução #40757162085 (tentativa 2)](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085), 13 seções, 25 painéis mobile, 38 capturas, 8 viewports e zero falhas. [Relatório de aceite](docs/P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md). **Aceite manual: nova frente em novo chat; LCP mobile ainda aberto.**

> **Fonte operacional única:** [docs/ESTADO_ATUAL_VIGENTE.md](docs/ESTADO_ATUAL_VIGENTE.md). Contém o snapshot de dados mais recente, evidências P0–P3, o estado real de homologação e as pendências atuais. **Confirme GitHub, Supabase e Vercel ao vivo antes de cada alteração:** este arquivo não atualiza automaticamente contagens/SHAs.

> **P2 transacional suspenso por decisão do proprietário (28/10/2026):** não foram aprovados custos para criar uma branch Supabase de homologação (cotação **US$ 0,01344/h**, mais possível consumo). Não provisionar ambiente pago, não disparar a suíte manual de escrita e não testar em produção. O P5 read-only permanece aprovado; as pendências transacionais ficam abertas, sem prazo, até nova autorização expressa. [Detalhes](docs/P2_TRANSACIONAL_STAGING_2026-10-28.md).

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

## Atualização operacional — P2 staging e medição P3 (28/10/2026)

O [P2 transacional](docs/P2_TRANSACIONAL_STAGING_2026-10-28.md) tem workflow manual e fixture seguros preparados, porém **ainda não foi executado** porque não existe staging Supabase aprovado e a criação de branch exige confirmação de custo. O [P3 #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) confirmou no deployment correspondente **Performance mobile 82/LCP mediano 4,32 s**, desktop 98/1,16 s (3 amostras por dispositivo), 13 seções/25 painéis/38 capturas e a11y/SEO 100. **A meta de LCP mobile continua aberta**. O índice [vigente](docs/ESTADO_ATUAL_VIGENTE.md) indica os próximos passos e não deve ser interpretado como SHA futuro fixo.

## Correções da verificação manual — 28/10/2026

A primeira rodada de revisão ajustou densidade visual desktop e, depois, quatro frentes específicas: **experiências** (até seis projetos visíveis por empresa, excedentes ocultados sem exclusão), **depoimentos** (cinco cartões expansíveis em grade desktop 3×2, dois registros **fictícios/ilustrativos identificados**, fonte única na coleção do CMS), **contato** (fotografia central isolada, rodapé com assinatura/localização, seta LinkedIn sem colisão) e **menu** (Início, Projetos em Destaque, Graduação e um único atalho Experiência Profissional → Invest RS; demais itens preservados). São **13 seções públicas e 8 entradas visíveis no menu**, com barra horizontal das seis experiências intacta.

Dados alterados em produção somente sob pedido expresso do proprietário, sem migration ou exclusões: **13 cards JSONB ocultados, 2 depoimentos fictícios adicionados, 2 blocos vinculados à coleção `testimonials`, 4 rótulos e 5 flags de menu atualizados**. Aceite humano permanece pendente. P2-TRANS e despesas de staging continuam suspensos; essas alterações editoriais não equivalem a testes transacionais P2.
