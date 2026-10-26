# Arquitetura

## Camadas

1. `src/components/public`: shell editorial, navegação, renderer e padrões de card.
2. `src/components/admin`: autenticação, proteção por papel e CMS.
3. `src/hooks/usePortfolio.ts`: consulta Supabase e adaptação para o modelo de apresentação.
4. `src/content/fallback.ts`: bootstrap editorial versionado; não substitui a fonte persistente após a migration.
5. `src/lib/supabase.ts`: cliente público e verificação de associação administrativa.
6. `supabase/`: schema, RLS, Storage, seed e roteiro de testes.

React Router opera em Data Mode com `RouterProvider`. O site público usa âncoras; páginas administrativas e 404 usam rotas.

## Fluxo de dados

`sections` é a unidade lógica. Os mesmos `content_blocks` são associados por `block_placements` aos painéis desktop/mobile A/mobile B. O campo `mobile_panel` mantém compatibilidade direta com o renderer. A publicação transacional exige conteúdo e pode bloquear placeholders; o visitante não recebe drafts por RLS.

O fallback só é usado quando a consulta falha ou o schema ainda não existe. Esse estado é explicitado no admin. Não há chave `service_role` no bundle.

## Limitações deliberadas

- Vite é SPA; o HTML principal é indexável, mas SSR/prerender deve ser considerado após definir domínio e plataforma final.
- Edição de layout/motion usa catálogo allowlisted, não CSS/JS arbitrário.
- O painel lista revisões e pendências; restauração granular permanece evolução futura.
- O admin é carregado em chunk separado. O bundle público ainda recebe aviso de tamanho e pode ser dividido adicionalmente.

## Navegação editorial configurável da abertura

`src/components/public/PublicSite.tsx` transforma os primeiros cinco itens do bloco `perfil` / painel B em links internos (<a href="#slug">) no desktop e no painel B mobile. `src/lib/validation.ts` resolve `targetSlug` exclusivamente contra seções efetivamente publicadas/visíveis; na ausência de campo, usa `resultados`. Os demais `ItemCard` e links de contato mantêm comportamento anterior. O CMS administra `targetSlug` dentro do conteúdo JSONB com `save_content_block_atomic`; não há chamada SQL nova nem alteração em `navigation_items`. A navegação por âncora usa o scroll nativo/suave (com suporte a movimento reduzido).

## Renderização especial da seção `sobre` (26/10/2026)

`src/components/public/PublicSite.tsx` aplica `AboutDesktop` apenas quando `section.slug === "sobre"`, mantendo o fluxo de `MobilePanel` sem alterações. O componente usa `section.desktopPanelA ?? section.panelA` e `section.desktopPanelB ?? section.panelB`: renderiza imagem central por `ContentItem.aboutDesktopImage` com fallback ao asset versionado, e declarações à direita como `[...itemsB, ...itemsA]`. O item da esquerda reaparece **somente como texto** à direita, por apresentação sem `image`, não por duplicação de `content_blocks`. A coluna esquerda segue `sections.title/eyebrow/intro` do CMS.

Os overrides `aboutDesktopImage` e `aboutDesktopAlt` pertencem ao JSONB do bloco existente. `src/lib/validation.ts` aplica allowlist de URL de mídia e alt personalizado. Não houve DDL, novo endpoint público, permissão adicional, mudança de RLS ou alteração na ordem dos dados armazenados.
