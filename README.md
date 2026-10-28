# Portfólio editorial — Tulius Tsangaropulos

Site pessoal, currículo e CMS editorial em React, TypeScript, Vite e Tailwind CSS v4. O conteúdo pode ser exibido pelo fallback local ou sincronizado com o projeto Supabase existente (`zfnrhzplwpjpdljraypt`). O projeto roda localmente no VS Code e pode ser publicado na Vercel.

## Situação vigente — conferência P0 de 28/10/2026

**Fonte operacional para decisões:** [Índice consolidado, atualizado com consultas diretas](docs/AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). A conferência anterior às alterações documentais encontrou `main` no SHA [`dcb8831221a54fb713031011c8da8b20fe157b38`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/dcb8831221a54fb713031011c8da8b20fe157b38), [CI aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40301041397) e [deployment de produção READY correspondente](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/FEJWKVLYi69qqFmg1da71H82Sue4). Este commit documental pode gerar novo CI/deploy; sua conclusão deve ser verificada separadamente.

O Supabase foi reconferido em somente leitura: **14 seções cadastradas / 13 públicas, 42 painéis cadastrados / 25 painéis mobile públicos, 28 blocos, 56 placements, 13 destinos de navegação públicos, 9 pendências editoriais (8 abertas), 21 mídias publicadas, 23 objetos Storage, 12 revisões e 12 auditorias**. As 21 mídias são **19 SVGs ilustrativos e 2 PNGs**; há **2 objetos privados sem cadastro em `media_assets`**, ainda não avaliados para exclusão. Não tratar os SVGs como fotografias reais ou marcas oficiais.

**Atualização posterior (28/10):** a autenticação administrativa real e o fluxo de leitura do CMS foram **homologados no P5 #40745631770**, com quatro gates aprovados. Permanecem pendentes **escrita/publicação/restauração no CMS e transferência binária real pelo Storage em fixture**. O trecho P0 seguinte é um snapshot anterior ao P5. O Lighthouse de **80 mobile / LCP 3,86 s** é uma medição histórica de 26/10, **não do SHA atual**. Consulte [reconciliação das Fontes ChatGPT](docs/RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md) e a [incorporação editorial de mídias](docs/CONTINUIDADE_INCORPORACAO_CONTEUDO_2026-10-26.md). Documentos mais antigos são snapshots válidos de suas datas, não inventários vigentes.

## Requisitos

- Node.js compatível com Vite 8
- pnpm

## Desenvolvimento local

```bash
pnpm install --frozen-lockfile
```

Copie `.env.example` para `.env.local` e use os valores públicos já fornecidos para o projeto Supabase. O arquivo de exemplo contém somente um placeholder para a chave publishable; não coloque credenciais reais nele.

```bash
pnpm dev
```

O Vite inicia o site localmente e atualiza a página quando os arquivos mudam. Para gerar e servir uma versão de produção local:

```bash
pnpm build
pnpm preview
```

## Verificações

```bash
pnpm format:check  # verifica formatação
pnpm typecheck     # verifica TypeScript
pnpm test          # testes Vitest
pnpm build         # build de produção
pnpm check         # executa tudo acima
```

## Aplicação

- `/`: portfólio público
- `/admin/login`: autenticação administrativa
- `/admin`: CMS protegido
- `/admin/preview`: prévia protegida de rascunhos
- demais rotas: página 404

A aplicação mantém o conteúdo editorial local como fallback enquanto o CMS Supabase não estiver disponível. A integração usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; não use uma chave `service_role` no frontend.

## Supabase

O cliente segue ligado ao projeto existente `zfnrhzplwpjpdljraypt`. A migration e o seed em `supabase/` não são aplicados automaticamente. Consulte `docs/ARCHITECTURE.md`, `docs/SECURITY_RLS.md` e `docs/ADMIN_CMS.md` antes de operações no banco. Este repositório não altera o banco durante o desenvolvimento ou build.

## Vercel

Configure as duas variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nos ambientes Vercel necessários. O build é `pnpm build`; a saída estática é `dist/`. Domínio, canonical e metadados sociais devem ser revisados para o domínio final conforme `docs/DEPLOYMENT.md`. Este projeto não faz deploy automaticamente a partir das instruções deste README.

## Segurança e colaboração

