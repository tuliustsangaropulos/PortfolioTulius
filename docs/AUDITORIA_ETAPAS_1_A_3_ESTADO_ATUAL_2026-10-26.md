# PortfolioTulius — verificação consolidada das etapas 1, 2 e 3

**Referência:** 26/10/2026, branch `main`. Este documento é o **índice operacional vigente**; os relatórios das etapas e outras notas históricas preservam sua época e não devem ser tratados isoladamente como fotografia atual.

## Matriz de implantação e comprovação

| Entrega | Implementação | Evidência e limite |
|---|---|---|
| Etapa 1 — checagem pública, QA e evidências | Concluída, read-only | [Audit histórico 40276635257](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40276635257): 8 viewports, 38 capturas, rotas/RLS anônimas; Lighthouse mobile 70, a11y 96 na medição original. |
| Etapa 2 — Auth/RLS/Storage/CMS | Auditoria read-only concluída | SQL com papéis simulados e transações somente leitura confirmou isolamento; não houve JWT administrativo nem operação real de mídia. |
| Etapa 3 — contraste, mídia e testes | Código e teste unitário aplicados | [Audit 40286141852](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40286141852): a11y **100/100** nos dois dispositivos; performance **75 mobile / 96 desktop**; LCP mobile ~4,51 s. |
| Etapa 3 — consolidação de textos | Aplicada no Supabase | `resultados/A`, `invest-rs/A` e `invest-rs/B` passaram a bloco validado; valores, títulos, temas e JSONB preservados. Item **Ativos visuais** continua pendente. |
| Etapa 3 — navegação | Corrigida no Supabase | 13 seções públicas, 13 itens de menu publicados e visíveis; 0 destino público inválido. |
| Etapa 3 — qualidade estática | Aprovada | [CI 40286577298](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40286577298), SHA `db22296`: TypeScript, formatação, **46/46 testes (7 arquivos)**, build e smoke. |
| Documentação | Relatórios das três etapas presentes em `docs/` | Veja links abaixo. Docs antigos e registro P4/P5/P6 de 25/10 são histórico; este documento resolve o ponto de entrada. |

## Estado de produção verificado antes desta reconciliação

- Supabase `zfnrhzplwpjpdljraypt`, estado `ACTIVE_HEALTHY`: 22 tabelas públicas com RLS, 14 seções cadastradas (13 visíveis), 42 painéis cadastrados, 28 blocos, 56 placements; 8 pendências abertas; 7 migrations remotas.
- Nenhum bloco com `is_placeholder=true`; **1 item dentro de um bloco** ainda tem `placeholder=true`: `invest-rs/B` → *Ativos visuais*. Nenhuma fotografia profissional no Storage / `media_assets`, 18 slides de texto de experiências sem imagens aprovadas.
- `content_revisions` = 2, `audit_logs` = 2. Edições SQL diretas não comprovam histórico da interface.
- Vercel: código final `e3bc828` teve deployment `READY` `dpl_7ZBcKc3zzs7pqjEQi3kgeMtF3HDu`. Última implantação `READY` observada antes deste índice: `dpl_BYKRKahC4coYLgY8dERtM5tUpJcV`, SHA `0389e54`. Comparação `0389e54..db22296`: apenas `docs/OPEN_ISSUES.md` e `docs/SECURITY_RLS.md` diferem, sem alteração de bundle.
- Auditoria Lighthouse P3 comprovou `9ac8eb5`, anterior às duas correções de wrapper de mídia (admin). O CSS de contraste validado foi mantido. Não confundir CI de `db22296` com execução de navegador naquele exato SHA.

## O que permanece comprovadamente pendente

