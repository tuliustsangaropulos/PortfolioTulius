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


## 7. Execução solicitada pelo proprietário — otimização e homologação controlada (25/10/2026)

**Autorização nesta etapa:** o proprietário solicitou executar (i) P5 admin read-only com JWT real, (ii) otimização de RLS/índices e (iii) homologação de CRUD, Storage e publicação com uso dos conectores. A execução abaixo distingue os testes possíveis via conector de SQL dos que exigem sessão JWT e navegador.

### Otimização de banco — executada em produção

- Migration remota `20261025230446_p7_admin_rls_initplan_fk_indexes`, versionada em [`supabase/migrations/20261025230446_p7_admin_rls_initplan_fk_indexes.sql`](../supabase/migrations/20261025230446_p7_admin_rls_initplan_fk_indexes.sql).
- **22 políticas** `public.* / admin full access` e **1 política** de `storage.objects` mantêm os mesmos papéis e condições de autorização, mas avaliam `private.is_portfolio_admin((select auth.uid()))` em subconsulta por instrução SQL, evitando reavaliação por linha.
- **9 novos índices btree**, sem unicidade e sem alteração de dados, cobrem as FKs: `audit_logs.user_id`, `block_placements.panel_id`, `content_blocks.media_id`, `content_revisions.actor_user_id`, `editorial_issues.section_id`, `metrics.section_id`, `portfolio_projects.experience_id`, `site_settings.favicon_media_id` e `testimonials.photo_media_id`.
- Migration remota `20261025230528_p7_admin_users_own_select_initplan`, versionada em [`supabase/migrations/20261025230528_p7_admin_users_own_select_initplan.sql`](../supabase/migrations/20261025230528_p7_admin_users_own_select_initplan.sql): política `owner may read own admin membership` continua impondo `user_id = auth.uid()`, mas com `(select auth.uid())` avaliado por instrução.
- Os arquivos foram gravados diretamente na `main` conforme a regra de trabalho, e as duas versões **já constam no histórico remoto**. Não reaplicá-las.

**Performance Advisor antes/depois:** 23 → **0** avisos `auth_rls_initplan`; 9 → **0** FKs sem índice. Permanecem **19 avisos `multiple_permissive_policies`** (OR entre leitura pública e leitura administrativa deliberada) e **10 avisos `unused_index`** após a última leitura (estatística contextual, podendo incluir índices recém-criados). Não desabilitar leitura publicada por usuários autenticados nem eliminar índices automaticamente para suprimir avisos. Security Advisor permanece com **6 alertas sobre RPCs `SECURITY DEFINER` para `authenticated`** e **1 aviso de proteção contra senhas vazadas desativada**; não foi alterada a decisão de risco aceito.

### Testes de autorização e CRUD/publicação — executados com ROLLBACK

1. Em transação: identidade `anon` consultou 14 seções públicas e zero `admin_users`/`editorial_issues`/objetos privados.
2. Identidade `authenticated` não administradora **simulada por claim SQL**, sem criar usuário Auth: leitura das seções publicadas; nenhuma leitura de administradores, revisões ou pendências editoriais; chamada de `create_section_with_panels` bloqueada por autorização. **PASS**.
3. Identidade de administrador **simulada na sessão SQL** utilizando o único vínculo já cadastrado: criação de seção descartável com seus três painéis, criação de bloco e placements, gravação pela RPC `save_content_block_atomic`, publicação pela RPC `publish_section`, leitura posterior da seção/bloco como `anon`. **PASS**. A transação foi encerrada com **`ROLLBACK`**, sem alterar o conteúdo existente.
4. Isolamento de Storage **apenas na camada de metadados SQL**: administrador simulado inseriu objetos temporários nos buckets público/privado dentro de transação; `anon` acessou somente o registro público; usuário comum simulado não leu nem atualizou o privado. **PASS**, com **`ROLLBACK`**.
5. Conferência posterior confirmou que ficaram **14 seções, 42 painéis, 28 blocos, 56 placements, 9 pendências, 2 revisões, 2 audit logs e 0 objetos Storage**. Nenhum arquivo foi de fato enviado à API de Storage.

