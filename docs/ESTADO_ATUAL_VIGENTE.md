# PortfolioTulius — estado operacional vigente

## Auditoria P3/P6 e LCP mobile — 29/10/2026 (posterior à revisão de Invest RS)

**SHA funcional:** [`4a8412e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/4a8412e93c99db4fae15e57d1e19785581daaf51). [CI #40824692978](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40824692978) **success**, deployment Vercel Production **READY** no mesmo SHA, [P3 #40824693037](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40824693037): **failure exclusivamente no orçamento sintético P6 mobile**.

Corrigida a dependência do status GitHub `Vercel` usando fingerprint SHA servido no domínio; gate da produção passou e seis amostras Lighthouse foram coletadas. O preload da imagem Perfil agora lê o retrato publicado no CMS no build, sem alterar mídia nem conteúdo. O P6 reconhece o PNG real como LCP, mantendo a proteção contra página vazia. Browser **0 falhas**, P5 público **3/3**, **38 capturas**, **13 seções / 25 painéis**. LCP mobile mediano **7,55 s** (Performance 69) contra meta **≤2,5 s**; orçamento P6 6,5 s reprovado. O PNG atual demanda otimização própria, não habilitada por transformação de imagem paga. Ver [relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md). P2 transacional e decisões de custos/Storage permanecem suspensos.


## Verificação manual — Olá! e Invest RS, 29/10/2026

- **Seção 02 “Olá!” (somente desktop):** para que a silhueta da fotografia personalizada alcance a margem inferior do painel, `src/index.css` compensou a faixa transparente inferior da imagem com altura `calc(100% + clamp(2rem, 5.5dvh, 3rem))`, posicionada no topo e recortada pelo contêiner existente. Mantidos fonte original no Supabase, enquadramento do CMS, colunas, textos, cor laranja e composição mobile. Sem zoom/scale global.
- **Logos das experiências:** a borda e o preenchimento cinza foram retirados somente de `.experience-heading > .company-mark` (logo acima do título da empresa). Os seis ícones do seletor superior mantêm bordas, tamanho, links e navegação.
- **Invest RS:** de oito itens cadastrados, ficam **quatro visíveis** (Competências aplicadas; Guia de Boas-Vindas; Organização de eventos; Plataforma de eventos e relacionamento) e **quatro marcados `isHidden=true`** (Estratégia de CRM e mailing institucional; Cartões de visita digitais; Conteúdo e apresentações institucionais; Inovação, IA e automação). Os dois últimos já estavam ocultos. Nenhum texto, registro, bloco ou slide foi excluído ou alterado. A alteração foi transacionada no JSONB do bloco B `222cc514-c860-4ec4-bc01-40a9084dc2e9` com guardas de título e estado anterior, e conferida em leitura posterior. O painel **Blocos** continua com a opção “Exibir este item em Projetos e realizações” e indica “Ocultado”. O conteúdo de fallback foi alinhado com a publicação; outras cinco empresas mantidas.
- **Critério de regressão:** `scripts/p3-browser-smoke.mjs` ganhou `P3_ABOUT_INVEST_FIT` para 1512×691, zoom nativo: altura/recorte da foto desktop, borda inexistente do logo grande, borda preservada na navegação superior, exatamente quatro projetos Invest RS e ausência de scroll interno. Aferir junto à auditoria P3; teste automatizado não substitui inspeção visual real.

**Commit funcional:** [`d882d7a`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d882d7a71ff45e0d6980cf85fbcaa6533f0f89db). [CI #40815457072](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) `success`, Vercel Production `READY`; [P3 #40815457107](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) em execução na criação deste registro. P2 transacional continua suspenso e LCP mobile ≤2,5s permanece pendente. Não houve custo adicional, mudança de RLS, Storage, arquivo de mídia ou estrutura do banco.


## Biblioteca de Mídia — editor no item e status editorial único (29/10/2026)

**Escopo autorizado:** a Biblioteca de Mídia do CMS agora substitui a miniatura clicada por um editor **na mesma posição da grade** (largura de duas colunas com reflow responsivo); o editor não é mais montado no final da página. Botão de fechamento **X** com rótulo acessível. Foi removido **apenas o controle de entrada “Texto alternativo”**; os metadados antigos `alt_text` permanecem no banco, e a prévia do admin continua a usá-los quando existentes, com fallback para o nome do arquivo. Fotos e componentes públicos conservam seus `alt` próprios.

**Status:** a única opção editorial no admin é **Publicado**; a interface não oferece mais o seletor Rascunho/Em revisão/Arquivado. Em upload e substituição, o registro `media_assets.status` é gravado como `published`, mas o arquivo novo/substituído continua inicialmente em `portfolio-private` **até o usuário acionar “Disponibilizar no site”**. Esse controle continua usando a cópia segura Storage→Storage já existente, com rollback quando os metadados não persistem, sem sobrescrever um arquivo público diretamente. Arquivos públicos continuam sem substituição direta para não expor rascunhos. O botão **Salvar** preserva `alt_text`, `storage_path` e outros metadados não editados.

**Banco no encerramento desta atualização:** após identificar uploads concorrentes ocorridos durante a inspeção, a atualização guardada e não destrutiva foi concluída com **27 registros `published`** (**24** em `portfolio-public` e **3** em `portfolio-private`); **21 textos alternativos não vazios preservados**. O primeiro plano SQL foi abortado antes da gravação ao detectar 25→27 registros. RLS vigente `public media metadata` exige `status='published' AND storage_bucket='portfolio-public'` para leitura anônima; `PublishedMediaPicker` aplica ambos os filtros, portanto a unificação de status não expõe mídias privadas. A nova prova unitária `media-publication.test.ts` verifica esse filtro. Nenhum arquivo foi excluído ou copiado, nenhum bucket foi aberto e nenhuma política de RLS foi alterada. **Publicado é status editorial, não afirmação de disponibilidade pública de mídia privada.**

**Código:** [`6c5e3e0`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/6c5e3e0f8991d825652844decbd482b86892457b), formatado em [`c9cb3de`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c9cb3dee73fadd11fc1a7bae86a78e8a89e039fb). [CI #40812587748](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812587748) `success`. [P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) validou 13 seções, 25 painéis mobile, 38 capturas, zero falhas de browser e P5 público 3/3; **o gate Lighthouse P6 falhou** por LCP mobile instável (~7,68 s) e ausência de correspondência do retrato na amostra. Nova execução solicitada; **não considerar o P3 aprovado até confirmação**. A homologação de gravações com JWT administrativo real permanece suspensa conforme P2, de modo que o fluxo de upload/publicação não deve ser declarado homologado ponta a ponta.


## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.


## Refinamento tipográfico pontual da primeira seção — 29/10/2026

**Pedido atendido:** melhorar a legibilidade dos textos menores, o ritmo dos quatro destaques laterais e a numeração dos cinco cards da abertura, **sem alterar a composição editorial aprovada**. A intervenção está estritamente localizada no CSS `@media (min-width: 1101px)`: mantém a divisão das colunas, retrato, selo 360°, título principal, paleta, conteúdo, foto e layout mobile.

- Legibilidade: descrições das experiências e dos destaques laterais agora têm ao menos **11,52 px** no viewport de referência; frase em itálico **12,64 px**; títulos dos destaques com incremento discreto.
- Competências: numeração laranja dos cinco cards em **9,76 px**, mantendo fundo, posição, links e contraste.
- Compensação de microespaçamentos na coluna esquerda (gap entre introdução e lista, gap dos destaques e padding dos itens) para não empurrar `IDIOMAS` para fora da primeira dobra.
- **Proibida a reintrodução de zoom/transform global.** O tamanho do título principal, o selo e a fotografia não mudaram.

**Evidência do SHA funcional:** [`c098a60`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c098a60d306601ac7d2e8e24ba41be80891832fd), [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) **success** e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) **success**. No viewport **1512×691**, com escala CSS nativa 1: cabeçalho 54 px; título a 66 px; cards de 199 a 281 px; último destaque termina em 669,39 px; **sobreposição selo/anos = 0 px²**. P3: **13 seções, 25 painéis mobile, 38 capturas, 0 falhas e P5 anônimo 3/3 sem mutações**. Lighthouse mediano: mobile Performance 82, **LCP 4,45 s** (meta ≤2,5 s **ainda não atendida**); desktop Performance 98, LCP 1,15 s. Nenhuma mudança Supabase, Storage, CMS, migração, token ou custo.

A referência visual de densidade continua sendo a **última captura fornecida com o navegador a 75%, desejada a 100%**; as referências antigas ficam como histórico. A comparação estética final em navegador físico fica a critério do proprietário, sem reabrir aceites anteriores.


## Referência desktop vigente — 29/10/2026 (substitui a referência histórica de 125%)

**Solicitação mais recente:** em 1512×691 px de área útil, a captura de navegador a **75%** é a composição desejada **com o navegador em 100%**. Os ajustes anteriores que usavam a captura a 125% como referência ficam **históricos/superados**. Nunca reproduzir a densidade por `zoom`, `transform:scale()` no contêiner raiz, alteração global do `html` ou cálculo de escala baseado em `vw` aplicado à página inteira.

A correção [`90975ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/90975ca6fea36095920eaccd0344aab4a2ad3cde) calibra apenas **tipografia secundária, espaçamentos de cards, ritmos verticais e altura do cabeçalho** dentro de `@media (min-width: 1101px)`. A foto, largura das duas colunas, título principal e selo circular mantêm a geometria original, com pequeno deslocamento local do selo para eliminar colisão com o texto. O `--header` reduzido é restrito à página pública em desktop largo; admin, mobile e dados Supabase não mudaram.