1. **Admin com JWT real:** não encontrada execução do workflow manual `P5 Admin Read-Only E2E`; login, prévia, logout e CRUD/rollback em sessão real não estão homologados. Configurar somente Secrets do GitHub; nunca expor senha em documentação/chat.
2. **Storage real:** não há upload/download binário testado com autenticação; helper compensatório testado por mocks, sem transação distribuída; o editor ativo usa `EnhancedMediaLibrary`.
3. **Performance mobile:** LCP ~4,51 s; avaliar imagem responsiva e custo de JS com medição causal. Passar nos budgets de regressão não comprova Core Web Vitals de campo.
4. **Ativos visuais:** imagens e logotipos profissionais aprovados permanecem ausentes. Não substituir por fotos ilustrativas ou logos não autorizados.
5. **Segurança:** seis warnings de `SECURITY DEFINER`, concessões do schema `private` a revisar antes de DDL, 19 `multiple_permissive_policies`, 10 `unused_index` informativos. PAT histórico e leaked-password protection são riscos aceitos pelo proprietário, não corrigidos.
6. **Editorial:** oito pendências abertas exigem decisão humana com fontes originais. Nenhum texto/indicador foi inventado no fechamento.
7. **Validação visual manual:** zoom 200%, toque, leitor de tela, comparação pixel a pixel e fluxo editor/Storage reais permanecem pendentes.

## Evidências e documentação

- [Etapa 1 — homologação pública e Lighthouse histórico](ETAPA_1_HOMOLOGACAO_PUBLICA_2026-10-26.md)
- [Etapa 2 — CMS, RLS, Auth e Storage](ETAPA_2_AUDITORIA_CMS_SUPABASE_2026-10-26.md)
- [Etapa 3 — correções, conteúdo e regressão](ETAPA_3_AJUSTES_2026-10-26.md)
- [Segurança e decisões de risco](SECURITY_RLS.md)
- [CMS e fluxo editorial](ADMIN_CMS.md)
- [Pendências e histórico](OPEN_ISSUES.md)
- [Deploy e SHAs de produção](DEPLOYMENT.md)

## Verificação posterior do índice — auditoria automatizada de 26/10/2026

O commit `d3acbedb7dd3c91ce9b5aba77dadf2f705a9a130` foi publicado na Vercel como deployment `dpl_8byFb5ssDMgQW1RrVrWMeM4TrqRU` (`READY`) e teve [CI 40288148955](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148955) **aprovado**. O [Audit P3 Lighthouse 40288148755](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148755) também terminou **SUCCESS**, incluindo a checagem nova de navegação pública: **13 seções, 13 links publicados e visíveis, 0 destinos inválidos**, 0 registros administrativos lidos como visitante e nenhuma mutação. Interações de teclado/menu/Resultados/experiências e inspeção automatizada de 8 viewports e **38 capturas** passaram, sem `badPanels`.

**Lighthouse 13.5.0 desta execução:** mobile Performance **80**, Acessibilidade **100**, Boas Práticas **100**, SEO **100**, LCP **3.859,72 ms**; desktop Performance **98**, Acessibilidade **100**, Boas Práticas **100**, SEO **100**, LCP **1.155,70 ms**. Scores de laboratório podem variar; a melhora não comprova causalidade da revisão documental. O LCP mobile ainda requer otimização.

O arquivo de workflow ainda denominava o artefato de screenshots `p4-editorial-42-panels`, embora o conteúdo atual tenha 38 capturas. O nome foi corrigido para `p4-editorial-38-panels`; não confundir **42 registros `section_panels` no CMS** (incluem seção oculta) com **38 capturas visíveis** no website. Os artefatos antigos permanecem sob seus nomes originais nos runs históricos.

**Limite de rastreabilidade:** o workflow `Audit P3 Lighthouse` consulta o domínio `https://tulius.work/` e não um artefato imutável do commit. Antes de vincular futuros scores a alterações, conferir SHA do deployment `READY` e instante de execução. Nem este resultado substitui login JWT administrativo e upload/download real de mídias.

## Complemento de limpeza não funcional

Foi comprovado no arquivo `AdminApp.tsx` que `MediaLibrary()` e `NavigationEditor()` eram funções legadas sem referências de chamada (o roteamento usa `EnhancedMediaLibrary` e `NavigationStudio`). Ambas foram removidas nesta revisão, eliminando implementação antiga de upload sem compensação e rótulos antigos de 14 destinos. **Sem alteração do comportamento do painel em uso**: a validação por TypeScript, Vitest e build confirma a integridade estática; JWT real e upload de bytes seguem pendentes de teste de integração.