**Limites — não marcar como homologados:** os testes SQL usam simulação de identidade, não JWT real emitido pelo Auth; não comprovam login, cookies, sessão, UI dos oito módulos, persistência real no browser, upload/download de bytes ou restauração pelo CMS.

### P5 com JWT real — preparado, não executado

O workflow [`P5 Admin Read-Only E2E`](../.github/workflows/p5-admin-readonly.yml) exige os Secrets `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD`. Os conectores disponíveis nesta sessão não disponibilizam disparo autenticado do `workflow_dispatch`, nem credenciais/sessão do usuário para executar esse teste. Não foi criada conta de teste, nem houve solicitação de exposição de senha. Para executar, o proprietário deve cadastrar os dois Secrets no GitHub (Settings → Secrets and variables → Actions) e usar Actions → P5 Admin Read-Only E2E → Run workflow, ou disponibilizar um método autorizado que permita ao agente acionar o workflow sem acessar o valor das credenciais. O usuário deve conferir o resultado real antes de dar aceite.

### Reversão das otimizações (somente se comprovadamente necessária)

As condições originais das políticas administrativas eram `private.is_portfolio_admin(auth.uid())` em `USING` e `WITH CHECK`, o predicado de Storage usava o mesmo verificador combinado aos buckets e a leitura própria de `admin_users` era `user_id = auth.uid()`. Reverter apenas com migration nova, leitura da versão vigente e testes de autorização. Os nove índices têm nomes terminados em `_fk_idx`, especificados integralmente na migration; **não removê-los automaticamente**, especialmente se passarem a ter tráfego de leitura relevante.

**Próximo gate:** confirmar GitHub CI e Vercel `READY` no commit final de documentação, depois realizar P5 com JWT real, upload/download binário descartável e homologação visual/editorial pelo proprietário. Não transformar esta auditoria transacional em aceite da interface administrativa.

## 8. Atualização posterior — ajustes da seção 01 (25/10/2026, horário do proprietário)

**Natureza:** complementação ao snapshot P7 acima; não reescreve as conferências históricas nem as decisões de risco. O proprietário autorizou especificamente ajustar a navegação e a composição visual da abertura.

- GitHub `main`: alterações de UI da seção 01 após o SHA P7, incluindo cards de especialidades transformados em links com hover/foco, seletor de destino no CMS, texto e alinhamento do selo, animação da seta, correção de âncora para seção 02 e título “MENU” no drawer.
- Supabase `portfolio`: inspecionados os dois blocos da seção `perfil`. O bloco A tem cinco itens e o B tem onze; não existe `hero.badgeText` persistido para o primeiro item. Assim, a nova legenda utiliza o fallback de interface. `targetSlug` é um campo opcional nos itens do JSONB já existente, com destino padrão `resultados`. Não foi executado DDL, migration, update de conteúdo, modificação de permissões ou de RLS.
- Vercel: a integração GitHub → Production publicou os commits de código com `READY`; o último commit **exclusivamente de documentação** também dispara deploy automático e deve ser conferido no final. Não confundir `READY` com aprovação de TypeScript/Vitest ou teste visual real.
- Documentação em `README.md`, `docs/OPEN_ISSUES.md`, `docs/ADMIN_CMS.md`, `docs/CONTENT_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` e [relatório próprio desta etapa](CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md).

**Pendências de aceite:** executar a suíte e inspecionar visualmente as duas metades da primeira seção, inclusive selo não cortado, card hover/foco e a seta em diferentes alturas; depois realizar edição de destino com JWT administrativo real e validar a gravação da RPC. Não foi iniciada alteração na seção 02. Próximo ciclo: receber observações específicas dela do proprietário.

