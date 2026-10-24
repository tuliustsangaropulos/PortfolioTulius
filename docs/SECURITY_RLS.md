# Segurança e RLS

Todas as tabelas expostas têm RLS. Anon e usuário autenticado comum leem somente registros publicados/visíveis. Políticas administrativas chamam `private.is_portfolio_admin(auth.uid())`, uma função `security definer` com `search_path` fixado e acesso mínimo.

`admin_users` não aceita autopromoção pela API. Buckets:

- `portfolio-public`: leitura pública; escrita apenas admin.
- `portfolio-private`: nenhuma leitura pública; CRUD apenas admin.

A chave publishable é apropriada ao cliente quando RLS está aplicada. Nunca adicione `service_role` a variáveis `VITE_*`.

`supabase/tests/rls.sql` executa asserções de leitura pública e bloqueio de escrita/autopromoção em transação. Os casos positivos de admin e Storage ainda exigem JWTs reais pela API. A migration não foi aplicada/testada remotamente nesta execução porque DDL exige autorização privilegiada.

Reorder, duplicação e publicação usam RPCs `security definer` que exigem `private.is_portfolio_admin`. Mudanças editoriais geram snapshots e audit logs por trigger.
