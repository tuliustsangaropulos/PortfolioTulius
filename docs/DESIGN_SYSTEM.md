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
