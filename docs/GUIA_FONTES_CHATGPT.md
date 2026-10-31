# PortfolioTulius — guia de Fontes do projeto ChatGPT

**Revisão do índice GitHub:** 31/10/2026. **Fonte operacional:** [estado vigente](ESTADO_ATUAL_VIGENTE.md) e [pendências](OPEN_ISSUES.md). **Correções CMS implementadas no código** em [`6913d91`](https://github.com/${repo}/commit/${base}), CI aprovado e Vercel READY; [handoff de 31/10](CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md) preservado como especificação histórica. P2 transacional e aceite visual dos controles novos permanecem pendentes. Esta documentação **não sincroniza automaticamente** os anexos do ChatGPT.

## Consulta prioritária para cada próximo chat

1. Confirmar [`main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), [CI](https://github.com/tuliustsangaropulos/PortfolioTulius/actions), [Vercel](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius) no mesmo SHA; quando há dados envolvidos, consultar Supabase somente leitura antes de decidir.
2. Ler [`AGENTS.md`](../AGENTS.md), [`README.md`](../README.md), [`ESTADO_ATUAL_VIGENTE.md`](ESTADO_ATUAL_VIGENTE.md), [`OPEN_ISSUES.md`](OPEN_ISSUES.md) e [`CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md`](CONTINUIDADE_CMS_FONTES_E_PENDENCIAS_2026-10-31.md).
3. Consultar por tema: [CMS](ADMIN_CMS.md), [design system](DESIGN_SYSTEM.md), [modelo de conteúdo](CONTENT_MODEL.md), [responsividade](RESPONSIVE_LAYOUT.md), [segurança](SECURITY_RLS.md), [deploy](DEPLOYMENT.md), [P1](P1_INVESTIGACAO_HIGIENE_2026-10-28.md), [P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) e [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).
4. Preservar os documentos datados como registros históricos com evidências no SHA da época. A [aprovação automatizada de 28/10](P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md) não declara o LCP mobile atual aprovado.

## Arquivos Markdown do projeto ChatGPT conferidos em 31/10/2026

| Arquivo de Fonte ativo | Papel | Sincronização necessária |
|---|---|---|
| `GUIA_FONTES_VIGENTES_PORTFOLIOTULIUS_ATUALIZADO_2026-10-28.md` | Índice congelado em 28/10 | **Substituir manualmente** por novo guia com referência à `main` e ao handoff 31/10; preservar histórico fora das Fontes ativas se desejado |
| `ESTADO_ATUAL_VIGENTE_PORTFOLIOTULIUS_2026-10-28.md` | Snapshot de 28/10, com LCP e mídia de outra data | **Substituir manualmente** por snapshot de 31/10, com estado P3/P5/P2 e pendências CMS-UX |
| `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` | Requisitos, história e identidade 24–25/10 | **Preservar integralmente**, não usá-lo como fonte de métricas atuais |
| `BACKUP_CONTINUIDADE_SECAO_01_VERSAO_80_LINHAS_2026-10-28.md` | Backup privado exclusivo com 80 linhas | **Preservar sem modificação**, SHA-256 `67db85f1cc497e6f51625f19472f76a753707cb0c7b34407af73d7f23b4ff288`; não publicar no GitHub |

**Prática para evitar duplicatas:** manter apenas quatro Fontes Markdown ativas, duas atualizadas e duas históricas, e usar as páginas vivas do GitHub por conector. O conjunto de oito arquivos de uma conferência anterior é histórico e não deve originar exclusões de arquivos que não existem no inventário atual. **A ação de substituir os anexos do projeto é manual.**

## Situação operacional resumida (read-only 31/10)

14 seções cadastradas, 13 públicas, 25 painéis mobile **renderizados/auditados**, oito entradas visíveis no menu, cinco depoimentos publicados (dois fictícios identificados no histórico), 34 registros de mídia, oito pendências editoriais abertas. O [P5 Admin read-only #41172037326](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172037326) passou no mobile 390×844, 8 módulos, 50 ícones, Salvar flutuante e zero mutações de conteúdo. [P3 #41171332333](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41171332333) manteve 13/25/38 e falhou somente no LCP mobile ~7,757 s (objetivo ≤2,5 s). P2 transacional permanece suspenso por falta de autorização de staging cobrável. O [CI #41172157025](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41172157025) e o deployment do SHA funcional `e611429` estavam aprovados antes desta revisão documental; **verificar novamente no próximo chat**.

## Invariantes e aceite

Não alterar conteúdo aprovado, fotografia, design, escala CSS raiz, dados ou segurança sem escopo autorizado. Não executar testes de CRUD com JWT em produção nem contratar staging. Dropdown de ícones, posicionamento de labels e popup de mídia com upload são **solicitações registradas para correção futura**, não funcionalidades já publicadas. Fechamento/reload de aba deve manter aviso nativo `beforeunload`; navegação interna usa modal personalizado. [Reconciliação histórica de Fontes](RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md).
