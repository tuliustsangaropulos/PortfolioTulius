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

### Evidências desta rodada

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

### Revisão manual do CMS — Seções e Mídia (28/10/2026)

- **Seções:** lista de status em português; publicação confirmada e limitada à RPC `publish_section` (sem liberação automática de placeholders); `Salvar alterações` não promove rascunhos nem arquiva contornando os botões. O campo **Exibir no site** continua ligado a `sections.is_visible`. Layouts editoriais especiais são fixos e indicados como tal no formulário; layout/motion de seções genéricas e temas compatíveis são refletidos pelo renderer público.
- **Feedback:** avisos flutuantes com fechamento e duração de 7 s nos formulários de Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões. Confirmações para operações relevantes continuam explícitas.
- **Mídia:** miniatura e nome do arquivo com extensão até selecionar um item. Apenas o item selecionado abre formulário de descrição/status, substituição e publicação. Campo **Crédito/licença** removido da interface e de atualizações futuras; 19 valores legados foram preservados no banco, sem exibição/uso. Os 21 títulos no Supabase foram igualados aos basenames de `storage_path`, sem alterar bytes.
- **Posicionamento da mídia:** seletores exibem área e dimensão de referência; janela permite regular X, Y, zoom e restaurar. Configuração por uso é salva junto ao bloco JSONB e refletida nas imagens públicas após salvar; arquivo Storage original nunca é recortado nem alterado. Para imagem Open Graph, a proporção 1200×630 px é orientativa: a mídia usada pelo crawler continua sendo o arquivo original, que deve ser preparado antes do upload.

**Limite do aceite:** inspeção de caminhos de dados, TypeScript, testes unitários, build, P3/P5 e leitura Supabase não substituem homologação de gravações com sessão administrativa real. P2 transacional segue suspenso sem gastos adicionais.

### Auditoria dos módulos administrativos

Ver [auditoria das dez abas](docs/AUDITORIA_ADMIN_MANUAL_2026-10-28.md), incluindo limites de homologação P2, registros SQL preservados e evidências de CI/P3.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

### Prevenção de regressão de escala desktop (28/10/2026)

O site público utiliza **escala natural de navegador**, sem redução CSS global para simular 75% do zoom. A nova referência de composição é a captura fornecida a 125% do navegador, desejada a 100%. Mudanças futuras devem ajustar tipografia/colunas/margens por componente e breakpoint, **nunca** `zoom` na raiz `.public-site` nem um `transform:scale()` global. `src/lib/layout-zoom.test.ts` e `scripts/p3-browser-smoke.mjs` impedem a reintrodução do padrão anterior; consultar [responsividade](docs/RESPONSIVE_LAYOUT.md). Nenhuma alteração de CMS, dados ou Storage foi necessária.

### Continuidade da frente manual e Fontes do ChatGPT — 28/10/2026

A documentação da rodada de verificação manual, das duas referências de zoom e da reconciliação dos **quatro arquivos atualmente anexados ao projeto ChatGPT** está em [`docs/CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md`](docs/CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md). O estado atual sempre é o SHA da `main`, não as cópias de Fontes datadas; não reabrir a revisão manual anterior sem novo achado.

### LCP mobile — otimização medida, meta ainda aberta

A rodada de 29/10 eliminou a montagem duplicada de DOM desktop/mobile no site público, com P3 13/25/38 e CI aprovados. LCP mobile mediano do SHA final `4ab9ce5`: **4,30 s** (baseline 4,36 s); o objetivo **≤2,5 s continua NÃO ATENDIDO**. Experimentos de `content-visibility` e carregamento não bloqueante de fontes foram revertidos por ausência de ganho. Evidências e próximo diagnóstico arquitetural em [qualidade P3](docs/P3_QUALIDADE_ACEITE_2026-10-28.md).

### Prevenção de score Lighthouse falso após divisão de chunks

O P3 de 29/10 isolou os chunks do Supabase sem mudar o cliente ou as consultas públicas. Uma tentativa anterior de REST customizado foi revertida quando deixou o site vazio: LCP baixo sem conteúdo **não é melhoria**. Novo gate `P6_LCP_CONTENT_GATE` exige o retrato publicado como LCP nas três amostras mobile/desktop. O objetivo ≤2,5 s continua aberto. [P3 completo](docs/P3_QUALIDADE_ACEITE_2026-10-28.md).

### Auditoria final da proteção P6 e divisão dos chunks — 29/10/2026 UTC

No SHA funcional [`cc30446`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc304462bf9bf2ab0d8583b85920eb136a127916), [CI #40800444163](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444163) e [P3 #40800444157](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444157) passaram, com Vercel Production `READY`. P3: **13 seções**, **25 painéis mobile**, **38 capturas**, `P3_BROWSER_AUDIT failures=0`, P5 anônimo **3/3**, **0 mutações**. O novo **`P6_LCP_CONTENT_GATE` passou em mobile e desktop**, comprovando que o LCP medido era o retrato publicado. Mediana Lighthouse mobile: **Performance 82, LCP 4,421 s**; desktop: **Performance 97, LCP 1,235 s**. O valor de 4,248 s do experimento `e1846ac` não se repetiu; **não há evidência de melhora causal do LCP** frente ao baseline de aproximadamente 4,30 s. A meta mobile **≤2,5 s permanece aberta**. Preservar o SDK e o conteúdo original; a separação dos chunks está mantida apenas como isolamento/cache, **não** como aceite de desempenho.

### Referência visual desktop mais recente (29/10/2026)

A nova solicitação do proprietário **substituiu** a captura anterior que buscava 125%: **o aspecto desejado a 100% agora é o visto a 75%** no anexo mais recente, em desktop ~1512×691. A implementação é localizada na mídia `min-width:1101px`, sem zoom/scale global e sem alterar dados. O P3 [#40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) passou: início do título 66 px, cards 199–279 px, quatro destaques até 669 px e sobreposição selo/anos zero, além dos 13/25 painéis e 38 capturas. A meta LCP mobile ≤2,5 s permanece aberta. Esta referência **prevalece** sobre as referências anteriores a 75%/125% documentadas no histórico. O aceite estético da última mudança ainda depende de inspeção do proprietário.

### Primeira dobra desktop — refinamento de legibilidade (29/10/2026)

Com a geometria original mantida e sem `zoom` global, foram refinados apenas os textos secundários, as numerações 01–05 e os microespaçamentos da coluna esquerda. [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) `success`, com 13 seções, 25 painéis e 38 capturas. O último destaque permanece dentro de 1512×691 e sem sobreposição com o selo. [Detalhamento no design system](docs/DESIGN_SYSTEM.md). O LCP mobile continua aberto (~4,45 s nesta amostra).

