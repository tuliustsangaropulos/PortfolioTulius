# P3 — Continuidade da otimização do LCP mobile

**Data:** 31/10/2026. **Repositório:** `tuliustsangaropulos/PortfolioTulius`. **Situação:** desempenho mobile ainda acima da meta; alterações funcionais validadas e experimento sem ganho revertido.

## Etapa adicional — cliente PostgREST público isolado (31/10/2026)

**Implementado** nos commits `bda10f8` a `47f949d`; o código entregue preserva leitura do CMS pelo PostgREST oficial sem importar os módulos completos de Auth/Realtime/Storage na primeira dobra. O cliente Supabase completo permanece carregado dinamicamente nas rotas administrativas e prévia protegida. O helper `src/lib/public-read.ts` usa a chave publicável existente e as mesmas políticas RLS; **não houve mudança de banco, schema, políticas, contas, arquivos ou configuração Vercel**.

**Verificação de produção:** [P3 #41183307575](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41183307575), sucesso no commit `d087424`. Na amostragem mobile Lighthouse 13.5.0 (três rodadas), LCP mediano **4,093 s**, FCP mediano **1,986 s**, Performance **85/100**, TBT **25 ms**, CLS **0,000629**. O LCP desktop mediano foi **1,046 s**, Performance **98/100**. O HTML público pré-carrega `public-postgrest` (~5,4 KB transferidos), sem requisitar `supabase-sdk` (~56 KB anteriormente). O teste confirmou `adminRouterRequested=false`, `fullSupabaseSdkRequested=false`, `publicPostgrestRequested=true`, 13 seções, 25 painéis e 38 capturas, nenhuma falha; P5 público/RLS `PASS`, sem operações de escrita. As duas rotas `/admin` e `/admin/preview` anônimas redirecionam à autenticação. **A prévia autenticada transacional não foi testada** (P2 suspenso).

**CI atual:** [Validate #41202307819](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41202307819), sucesso no commit `47f949d`: formatação, TypeScript, 29 arquivos de testes, build e smoke offline. O smoke diferencia build local sem variáveis Supabase (fallback) do build de produção com CMS. Não há mudança adicional de runtime entre `d087424` e `47f949d`.

**Leitura cautelosa:** ganho aparente de ~298 ms frente à última mediana de 4,391 s, mas uma rodada Lighthouse não comprova causalidade; remoção do SDK inicial e redução de JS requisitado são fatos confirmados. Persistem nove preflights REST, CSS e fontes bloqueantes e uma imagem secundária de ~399 KB (não o LCP, prioridade baixa). Essas hipóteses ainda não justificam retirar autenticação, editar fotografias/cores/fontes ou mudar a arquitetura de atualização instantânea do CMS. **P3-PERF-01 segue ABERTA: falta ~1,593 s para alcançar 2,5 s.** O gate de regressão P3 existente não equivale à aprovação da meta Web Vitals p75 de campo.

## Evolução controlada

| Código / rodada | LCP mobile mediano | LCP desktop mediano | Resultado |
|---|---:|---:|---|
| `494aba3` — referência inicial | 7,704 s | 1,738 s | P3 reprovado por LCP mobile |
| `ae393e0` — preload WebP corretamente sincronizado com o CMS | 4,352 s | 1,044 s | CI e P3 aprovados |
| `27f1024` — retirada apenas do preload administrativo | 4,266 s | 1,150 s | P3 reprovado: import estático administrativo ainda requisitado |
| `2aaf336` — correção efetiva do grupo Rolldown | 4,224 s | 1,025 s | CI e P3 aprovados |
| `ccb1b53` — experimento de montagem progressiva no mobile | 4,334 s | 0,994 s | CI e P3 aprovados; sem ganho demonstrado |
| `87c9348` — reversão do experimento | 4,395 s | 1,081 s | CI e P3 aprovados; interface original preservada |

Medições: três amostras Lighthouse 13.5.0 por execução; mediana, rede e CPU sintéticas. A pequena variação entre 4,224 e 4,395 s **não** é evidência de regressão causal. A redução frente aos 7,704 s iniciais é relevante, mas a meta de **LCP ≤2,5 s continua aberta**. O gate P3 conservador de 6,5 s não substitui a meta Web Vitals.

Evidências: [P3 inicial #41180490449](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41180490449), [P3 WebP #41181655824](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41181655824), [P3 router #41182057509](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41182057509), [P3 progressivo #41182252213](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41182252213) e [P3 reversão #41182454457](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/41182454457).

## Correções mantidas

1. `scripts/generate-seo.mjs` usa `scripts/portrait-preload.mjs`: conserva o `imagesrcset` WebP 600/900 quando a fotografia CMS corresponde à versão aprovada; caso o CMS publique outra fotografia, o preload acompanha a nova URL. Os cinco testes do helper passaram.
2. `vite.config.ts` deixou o pacote `react-router` fora do grupo vendor inicial e eliminou o grupo manual que contaminava o bundle público. O HTML e o JS da home não requisitam o roteador administrativo; `/admin` permanece protegido e funcional.
3. `src/components/public/PublicSite.tsx` e `scripts/p3-browser-smoke.mjs` registram marcos de primeiro painel e LCP. Nenhum dado editorial, ativo fotográfico, schema, RLS, Auth ou Storage foi modificado.
4. A montagem em duas etapas por `requestAnimationFrame` foi testada, não demonstrou ganho de LCP e foi revertida integralmente, sem manter seus efeitos e dependências extras.

## Gargalo residual e hipóteses a medir

No Lighthouse mobile da rodada `2aaf336`, FCP mediano ~3,078 s e LCP mediano ~4,224 s. A primeira amostra mostrou estimativa de ~1,45 s de recursos bloqueantes para FCP (CSS principal e CSS Google Fonts), **sem economia direta de LCP demonstrada** pelo insight. `unused-javascript` estimou ~72 KiB de JavaScript inicial desnecessário; o chunk `supabase-sdk` apresentou aproximadamente 80,6% de bytes não utilizados nesta amostra. A análise das requisições REST também encontrou preflights CORS e uma imagem secundária de aproximadamente 399 KiB carregada antes do término da navegação.

Esses sinais são **hipóteses de otimização, não efeitos medidos de uma correção**. Evitar simplesmente recomprimir o WebP LCP (29,6 KB), desativar fontes sem comparação, afrouxar gates ou apresentar somente o Perfil vazio. O retrato aprovado e o conteúdo real devem continuar sendo o elemento LCP.

Próxima frente técnica recomendada: avaliar uma alternativa leve **somente para leitura pública de dados publicados**, sem substituir o cliente administrativo autenticado nem alterar RLS. Antes de alterar a arquitetura, instrumentar FCP→LCP, custo de inicialização React/vendor e requisições REST; implementar um único experimento reversível, preservar dados e filtros do CMS, e executar P3 completo no mesmo SHA da Vercel. Um cache HTML estático de conteúdo do CMS sem invalidação editorial não atende ao requisito de atualização imediata.

## Aceites e limites operacionais

- CI, TypeScript, testes, build e smoke devem passar; 13 seções desktop, 25 painéis mobile e 38 capturas sem falhas.
- P5 público continua read-only; P2 administrativo transacional segue suspenso. Nenhum teste de gravação em produção ou staging pago.
- Não tocar em conteúdo publicado, no backup privado, em mídia ou nas decisões de segurança P1.
- Não usar `zoom` global nem `transform:scale()` na raiz. Preservar menu, âncoras, fotografia, fontes e composição editorial.
- Registrar mediana e dispersão do LCP, FCP, TBT, CLS, elemento LCP e SHA. Resultado de laboratório não substitui dados de campo p75.
- O script `scripts/p3-lcp-triage.mjs` inclui diagnóstico `P3_LCP_CRITICAL_PATH`, registrando somente rótulos de recursos e métricas, sem parâmetros de query, credenciais ou conteúdo do CMS.

**Pendência vigente:** `P3-PERF-01` permanece **aberta** até o LCP mobile alcançar ≤2,5 s com integridade da página real.
