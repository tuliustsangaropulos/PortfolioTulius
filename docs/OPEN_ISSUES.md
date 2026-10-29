# Pendências operacionais vigentes — PortfolioTulius

## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.


## Refinamento tipográfico pontual da primeira seção — 29/10/2026

**Pedido atendido:** melhorar a legibilidade dos textos menores, o ritmo dos quatro destaques laterais e a numeração dos cinco cards da abertura, **sem alterar a composição editorial aprovada**. A intervenção está estritamente localizada no CSS `@media (min-width: 1101px)`: mantém a divisão das colunas, retrato, selo 360°, título principal, paleta, conteúdo, foto e layout mobile.

- Legibilidade: descrições das experiências e dos destaques laterais agora têm ao menos **11,52 px** no viewport de referência; frase em itálico **12,64 px**; títulos dos destaques com incremento discreto.
- Competências: numeração laranja dos cinco cards em **9,76 px**, mantendo fundo, posição, links e contraste.
- Compensação de microespaçamentos na coluna esquerda (gap entre introdução e lista, gap dos destaques e padding dos itens) para não empurrar `IDIOMAS` para fora da primeira dobra.
- **Proibida a reintrodução de zoom/transform global.** O tamanho do título principal, o selo e a fotografia não mudaram.

**Evidência do SHA funcional:** [`c098a60`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/c098a60d306601ac7d2e8e24ba41be80891832fd), [CI #40807420317](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420317) **success** e [P3 #40807420323](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40807420323) **success**. No viewport **1512×691**, com escala CSS nativa 1: cabeçalho 54 px; título a 66 px; cards de 199 a 281 px; último destaque termina em 669,39 px; **sobreposição selo/anos = 0 px²**. P3: **13 seções, 25 painéis mobile, 38 capturas, 0 falhas e P5 anônimo 3/3 sem mutações**. Lighthouse mediano: mobile Performance 82, **LCP 4,45 s** (meta ≤2,5 s **ainda não atendida**); desktop Performance 98, LCP 1,15 s. Nenhuma mudança Supabase, Storage, CMS, migração, token ou custo.

A referência visual de densidade continua sendo a **última captura fornecida com o navegador a 75%, desejada a 100%**; as referências antigas ficam como histórico. A comparação estética final em navegador físico fica a critério do proprietário, sem reabrir aceites anteriores.


## Referência desktop vigente — 29/10/2026 (substitui a referência histórica de 125%)

**Solicitação mais recente:** em 1512×691 px de área útil, a captura de navegador a **75%** é a composição desejada **com o navegador em 100%**. Os ajustes anteriores que usavam a captura a 125% como referência ficam **históricos/superados**. Nunca reproduzir a densidade por `zoom`, `transform:scale()` no contêiner raiz, alteração global do `html` ou cálculo de escala baseado em `vw` aplicado à página inteira.

A correção [`90975ca`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/90975ca6fea36095920eaccd0344aab4a2ad3cde) calibra apenas **tipografia secundária, espaçamentos de cards, ritmos verticais e altura do cabeçalho** dentro de `@media (min-width: 1101px)`. A foto, largura das duas colunas, título principal e selo circular mantêm a geometria original, com pequeno deslocamento local do selo para eliminar colisão com o texto. O `--header` reduzido é restrito à página pública em desktop largo; admin, mobile e dados Supabase não mudaram.

**Evidências automatizadas:** [CI #40806132618](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132618) `success`; [P3 #40806132632](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40806132632) `success`, Vercel Production `READY` no mesmo SHA funcional. No viewport de referência **1512×691, escala nativa 1**, o teste `P3_DESKTOP_DENSITY` registrou `headerHeight=54`, `nameTop=66`, `nameFontPx=85`, `cardsTop=199`, `cardsBottom=279`, `finalHighlightBottom=669.2`, `badgeYearsOverlapPx2=0`. Navegador `failures=0`, 13 seções, 25 painéis mobile, 38 capturas editoriais sem falhas e P5 público 3/3 sem mutações. Medianas Lighthouse: mobile Performance **83**, LCP **4,30 s** (meta ≤2,5 s ainda pendente); desktop Performance **97**, LCP **1,17 s**.

**Prevenção:** `src/lib/layout-zoom.test.ts` continua proibindo zoom global; o P3 agora mede as posições da primeira dobra em 1512×691, além de 12 outras resoluções, exige o último destaque visível e detecta interseção do selo com a descrição. Esses testes não substituem a confirmação visual do proprietário em seu navegador físico; **somente o aceite estético da nova composição fica aguardando inspeção**.


> **Estado das pendências após a conversa — 28/10/2026.** A rodada manual de experiências, depoimentos, Contato, menu e CMS foi declarada validada pelo proprietário. A correção posterior da **escala desktop nativa** passou no P3, sem `zoom` global em 12 resoluções, porém a equivalência estética exata com a última referência ainda não recebeu confirmação após o deployment. Permanecem o **LCP mobile ≤2,5 s**, o **P2 transacional suspenso**, decisões separadas de P1/segurança e **oito ocorrências editoriais**. O registro histórico detalhado abaixo inclui frases de etapas superadas e deve ser lido nessa ordem de precedência. [Resumo do chat](CONTINUIDADE_CHAT_MANUAL_ZOOM_E_FONTES_2026-10-28.md).

> **Decisão posterior do proprietário — 28/10/2026:** a verificação manual visual e funcional de todas as áreas ajustadas neste chat foi **validada pelo proprietário**. Não solicitar novo aceite visual dessas áreas por rotina. A aceitação manual não homologa CRUD/Storage com JWT administrativo, não atinge automaticamente a meta LCP mobile e não autoriza exclusões, custos ou mudanças de segurança. O estado técnico vigente é sempre o HEAD e seus testes, nunca os SHAs históricos citados abaixo.

## Etapa 5 — Aceite automatizado concluído; manual separado (28/10/2026)

A [reexecução GitHub Actions #40757162085 (tentativa 2)](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) confirmou **13 seções, 25 painéis mobile, 38 capturas, 8 viewports e zero falhas**. [Termo de aceite automatizado](P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md). **Não é pendência repetir essa auditoria automaticamente** sem nova alteração relevante do site.

**Aberto em frente distinta / novo chat:** aceite manual visual e funcional em dispositivos reais, zoom 200% nativo, leitor de tela e ajustes decorrentes da análise do proprietário. **Aberto no P3:** meta LCP mobile ≤2,5 s. **Bloqueado no P2:** ensaios transacionais, por decisão de não aprovar custos adicionais.

**Última revisão documental:** 28/10/2026. Este arquivo contém **somente itens abertos**, com escopo, evidência e próxima decisão. O [histórico acumulado até esta revisão](historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md) preserva todas as notas de 25–28/10, inclusive falhas P5 já resolvidas e antigas cotas/deployments Vercel. A referência principal de estado é o [índice operacional](ESTADO_ATUAL_VIGENTE.md).

## Bloqueio deliberado — P2 transacional (28/10/2026)


**P2-TRANS-00 — SUSPENSO POR DECISÃO DO PROPRIETÁRIO.** O proprietário **não aprovou despesas neste momento**. Cotação consultada para uma branch Supabase de homologação: **US$ 0,01344/h**, mais possíveis cobranças por consumo. Não houve confirmação de custo nem criação de branch; o ambiente isolado inexiste.

**Não executar até nova autorização expressa:** criação de projeto/branch de homologação, confirmação de custo, provisionamento de usuários ou Secrets de staging, execução manual do workflow P2 ou qualquer substituição por CRUD/Storage na produção. Os itens **P2-TRANS-01 a P2-TRANS-04 permanecem abertos e bloqueados por P2-TRANS-00**, não reprovados nem concluídos. P5 administrativo read-only continua **PASS 4/4**. A [suíte preparada](P2_TRANSACIONAL_STAGING_2026-10-28.md) fica versionada, sem execução. **Não reapresentar aprovação de custo por rotina**; somente se o proprietário retomar a frente ou trouxer alternativa isolada autorizada. P3 performance segue como frente independente.

## Prioridade alta

| Código | Frente | Evidência atual | Critério para encerrar |
|---|---|---|---|
| **P2-TRANS-01** | CRUD e publicação reais CMS | [P5 read-only 4/4 aprovado](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md); **não testou gravação** | Fixture isolada, JWT admin real, criar/editar/reordenar/publicar/verificar/reverter sem tocar conteúdo aprovado; logs e antes/depois |
| **P2-TRANS-02** | Storage binário real | Consultas RLS e `storage.objects` existem; não comprovam transferência real de bytes | Fixture PNG sintético, checksum, upload privado/download autorizado/bloqueio não admin/promoção/substituição/limpeza, com recuperação verificada |
| **P2-TRANS-03** | Recuperação de conteúdo | `content_revisions=12`, `audit_logs=12`; [ADMIN_CMS](ADMIN_CMS.md) documenta **restauração pela UI não implementada** | Definir se é requisito de UI: implementar e testar quando autorizado, ou homologar procedimento operacional reversível e explicitar limitação |
| **P2-TRANS-04** | Autorização negativa real | Papel não admin e claims foram **simulados** em SQL; P5 usa somente conta admin real | Conta de teste não admin isolada e JWT emitido pelo Auth; verificar API HTTP/Storage sem expor tokens |
| **P3-PERF-01** | LCP mobile | [P3 válido #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980): mobile Performance 82, LCP **4,38 s** | Baseline repetido no SHA correto, análise causal React/Supabase, otimização pontual + medição comparável; alvo **≤2,5 s**, sem regressão |
| **P0-FONTES-01** | Seleção de Fontes ChatGPT | Guia atualizado nas Fontes, mas inventário ainda contém oito históricos/ativos e precisa de limpeza manual | Arquivar backups, preservar variante de 80 linhas, retirar redundâncias das Fontes e acrescentar guia/índice vigente; conferir lista final |

## Prioridade média — decisões ainda abertas

| Código | Frente | Condição para concluir |
|---|---|---|

| **P1-MIDIA-01** | Proveniência | Conferir licença e créditos dos 2 PNGs (usados InPress/Vale) e decidir entre as duas coleções divergentes de 19 SVGs; ambas são **ilustrativas** |
| **P1-STORAGE-01** | Objetos privados | Dois PNGs privados têm par público equivalente por path/tamanho/`eTag`; definir política de retenção, backup e integridade antes de qualquer exclusão |
| **P1-FUNC-01** | Edge Function inativa | Função de importação v2 está implantada mas responde 410; validar integrações externas e recuperação antes de eventual undeploy |
| **P1-BRANCH-01** | Branches antigas | Branch navegação: 4 commits exclusivos revisados, principal comportamento já está na `main`; motion: 0 exclusivos. Manter até aprovação expressa para arquivar/excluir |
| **P0-HIST-01** | Fonte seção 01 | A Fonte ChatGPT de **80 linhas** diverge da versão GitHub de **53**; backup histórico integral deve ser guardado antes de removê-la da lista ativa |

## Aceite manual encerrado na conversa atual

**P3-VISUAL-01 — encerrado por decisão expressa do proprietário:** a conferência visual e funcional solicitada neste chat foi declarada validada. Esta declaração não equivale a auditoria instrumental adicional de leitor de tela, testes transacionais ou desempenho mobile. Os parágrafos históricos abaixo conservam sua redação da época.

## Pendências editoriais no banco

**8 linhas `editorial_issues` abertas e 1 resolvida** em 28/10/2026; **não** são os códigos de trabalho técnico da tabela acima. O inventário no GitHub contém apenas contagens agregadas, sem reproduzir anotações internas não publicadas. A avaliação/fechamento editorial deve ocorrer no CMS, com confirmação do proprietário. Os SVGs não comprovam projetos reais e os PNGs de logotipo não possuem créditos de licença verificados.

## Decisões preservadas, não classificadas como correção técnica

A decisão anterior de **não revogar o token pessoal Supabase historicamente exposto** e **não habilitar Leaked Password Protection** foi expressamente registrada; ambos são riscos aceitos, não resolvidos e **não devem ser alterados sem nova autorização**. [Contexto histórico de segurança](SECURITY_RLS.md).

## Já homologado — não reabrir automaticamente

- P5 admin read-only: [#40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), login/8 módulos/prévia/logout **4/4 PASS**, `contentMutations=0`. Falhas de execuções antigas pertencem ao histórico.
- P3 público automatizado: [#40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), 13 seções/25 painéis/38 screenshots, SEO e a11y 100, sem falhas de viewport; ainda há as ressalvas acima.
- Infraestrutura anterior à consolidação: [CI `40747847554`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747847554) e [Vercel `dpl_GAgdukRpirZ8j3foDFB4E5FKEtNk`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/GAgdukRpirZ8j3foDFB4E5FKEtNk) no mesmo SHA `56cce265`. A nova consolidação também dispara CI/deploy próprio.

## P3 — ensaio de carregamento inicial (28/10/2026)

Experimento com consultas SEO fora da barreira de renderização, preservando as cinco dependências editoriais de `usePortfolio` e registrando marcos `P3_FIRST_FOLD_TIMING`. **Pendente verificação de Lighthouse no novo SHA**, sem assumir redução de LCP; [detalhes](P3_QUALIDADE_ACEITE_2026-10-28.md).

## P3 — estabilidade do LCP em laboratório

A primeira dobra renderizada separadamente reduziu o LCP num run, mas elevou o TBT mobile: [run #40755835498](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40755835498) (LCP 3,97 s, TBT 1.086 ms, Performance 60). Essa alteração foi **revertida**, preservando a separação assíncrona de SEO. A auditoria foi ampliada para **três medições mobile** e mediana; a meta LCP ≤2,5 s continua aberta. Ver [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

## P3 — primeira mediana Lighthouse de 3 amostras (28/10/2026)

[Run #40756305871](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40756305871), mesmo SHA/Vercel: amostras mobile **54/83/83** em Performance; **4,89/4,31/4,23 s** LCP. **Mediana 83 e 4,31 s**, TBT mediano 47 ms, Accessibility/SEO 100; todos os 13/25/38 testes de browser passaram. Run saiu `failure` porque o gate anterior olhava somente a primeira amostra 54. Gate atualizado para mediana, sem relaxar limites; ainda exige nova execução. **Meta 2,5 s continua não atendida.**

## P3 — mediana estabilizada com workflow aprovado (28/10/2026)

[Audit #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) passou no SHA `50a66f8`, com **3 mobile + 3 desktop**. Mediana mobile **82/100 e LCP 4,32 s**, desktop **98/100 e 1,16 s**; A11y, SEO e boas práticas 100; **13/25/38 PASS**. Primeira amostra mobile Performance 53 e TBT 1.479 ms, outras duas 82 e 0–1 ms: manter monitoramento de variância, não declarar performance estável em dispositivo real. O **LCP mobile ≤2,5 s permanece pendente**; [P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

**P2 transacional:** [workflow isolado preparado](P2_TRANSACIONAL_STAGING_2026-10-28.md), sem execução de fixture até criar staging e aprovar custo/credenciais de teste. Não usar produção.

## Acompanhar após esta rodada manual (28/10/2026)

Alterações implementadas conforme pedido: listas públicas de experiência com flag `isHidden` (sem apagar 13 itens), cinco depoimentos na coleção (dois **fictícios explicitamente sinalizados**), grade de cards expansíveis, rodapé/foto/setas de Contato e menu lateral de oito entradas. Não reabrir como pendências de implementação se CI e auditoria estiverem aprovados, mas **validar manualmente** a aparência nas resoluções reais, truncamento e expansão dos depoimentos, links da barra das seis experiências, legibilidade do rodapé e ausência de sobreposição no LinkedIn. Confirmar que o CMS exibe o rótulo **Ocultado** para os 13 itens, e que os novos depoimentos estão editáveis em **Coleções → Depoimentos**. Não confundir os dois exemplos fictícios com recomendações profissionais reais; decidir posteriormente se serão substituídos por depoimentos autênticos.

Permanece o bloqueio deliberado do P2 transacional e a meta LCP mobile ≤2,5 s; o acréscimo de conteúdo via SQL solicitado pelo proprietário não equivale a homologar fluxos de CRUD com JWT pela interface.

### Validação, sem encerramento do aceite humano

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

## Pendência de homologação administrativa — revisão manual (28/10/2026)

A inspeção de todos os módulos e os ajustes de UI de Seções/Mídia não substituem testes transacionais com autenticação administrativa: permanece pendente validar em ambiente seguro, com autorização, o ciclo **editar → salvar → reler → publicar/arquivar → verificar no público** em Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões, além de upload/substituição e RLS efetiva. Revisão de enquadramento por área: verificar também recortes reais em desktop/mobile e zoom nativo. Não executar esses testes em produção por conveniência enquanto P2 estiver suspenso.

O formato Open Graph depende dos pixels reais do arquivo compartilhado: CSS do portfólio não recorta imagens de terceiros. Os 19 créditos legados permanecem retidos, embora não apresentados/editados; eventual limpeza exigiria decisão separada, pois o pedido atual foi remover o **campo da interface** e não apagar dados históricos.

### Evidências da auditoria administrativa integral — 28/10/2026

[Relatório por aba](AUDITORIA_ADMIN_MANUAL_2026-10-28.md): auditoria de código de dez áreas, sem mutações P2. CI #40776321190 aprovado; auditoria pública P3 #40776111312 aprovada; 21/21 títulos de mídia sincronizados com nome de arquivo no Supabase e 19 créditos históricos preservados sem uso. O LCP mobile e o teste real de gravação do CMS permanecem pendentes.

### Auditoria da versão funcional de correções — 28/10/2026

[CI de implementação #40781440231](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440231) **success** no SHA [`ae4033e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/ae4033e3720d8252e5af3270c71f7470877341ec). [Auditoria P3 #40781440227](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781440227) **success**, 8 viewports sem overflow, 13 seções, 25 painéis, 38 capturas sem falhas, 6 experiências navegáveis, P5 anônimo 3/3, nenhum dado de produção escrito. Lighthouse mediana de três amostras: **mobile Performance 80, LCP 4,38 s**; **desktop Performance 97, LCP 1,09 s**. A meta mobile ≤2,5 s não foi alcançada. Diagnóstico registrou fonte Google render-blocking e custo de execução/avaliação do bundle JavaScript, além da variabilidade de laboratório. A antecipação da consulta de depoimentos remove etapa sequencial de rede, mas não comprova ganho sustentável de LCP. **Não alterar orçamento de regressão para declarar o requisito aprovado.** A auditoria de browser foi executada no SHA funcional; os commits posteriores apenas documentam o aceite manual.

As verificações da versão documental de `main` são [CI #40781599089](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781599089) e [Export Docs #40781598923](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40781598923), ambas **success**. Vercel Production `READY` no mesmo commit documental antes deste registro. A declaração expressa do proprietário encerra a fase de aceite manual do chat; não encerra metas de performance ou P2 transacional.

## Zoom CSS global removido — prevenção de regressão (28/10/2026)

Novo achado manual: 100% de zoom do navegador exibindo conteúdo pequeno, com referência desejada em 125%. **Causa técnica solucionada no código:** removido o antigo `--desktop-visual-scale` de `.public-site` e as compensações associadas. A garantia estática `src/lib/layout-zoom.test.ts` e a auditoria de navegador P3 cobrem zoom/transform globais e a transição desktop/tablet. Se as capturas a 100% em navegador físico mostrarem diferenças do anexo desejado, corrigir dimensões locais de componentes, sem retornar a zoom global. Não reabrir o aceite dos demais ajustes já aprovados; P2 e LCP mobile permanecem independentes.

### Evidências do ajuste nativo de escala — Auditoria 28/10/2026

**SHA funcional** [`8a45e9b`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/8a45e9bc0663ee15e9b0797785900308f6622712), [CI Validate #40794804474](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804474) **success**, [P3 Lighthouse + browser #40794804504](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40794804504) **success** e Vercel Production `READY` no mesmo SHA previamente à auditoria.

**Novos testes do contrato de escala:** 12/12 viewports (1920×1080, 1757×832, 1440×900, 1366×768, 1200×800, 1101×800, 1100×800, 768×1024, 720×450, 390×844, 360×800, 320×700) registraram `getComputedStyle(.public-site).zoom === "1"`, `transform === "none"` e `overflowPx=0`. A passagem de 1101 para 1100 px não altera artificialmente a escala (fonte da marca: 61,656 px e 61,6 px, respectivamente). **13 seções**, **25 painéis mobile**, **38 capturas editoriais**, **nenhum erro** de navegador ou painel; 6 experiências e galeria navegáveis. P5 público anônimo 3/3 e `mutations=0`.

**Performance (mediana de 3 execuções Lighthouse)**: mobile Performance **78**, LCP **4,36 s**, desktop Performance **97**, LCP **1,09 s**. O gate de regressão foi aprovado, porém **LCP mobile ≤2,5 s não foi atingido**. Alteração de zoom não constitui intervenção em performance mobile. O teste em 720 px é uma simulação por largura de viewport e **não** comprova zoom nativo de 200% em todos os navegadores.

O mecanismo global anterior deve permanecer **proibido** pelo teste `src/lib/layout-zoom.test.ts` e pela checagem de estilo calculado `P3_VIEWPORT`; correções futuras de tipografia/densidade devem ser locais e responsivas, sem novo percentual de zoom CSS.

### P3-PERF-01 — nova medição do LCP mobile (29/10/2026 UTC)

**Aberto: objetivo ≤2,5 s ainda não atendido.** Código funcional `4ab9ce5`: mediana de três amostras mobile **4,30 s**, Performance 80; [P3 #40797703855](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40797703855) `success`. Baseline anterior 4,36 s; a pequena diferença não comprova melhoria causal. Mantida a eliminação da dupla árvore React desktop/mobile. Revertidos `content-visibility` e fontes Google não bloqueantes porque não melhoraram LCP. Próxima frente: reduzir o trabalho do JavaScript inicial (bundle vendor/React/Supabase), sem mudanças em produção não autorizadas. [Relatório](P3_QUALIDADE_ACEITE_2026-10-28.md).

### P3-LCP — ensaio de divisão de JS, 29/10/2026 UTC

**Meta ≤2,5 s aberta.** Experimento de REST anônimo customizado `7049ee2/41817e6` gerou página vazia e **foi revertido** (`49fbfda`). O LCP ~2,26 s durante a falha **não é válido**, porque 0 seções foram renderizadas. O P3 de recuperação [#40799749896](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799749896) passou com 13/25/38 e LCP mobile **4,312 s**. A abordagem segura `e1846ac` preserva o SDK e separa chunks apenas no Vite, [P3 #40799952773](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40799952773) `success`, LCP **4,248 s**, porém sem melhora causal demonstrada. Novo gate `P6_LCP_CONTENT_GATE` exige o retrato real em todas as amostras; não aceitar score de página vazia. [Relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

### Auditoria final da proteção P6 e divisão dos chunks — 29/10/2026 UTC

No SHA funcional [`cc30446`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/cc304462bf9bf2ab0d8583b85920eb136a127916), [CI #40800444163](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444163) e [P3 #40800444157](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40800444157) passaram, com Vercel Production `READY`. P3: **13 seções**, **25 painéis mobile**, **38 capturas**, `P3_BROWSER_AUDIT failures=0`, P5 anônimo **3/3**, **0 mutações**. O novo **`P6_LCP_CONTENT_GATE` passou em mobile e desktop**, comprovando que o LCP medido era o retrato publicado. Mediana Lighthouse mobile: **Performance 82, LCP 4,421 s**; desktop: **Performance 97, LCP 1,235 s**. O valor de 4,248 s do experimento `e1846ac` não se repetiu; **não há evidência de melhora causal do LCP** frente ao baseline de aproximadamente 4,30 s. A meta mobile **≤2,5 s permanece aberta**. Preservar o SDK e o conteúdo original; a separação dos chunks está mantida apenas como isolamento/cache, **não** como aceite de desempenho.