`.gitignore` protege `.env.local`, `.env.*`, `.vercel/`, `node_modules/` e `dist/`, mantendo `.env.example` disponível para versionamento. Nunca versione tokens ou chaves privadas. Revise `git status` e o diff antes de qualquer commit; este README não autoriza commits, push, alterações na Vercel ou deploy.

## Auditoria consolidada — etapas 1, 2 e 3 (26/10/2026)

A referência técnica **consolidada, atualizada em 28/10/2026**, para estado, evidências, dados e pendências é [`docs/AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md`](docs/AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). Os relatórios [Etapa 1](docs/ETAPA_1_HOMOLOGACAO_PUBLICA_2026-10-26.md), [Etapa 2](docs/ETAPA_2_AUDITORIA_CMS_SUPABASE_2026-10-26.md) e [Etapa 3](docs/ETAPA_3_AJUSTES_2026-10-26.md) preservam o contexto de cada execução. Datas, SHAs, números de painéis e Lighthouse em documentos anteriores são **fotografias históricas**, não o estado técnico corrente.

**Resumo histórico após a etapa 3 (antes da incorporação de mídias):** 13 seções e 13 destinos de navegação públicos, 42 painéis cadastrados (incluem seção oculta), 28 blocos (0 com `is_placeholder=true`), 56 placements, 8 pendências editoriais abertas. Existe **um item interno ainda marcado `placeholder=true`**, referente a imagens da Invest RS; os 18 títulos de slides profissionais não têm fotos aprovadas. CI final validado: 46 testes, build, TypeScript e formatação aprovados. Auditoria Lighthouse posterior à correção CSS: acessibilidade 100 em mobile/desktop, performance mobile 75 e desktop 96, com LCP mobile ~4,51 s. E2E com JWT administrativo e transferência real de arquivos continuam sem comprovação.

## Estado atual

O portfólio está publicado em **https://tulius.work/** na Vercel, com deploy automático da branch `main` e CMS conectado ao Supabase. A página `/` usa os conteúdos publicados do banco; quando Supabase está configurado e falha, a interface indica erro, sem substituir silenciosamente conteúdo por fallback. As rotas de administração têm carregamento separado e autenticação obrigatória.

Automação de qualidade: workflows `Validate PortfolioTulius` (formato, tipos, testes, build e smoke offline) e `Audit P3 Lighthouse` (smoke HTTP, Lighthouse, testes P4/P5 e evidências). Testes com JWT admin real requerem `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` armazenados exclusivamente em GitHub Actions Secrets e execução controlada do workflow manual `P5 Admin Read-Only E2E`.

O estado de validação, os limites da automação e a última homologação manual do proprietário estão documentados em [`docs/P4_P5_P6_FECHAMENTO.md`](docs/P4_P5_P6_FECHAMENTO.md).

## Documentação adicional

Consulte `docs/` para arquitetura, modelo de conteúdo, CMS, segurança, layout responsivo, sistema visual, motion e publicação.

## Continuidade P4 e P5

Os resultados, limites e instruções de execução dos testes visuais e do CMS estão documentados em [`docs/P4_P5_EXECUCAO.md`](docs/P4_P5_EXECUCAO.md). A suíte autenticada da P5 exige configuração separada de Secrets no GitHub Actions; não registrar credenciais aqui.

## Ajustes de navegação da abertura — 25/10/2026

Os cinco cards numerados da primeira seção agora são links internos com hover/foco e destino padrão na seção 03 (`#resultados`); o destino é editável em `/admin` → **Blocos e painéis** → Perfil / painel B → itens 01–05. O selo circular tem frase ampliada e a seta inferior navega à seção 02 com rolagem suave. O menu lateral exibe **MENU**.

Detalhes técnicos, limitações e handoff para a próxima fase estão em [`docs/CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md`](docs/CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md).

## Seção 02 — composição editorial e administração (26/10/2026)

A seção **Olá!** (`#sobre`) mantém três áreas no desktop: texto introdutório à esquerda, fotografia central de destaque e **lista administrável de cinco declarações à direita**. Os cinco títulos/textos residem **exclusivamente no painel B**, com suporte a adicionar, editar, excluir e reordenar itens; a quantidade cinco é inicial, não um limite rígido. A fotografia principal utiliza o arquivo versionado `/media/tulius-contact.jpg` e os metadados da imagem permanecem no **painel A**, sem duplicação do conteúdo textual. No mobile, o primeiro item B acompanha a fotografia do painel A; os demais itens aparecem no painel mobile B.

