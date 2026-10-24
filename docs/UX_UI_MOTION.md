# UX, interação e motion

Reveals usam opacity/transform, cerca de 520ms. Drawer usa 250ms; setas deslocam 4px. `IntersectionObserver` ativa conteúdo ao entrar em tela, sem interceptar a rolagem.

`prefers-reduced-motion` desliga scroll suave, snap e transições. O menu fecha com Escape, clique externo ou destino, bloqueia apenas o body enquanto aberto e mantém controles focáveis.

Próxima evolução do CMS: persistir os parâmetros completos de `motion_config` já modelados em `block_placements`.
