# PortfolioTulius — Auditoria cruzada e continuidade operacional

> **Conferência:** 25/10/2026. **Escopo:** GitHub, Supabase e Vercel por conectores autenticados, sem alteração de código, banco, conteúdo ou configuração dos serviços.
>
> **Repositório:** https://github.com/tuliustsangaropulos/PortfolioTulius
>
> **Snapshot ANTERIOR à inclusão deste relatório:** `main` em `9fac3c0e0eeae6f9df8b10c7c1cd7bb2e9c0fba3`. O commit documental que incluir este arquivo passará a ser o novo HEAD; o SHA anterior continua como referência da implementação auditada.
>
> **Regra de precedência:** aplicação e infraestrutura atuais > verificações recentes > seções atualizadas dos documentos de 25/10 > registros históricos de 24/10. Este relatório complementa, não substitui, `docs/P4_P5_P6_FECHAMENTO.md`, `docs/OPEN_ISSUES.md` e as cinco fontes do projeto ChatGPT.

## 1. Resultado de conferência

| Área | Verificado em 25/10 | Limite |
|---|---|---|
| GitHub | Repositório **público**, branch principal `main`, HEAD `9fac3c0e0` antes deste relatório. | Checkout e eventuais alterações **locais** do proprietário não são acessíveis pelos conectores. |
| GitHub Actions | [Validate run 40238808037](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40238808037): **success**. [Audit P3 Lighthouse run 40238529882](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40238529882): **success**. | Essas execuções verificam os respectivos SHAs; commits documentais posteriores podem gerar outra execução. |
| Vercel | Projeto `portfolio-tulius`, equipe `tuliustsangaropulos-creates-projects`, Vite, Node 24.x. Deployment `dpl_GqwnYiM3g5WgdgxSCjbMwTouxZR5`: **READY**, production, SHA `9fac3c0e0`. | Novo commit em `main` pode iniciar automaticamente novo deployment; conferir o SHA publicado após cada push. |
| Domínios | `tulius.work` e `www.tulius.work` associados ao projeto com `verified=true`. | Não houve teste visual humano nem validação em segunda rede/dispositivo real nesta auditoria. |
| Variáveis Vercel | `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` presentes em Development, Preview e Production (somente nomes e targets verificados). | Valores mantidos protegidos; não houve leitura, rotação nem reconfiguração. |
| Supabase | Projeto `zfnrhzplwpjpdljraypt` (`portfolio`), `ACTIVE_HEALTHY`. **22** tabelas públicas com RLS em **22/22**; **14** seções; **42** painéis; **28** blocos; **56** placements; **9** pendências editoriais. | Consultas de contagem não validam fluxos autenticados do CMS. |
| Auth e Storage | **1** usuário Auth; **1** administrador; **2** buckets; **0** objetos armazenados. **0** Edge Functions implantadas. | Não criar usuários de teste; testes de upload/download com JWT admin real ainda não foram feitos. |
| Migrations | P0 (`20261024044005`, `20261024051406`, `20261024052156`), P1 (`20261024060432`) e P3.1 (`20261025203559`) registradas. | Baseline inicial `202610220001_portfolio_cms.sql` existe em Git mas não no histórico remoto: **não reaplicar**. |
| Observabilidade Vercel | Nenhum agrupamento de erros de runtime encontrado na janela consultada de 24 horas. | Aplicação estática pode ter erros apenas no navegador, invisíveis nesse indicador. |

## 2. Advisors do Supabase — achados ainda abertos