**Administração atual:** **Seções → Olá!** edita o conteúdo introdutório da esquerda; **Blocos e painéis → Olá! → painel A** gerencia fotografia e atributos de acessibilidade/desktop; **painel B** gerencia **todos** os títulos e textos da direita e a ordem dos itens. A composição antiga, com apenas três declarações distribuídas entre A e B, consta no relatório [`CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md`](docs/CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md) como **histórico de implementação**, posteriormente substituído pela revisão editorial documentada em [`CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md`](docs/CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md).

## Conteúdo da seção 02 e títulos da seção 03 — 26/10/2026

- **Seção 02:** os cinco textos da coluna direita são gerenciados no único bloco **Olá! → painel B** do CMS. Os controles **Adicionar item**, edição de título/texto, setas de ordenação e exclusão já fazem parte do editor; é necessário salvar para persistir. O painel A mantém apenas os atributos da fotografia. No mobile, o primeiro texto da lista B é apresentado junto à foto no painel A; os quatro seguintes aparecem no painel B, sem duplicação de conteúdo.
- **Seção 03:** a lista do painel B agora contém os cinco títulos das especialidades dos cards clicáveis da seção 01, na mesma ordem; os quatro indicadores de resultados do painel A permanecem intactos. O antigo placeholder `XXXXX · X/Y/Z` foi substituído e sua pendência editorial registrada como resolvida no Supabase.

O Supabase e o fallback versionado foram sincronizados sem alterar schema/RLS. Ver [continuidade das seções 02 e 03](docs/CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md).

## Seção 03 — resultados interativos (26/10/2026)

A seção `#resultados` oferece uma **visão geral com quatro indicadores preservados**, agora identificados por ícones, e cinco filtros temáticos clicáveis. Selecionar um tema revela seu eixo central, título, subtítulo, temas relacionados, texto curto e conhecimentos reaproveitados da antiga seção 04, além dos indicadores associados quando houver evidência. Os cinco cards da seção 01 mantêm o destino configurável no CMS e, ao direcionar à seção 03, selecionam o tema correspondente. Layout mobile possui seleção temática própria.

Os ícones dos indicadores, suas associações aos temas e os textos temáticos são editáveis em `/admin` → **Blocos e painéis** → **Resultados e projetos em destaque**: painel A (indicadores) e painel B (temas). Os cinco cards da abertura possuem seletor de tema associado em **Perfil / painel B**. A antiga seção 04 (`competencias`) foi **ocultada**, não apagada: seu conteúdo permanece no CMS e foi reaproveitado editorialmente na seção 03. O menu apresenta 13 seções visíveis com numeração sequencial. Consulte `docs/CONTINUIDADE_INTERATIVIDADE_SECAO_03_2026-10-26.md`.

## Formação e experiências em camadas — 26/10/2026

A seção **Formação** utiliza agora o fundo escuro `#171617` e tipografia branca/laranja. As experiências **Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress e CDI Comunicação** utilizam fundo branco e são exibidas em uma **pilha vertical sobreposta** via `position: sticky`: ao rolar, o painel seguinte sobe e cobre o anterior. Um seletor horizontal de seis empresas, fixado abaixo do cabeçalho, facilita a navegação direta.

Cada experiência possui logotipo opcional, título, lista de realizações existente e galeria de slides associada a projetos reais, editável no CMS. **Histórico e atualização:** inicialmente, os 18 slides profissionais tinham títulos, sem fotografias ou logotipos aprovados. Em 26/10 foram incorporados **19 SVGs de síntese editorial**, versionados em `public/media/editorial-*.svg` e referenciados em galerias; o Storage passou a conter também **2 PNGs catalogados**. Esses ativos **não** substituem a comprovação de fotografias profissionais, marcas oficiais, fontes e licenças. URLs, alt e legendas continuam editáveis no CMS, sem homologação de salvamento com JWT real.

Ver `docs/CONTINUIDADE_FORMACAO_EXPERIENCIAS_2026-10-26.md` (snapshot histórico) e `docs/CONTINUIDADE_INCORPORACAO_CONTEUDO_2026-10-26.md` (incorporação posterior). O limite diário Vercel foi um evento transitório documentado; o deployment do SHA `dcb8831` foi posteriormente confirmado `READY`.

## Ferramentas, experiências clicáveis e hover de contato — 26/10/2026

