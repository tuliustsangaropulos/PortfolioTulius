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

## Complemento de homologação (25/10/2026)

Suite SQL reversível sob papel `authenticated` e UID administrativo simulado executou com êxito criação de seção com 3 painéis, edição atômica de blocos/placements, publicação, duplicação, troca de ordem, rejeição de placeholder, SEO atômico e gravação de histórico/auditoria. Um `ROLLBACK` final preservou os dados reais. Metadados temporários em `storage.objects` validaram isolamento de leitura e bloqueio de escrita de não admin; **não houve upload/download de bytes nem JWT verdadeiro**. Resultado pós-transação: 14 seções, 42 painéis, 28 blocos, 56 placements, 0 objetos e 0 `media_assets`.

**Vulnerabilidade operacional externa ao RLS:** PAT pessoal encontrado no plano histórico público, removido do texto atual (commit `cd61f600`). Revogação no Supabase Dashboard permanece **urgente e não verificada**, pois o histórico público ainda contém a credencial e a integração não permite revogá-la.

**Leaked Password Protection:** Supabase org está no plano Free; a funcionalidade exige Pro ou superior e está desativada. Não atualizar cobrança sem aceite expresso. Manter senha forte e MFA para conta admin como medidas imediatas complementares.

## Decisão expressa do proprietário — 25/10/2026

O proprietário determinou **não revogar o token pessoal Supabase anteriormente exposto** e **não ativar o recurso Leaked Password Protection**. Estas duas ações ficam **fora do escopo**, por decisão do proprietário, e não devem ser novamente solicitadas como condição de avanço de P4/P5/P6, salvo nova orientação expressa. Nenhuma revogação, ativação ou upgrade foi realizada por esta decisão.

Esta decisão **não demonstra que o token exposto seja seguro**: caso ainda esteja válido, permanece o risco de uso não autorizado, inclusive porque versões históricas do Git podem conter a credencial. Também permanece desativada a checagem de senhas comprometidas. A decisão do proprietário registra aceitação de prosseguir sem essas duas medidas, **não** aprovação técnica do risco ou resolução dos avisos de segurança.

Prosseguir com P4/P5/P6 sem alterar essa escolha; registrar em relatórios futuros como **risco aceito, não corrigido**, sem cobranças repetidas.
