# Design system

## Direção

Publicação editorial de alta energia: contraste entre grafite, laranja e papel; tipografia condensada; assimetria; linhas finas; numeração; selo circular e setas.

Tokens padrão: `orange #FF5414`, `ink #171617`, `paper #FAFAFA`, `cream #F8F4F1`, `muted #514742`, `orangeDark #BC390C`. Eles são editáveis em `design_tokens` e aplicados como custom properties validadas.

## Tipografia

- Big Shoulders Display: títulos e métricas, carregada do Google Fonts (OFL).
- Inter: textos e interface, carregada do Google Fonts (OFL).
- Neue Montreal: não servida até confirmação da licença web.
- Heading Now Trial: proibida no bundle e no repositório.

## Componentes

`Navigation`, `MobilePanel`, `ItemCard`, `Badge360`, headings editoriais, cards de métricas, timelines, tags, depoimentos e links de contato. Variações são controladas por `layout_variant`, `theme` e conteúdo, não por HTML arbitrário.

Texto pequeno usa grafite sobre laranja. Foco é visível; botões têm alvo mínimo de 44px.

## Ajustes da abertura — 25/10/2026

- Os cinco cards numerados do lado direito da primeira seção são links integrais, com feedback de hover e foco e paleta grafite/laranja; não confundir seus números (01–05) com o antigo contador de seções do header.
- O selo circular usa o texto padrão **VISÃO 360° DA COMUNICAÇÃO E MARKETING ·**, distribuído ao longo do caminho SVG e reposicionado acima do limite inferior do painel. O texto continua editável no conteúdo do herói.
- A seta inferior do painel direito anima somente o ícone em ciclo discreto; a regra global de `prefers-reduced-motion` impede animação contínua quando o usuário prefere movimento reduzido.
- Âncoras das seções desktop fazem alinhamento pelo topo, sem `scroll-margin-top` do header. O menu lateral tem o título literal **MENU**.

## Quantidade e distribuição dos textos — seções 02 e 03, 26/10/2026

A seção 02 (fundo laranja) apresenta **cinco declarações inicialmente** na coluna direita desktop; a lista é administrável e sua altura pode variar após inclusões/exclusões. A primeira declaração também acompanha a foto no painel A mobile; as demais são listadas no painel B mobile. Preservar o equilíbrio vertical, as regras de tamanho e o recorte central existentes e verificar visualmente quando a lista ultrapassar a altura disponível.

A seção 03 mantém seus **quatro indicadores** à esquerda/centro e exibe **cinco temas de especialidades** na coluna da direita, correspondentes aos cards 01–05 da abertura. Os números desses cards pertencem apenas à seção 01; os títulos da seção 03 não são numerados nem se tornam links nesta entrega.

## Seção 03 — interação e leitura (26/10/2026)

A apresentação conserva a coluna de título **Resultados e projetos em destaque** à esquerda. Na **Visão geral**, a área central mostra os quatro indicadores com ícones em lugar dos números 01–04. A coluna direita apresenta os cinco temas e a opção de retorno à visão geral como botões com hover, foco visível e estado ativo. Ao selecionar tema, o centro apresenta seu eixo, título, subtítulo, temas relacionados, texto curto, conteúdo de Competências reaproveitado e indicadores somente quando pertinentes. Os cinco cards clicáveis da abertura abrem `#resultados` no tema escolhido.

O mobile apresenta títulos/filtros e conteúdo central em sequência em um único painel. Em desktop de altura reduzida, a área central poderá rolar independentemente para manter o bloco temático acessível; validar legibilidade e ausência de cortes. Preservar as cores, fontes, proporções dos cards, contrastes e `prefers-reduced-motion` já definidos.

Os textos originais de **Habilidades**, **Gestão**, **Competências**, **Relações** e **Destaques** da antiga seção 04 estão agora visíveis como destaques de apoio nos dossiês pertinentes. Os registros da seção 04 continuam conservados no CMS e a seção não aparece mais no site público.

## Direção visual — Formação e seis experiências (26/10/2026)

**Formação:** fundo cinza-escuro da identidade `#171617`; títulos e corpo brancos, elementos de destaque laranja. Mesmos conteúdos e tipografia.

