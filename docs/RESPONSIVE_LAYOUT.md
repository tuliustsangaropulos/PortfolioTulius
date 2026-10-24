# Layout responsivo

Desktop (≥768px) apresenta cada seção como painel com `min-height: 100svh`, grid editorial e overflow natural. Mobile renderiza A e B sequencialmente: 14 seções × 2 = 28 painéis.

O perfil A reproduz nome monumental, faixa profissional, retrato, +15 anos, selo e destaques. O perfil B mantém cinco áreas no arranjo 3+2 e seis organizações em coluna.

Painéis usam `scroll-snap-type: y proximity`; nunca `mandatory`. Conteúdo pode exceder a viewport. O header respeita safe areas, as âncoras usam `scroll-margin-top` e o breakpoint de 320px reflui métricas para uma coluna.

Matriz recomendada: 1920×1080, 1440×900, 1366×768, 768px, 390×844, 360×800, 320px e zoom 200%.
