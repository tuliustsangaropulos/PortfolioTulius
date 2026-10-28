# PortfolioTulius — P3: auditoria de qualidade e aceite

**Início:** 28/10/2026. **Critério:** verificar a mesma implementação publicada, sem alterar conteúdo editorial, licenças, dados do CMS ou identidade visual.

## Fonte de verdade e versões

A auditoria histórica de 26/10, [run #40299848896](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40299848896), foi executada no commit `9d118da8108181664867835f09ca93f55fe63218` e registrou mobile Performance **72**, LCP **4.604,02 ms**, FCP **2.423,68 ms**, TBT **347 ms**, CLS **0,0004**; desktop Performance **97**, LCP **1.244,08 ms**; Acessibilidade, Boas Práticas e SEO **100/100** nos dois. O mesmo job registrou `P3_BROWSER_AUDIT failures=0` e `P4_EDITORIAL_SUMMARY captures=38 desktop=13 mobile=25 failures=0`. **Não atribuir essas medições ao deployment atual.**

**Pré-auditoria de 28/10:** GitHub `main` em `fb487af642c668083bf6f2db6c3160acbaa402bf`, [CI aprovada](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40746000813), Vercel [`dpl_4zvyVEqQtzxkdPkVC1TPrYKTcPNY`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/4zvyVEqQtzxkdPkVC1TPrYKTcPNY) `READY`, SHA correspondente. O commit desta preparação cria novo SHA/deployment; registrar o real após o resultado da auditoria.

## Matriz do aceite P3

| Gate | Evidência exigida | Critério |
|---|---|---|
| Origem da publicação | SHA do GitHub Actions, SHA do último deployment `READY` da Vercel, alias `tulius.work`, hora de execução do Lighthouse. | Coincidirem ou documentar explicitamente a discrepância; não comparar a execução de um SHA com outro. |
| Site público | `scripts/p3-browser-smoke.mjs`, oito viewports e navegação. | 13 seções públicas, 25 painéis mobile visíveis, sem overflow, erros ou falhas de interação. |
| Evidências visuais | `scripts/p4-visual-audit.mjs`. | 38 capturas (13 desktop + 25 mobile), imagens decodificadas, sem painéis vazios ou quebrados. Não equivale a equivalência estética com Canva/Figma. |
| Acessibilidade | Lighthouse mobile/desktop e inspeção de menu/teclado. | Alvo de aceite automatizado: a11y >=95 em ambos; zoom 200% e leitor de tela reais exigem validação humana. |
| SEO | `scripts/smoke-production.mjs` e Lighthouse. | Score SEO >=95 e configurações canonical/robots/sitemap sem regressão. |
| Performance | Lighthouse JSON completos do run atual. | Registrar FCP, LCP, TBT, CLS e scores; não confundir gate tolerante `mobile LCP <=6500 ms` com meta ideal `LCP <=2500 ms`. |
| LCP mobile | `scripts/p3-lcp-triage.mjs`, dados do Lighthouse 13, imagens/fontes e renderização. | Identificar elemento causador e gargalo prioritário; propor alteração mínima baseada em evidência, não otimizar somente a pontuação. |

**Status deste arquivo na criação:** preparação e novo gate de diagnóstico LCP. A nova rodada automatizada, os valores de Lighthouse e os artifacts deverão ser adicionados **depois** da execução real. Não declarar aceite P3 antes disso.

## P2 antes de P3

O [P5 administrativo read-only](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770) passou 4/4 com `contentMutations=0`. Porém o [relatório P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) ainda exige ensaios com **fixture CMS e Storage binário autenticados**, protegidos por plano de restauração e limpeza. **Não se deve registrar P2 integralmente aprovada** apenas para iniciar P3; essa pendência é independente da auditoria pública.

## Interpretação

Performance Lighthouse é **dado de laboratório**, variável entre execuções e distinta dos Core Web Vitals de campo. Para comparar antes/depois de uma alteração de LCP, obter execução do mesmo SHA e depois uma medição no SHA novo, preservando a configuração e o tipo de dispositivo. Manter artefatos JSON e screenshots do run (retenção limitada do GitHub Actions).
