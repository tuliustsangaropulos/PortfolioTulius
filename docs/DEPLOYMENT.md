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

## Atualização operacional de 26/10/2026 — validação não é publicação

**Estado conferido antes desta revisão documental:**
- Repositório GitHub `main`: `52a5b61bfde881c05a67bc3d7fa665eb26f1182f`; workflow **Validate PortfolioTulius** aprovado no run [40277484553](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40277484553) (formatação, TypeScript, testes e build).
- Vercel produção (`portfolio-tulius`): último deployment **READY** então identificado `dpl_frYDWCnqoMqeKHt3BjVBwQc7Z9FP`, com commit de origem **`382ec95f41fe35452602a7327e75a57565caeebf`**, anterior às alterações finais de Ferramentas, cards profissionais e Contato.
- Na tentativa de publicar novo deployment manual, a Vercel devolveu **HTTP 402** com código `api-deployments-free-per-day` (cota diária do plano). Não se alterou cobrança, conta, DNS ou projeto.
- Portanto, **CI aprovado na `main` não comprova deploy da mesma revisão**, e alterações editoriais gravadas no Supabase podem estar visíveis antes dos componentes CSS/React correspondentes.

**Para retomar a publicação quando houver quota:**
1. Conferir `main`, versão de produção e diferenças entre os SHAs; confirmar que o commit desejado inclui o CSS mobile corretivo da pilha de empregadores (`6cfe4d04` ou posterior) e os ajustes mais recentes de Ferramentas/Contato.
2. Executar `pnpm check` e `pnpm smoke:build` e revisar o resultado de `Validate PortfolioTulius` no commit efetivamente candidato à publicação.
3. Publicar pela integração GitHub/Vercel existente, **sem forçar alteração de plano ou novas credenciais**. Conferir deployment **READY**, o commit associado e o domínio/alias `tulius.work`; se falhar, manter a pendência aberta com o erro real.
4. Após a publicação, validar no navegador em desktop e mobile: Formação e Ferramentas com fundo escuro; seis experiências brancas e sobreposição apenas em desktop/tablet; seletor fixo e galeria; seis links da seção 01; hover dos links de Contato; seção 03 temática; menu e âncoras.
5. Conferir `/admin`, direitos de mídia, acessibilidade e teste de salvamento/revisão/rollback com sessão administrativa real; **não considerar homologado** com base só em validação SQL ou build. Verificar SEO estático após build quando forem alterados dados de SEO.

Os documentos `docs/OPEN_ISSUES.md` e `docs/ESTADO_ATUAL_AUDITORIA_2026-10-25.md` reúnem as pendências e a separação entre código, conteúdo e produção. Este registro é uma fotografia de 26/10/2026: futuros deployments devem acrescentar nova evidência em vez de substituir o histórico.

