# Layout responsivo

## Referência desktop vigente — 29/10/2026 (substitui a referência histórica de 125%)

**Solicitação mais recente:** em 1512×691 px de área útil, a captura de navegador a **75%** é a composição desejada **com o navegador em 100%**. Os ajustes anteriores que usavam a captura a 125% como referência ficam **históricos/superados**. Nunca reproduzir a densidade por `zoom`, `transform:scale()` no contêiner raiz, alteração global do `html` ou cálculo de escala baseado em `vw` aplicado à página inteira.

A correção [`90975ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/90975ca6fea36095920eaccd0344aab4a2ad3cde) calibra apenas **tipografia secundária, espaçamentos de cards, ritmos verticais e altura do cabeçalho** dentro de `@media (min-width: 1101px)`. A foto, largura das duas colunas, título principal e selo circular mantêm a geometria original, com pequeno deslocamento local do selo para eliminar colisão com o texto. O `--header` reduzido é restrito à página pública em desktop largo; admin, mobile e dados Supabase não mudaram.

**Evidências automatizadas:** [CI #40806132618](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132618) `success`; [P3 #40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) `success`, Vercel Production `READY` no mesmo SHA funcional. No viewport de referência **1512×691, escala nativa 1**, o teste `P3_DESKTOP_DENSITY` registrou `headerHeight=54`, `nameTop=66`, `nameFontPx=85`, `cardsTop=199`, `cardsBottom=279`, `finalHighlightBottom=669.2`, `badgeYearsOverlapPx2=0`. Navegador `failures=0`, 13 seções, 25 painéis mobile, 38 capturas editoriais sem falhas e P5 público 3/3 sem mutações. Medianas Lighthouse: mobile Performance **83**, LCP **4,30 s** (meta ≤2,5 s ainda pendente); desktop Performance **97**, LCP **1,17 s**.

**Prevenção:** `src/lib/layout-zoom.test.ts` continua proibindo zoom global; o P3 agora mede as posições da primeira dobra em 1512×691, além de 12 outras resoluções, exige o último destaque visível e detecta interseção do selo com a descrição. Esses testes não substituem a confirmação visual do proprietário em seu navegador físico; **somente o aceite estético da nova composição fica aguardando inspeção**.


## Contrato público vigente — 26/10/2026

O banco preserva os registros editoriais originais, mas a seção `competencias` (antiga seção 04) está **oculta** (`is_visible=false`); são **13 seções públicas**. A seção `resultados` (seção 03) utiliza **um** painel mobile interativo; as outras 12 seções públicas utilizam dois. Portanto, o contrato de renderização esperado é **13 seções desktop + 25 painéis mobile = 38 capturas editoriais** no teste P4, e não mais 14/28/42. Esta contagem corresponde à estrutura publicada no Supabase, não à exclusão física da seção 04.

## Desktop e tablet (a partir de 768 px)

Cada seção conserva sua composição editorial com `min-height: 100svh` e overflow apropriado ao conteúdo; a seção 01 mantém o split grafite/branco e as áreas de especialidade/experiência. Resultados apresenta visão geral de quatro métricas com ícones e cinco opções temáticas interativas. Formação e Ferramentas utilizam o tema `ink`.

As seis empresas (Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress, CDI Comunicação) são apresentadas por `ExperienceStack`: painéis brancos sobrepostos com `position: sticky`, `top: 0` e `z-index` crescente. A barra de seleção das seis empresas é sticky abaixo do cabeçalho global; a coluna direita de cada experiência contém uma galeria de projetos, que apresenta título e estado de mídia pendente até a inclusão de fotos autorizadas no CMS.

## Mobile (até 767 px)

A abertura preserva dois painéis: o primeiro com perfil/fotografia/marcadores, o segundo com cinco especialidades e seis organizações. A seção 02 mostra foto com o primeiro item textual do painel B no painel A; os demais textos ficam no painel B. A seção 03 usa **um** painel mobile com seletor de temas, indicadores e dossiês.

Para as seis experiências profissionais, a barra de empresas continua fixa e horizontalmente rolável, mas os **cards deixam de ser sticky** (`position: relative`) para não cobrir a galeria da empresa anterior quando o conteúdo exceder a altura da viewport. A sobreposição pedida pelo proprietário é preservada no desktop/tablet; a leitura mobile é sequencial e completa. A correção mobile foi registrada após auditoria visual e requer aceite em aparelho real.

Em Ferramentas, os ícones dos grupos são reposicionados junto aos títulos/textos com redução de escala em telas estreitas. Em Contato, os valores e links extensos respeitam a largura disponível.

## Rolagem, cabeçalho e verificação

A rolagem por snap é `scroll-snap-type: y proximity`, **não** `mandatory`; textos podem exceder a viewport. Respeitar safe areas, offset do header para âncoras, foco visível e `prefers-reduced-motion`. O menu lista somente as seções visíveis; os links dos seis empregadores na abertura devem navegar para seus próprios slugs.

Matriz de verificação: 1920×1080, 1440×900, 1366×768, 768 px, 390×844, 360×800, 320 px e zoom nativo de 200%. Os scripts `scripts/p3-browser-smoke.mjs` e `scripts/p4-visual-audit.mjs` documentam o contrato técnico. Executar inspeção manual adicional para interações e recortes que os testes automatizados não detectam.

## Verificação manual — escala visual desktop a 100% (28/10/2026)

**Achado do proprietário:** na mesma janela de navegador, a visualização a 100% cortava o quarto destaque da abertura, parte das seis experiências e a seta inferior. A captura do navegador a 75% é a **referência de composição desejada para 100%**, sem alterar conteúdo, identidade visual ou dados.

**Implementação restrita ao público desktop (largura ≥1101 px):** `src/index.css` define `--desktop-visual-scale` progressivo até aproximadamente 0,75 na largura da captura (1523 px), aplicado em `.public-site`. As alturas com `svh/dvh` são compensadas para manter painéis de janela inteira; margens e títulos em `vw` preservam as proporções físicas observadas no zoom real de 75%; a seção `perfil` não oculta conteúdo excedente. O modo compacto por `max-height` permanece para tablet (768–1100 px), enquanto o layout mobile até 767 px e o CMS administrativo não recebem esta escala.

**Regressão de teste corrigida:** a checagem P3 da barra sticky das seis experiências passou a comparar sua posição com a **borda inferior real do cabeçalho** (em vez do intervalo fixo de 65–90 px, anterior à mudança de escala). A funcionalidade de navegação não foi alterada para acomodar o teste.

**Evidências:** commits [`806031b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/806031bfa868b048a4c6bfc695341afb5a9d4080), [`d8519b6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/d8519b63863d349af44102c5e21be0cec69c9add) e [`fa6668d`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/fa6668d4d5d8043a08c2df6834ec415a5715249c). [CI Validate #40771741818](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40771741818) **success**; [P3 #40771741839](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40771741839) **success**, deployment Vercel `READY` do mesmo SHA antes das medições. **8/8 viewports sem overflow, 13 seções, 25 painéis mobile, 38 capturas, zero falhas de navegador/painéis; navegação sticky PASS.** Lighthouse mediano: mobile Performance 80/LCP 4,05 s e desktop Performance 98/LCP 1,01 s; a meta **LCP mobile ≤2,5 s continua pendente**.

**Aceite humano ainda necessário:** confirmar no navegador real, em zoom nativo de 100%, a equivalência visual com a captura de referência a 75%; verificar também tamanhos intermediários, telas curtas, zoom 200% e aparelhos físicos. Testes automatizados não constituem aprovação estética.

## Homologação manual — rodada de experiências, depoimentos, contato e menu (28/10/2026)

Em telas desktop, cada experiência mostra somente itens com `isHidden !== true`, com preferência editorial por até seis itens sem necessidade de barra vertical. O conteúdo oculto permanece preservado e reexibível pelo CMS, inclusive no mobile. A rolagem continua disponível quando a janela real não comporta seis itens sem perda de leitura.

Depoimentos desktop: grade com seis posições geométricas (3 × 2), cinco cartões quadrados iniciais e expansão que ocupa duas linhas de uma coluna. Layouts intermediários ajustam colunas e mobile mantém dois painéis com os mesmos cinco depoimentos. Contato desktop: chamada, imagem e links em três colunas, rodapé completo na borda inferior. Mobile mantém dois painéis com foto isolada e links/rodapé em fluxo. Menu lateral reduzido a oito entradas sem eliminar as 13 seções públicas; a barra das seis experiências continua navegável.

### Evidências finais da rodada manual

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

## Ajuste de enquadramento por dispositivo — 28/10/2026

As imagens de blocos, retratos de abertura, coluna de Contato, foto central de Olá!, logos e slides aceitam coordenadas opcionais por uso no JSONB. O renderer compõe com `object-position`, `transform: scale()` e `transform-origin` somente quando há uma configuração salva; conteúdo sem crop permanece no enquadramento anterior. O diálogo administrativo utiliza preview responsivo e proporção do destino. A configuração compartilha os dados do bloco entre desktop e mobile; ainda não oferece recortes independentes por breakpoint, exceto a imagem desktop própria de Olá!. Não duplicar nem apagar fotografias originais.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

## Correção estrutural de densidade desktop — 28/10/2026 (substitui o ajuste de 75%)

**Novo achado do proprietário:** o navegador em 100% mostrava a página excessivamente pequena; a composição desejada corresponde à captura obtida com navegador em 125%. O mecanismo anterior de 75% de densidade permanece documentado **acima como histórico, não como regra vigente**.

**Causa e remoção:** o código usava `zoom: var(--desktop-visual-scale)` em `.public-site`, com uma escala variável entre 75% e 100% em função de `100vw`. O zoom do navegador altera o viewport CSS e, consequentemente, o próprio valor calculado dessa escala, amplificando o efeito. Foram removidos a redução global, a variável `--desktop-visual-scale` e **todas** as compensações dependentes de `svh/dvh/vw` ligadas a ela, incluindo depoimentos e Contato. Preservou-se o ajuste independente de conteúdo longo na seção 01: `overflow:visible` e `min-height:100dvh` no desktop largo.

**Novo contrato:** o aplicativo público não força `zoom` ou `transform:scale()` no contêiner. O navegador em 100% exibe o CSS responsivo nativo; o zoom em 125% e 200% é controlado exclusivamente pelo usuário, com passagem natural pelos breakpoints. As fontes, os tokens de identidade, o conteúdo editorial, o layout mobile e o CMS não foram modificados.

**Prevenção de regressão:** teste unitário `src/lib/layout-zoom.test.ts` impede a reintrodução de zoom global/variável de compensação. O smoke P3 verifica o `getComputedStyle(.public-site).zoom === 1` e a ausência de transform no site, com viewports de 1920, 1757, 1440, 1366, 1200, 1101, 1100, tablet, simulador de 200% e mobile. A igualdade visual com a referência de 125% deve ser confirmada na mesma área útil em pixels físicos; diferenças de renderização entre SO/navegadores são esperadas.

**Limites:** testes por mudança de viewport não simulam *verdadeiro* zoom nativo do navegador; a validação humana desses detalhes permanece baseada nos anexos da conversa. Este ajuste é estritamente do CSS público, sem gravação ou migração no Supabase. O P2 transacional e a meta LCP mobile são independentes.

### Evidências do ajuste nativo de escala — Auditoria 28/10/2026

**SHA funcional** [`8a45e9b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/8a45e9bc0663ee15e9b0797785900308f6622712), [CI Validate #40794804474](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804474) **success**, [P3 Lighthouse + browser #40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504) **success** e Vercel Production `READY` no mesmo SHA previamente à auditoria.

**Novos testes do contrato de escala:** 12/12 viewports (1920×1080, 1757×832, 1440×900, 1366×768, 1200×800, 1101×800, 1100×800, 768×1024, 720×450, 390×844, 360×800, 320×700) registraram `getComputedStyle(.public-site).zoom === "1"`, `transform === "none"` e `overflowPx=0`. A passagem de 1101 para 1100 px não altera artificialmente a escala (fonte da marca: 61,656 px e 61,6 px, respectivamente). **13 seções**, **25 painéis mobile**, **38 capturas editoriais**, **nenhum erro** de navegador ou painel; 6 experiências e galeria navegáveis. P5 público anônimo 3/3 e `mutations=0`.

**Performance (mediana de 3 execuções Lighthouse)**: mobile Performance **78**, LCP **4,36 s**, desktop Performance **97**, LCP **1,09 s**. O gate de regressão foi aprovado, porém **LCP mobile ≤2,5 s não foi atingido**. Alteração de zoom não constitui intervenção em performance mobile. O teste em 720 px é uma simulação por largura de viewport e **não** comprova zoom nativo de 200% em todos os navegadores.

O mecanismo global anterior deve permanecer **proibido** pelo teste `src/lib/layout-zoom.test.ts` e pela checagem de estilo calculado `P3_VIEWPORT`; correções futuras de tipografia/densidade devem ser locais e responsivas, sem novo percentual de zoom CSS.

### Continuidade após a última auditoria de zoom

O proprietário solicitou que a aparência atual a 100% reproduzisse a referência antes observada a 125%. **Corrigida a causa técnica** (sem zoom CSS global e sem compensações progressivas) e aprovada a auditoria P3 do SHA funcional `8a45e9b`: 12 resoluções, 0 overflow, 13 seções, 25 painéis e 38 capturas. A correspondência estética exata da nova referência em navegador físico ainda não foi confirmada por mensagem posterior. O aceite manual anterior para as demais áreas permanece válido. Mais contexto: [continuidade do chat](CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md).
