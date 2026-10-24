# Deploy

## Vercel

1. Importe o repositório.
2. Framework: Vite; install `pnpm install`; build `pnpm build`; output `dist`.
3. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. O arquivo `vercel.json` já configura rewrite SPA e cache de assets.
5. Valide `/`, `/admin/login`, `/admin/preview`, 404, assets e deep links.

O projeto não foi publicado nesta execução. Após definir domínio, ajuste canonical/robots e uma imagem Open Graph aprovada pelo editor SEO. O preview Figma permanece `noindex` pela configuração da plataforma.

Antes do deploy: aplicar migration/seed, executar testes RLS, resolver pendências editoriais, revisar créditos e testar todos os viewports.
