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

## Seção 02 — direção editorial (26/10/2026)

Na área desktop da seção `sobre` (fundo laranja), preservar a introdução à esquerda e compor **imagem vertical central de ponta a ponta** e **três declarações em coluna à direita**, na ordem Comunicação de ponta a ponta / Visão editorial / Estratégia também é escuta. A foto padrão, já existente na biblioteca do repositório, é `tulius-contact.jpg` (Tulius com tablet), em escala de cinza sobre círculo branco, com enquadramento controlado por `object-fit` CSS. A fotografia do bloco A não se repete no card textual da direita. O conteúdo e a imagem continuam editáveis no CMS; a apresentação responsiva mobile permanece anterior.

Rever manualmente o recorte real da fotografia, a borda do círculo, a legibilidade do texto nas colunas e os viewports intermediários. Esta descrição é objetivo de implementação, não homologação visual.
