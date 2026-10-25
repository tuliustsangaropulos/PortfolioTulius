# Segurança e RLS

Todas as tabelas expostas têm RLS. Anon e usuário autenticado comum leem somente registros publicados/visíveis. Políticas administrativas chamam `private.is_portfolio_admin(auth.uid())`, uma função `security definer` com `search_path` fixado e acesso mínimo.

`admin_users` não aceita autopromoção pela API. Buckets:

- `portfolio-public`: leitura pública; escrita apenas admin.
- `portfolio-private`: nenhuma leitura pública; CRUD apenas admin.

A chave publishable é apropriada ao cliente quando RLS está aplicada. Nunca adicione `service_role` a variáveis `VITE_*`.

`supabase/tests/rls.sql` executa asserções de leitura pública e bloqueio de escrita/autopromoção em transação. Os casos positivos de admin e Storage ainda exigem JWTs reais pela API. A migration não foi aplicada/testada remotamente nesta execução porque DDL exige autorização privilegiada.

Reorder, duplicação e publicação usam RPCs `security definer` que exigem `private.is_portfolio_admin`. Mudanças editoriais geram snapshots e audit logs por trigger.

## Revisão P3.1 (25/10/2026)

- Migration remota `20261025203559_p3_revoke_excess_table_privileges` remove `TRUNCATE`, `TRIGGER` e `REFERENCES` de `anon` e `authenticated` nas 22 tabelas públicas. RLS não cobre `TRUNCATE`; permissões `SELECT/INSERT/UPDATE/DELETE` permanecem sujeitas a RLS.
- Verificado em transações `READ ONLY` e com identidade JWT **simulada via claim de sessão SQL**: usuário autenticado não administrador enxerga zero registros de `admin_users`/`editorial_issues`; 14 seções publicadas visíveis. Seis RPCs administrativas falham com `portfolio_admin_required`; identidade do administrador existente acessa 1 vínculo administrativo e 9 pendências. Não equivale a um JWT real emitido pelo Auth.
- Permanecem alertas do Security Advisor: seis RPCs `SECURITY DEFINER` executáveis pelo papel `authenticated` (esperado, todas verificam `private.require_portfolio_admin()`) e *leaked password protection* desativada (habilitação manual pendente no Auth).
- Há somente um usuário Auth, vinculado a um administrador. Não foi criada conta adicional e não foi executado CRUD produtivo de CMS/Storage para não modificar dados reais.
- A baseline `202610220001_portfolio_cms.sql` existe em Git, mas não consta como versão aplicada no histórico remoto; o schema já existe. Não reaplicar sem plano explícito.
