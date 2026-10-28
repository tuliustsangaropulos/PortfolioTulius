# Pendências operacionais vigentes — PortfolioTulius

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