**Experiências:** fundo branco uniforme, seis painéis com sobreposição por rolagem vertical (o seguinte fica acima do anterior). Cabeçalho geral permanece; abaixo, uma barra de seleção fixa contém marca pequena + título de cada empresa e estado ativo. Na ausência da logomarca real, usar monograma **identificado como provisório**. Conteúdo do painel: pequeno logo acima do título; lista de projetos e realizações; galeria visual à direita com enquadramento consistente, legenda, contador, navegação por setas e indicadores clicáveis.

Os 18 slots de mídia representam temas de projeto reais, mas **as imagens ainda não existem no acervo aprovado**. O componente mantém placeholders textuais com contraste e não exibe imagens de bancos de imagens como prova do trabalho. O CMS define URLs e descrições acessíveis para futura substituição. Mobile usa nav horizontal rolável, conteúdo textual seguido da galeria; respeitar `prefers-reduced-motion`. Validar a experiência sticky em navegadores móveis e telas baixas para evitar bloqueios de scroll.

**Ajuste responsivo posterior à captura:** a auditoria visual encontrou a galeria mobile parcialmente coberta por conteúdo do próximo empregador quando se mantinha `position:sticky` em painéis mais altos que o viewport. A partir do commit `6cfe4d04`, a sobreposição sticky é **exclusiva do desktop/tablet**, e no mobile os painéis de experiência voltam a `position:relative`, permitindo leitura integral; a barra de empresas continua sticky e horizontal. Publicação desse ajuste depende de nova disponibilidade de deploy na Vercel.

## Ferramentas e estados de interação — 26/10/2026

**Ferramentas:** substituir o creme anterior pelo cinza-escuro da identidade (`var(--ink)`) em toda a seção; texto auxiliar branco, títulos alternando branco/laranja para dar hierarquia. Cada grupo da coluna direita ganha de dois a três círculos laranja com pictogramas SVG brancos, compondo blocos próximos à referência enviada. Os ícones representam plataformas e práticas por ilustração vetorial local, sem afirmar que são logos oficiais. Ajustar tamanho para desktop, tablet e mobile; manter conteúdo textual e contrastes.

**Seção 01:** os seis cards de histórico profissional recebem interação na superfície inteira, com fundo sutil alaranjado, linha de acento à esquerda, título em laranja-escuro e foco visível. Não aplicar esse estilo à fotografia nem aos cinco cards temáticos (que mantêm o hover anterior).

**Contato:** títulos de canais e valores são brancos ao passar o cursor ou focalizar o link; o fundo laranja, o texto secundário e o ícone de seta permanecem.

## Verificação manual: experiências, depoimentos e contato (28/10/2026)

O volume da coluna de experiências é editorialmente controlado: até seis itens visíveis como composição padrão, com os excedentes ocultos no CMS, nunca descartados. Os depoimentos usam cards quadrados uniformes (3 colunas × 2 linhas desktop), texto com truncamento em linhas e expansão sob clique/teclado; o card expandido ocupa duas linhas e a grade reacomoda os demais. A identificação **fictícia** dos dois exemplos é explícita.

Contato passa a ter três colunas: chamada à esquerda, retrato central de altura disponível, links à direita; assinatura e localização compõem faixa de rodapé. As setas dos links ocupam coluna própria, sem cobrir URLs. No mobile a foto, os links e o rodapé permanecem acessíveis em fluxo vertical.

## Media framing contextual — revisão manual (28/10/2026)

O CMS exibe dimensões esperadas **como referência de composição**, não como redimensionamento automático: herói e foto de Contato aproximadamente 900×1200 (3:4), miniquadros 600×600 (1:1), foto central de Olá! aproximadamente 900×1200 (3:4), logos quadrados aproximadamente 400×400, slides de experiência 900×1000 (9:10) e Open Graph 1200×630. Uma janela com prévia de proporção, X, Y e zoom aplica apenas o recorte de apresentação por área. Fotos e logos originais preservados; arquivos do Storage não são processados. As seções editoriais especiais mantêm composição/efeitos fixos; os controles correspondentes permanecem desabilitados na UI em vez de produzir alterações falsas.
