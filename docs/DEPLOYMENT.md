# Deploy

## Vercel

1. Importe o repositório.
2. Framework: Vite; install `pnpm install`; build `pnpm build`; output `dist`.
3. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. O arquivo `vercel.json` já configura rewrite SPA e cache de assets.
5. Valide `/`, `/admin/login`, `/admin/preview`, 404, assets e deep links.

## Situação atual (25/10/2026)

O projeto já está publicado em **https://tulius.work/** na Vercel, sob `portfolio-tulius` na equipe `tuliustsangaropulos-creates-projects`, com integração GitHub `main` → production. O deployment automático foi verificado no P3.

O build gera HTML SEO estático, `robots.txt` e `sitemap.xml`. Rotas `/admin` e `/admin/*` recebem `X-Robots-Tag: noindex, nofollow, noarchive`. Mudanças no SEO armazenadas pelo CMS não reescrevem HTML do deployment já publicado: o conteúdo estático só reflete novos dados após build/deploy.

O CMS e o schema Supabase estão presentes; **não reaplique o arquivo de baseline inicial de forma indiscriminada**. O histórico e as pendências de homologação, performance mobile, Storage e aprovações editoriais constam em `docs/P3_FECHAMENTO.md`.

Validar antes de cada publicação: `pnpm check`, `pnpm smoke:build`, domínio, acessibilidade, rotas protegidas e o workflow Lighthouse para alterações visuais. Não alterar DNS já funcional apenas por recomendações opcionais do provedor.