**Evidências automatizadas:** [CI #40806132618](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132618) `success`; [P3 #40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) `success`, Vercel Production `READY` no mesmo SHA funcional. No viewport de referência **1512×691, escala nativa 1**, o teste `P3_DESKTOP_DENSITY` registrou `headerHeight=54`, `nameTop=66`, `nameFontPx=85`, `cardsTop=199`, `cardsBottom=279`, `finalHighlightBottom=669.2`, `badgeYearsOverlapPx2=0`. Navegador `failures=0`, 13 seções, 25 painéis mobile, 38 capturas editoriais sem falhas e P5 público 3/3 sem mutações. Medianas Lighthouse: mobile Performance **83**, LCP **4,30 s** (meta ≤2,5 s ainda pendente); desktop Performance **97**, LCP **1,17 s**.

**Prevenção:** `src/lib/layout-zoom.test.ts` continua proibindo zoom global; o P3 agora mede as posições da primeira dobra em 1512×691, além de 12 outras resoluções, exige o último destaque visível e detecta interseção do selo com a descrição. Esses testes não substituem a confirmação visual do proprietário em seu navegador físico; **somente o aceite estético da nova composição fica aguardando inspeção**.


> **Atualização de fechamento — 28/10/2026, após a correção de zoom.** O estado vigente do projeto é a `main` viva; consultar sempre seu SHA, CI, Vercel e dados atuais quando necessários. O histórico abaixo contém snapshots anteriores, inclusive afirmações de aceite visual “pendente” que foram substituídas pela decisão do proprietário para a rodada manual anterior. **A nova equivalência estética da correção de zoom a 100% com a captura de 125% não foi expressamente confirmada pelo proprietário após o último deployment.** [Resumo de continuidade da conversa](CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md).


> **Decisão posterior do proprietário — 28/10/2026:** a verificação manual visual e funcional de todas as áreas ajustadas neste chat foi **validada pelo proprietário**. Não solicitar novo aceite visual dessas áreas por rotina. A aceitação manual não homologa CRUD/Storage com JWT administrativo, não atinge automaticamente a meta LCP mobile e não autoriza exclusões, custos ou mudanças de segurança. O estado técnico vigente é sempre o HEAD e seus testes, nunca os SHAs históricos citados abaixo.

## Etapa 5 — Aceite automatizado concluído; manual em nova frente (28/10/2026)

**PASS — 13 seções públicas, 25 painéis mobile, 38 capturas (13 desktop + 25 mobile), 8 viewports, zero falhas de navegador ou painéis inadequados.** Evidência: [GitHub Actions #40757162085 — tentativa 2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085), no SHA funcional `50a66f8`; até o SHA documental prévio `5db5fd7`, apenas README/`docs/` mudaram. [Relatório final do aceite automatizado](P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md).

**Não houve aceite manual:** a revisão estética, dispositivos físicos, zoom nativo e leitor de tela serão tratados **no novo chat e em uma nova frente**, mediante achados do proprietário. **P3 LCP mobile ainda aberto** (meta ≤2,5 s); **P2 transacional suspenso por custo**, sem criação de staging ou escrita em produção. Este registro se limita ao aceite automatizado estrutural.

**Conferência:** 28/10/2026, somente leitura em GitHub, Vercel e Supabase. **Entrada operacional única:** este documento substitui a função de índice vigente de relatórios cumulativos de 24–26/10. Os documentos originais e os backups permanecem históricos.

> **Regra de atualização:** o snapshot de Git/CI/Vercel abaixo é **anterior ao commit desta consolidação documental**. Para o estado em qualquer novo chat, verificar [HEAD da `main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), [runs do GitHub Actions](https://github.com/tuliustsangaropulos/PortfolioTulius/actions), [deployments da Vercel](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius) e, quando a tarefa pedir, o banco Supabase. **Não reutilizar SHA congelado como se fosse o HEAD futuro.**

## Decisão vigente — P2 transacional suspenso por custo (28/10/2026)


**Decisão expressa do proprietário:** **não aprovar custos adicionais neste momento** para a branch de homologação Supabase. A cotação consultada foi **US$ 0,01344 por hora** para uma branch, sujeita a eventuais custos adicionais de uso. **Cotação não é aprovação de cobrança.**

**P2-TRANS: BLOQUEADO / AGUARDANDO NOVA DECISÃO DO PROPRIETÁRIO, sem prazo.** Não criar ou provisionar branch/projeto pago, não confirmar custo, não configurar ou usar credenciais de homologação, não disparar o [workflow transacional](../.github/workflows/p2-transactional-staging.yml) e **não substituir staging por escrita na produção**. A suíte está preparada no repositório, porém **não foi executada**; CRUD, publicação/restauração e Storage binário com JWT real seguem sem homologação. O [P5 read-only aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770) continua válido.

**Retomada somente mediante solicitação e aprovação explícitas futuras**, com nova revisão de preço/alternativa sem cobrança, equivalência de schema, contas de teste e plano de limpeza. A auditoria e otimização **P3 podem prosseguir separadamente**; o LCP mobile mediano de 4,32 s ainda está acima da meta de 2,5 s. [Pendências](OPEN_ISSUES.md) e [plano P2](P2_TRANSACIONAL_STAGING_2026-10-28.md).

## Identidade e fonte de verdade


- Repositório público: [`tuliustsangaropulos/PortfolioTulius`](https://github.com/tuliustsangaropulos/PortfolioTulius), branch de trabalho **somente `main`**, seguindo [`AGENTS.md`](../AGENTS.md).
- Site: [`https://tulius.work/`](https://tulius.work/), Vercel projeto `portfolio-tulius`, equipe `tuliustsangaropulos-creates-projects`. O push na `main` pode disparar deploy automático.
- Supabase: projeto `portfolio`, id `zfnrhzplwpjpdljraypt`; produção conecta o CMS e o site público. Consultar ao vivo dados de conteúdo antes de alterar layout/edição.
- Antes desta consolidação: `main` em [`56cce2658731d6db29a2cf60cb326f0fd908ef01`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/56cce2658731d6db29a2cf60cb326f0fd908ef01), [CI `40747847554` `success`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747847554), Vercel [`dpl_GAgdukRpirZ8j3foDFB4E5FKEtNk` `READY`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/GAgdukRpirZ8j3foDFB4E5FKEtNk), mesmo SHA. **Este é um marco histórico verificável, não o SHA desta consolidação.**

## Snapshot de dados de produção — 28/10/2026

| Item | Verificado | Interpretação |
|---|---:|---|
| Seções CMS | 14 | 13 `published` e `is_visible`; `competencias` preservada/oculta |
| Contrato mobile público | 25 painéis | Contrato do navegador; **não** são 25 registros do CMS |
| Seções públicas / navegação pública | 13 / 13 | Confirmadas nas consultas e no teste navegador do P3 |
| Painéis cadastrados CMS | 42 | 28 blocos e 56 placements |
| Mídias publicadas | 21 | 19 SVGs ilustrativos + 2 PNGs; **não** equivalem a fotografias e marcas oficiais aprovadas |
| Storage físico | 23 | 21 no `portfolio-public`; 2 no `portfolio-private`, sem linha `media_assets` |
| Pendências editoriais | 8 abertas / 1 resolvida | Não alterar/fechar automaticamente; podem conter fatos sujeitos a aprovação |
| Revisões / audit logs | 12 / 12 | Não representam rollback funcional homologado |
| Segurança | 22 tabelas públicas com RLS / 22 | Testar permissões reais via Auth separadamente de simulações SQL |

**Integridade editorial:** os dois PNGs privados preservam cópias com mesmo path/tamanho/`eTag` dos públicos, retidas pelo fluxo de promoção. Os 19 SVGs publicados no Storage têm tamanhos diferentes dos arquivos `public/media/editorial-*.svg`; não inferir identidade/proveniência ou licenças. Nenhuma limpeza autorizada no P1.

## P0–P3: situação e evidências com limites

| Frente | Aceite evidenciado | Pendência |
|---|---|---|
| **P0 — Documentação** | Repositório consolidado; relatórios históricos preservados e Fontes ChatGPT inventariadas | Gestão das Fontes do ChatGPT é **manual** e não se sincroniza automaticamente com GitHub |
| **P1 — Higiene técnica** | [Investigação detalhada](P1_INVESTIGACAO_HIGIENE_2026-10-28.md) dos 2 privados, importador HTTP 410, 19 SVGs e branches | Decisão sobre retenção, direitos, proveniência e eventual exclusão, **sem apagar antes** |
| **P2 — Administração** | [P5 #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770): **4/4 PASS**, login real, 8 módulos, prévia 14 seções, logout; `contentMutations=0` | **Não homologados** CRUD/publicação/restauração pela UI e upload/download/substituição de bytes com JWT real e fixture isolada; prova de usuário autenticado não admin real. [Relatório P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) |
| **P3 — Qualidade** | [Audit #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), SHA [`e3bfccf`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e3bfccf467c730cc0a869f2db6addaaf7f65ca14), [Vercel `READY` correspondente](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/C1YFn6m9iE2Jc5cVjjL1VoKHTydk) **antes** da medição; 13 seções, 25 painéis, 38 capturas, 8 viewports, zero falhas automatizadas; A11y/SEO/Boas Práticas 100/100 | LCP mobile **4,376 s**, meta **≤2,5 s** ainda não cumprida; aceite visual humano, zoom 200% e leitor de tela real pendentes. [Relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md) |

**Lighthouse válido:** Performance **82 mobile / 97 desktop**; LCP **4,38 s mobile / 1,26 s desktop**. O elemento LCP é `/media/tulius-portrait-dark.jpg`; arquivo pequeno e prioritário. Investigar sequência de dados Supabase, render inicial React e variação de laboratório antes de otimizações arbitrárias. Não comparar a rodada anterior iniciada antes do deployment com a rodada vinculada ao SHA correto.

## Pendências operacionais com escopo controlado

Consultar [**`OPEN_ISSUES.md` (somente pendências atuais)**](OPEN_ISSUES.md). Ordem proposta:
1. Organizar Fontes do projeto ChatGPT e preservar o backup exclusivo da seção 01; [inventário e instruções](RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md).
2. Criar ambiente/fixture segura de homologação e executar transações P2 via interface e Storage real, **sem editar dados aprovados**.
3. Medir e reduzir LCP mobile com hipóteses testáveis, manter estética, SEO, acessibilidade e 13/25; depois aceite humano P3.
4. Avaliar separadamente mídias/branches/função/objetos privados P1 — **nenhuma exclusão foi aprovada**.

## Referências por tipo de mudança

| Tarefa | Consultar antes |
|---|---|
| Todas | [`AGENTS.md`](../AGENTS.md), [README](../README.md), `main`, deployment e este índice |
| Layout, design, responsividade e motion | [DESIGN_SYSTEM](DESIGN_SYSTEM.md), [RESPONSIVE_LAYOUT](RESPONSIVE_LAYOUT.md), [UX_UI_MOTION](UX_UI_MOTION.md), componentes em `src/components/public/`, `src/index.css`; Fonte ChatGPT `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` é histórica |
| Conteúdo e CMS | [CONTENT_MODEL](CONTENT_MODEL.md), [ADMIN_CMS](ADMIN_CMS.md), `src/components/admin/`, `src/content/fallback.ts` e dados atuais Supabase |
| Segurança/Auth/Storage | [SECURITY_RLS](SECURITY_RLS.md), [P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) e [P1](P1_INVESTIGACAO_HIGIENE_2026-10-28.md); nunca expor Secrets nem reaplicar baseline |
| Publicação | [DEPLOYMENT](DEPLOYMENT.md), CI e deployment `READY` do **mesmo SHA** |
| Histórico | [Auditoria acumulada 26–28/10](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md), [histórico de pendências](historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md) e [histórico do README](historico/README_ACUMULADO_ATE_2026-10-28.md) |

## Regras de proteção

Preservar layout, fontes, fotografias, textos e conteúdo aprovado. Não criar branch/PR, não executar migrations, seed, alterações RLS, exclusão Storage, contas administrativas ou limpeza de histórico sem autorização específica. Não revogar o token histórico nem ativar Leaked Password Protection sem nova decisão do proprietário: constam como **riscos anteriormente aceitos, não resolvidos**. Não considerar screenshots automatizados equivalentes a homologação visual humana.

## Acompanhamento operacional P2/P3 — 28/10/2026

**P2:** suíte transacional isolada preparada em [`P2_TRANSACIONAL_STAGING_2026-10-28.md`](P2_TRANSACIONAL_STAGING_2026-10-28.md); **não executada**. Não havia branch Supabase de homologação e a criação exigiu confirmação de custo. O script falha fechado se receber ref de produção, testa JWT real de admin e não admin, CMS/Storage com fixture, sem excluir dados aprovados. Não reaplicar a baseline do GitHub no remoto sem revisão específica.

**P3:** após P5 e auditoria inicial, foram ensaiadas a separação de consultas SEO e renderização isolada da primeira dobra. O segundo experimento foi revertido por potencial regressão de TBT; o workflow agora coleta **três amostras mobile** no mesmo SHA para mediana/variância antes de novos ajustes. Nenhuma meta LCP ≤2,5 s foi alcançada ou declarada. [Evidências P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

## Última medição P3 validada e plano P2 — 28/10/2026

- **P3:** [Audit #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) `success`, Vercel `READY` previamente confirmado no **SHA `50a66f896deb87e315b194e65e3de964495beeb8`**. Medianas de três runs: **mobile Performance 82/LCP 4,32 s; desktop 98/LCP 1,16 s**. A11y/SEO/boas práticas 100 em todas as amostras; 13 seções, 25 painéis e 38 capturas sem falhas. Meta LCP mobile ≤2,5 s **continua aberta**. [Relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md).
- **P2:** [suíte de homologação isolada](P2_TRANSACIONAL_STAGING_2026-10-28.md) versionada e protegida contra uso no ref de produção, mas **não executada**: falta projeto/branch staging, confirmação de eventual custo, verificação de baseline e contas JWT de teste. P5 read-only 4/4 segue aprovado.

Este é o snapshot funcional antes do commit exclusivamente documental que registra a auditoria; sempre consultar o HEAD/deployment reais.

## Adendo de continuidade — ajustes solicitados na verificação manual (28/10/2026)

Esta atualização sucede o aceite automatizado histórico descrito no início do documento. As alterações solicitadas pelo proprietário foram implementadas no site público e no painel administrativo, com modificação editorial controlada no projeto Supabase de produção, **não** como execução da suíte P2 transacional suspensa. Nenhum staging pago, migration, alteração RLS ou exclusão foi realizado.

- **Experiências:** 13 itens de projetos excedentes marcados `isHidden=true` em três blocos (Invest RS 2, Prefeitura SP 3, Globo/SporTV 8), mantendo os originais no JSONB. Todos os empregadores têm até seis itens visíveis por padrão; a barra de navegação de seis empregadores permanece. O CMS permite alternar a visibilidade de cada item sem removê-lo.
- **Depoimentos:** cinco registros `published` em `public.testimonials`, sendo **três originais preservados** e **dois exemplos fictícios/ilustrativos identificados**, nunca apresentados como endossos reais. Dois blocos `depoimentos` vinculados à coleção com distribuição 2+3 entre os dois painéis mobile; a grade desktop usa três colunas e duas linhas, com expansão acessível.
- **Contato:** texto da assinatura já existente em `sections.intro` e localização já existente em `contato/a.items[0].text` são reaproveitados como rodapé; sem duplicar conteúdo no CMS. Coluna central reservada à fotografia; ícones dos links sem sobreposição.
- **Menu:** rótulos Início, Projetos em Destaque, Graduação e Experiência Profissional (destino `invest-rs`). Cinco entradas individuais de empregadores passaram a `is_visible=false`, preservadas no banco. **Menu público 8 entradas; estrutura pública continua 13 seções/25 painéis mobile**.

**Limites:** não declarar aceite visual humano nem homologação P2 transacional. A conferência em aparelhos físicos, zoom 200% e leitor de tela, assim como a meta LCP mobile ≤2,5 s, permanecem pendentes. Para o SHA de CI/Vercel mais recente consultar as plataformas ao vivo; o snapshot anterior continua histórico.

### Evidências finais da rodada manual

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

## Adendo — CMS de Seções/Mídia revisado (28/10/2026)

A nova frente manual solicitou tradução de status, confirmação e feedback de salvamento, verificação de layout/tema/motion/visibilidade, Biblioteca de mídia simplificada e editor de enquadramento por uso. O código implementa status em português nas listas, toast transiente em todos os módulos de escrita, confirmação de arquivamento/publicação e restrição dos layouts fixos. `is_visible` continua fonte pública de visibilidade, sem alterar schema ou as 13 seções visíveis da auditoria anterior. A Biblioteca agora abre campos apenas do asset selecionado; o título é o nome real do arquivo e o campo crédito/licença não é usado pela UI.

**Supabase leitura/gravação editorial autorizada:** 21/21 títulos `media_assets.title` ajustados para o nome do arquivo final com extensão; 19 valores de `credit` anteriores **não foram apagados** para preservar histórico, mas estão excluídos do editor e de novas gravações. Nenhum arquivo Storage, RLS, schema, conta administrativa ou custo foi alterado. Configuração X/Y/zoom usa propriedades opcionais JSONB somente em usos escolhidos; nenhuma mídia existente recebeu crop automático.

**Aceite:** a compilação e os testes automatizados validam código, não o fluxo de escrita com JWT real. O P2 transacional continua deliberadamente suspenso; requer autorização expressa para homologação autenticada. O aceite manual estético permanece aberto.

### Evidências da auditoria administrativa integral — 28/10/2026

[Relatório por aba](AUDITORIA_ADMIN_MANUAL_2026-10-28.md): auditoria de código de dez áreas, sem mutações P2. CI #40776321190 aprovado; auditoria pública P3 #40776111312 aprovada; 21/21 títulos de mídia sincronizados com nome de arquivo no Supabase e 19 créditos históricos preservados sem uso. O LCP mobile e o teste real de gravação do CMS permanecem pendentes.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

### Auditoria da versão funcional de correções — 28/10/2026

[CI de implementação #40781440231](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440231) **success** no SHA [`ae4033e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ae4033e3720d8252e5af3270c71f7470877341ec). [Auditoria P3 #40781440227](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440227) **success**, 8 viewports sem overflow, 13 seções, 25 painéis, 38 capturas sem falhas, 6 experiências navegáveis, P5 anônimo 3/3, nenhum dado de produção escrito. Lighthouse mediana de três amostras: **mobile Performance 80, LCP 4,38 s**; **desktop Performance 97, LCP 1,09 s**. A meta mobile ≤2,5 s não foi alcançada. Diagnóstico registrou fonte Google render-blocking e custo de execução/avaliação do bundle JavaScript, além da variabilidade de laboratório. A antecipação da consulta de depoimentos remove etapa sequencial de rede, mas não comprova ganho sustentável de LCP. **Não alterar orçamento de regressão para declarar o requisito aprovado.** A auditoria de browser foi executada no SHA funcional; os commits posteriores apenas documentam o aceite manual.

As verificações da versão documental de `main` são [CI #40781599089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781599089) e [Export Docs #40781598923](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781598923), ambas **success**. Vercel Production `READY` no mesmo commit documental antes deste registro. A declaração expressa do proprietário encerra a fase de aceite manual do chat; não encerra metas de performance ou P2 transacional.

## Correção de densidade desktop nativa — 28/10/2026

Por solicitação expressa, a composição de referência passou a ser a captura com zoom do navegador em **125%**, agora desejada no navegador em **100%**. O mecanismo CSS anterior de escala 75% foi removido completamente do site público, juntamente com compensações de viewport dependentes. A seção de abertura mantém overflow e altura flexível em desktop largo. O contrato passa a não admitir **zoom CSS global** nem scale global na `.public-site`. Teste unitário preventivo e extensão de P3 auditam zoom calculado, transform e larguras adjacentes ao breakpoint. A implementação é exclusivamente pública; dados CMS/Supabase e admin preservados. Ver [Layout responsivo](RESPONSIVE_LAYOUT.md) e os commits/CI no HEAD vigente. O aceite de outras frentes manuais já registrado permanece preservado; este é um **novo ajuste solicitado**.

### Evidências do ajuste nativo de escala — Auditoria 28/10/2026

**SHA funcional** [`8a45e9b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/8a45e9bc0663ee15e9b0797785900308f6622712), [CI Validate #40794804474](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804474) **success**, [P3 Lighthouse + browser #40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504) **success** e Vercel Production `READY` no mesmo SHA previamente à auditoria.

**Novos testes do contrato de escala:** 12/12 viewports (1920×1080, 1757×832, 1440×900, 1366×768, 1200×800, 1101×800, 1100×800, 768×1024, 720×450, 390×844, 360×800, 320×700) registraram `getComputedStyle(.public-site).zoom === "1"`, `transform === "none"` e `overflowPx=0`. A passagem de 1101 para 1100 px não altera artificialmente a escala (fonte da marca: 61,656 px e 61,6 px, respectivamente). **13 seções**, **25 painéis mobile**, **38 capturas editoriais**, **nenhum erro** de navegador ou painel; 6 experiências e galeria navegáveis. P5 público anônimo 3/3 e `mutations=0`.

**Performance (mediana de 3 execuções Lighthouse)**: mobile Performance **78**, LCP **4,36 s**, desktop Performance **97**, LCP **1,09 s**. O gate de regressão foi aprovado, porém **LCP mobile ≤2,5 s não foi atingido**. Alteração de zoom não constitui intervenção em performance mobile. O teste em 720 px é uma simulação por largura de viewport e **não** comprova zoom nativo de 200% em todos os navegadores.

O mecanismo global anterior deve permanecer **proibido** pelo teste `src/lib/layout-zoom.test.ts` e pela checagem de estilo calculado `P3_VIEWPORT`; correções futuras de tipografia/densidade devem ser locais e responsivas, sem novo percentual de zoom CSS.

### P3 — última rodada de desempenho mobile (29/10/2026 UTC)

A correção de densidade/zoom anterior permanece intacta. A otimização de montar **apenas uma árvore responsiva** por viewport foi mantida; os testes P3 preservam 13 seções, 25 painéis mobile, 38 capturas e zero falhas. Último SHA funcional `4ab9ce5`, [CI #40797703964](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703964) e [P3 #40797703855](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703855) `success`; LCP mobile mediano **4,30 s**, meta **≤2,5 s não atendida**, desktop 1,07 s. Tentativas de contenção de pintura e fontes assíncronas foram **revertidas**. Nenhum dado ou mídia foi alterado. Detalhes e decisões de continuidade em [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

### Continuação do LCP mobile — 29/10/2026 UTC

Teste de leitor REST público foi revertido por produzir **zero seções**; o Lighthouse falso de 2,26 s é inválido e não representa cumprimento da meta. O Supabase SDK/autenticação originais foram preservados. **Apenas a separação de chunks Vite** foi mantida: `supabase-sdk` e `vendor`. Auditoria P3 `e1846ac`: 13 seções, 25 painéis, 38 capturas, LCP mediano mobile 4,248 s, P5 sem mutações. A meta ≤2,5 s continua aberta e o gate P6 foi reforçado para exigir conteúdo LCP real. Ver [relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

### Auditoria final da proteção P6 e divisão dos chunks — 29/10/2026 UTC

No SHA funcional [`cc30446`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc304462bf9bf2ab0d8583b85920eb136a127916), [CI #40800444163](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444163) e [P3 #40800444157](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444157) passaram, com Vercel Production `READY`. P3: **13 seções**, **25 painéis mobile**, **38 capturas**, `P3_BROWSER_AUDIT failures=0`, P5 anônimo **3/3**, **0 mutações**. O novo **`P6_LCP_CONTENT_GATE` passou em mobile e desktop**, comprovando que o LCP medido era o retrato publicado. Mediana Lighthouse mobile: **Performance 82, LCP 4,421 s**; desktop: **Performance 97, LCP 1,235 s**. O valor de 4,248 s do experimento `e1846ac` não se repetiu; **não há evidência de melhora causal do LCP** frente ao baseline de aproximadamente 4,30 s. A meta mobile **≤2,5 s permanece aberta**. Preservar o SDK e o conteúdo original; a separação dos chunks está mantida apenas como isolamento/cache, **não** como aceite de desempenho.

### Verificação complementar do desempenho — 29/10/2026

A repetição da [auditoria P3 #40812459767](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40812459767) concluiu com **failure apenas no orçamento Lighthouse P6**; as verificações de rotas e responsividade permaneceram aprovadas (`P3_BROWSER_AUDIT failures=0`, 13 seções, 25 painéis, 38 capturas, P5 anônimo 3/3). Mediana mobile **LCP 8,455 s, Performance 69**; desktop **LCP 1,685 s, Performance 93**; o gate de retrato esperado como LCP não conseguiu confirmar o elemento em nenhuma das duas categorias. Uma execução anterior do mesmo código havia registrado LCP mobile ~7,680 s e também falhou no P6. **Não declarar aceite de desempenho; a meta ≤2,5 s e a investigação da variância permanecem abertas.** O teste funcional do site público não indica perda de seções, mídias ou RLS; ainda não há evidência causal relacionando a piora sintética às alterações exclusivamente administrativas. Homologação de escrita autenticada do CMS segue suspensa (P2).

### Evidência final adicional: auditoria P3 #40815457107 — 29/10/2026

No SHA funcional `d882d7a` (mesmo código público da documentação `cce4869`), o navegador automatizado mediu `P3_ABOUT_INVEST_FIT`: `aboutBottom=1382`, `portraitBottom=1420` (38 px extras recortados ao fim), `count=4`, `listHeight=422`, `listScrollHeight=422` (nenhuma rolagem no painel Invest RS), `headingLogoBorder=0px`, `indexLogoBorder=1px`. `P3_BROWSER_AUDIT failures=0`, `P5_PUBLIC_RESULT passed=3/3 mutations=0` e `P4_EDITORIAL_SUMMARY captures=38 failures=0`. O site mostrou `publicSections=13`, `portraitComplete=true`.

**Importante: o job P3 final tem resultado global `failure` por falha de integração de status, não por falha funcional:** o gate `Confirm Vercel production deployment status for audit SHA` consultou 30 vezes o status de commit com contexto `Vercel` e recebeu `missing`, mesmo havendo deployment `READY` confirmado diretamente pelo conector Vercel. Como Lighthouse dependia desse gate, as seis amostras não foram produzidas e o gate P6 reportou `missing sample`. Não afirmar aprovação da auditoria completa nem inferir mudança de LCP com base nessa execução. A meta LCP mobile ≤2,5 s e o ajuste do gate GitHub↔Vercel seguem como **pendências independentes**, sem suspender o sucesso dos testes funcionais de layout.

[Execução P3](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457107) · [CI funcional](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40815457072) · [Deployment funcional READY](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/CW4JH4aXUtmCGW3Hx6Gi5Phvrs34).