A seção `#ferramentas` utiliza o tema escuro da identidade (`ink` / `#171617`) com títulos brancos/laranja e conjuntos de ícones vetoriais locais para as seis categorias de ferramentas. Os nomes/descrições originais permanecem no CMS. A seleção de até três pictogramas por grupo está no bloco A ou B de Ferramentas, campo **Ícones de plataformas**.

Os seis itens de **Experiência e atuação** na seção 01 agora apontam, respectivamente, para `#invest-rs`, `#prefeitura-sp`, `#vale`, `#inpress`, `#globo-sportv`, `#cdi`. O card inteiro é uma âncora com hover e foco visível, tanto no desktop como no mobile; o destino pode ser editado em **Perfil → Blocos e painéis → painel B** (itens 6–11). Os cinco cards de especialidades continuam com o próprio mecanismo independente de navegação para a seção 03.

No Contato, os títulos e valores clicáveis ganham contraste branco em hover/foco, mantendo a base laranja. Não foram alterados números, e-mails, URLs, empresas ou conteúdos. Ver `docs/CONTINUIDADE_FERRAMENTAS_CARDS_CONTATO_2026-10-26.md`.


### Atualização operacional histórica da etapa 3 — 26/10/2026

Textos atualmente publicados em `resultados/A`, `invest-rs/A` e `invest-rs/B` foram consolidados editorialmente no Supabase sem reescrever o JSONB. O item **Ativos visuais** continua pendente de fotografias aprovadas, e os 18 slides profissionais seguem sem fotos. O CSS de contraste da Formação e a biblioteca privada de mídia receberam correções pontuais e testes unitários. Consulte [Etapa 3](docs/ETAPA_3_AJUSTES_2026-10-26.md); o aceite visual e administrativo autenticado ainda requer provas separadas.


**Última revalidação do ciclo histórico (26/10/2026, não do SHA de 28/10):** [CI do índice consolidado aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148955) e [Lighthouse/QA públicos aprovados](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148755) no SHA `d3acbed`: Performance **80 mobile / 98 desktop** e Acessibilidade **100/100** nos dois; 13 links públicos válidos, 8 viewports sem falhas e 38 capturas. A medição é de laboratório e o LCP mobile (3,86 s) ainda deve melhorar. O índice consolidado em `docs/` reúne as versões mais recentes de todas as verificações.

## P1 — investigação de higiene técnica (28/10/2026)

A investigação read-only de objetos privados, mídias publicadas, função de importação e branches históricas está documentada em [`docs/P1_INVESTIGACAO_HIGIENE_2026-10-28.md`](docs/P1_INVESTIGACAO_HIGIENE_2026-10-28.md). Dois PNGs privados são origens retidas de cópias públicas; as 19 ilustrações do Storage não são byte a byte iguais às 19 versões editoriais do GitHub. **Nenhuma exclusão, substituição de mídia, merge ou alteração funcional foi executada**; direitos e decisões de limpeza exigem aprovação separada.

## P2 — segurança do CMS e Storage (28/10/2026; parcial)

Três gates SQL `READ ONLY` com `ROLLBACK` passaram para `anon`, usuário `authenticated` comum e admin, **simulando** papéis e claims. As 22 tabelas públicas continuam com RLS; a guarda administrativa negou acesso ao não admin e aceitou o admin simulado. **Isso não é JWT real.** O workflow manual [P5 Admin Read-Only E2E](.github/workflows/p5-admin-readonly.yml) foi **executado com sucesso** no [run #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), SHA `af95b5d`, com **login real, 8 módulos, prévia de 14 seções, logout e `contentMutations=0`**. Os testes de **CRUD/restauração do CMS e Storage binário** ainda requerem fixture isolada. Detalhes em [`docs/P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md`](docs/P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md).

## P3 — qualidade e aceite técnico (28/10/2026)

[Auditoria de produção #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980) aprovada no **SHA e3bfccf** após verificação de Vercel `READY` no mesmo commit: **13 seções**, **25 painéis mobile**, **38 screenshots**, sem falhas de navegador; acessibilidade, boas práticas e SEO **100/100**; mobile **Performance 82 / LCP 4,38 s**, desktop **97 / LCP 1,26 s**. O gate de regressão passou, mas **LCP mobile ainda não atende à meta de 2,5 s**; pendem também aceite visual humano, leitor de tela e zoom nativo de 200%. Ver [`docs/P3_QUALIDADE_ACEITE_2026-10-28.md`](docs/P3_QUALIDADE_ACEITE_2026-10-28.md) para evidências e plano priorizado.