**Segurança:** 6 ocorrências de [RPCs `SECURITY DEFINER` executáveis por `authenticated`](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable). O acesso ao papel `authenticated` é esperado para o CMS, mas a presença de guardas internas precisa continuar sendo testada com JWT real; o aviso isolado não prova falha explorável. Há 1 aviso de [Leaked Password Protection desativada](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

**Desempenho:** 9 ocorrências de [FKs sem índices de cobertura](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys), 23 ocorrências de [avaliações de Auth/RLS por linha](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan), 2 [índices ainda não utilizados](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index) e 19 ocorrências de [políticas permissivas múltiplas](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies). São avisos de otimização; **não** aplicar índices/DDL nem reescrever RLS apenas para eliminar alertas sem revisão de impacto, plano de rollback e autorização.

**Decisões já registradas do proprietário:** não revogar o PAT Supabase historicamente exposto e não ativar Leaked Password Protection. Ambas permanecem classificadas como **riscos aceitos, não corrigidos**. Não reiterar como condicionantes para a homologação nem reverter essas escolhas sem nova instrução expressa.

## 3. Evidências automatizadas e validade temporal

- `p4-editorial-42-panels` e `p3-viewport-screenshots` do [run 40238529882](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40238529882) disponíveis na consulta; **expiram em 01/11/2026**. Baixar cópias locais antes do vencimento se forem úteis como base visual de comparação.
- `p6-lighthouse-json` do mesmo run disponível; **expira em 08/11/2026**.
- Última medição Lighthouse **registrada no ciclo anterior**: mobile Performance 73 / LCP 4,52 s; desktop Performance 97 / LCP 1,20 s; Accessibility, Best Practices e SEO em 100 em ambos. Não foi executado novo Lighthouse nesta auditoria.
- A suíte `P5 Admin Read-Only E2E` existe, mas **não há comprovação de execução com sessão JWT admin real**. Requer Secrets `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD`, configurados pelo proprietário em ambiente protegido; não transcrever senhas em chats, arquivos ou logs.
- Não houve testes de escrita/admin, upload, edição do CMS, alteração de banco, mudança de DNS ou deploy manual nesta auditoria.

## 4. O que os conectores podem resolver sem intervenção de interface

**Já executado (somente leitura):** comparação de repositório, branch e commit, verificação de workflows, verificação de deploy/domínios/nomes de variáveis, consultas agregadas ao Supabase, lista de migrations, inventário de funções e advisors e consulta aos erros de runtime.

**Automatizável com solicitação específica ou preparação:** repetir auditorias e análises estáticas; propor ajustes pontuais de documentação, testes e código com revisão e CI; testar leitura pública e navegação pela suíte existente; executar a suíte administrativa read-only **depois** da configuração segura dos Secrets. Mudanças em código na `main` podem publicar o site, e alterações de RLS/DDL/Storage/produção exigem autorização pontual e plano de verificação.

**Não automatizar nesta etapa:** alterar conteúdo editorial, revogar PAT, ativar proteção contra senhas vazadas, criar usuários, reaplicar migrations ou seed, alterar DNS, atualizar segurança/índices sem medição, editar layout ou fazer testes destrutivos em produção.

## 5. Checklist manual do proprietário — ordem sugerida

- [ ] **Antes de 01/11:** baixar e arquivar os PNGs das 42 composições e 8 viewports no Actions; antes de 08/11, guardar JSON Lighthouse se necessário.
- [ ] **Referências:** conservar PDFs/Canva/Figma final, imagens originais e capturas que porventura só existam nos chats anteriores; fontes `.md` não substituem os anexos visuais originais.
- [ ] **Site público:** abrir `https://tulius.work/` em desktop e celular reais e comparar as 14 seções e os 28 painéis mobile com os layouts aprovados, em especial a coluna esquerda do primeiro hero e a **preservação da direita**.
- [ ] **Acessibilidade/UX:** verificar zoom nativo de 200%, telas baixas e 320 px, menu com teclado/Tab/Escape, foco, âncoras/Voltar, contraste, toque, rolagem e movimento reduzido.
- [ ] **Admin read-only:** entrar em `/admin/login`, conferir autenticação, oito módulos, preview, sessão e logout, **sem editar conteúdo real**; decidir se configura Secrets para automatizar depois esse teste.
- [ ] **CMS transacional em fixture descartável:** somente após definir backup/restauração e autorizar, testar gravação, publicação, visibilidade desktop/mobile, SEO/redeploy, permissões e retorno dos dados à situação original.
- [ ] **Mídia:** testar upload/download/publicação/substituição/alt/créditos com arquivo descartável, preservando Storage real. Atualmente há zero objetos.
- [ ] **Editorial:** resolver as 9 divergências registradas em `docs/OPEN_ISSUES.md` e validar licenças das imagens/fontes; não substituir placeholders por realizações fictícias.
- [ ] **Operação local:** no VS Code/PowerShell verificar `git status -sb` antes de qualquer pull; depois de sincronizar, executar `pnpm.cmd check` e `pnpm.cmd smoke:build` quando necessário.
- [ ] **Fechamento:** registrar apenas problemas demonstrados; realizar correções pequenas, sem redesign espontâneo. Evitar iniciar modificações visuais enquanto a homologação do proprietário estiver em andamento.

## 6. Fontes de continuidade

As cinco fontes de projeto documentam: (1) contexto de produto e design; (2) configuração de ambiente; (3) histórico de correções; (4) plano e continuidade P3; (5) inventário GitHub fixo no SHA anterior. Elas são registros versionados e contêm trechos históricos preservados. **Este relatório é o índice operacional mais recente das conferências feitas por conectores em 25/10**, não uma cópia do código, do banco ou das referências visuais.

O usuário pode remover os chats antigos **depois de preservar quaisquer anexos/imagens ou decisões que não estejam nas fontes**. A remoção de conversas não atualiza automaticamente os anexos de fontes do projeto; é necessário anexar a cópia deste relatório como nova fonte quando desejado.
