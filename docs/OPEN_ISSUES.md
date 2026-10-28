# Pendências operacionais vigentes — PortfolioTulius

**Última revisão documental:** 28/10/2026. Este arquivo contém **somente itens abertos**, com escopo, evidência e próxima decisão. O [histórico acumulado até esta revisão](historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md) preserva todas as notas de 25–28/10, inclusive falhas P5 já resolvidas e antigas cotas/deployments Vercel. A referência principal de estado é o [índice operacional](ESTADO_ATUAL_VIGENTE.md).

## Prioridade alta

| Código | Frente | Evidência atual | Critério para encerrar |
|---|---|---|---|
| **P2-TRANS-01** | CRUD e publicação reais CMS | [P5 read-only 4/4 aprovado](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md); **não testou gravação** | Fixture isolada, JWT admin real, criar/editar/reordenar/publicar/verificar/reverter sem tocar conteúdo aprovado; logs e antes/depois |
| **P2-TRANS-02** | Storage binário real | Consultas RLS e `storage.objects` existem; não comprovam transferência real de bytes | Fixture PNG sintético, checksum, upload privado/download autorizado/bloqueio não admin/promoção/substituição/limpeza, com recuperação verificada |
| **P2-TRANS-03** | Recuperação de conteúdo | `content_revisions=12`, `audit_logs=12`; [ADMIN_CMS](ADMIN_CMS.md) documenta **restauração pela UI não implementada** | Definir se é requisito de UI: implementar e testar quando autorizado, ou homologar procedimento operacional reversível e explicitar limitação |
| **P2-TRANS-04** | Autorização negativa real | Papel não admin e claims foram **simulados** em SQL; P5 usa somente conta admin real | Conta de teste não admin isolada e JWT emitido pelo Auth; verificar API HTTP/Storage sem expor tokens |
| **P3-PERF-01** | LCP mobile | [P3 válido #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980): mobile Performance 82, LCP **4,38 s** | Baseline repetido no SHA correto, análise causal React/Supabase, otimização pontual + medição comparável; alvo **≤2,5 s**, sem regressão |
| **P0-FONTES-01** | Seleção de Fontes ChatGPT | Guia atualizado nas Fontes, mas inventário ainda contém oito históricos/ativos e precisa de limpeza manual | Arquivar backups, preservar variante de 80 linhas, retirar redundâncias das Fontes e acrescentar guia/índice vigente; conferir lista final |

## Prioridade média e aceite humano

| Código | Frente | Condição para concluir |
|---|---|---|
| **P3-VISUAL-01** | Fidelidade de UI | Comparar seções/painéis com referências finais Canva/Figma em dispositivos reais; verificar contraste, animação/foco, zoom 200% e leitor de tela; não presumir aprovação pelo Lighthouse 100 |
| **P1-MIDIA-01** | Proveniência | Conferir licença e créditos dos 2 PNGs (usados InPress/Vale) e decidir entre as duas coleções divergentes de 19 SVGs; ambas são **ilustrativas** |
| **P1-STORAGE-01** | Objetos privados | Dois PNGs privados têm par público equivalente por path/tamanho/`eTag`; definir política de retenção, backup e integridade antes de qualquer exclusão |
| **P1-FUNC-01** | Edge Function inativa | Função de importação v2 está implantada mas responde 410; validar integrações externas e recuperação antes de eventual undeploy |
| **P1-BRANCH-01** | Branches antigas | Branch navegação: 4 commits exclusivos revisados, principal comportamento já está na `main`; motion: 0 exclusivos. Manter até aprovação expressa para arquivar/excluir |
| **P0-HIST-01** | Fonte seção 01 | A Fonte ChatGPT de **80 linhas** diverge da versão GitHub de **53**; backup histórico integral deve ser guardado antes de removê-la da lista ativa |

## Pendências editoriais no banco

**8 linhas `editorial_issues` abertas e 1 resolvida** em 28/10/2026; **não** são os códigos de trabalho técnico da tabela acima. O inventário no GitHub contém apenas contagens agregadas, sem reproduzir anotações internas não publicadas. A avaliação/fechamento editorial deve ocorrer no CMS, com confirmação do proprietário. Os SVGs não comprovam projetos reais e os PNGs de logotipo não possuem créditos de licença verificados.

## Decisões preservadas, não classificadas como correção técnica

A decisão anterior de **não revogar o token pessoal Supabase historicamente exposto** e **não habilitar Leaked Password Protection** foi expressamente registrada; ambos são riscos aceitos, não resolvidos e **não devem ser alterados sem nova autorização**. [Contexto histórico de segurança](SECURITY_RLS.md).

## Já homologado — não reabrir automaticamente

- P5 admin read-only: [#40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), login/8 módulos/prévia/logout **4/4 PASS**, `contentMutations=0`. Falhas de execuções antigas pertencem ao histórico.
- P3 público automatizado: [#40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), 13 seções/25 painéis/38 screenshots, SEO e a11y 100, sem falhas de viewport; ainda há as ressalvas acima.
- Infraestrutura anterior à consolidação: [CI `40747847554`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747847554) e [Vercel `dpl_GAgdukRpirZ8j3foDFB4E5FKEtNk`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/GAgdukRpirZ8j3foDFB4E5FKEtNk) no mesmo SHA `56cce265`. A nova consolidação também dispara CI/deploy próprio.
