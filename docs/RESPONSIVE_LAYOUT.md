# Layout responsivo

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