## 9. Atualização de 26/10/2026 — layout CMS da seção 02

**Objeto:** atualização do site `tulius.work` para a referência visual apresentada pelo proprietário: manter a coluna esquerda de `#sobre`, usar fotografia em altura integral no centro e exibir os três textos à direita, movendo `Estratégia também é escuta.` da composição central para a coluna de textos sem duplicar registros.

**Arquitetura:** `AboutDesktop` em `PublicSite.tsx` apenas para `sobre`. A imagem vem do asset já versionado `/media/tulius-contact.jpg` (foto de Tulius segurando um tablet), com campos de override opcionais `aboutDesktopImage/aboutDesktopAlt` no JSONB do item único do painel A. O texto do painel A é renderizado à direita após os dois itens do painel B, removendo a miniatura somente do renderer desktop. A apresentação mobile original e os campos da seção esquerda foram mantidos. CSS inclui enquadramento vertical, halo branco e máscara de silhueta para evitar o fundo preto retangular do JPG. **Sem modificação SQL, dados persistidos, RLS, Auth, Storage, DNS ou variáveis Vercel**.

**Verificação:** `Validate PortfolioTulius` aprovado no SHA `d6e1083` ([run 40263871192](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40263871192)), além de `Audit P3 Lighthouse` aprovado nesse SHA ([run 40263871173](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40263871173)). A auditoria P4 forneceu screenshots reais de 42 composições; a primeira inspeção mostrou retângulo preto de fundo da imagem e motivou os commits de recorte `1d277f60` e refinamento de posicionamento `ac15053c`. `Validate` e `Audit P3 Lighthouse` também passaram no SHA `1d277f60` ([run 40264613518](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40264613518), [run 40264612526](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40264612526)). O SHA posterior exige sua própria conferência final de CI/deploy.

**Pendente:** aceite visual do proprietário em diferentes resoluções e zoom, sobretudo recorte e centralização do sujeito; edição real de imagem/alt e dos textos no admin com sessão JWT e verificação da publicação. `READY` da Vercel e screenshot de auditoria não substituem esse aceite. Documentação detalhada em [`CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md`](CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md).

## 10. Continuidade de 26/10/2026 — conteúdo administrável da seção 02 e títulos da seção 03

Após as alterações estruturais da seção 02 registradas no item 9, o proprietário solicitou **cinco textos** editáveis em uma única lista: (1) Estratégia também é escuta.; (2) Comunicação de ponta a ponta; (3) Visão editorial; (4) Resultados que orientam decisões; (5) A voz de quem lidera. O `content_blocks` do painel A `sobre` mantém apenas dados da imagem (title técnico); todos os cinco textos foram publicados em `content_blocks` / painel B. O editor existente permite adicionar, editar, excluir e reordenar itens no mesmo bloco. O componente público reutiliza o primeiro item da lista ao lado da foto no mobile A, sem manter duas cópias.

Na seção 03 (`resultados`), o painel B agora contém exatamente as cinco especialidades da abertura. Os quatro indicadores do painel A permaneceram intactos. A pendência `XXXXX · X/Y/Z` foi resolvida no registro `editorial_issues`, com histórico preservado. O conteúdo publicado foi atualizado por **uma transação SQL com verificação dos valores anteriores**, sem DDL/RLS/migrations, e confirmado com uma leitura posterior dos quatro blocos das seções 02/03.

O fallback versionado e o código React/CMS foram atualizados; testes unitários foram acrescentados para a estrutura local. Esta atualização não altera o design da seção 01 nem os dados dos demais blocos. Não confundir ausência de alteração de schema com ausência de alteração de conteúdo — **houve alteração editorial intencional do banco**. Ver `docs/CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md`.

**Aceite administrativo:** adicionar/remover itens no CMS com sessão JWT real e rollback editorial permanecem pendentes de teste humano. Estado de CI e produção deve ser conferido no SHA final da etapa.
