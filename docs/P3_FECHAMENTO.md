# P3 — Fechamento técnico e pendências de homologação

Data: **25/10/2026** · Projeto: **PortfolioTulius** · Branch única: **`main`** · Site: **https://tulius.work/**.

## Decisão de escopo e integridade

P3 executada como estabilização, segurança, validação funcional não destrutiva, Lighthouse, regressão e documentação. **Não equivale a homologação de escrita com credenciais administrativas**, comparação visual humana com Figma/PDF ou aprovação editorial. Essas etapas exigem contexto autorizado que não deve ser fabricado. Não foram criados usuários, modificados textos editoriais, feitos uploads reais, alterados DNS nem reaplicada a baseline.

## P3.1 — Segurança

- Supabase: 22/22 tabelas públicas com RLS habilitado; Auth com **1 administrador, 0 outros usuários**; buckets `portfolio-public` (público) e `portfolio-private` (privado), ambos sem objetos na revisão.
- Executada a migration `20261025203559_p3_revoke_excess_table_privileges` (arquivo versionado em `supabase/migrations/`). `TRUNCATE/TRIGGER/REFERENCES` revogados de `anon` e `authenticated` nas 22 tabelas, mantendo DML sob RLS. Estado conferido após a aplicação: 14 seções, 28 blocos, 9 pendências editoriais e 1 administrador.
- Teste simulado do papel `authenticated` com claim de usuário não cadastrado em transação `READ ONLY`: acesso a 14 seções publicadas, zero a administradores e pendências. **6 de 6 RPCs administrativas retornaram `portfolio_admin_required`**, com transação revertida. Teste simulado do administrador existente: acesso a um vínculo, 9 pendências e 14 seções.
- **Limites:** testes SQL com claim simulada não substituem JWT real/Storage E2E. Security Advisor mantém 6 alertas de RPC `SECURITY DEFINER` por desenho intencional com guarda administrativa explícita. `Leaked Password Protection` está desativada e depende de configuração Auth manual. Inventário de grants já corrigido; a avaliação de 9 índices FK e políticas RLS não otimizadas fica para ciclo de performance de banco, sem urgência provada pela carga atual.
- Histórico remoto de migrations não relaciona a baseline inicial `202610220001_portfolio_cms.sql`, apesar do schema instalado. Não a executar novamente.

## P3.2 — CMS

- Homologação informada pelo proprietário: login administrativo, navegação dos módulos, prévia protegida e logout aprovados. `/admin` e `/admin/preview` sem autenticação foram redirecionados para `/admin/login` em navegador automatizado.
- Corrigido o dashboard: quantidade de seções e pendências editoriais com consulta dinâmica, estado real do Supabase e mensagem de erro atualizada. Tratamento de erro no guard agora nega acesso se a verificação falhar.
- **Não executado:** operações de salvar/duplicar/arquivar/publicar/rollback, upload e substituição de mídia, checagem E2E com sessão administrativa JWT real; são operações persistentes em produção, e não há credenciais da sessão via integração. Homologar em cenário reversível, com snapshot e limpeza.
- SEO do CMS pode variar dinamicamente no banco, mas metadados HTML são gerados no build da Vercel. Mudanças editoriais de SEO exigem novo deployment para refletir no HTML publicado.

## P3.3 — UI, responsividade e acessibilidade

- Auditoria automatizada via `scripts/p3-browser-smoke.mjs` e workflow `.github/workflows/audit-p3-lighthouse.yml`: 14 seções e 28 painéis, desktop 1920×1080/1440×900/1366×768, mobile 390×844/360×800/320×700, além de 768×1024 e 720×450 para inspeção de tela estreita. O teste de 720 CSS px **não é** equivalente perfeito a zoom nativo de 200%.
- Menu testado por teclado: Escape fecha, foco retorna ao botão; `prefers-reduced-motion` detectado. Capturas de tela anexadas como artifact nos runs, com retenção de sete dias.
- Corrigidos nomes acessíveis, semântica de SVG, heading order, contrastes e overflow de contatos mobile; Lighthouse atingiu **100/100 em acessibilidade** nos perfis mobile e desktop.
- **Pendente:** comparar visualmente cada painel com a referência original e verificar zoom nativo de 200% e leitores de tela reais. Qualquer overflow residual em 768 px deverá ser resolvido antes de declarar a matriz completa aprovada.

## P3.4 — Lighthouse e SEO

- Lighthouse 13.5.0 em produção, móvel e desktop: **100/100 em acessibilidade, boas práticas e SEO** nas execuções recentes. Performance desktop tipicamente 96–99; mobile variou significativamente nas execuções (aprox. 60–84). O LCP mobile permaneceu em torno de **4,1–4,7 s** sob emulação de laboratório; manter otimização mobile como backlog explícito, sem prometer metas não aprovadas.
- Canonical, títulos, robots e sitemap verificados. A rota exata `/admin`, além de `/admin/*`, recebe agora cabeçalho `X-Robots-Tag: noindex`; `robots.txt` também cobre as duas formas.
- Core Web Vitals de campo e INP real não foram medidos; Lighthouse não substitui dados de usuários. Os scores variam com rede/CPU no runner.

## P3.5 — Regressão e CI

- `.github/workflows/validate.yml`: `pnpm format:check`, `pnpm typecheck`, `pnpm test` (**21 testes**) e `pnpm build`, mais `pnpm smoke:build`.
- `.github/workflows/audit-p3-lighthouse.yml`: `node scripts/smoke-production.mjs`, Lighthouse mobile/desktop, rotas anônimas, menu/foco/motion e matriz de viewports, screenshots como artifact.
- Em cada commit, checar conclusão de ambos os workflows e estado READY da Vercel. `main` é a única branch de trabalho; não fazer force push.

## P3.6 — Fechamento e aceites remanescentes

**Concluível tecnicamente:** código/CI, isolamento SQL simulado, restrição de grants e SEO, métricas Lighthouse e diagnóstico automatizado de viewport; documentação presente.

**Aceite pendente do proprietário:** (1) ativação da proteção contra senhas vazadas no Auth; (2) operações reais de CRUD/publicação/reversão/Storage com o administrador; (3) validação visual/zoom de 200% e revisão da seção hero; (4) decisões sobre nove pendências editoriais listadas em `docs/OPEN_ISSUES.md`. Performance mobile e avisos de otimização de banco são melhorias posteriores com orçamento/escopo próprio, não falhas de autorização comprovadas.

## Referências reprodutíveis

- Repositório: https://github.com/tuliustsangaropulos/PortfolioTulius
- CI: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/validate.yml
- Auditoria: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/workflows/audit-p3-lighthouse.yml
- Supabase Security Advisor: https://supabase.com/docs/guides/database/database-linter
- Ativação de proteção contra senhas vazadas: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

Para reproduzir localmente (PowerShell, sem ler segredos):

```powershell
git pull --ff-only origin main
pnpm.cmd check
pnpm.cmd smoke:build
pnpm.cmd smoke:prod
git status -sb
```
