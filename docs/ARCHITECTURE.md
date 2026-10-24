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
