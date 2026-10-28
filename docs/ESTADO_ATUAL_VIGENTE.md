# PortfolioTulius — estado operacional vigente

## Etapa 5 — Aceite automatizado concluído; manual em nova frente (28/10/2026)

**PASS — 13 seções públicas, 25 painéis mobile, 38 capturas (13 desktop + 25 mobile), 8 viewports, zero falhas de navegador ou painéis inadequados.** Evidência: [GitHub Actions #40757162085 — tentativa 2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085), no SHA funcional `50a66f8`; até o SHA documental prévio `5db5fd7`, apenas README/`docs/` mudaram. [Relatório final do aceite automatizado](P3_ACEITE_AUTOMATIZADO_FINAL_2026-10-28.md).

**Não houve aceite manual:** a revisão estética, dispositivos físicos, zoom nativo e leitor de tela serão tratados **no novo chat e em uma nova frente**, mediante achados do proprietário. **P3 LCP mobile ainda aberto** (meta ≤2,5 s); **P2 transacional suspenso por custo**, sem criação de staging ou escrita em produção. Este registro se limita ao aceite automatizado estrutural.

**Conferência:** 28/10/2026, somente leitura em GitHub, Vercel e Supabase. **Entrada operacional única:** este documento substitui a função de índice vigente de relatórios cumulativos de 24–26/10. Os documentos originais e os backups permanecem históricos.

> **Regra de atualização:** o snapshot de Git/CI/Vercel abaixo é **anterior ao commit desta consolidação documental**. Para o estado em qualquer novo chat, verificar [HEAD da `main`](https://github.com/tuliustsangaropulos/PortfolioTulius/commits/main), [runs do GitHub Actions](https://github.com/tuliustsangaropulos/PortfolioTulius/actions), [deployments da Vercel](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius) e, quando a tarefa pedir, o banco Supabase. **Não reutilizar SHA congelado como se fosse o HEAD futuro.**

## Decisão vigente — P2 transacional suspenso por custo (28/10/2026)


**Decisão expressa do proprietário:** **não aprovar custos adicionais neste momento** para a branch de homologação Supabase. A cotação consultada foi **US$ 0,01344 por hora** para uma branch, sujeita a eventuais custos adicionais de uso. **Cotação não é aprovação de cobrança.**

**P2-TRANS: BLOQUEADO / AGUARDANDO NOVA DECISÃO DO PROPRIETÁRIO, sem prazo.** Não criar ou provisionar branch/projeto pago, não confirmar custo, não configurar ou usar credenciais de homologação, não disparar o [workflow transacional](../.github/workflows/p2-transactional-staging.yml) e **não substituir staging por escrita na produção**. A suíte está preparada no repositório, porém **não foi executada**; CRUD, publicação/restauração e Storage binário com JWT real seguem sem homologação. O [P5 read-only aprovado](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770) continua válido.

**Retomada somente mediante solicitação e aprovação explícitas futuras**, com nova revisão de preço/alternativa sem cobrança, equivalência de schema, contas de teste e plano de limpeza. A auditoria e otimização **P3 podem prosseguir separadamente**; o LCP mobile mediano de 4,32 s ainda está acima da meta de 2,5 s. [Pendências](OPEN_ISSUES.md) e [plano P2](P2_TRANSACIONAL_STAGING_2026-10-28.md).

## Identidade e fonte de verdade


- Repositório público: [`tuliustsangaropulos/PortfolioTulius`](https://github.com/tuliustsangaropulos/PortfolioTulius), branch de trabalho **somente `main`**, seguindo [`AGENTS.md`](../AGENTS.md).
- Site: [`https://tulius.work/`](https://tulius.work/), Vercel projeto `portfolio-tulius`, equipe `tuliustsangaropulos-creates-projects`. O push na `main` pode disparar deploy automático.
- Supabase: projeto `portfolio`, id `zfnrhzplwpjpdljraypt`; produção conecta o CMS e o site público. Consultar ao vivo dados de conteúdo antes de alterar layout/edição.
- Antes desta consolidação: `main` em [`56cce2658731d6db29a2cf60cb326f0fd908ef01`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/56cce2658731d6db29a2cf60cb326f0fd908ef01), [CI `40747847554` `success`](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747847554), Vercel [`dpl_GAgdukRpirZ8j3foDFB4E5FKEtNk` `READY`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/GAgdukRpirZ8j3foDFB4E5FKEtNk), mesmo SHA. **Este é um marco histórico verificável, não o SHA desta consolidação.**

## Snapshot de dados de produção — 28/10/2026

| Item | Verificado | Interpretação |
|---|---:|---|
| Seções CMS | 14 | 13 `published` e `is_visible`; `competencias` preservada/oculta |
| Contrato mobile público | 25 painéis | Contrato do navegador; **não** são 25 registros do CMS |
| Seções públicas / navegação pública | 13 / 13 | Confirmadas nas consultas e no teste navegador do P3 |
| Painéis cadastrados CMS | 42 | 28 blocos e 56 placements |
| Mídias publicadas | 21 | 19 SVGs ilustrativos + 2 PNGs; **não** equivalem a fotografias e marcas oficiais aprovadas |
| Storage físico | 23 | 21 no `portfolio-public`; 2 no `portfolio-private`, sem linha `media_assets` |
| Pendências editoriais | 8 abertas / 1 resolvida | Não alterar/fechar automaticamente; podem conter fatos sujeitos a aprovação |
| Revisões / audit logs | 12 / 12 | Não representam rollback funcional homologado |
| Segurança | 22 tabelas públicas com RLS / 22 | Testar permissões reais via Auth separadamente de simulações SQL |

**Integridade editorial:** os dois PNGs privados preservam cópias com mesmo path/tamanho/`eTag` dos públicos, retidas pelo fluxo de promoção. Os 19 SVGs publicados no Storage têm tamanhos diferentes dos arquivos `public/media/editorial-*.svg`; não inferir identidade/proveniência ou licenças. Nenhuma limpeza autorizada no P1.

## P0–P3: situação e evidências com limites

| Frente | Aceite evidenciado | Pendência |
|---|---|---|
| **P0 — Documentação** | Repositório consolidado; relatórios históricos preservados e Fontes ChatGPT inventariadas | Gestão das Fontes do ChatGPT é **manual** e não se sincroniza automaticamente com GitHub |
| **P1 — Higiene técnica** | [Investigação detalhada](P1_INVESTIGACAO_HIGIENE_2026-10-28.md) dos 2 privados, importador HTTP 410, 19 SVGs e branches | Decisão sobre retenção, direitos, proveniência e eventual exclusão, **sem apagar antes** |
| **P2 — Administração** | [P5 #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770): **4/4 PASS**, login real, 8 módulos, prévia 14 seções, logout; `contentMutations=0` | **Não homologados** CRUD/publicação/restauração pela UI e upload/download/substituição de bytes com JWT real e fixture isolada; prova de usuário autenticado não admin real. [Relatório P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) |
| **P3 — Qualidade** | [Audit #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980), SHA [`e3bfccf`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/e3bfccf467c730cc0a869f2db6addaaf7f65ca14), [Vercel `READY` correspondente](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/C1YFn6m9iE2Jc5cVjjL1VoKHTydk) **antes** da medição; 13 seções, 25 painéis, 38 capturas, 8 viewports, zero falhas automatizadas; A11y/SEO/Boas Práticas 100/100 | LCP mobile **4,376 s**, meta **≤2,5 s** ainda não cumprida; aceite visual humano, zoom 200% e leitor de tela real pendentes. [Relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md) |

**Lighthouse válido:** Performance **82 mobile / 97 desktop**; LCP **4,38 s mobile / 1,26 s desktop**. O elemento LCP é `/media/tulius-portrait-dark.jpg`; arquivo pequeno e prioritário. Investigar sequência de dados Supabase, render inicial React e variação de laboratório antes de otimizações arbitrárias. Não comparar a rodada anterior iniciada antes do deployment com a rodada vinculada ao SHA correto.

## Pendências operacionais com escopo controlado

Consultar [**`OPEN_ISSUES.md` (somente pendências atuais)**](OPEN_ISSUES.md). Ordem proposta:
1. Organizar Fontes do projeto ChatGPT e preservar o backup exclusivo da seção 01; [inventário e instruções](RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md).
2. Criar ambiente/fixture segura de homologação e executar transações P2 via interface e Storage real, **sem editar dados aprovados**.
3. Medir e reduzir LCP mobile com hipóteses testáveis, manter estética, SEO, acessibilidade e 13/25; depois aceite humano P3.
4. Avaliar separadamente mídias/branches/função/objetos privados P1 — **nenhuma exclusão foi aprovada**.

## Referências por tipo de mudança

| Tarefa | Consultar antes |
|---|---|
| Todas | [`AGENTS.md`](../AGENTS.md), [README](../README.md), `main`, deployment e este índice |
| Layout, design, responsividade e motion | [DESIGN_SYSTEM](DESIGN_SYSTEM.md), [RESPONSIVE_LAYOUT](RESPONSIVE_LAYOUT.md), [UX_UI_MOTION](UX_UI_MOTION.md), componentes em `src/components/public/`, `src/index.css`; Fonte ChatGPT `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` é histórica |
| Conteúdo e CMS | [CONTENT_MODEL](CONTENT_MODEL.md), [ADMIN_CMS](ADMIN_CMS.md), `src/components/admin/`, `src/content/fallback.ts` e dados atuais Supabase |
| Segurança/Auth/Storage | [SECURITY_RLS](SECURITY_RLS.md), [P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md) e [P1](P1_INVESTIGACAO_HIGIENE_2026-10-28.md); nunca expor Secrets nem reaplicar baseline |
| Publicação | [DEPLOYMENT](DEPLOYMENT.md), CI e deployment `READY` do **mesmo SHA** |
| Histórico | [Auditoria acumulada 26–28/10](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md), [histórico de pendências](historico/OPEN_ISSUES_ACUMULADO_ATE_2026-10-28.md) e [histórico do README](historico/README_ACUMULADO_ATE_2026-10-28.md) |

## Regras de proteção

Preservar layout, fontes, fotografias, textos e conteúdo aprovado. Não criar branch/PR, não executar migrations, seed, alterações RLS, exclusão Storage, contas administrativas ou limpeza de histórico sem autorização específica. Não revogar o token histórico nem ativar Leaked Password Protection sem nova decisão do proprietário: constam como **riscos anteriormente aceitos, não resolvidos**. Não considerar screenshots automatizados equivalentes a homologação visual humana.

## Acompanhamento operacional P2/P3 — 28/10/2026

**P2:** suíte transacional isolada preparada em [`P2_TRANSACIONAL_STAGING_2026-10-28.md`](P2_TRANSACIONAL_STAGING_2026-10-28.md); **não executada**. Não havia branch Supabase de homologação e a criação exigiu confirmação de custo. O script falha fechado se receber ref de produção, testa JWT real de admin e não admin, CMS/Storage com fixture, sem excluir dados aprovados. Não reaplicar a baseline do GitHub no remoto sem revisão específica.

**P3:** após P5 e auditoria inicial, foram ensaiadas a separação de consultas SEO e renderização isolada da primeira dobra. O segundo experimento foi revertido por potencial regressão de TBT; o workflow agora coleta **três amostras mobile** no mesmo SHA para mediana/variância antes de novos ajustes. Nenhuma meta LCP ≤2,5 s foi alcançada ou declarada. [Evidências P3](P3_QUALIDADE_ACEITE_2026-10-28.md).

## Última medição P3 validada e plano P2 — 28/10/2026

- **P3:** [Audit #40757162085](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40757162085) `success`, Vercel `READY` previamente confirmado no **SHA `50a66f896deb87e315b194e65e3de964495beeb8`**. Medianas de três runs: **mobile Performance 82/LCP 4,32 s; desktop 98/LCP 1,16 s**. A11y/SEO/boas práticas 100 em todas as amostras; 13 seções, 25 painéis e 38 capturas sem falhas. Meta LCP mobile ≤2,5 s **continua aberta**. [Relatório P3](P3_QUALIDADE_ACEITE_2026-10-28.md).
- **P2:** [suíte de homologação isolada](P2_TRANSACIONAL_STAGING_2026-10-28.md) versionada e protegida contra uso no ref de produção, mas **não executada**: falta projeto/branch staging, confirmação de eventual custo, verificação de baseline e contas JWT de teste. P5 read-only 4/4 segue aprovado.

Este é o snapshot funcional antes do commit exclusivamente documental que registra a auditoria; sempre consultar o HEAD/deployment reais.

## Adendo de continuidade — ajustes solicitados na verificação manual (28/10/2026)

Esta atualização sucede o aceite automatizado histórico descrito no início do documento. As alterações solicitadas pelo proprietário foram implementadas no site público e no painel administrativo, com modificação editorial controlada no projeto Supabase de produção, **não** como execução da suíte P2 transacional suspensa. Nenhum staging pago, migration, alteração RLS ou exclusão foi realizado.

- **Experiências:** 13 itens de projetos excedentes marcados `isHidden=true` em três blocos (Invest RS 2, Prefeitura SP 3, Globo/SporTV 8), mantendo os originais no JSONB. Todos os empregadores têm até seis itens visíveis por padrão; a barra de navegação de seis empregadores permanece. O CMS permite alternar a visibilidade de cada item sem removê-lo.
- **Depoimentos:** cinco registros `published` em `public.testimonials`, sendo **três originais preservados** e **dois exemplos fictícios/ilustrativos identificados**, nunca apresentados como endossos reais. Dois blocos `depoimentos` vinculados à coleção com distribuição 2+3 entre os dois painéis mobile; a grade desktop usa três colunas e duas linhas, com expansão acessível.
- **Contato:** texto da assinatura já existente em `sections.intro` e localização já existente em `contato/a.items[0].text` são reaproveitados como rodapé; sem duplicar conteúdo no CMS. Coluna central reservada à fotografia; ícones dos links sem sobreposição.
- **Menu:** rótulos Início, Projetos em Destaque, Graduação e Experiência Profissional (destino `invest-rs`). Cinco entradas individuais de empregadores passaram a `is_visible=false`, preservadas no banco. **Menu público 8 entradas; estrutura pública continua 13 seções/25 painéis mobile**.

**Limites:** não declarar aceite visual humano nem homologação P2 transacional. A conferência em aparelhos físicos, zoom 200% e leitor de tela, assim como a meta LCP mobile ≤2,5 s, permanecem pendentes. Para o SHA de CI/Vercel mais recente consultar as plataformas ao vivo; o snapshot anterior continua histórico.

### Evidências finais da rodada manual

**Validação automatizada da rodada manual (28/10/2026):** [CI Validate #40773898800](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898800) `success`; [Audit P3 #40773898835](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40773898835) `success`, no SHA funcional [`faa43e2`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/faa43e2709bdcbe917e6e81bee2abb220dde5456) com Vercel Production `READY` antes da auditoria. Navegador: 13 seções, 25 painéis mobile, 8 viewports sem overflow, navegação sticky `PASS`, 38 capturas (13 desktop/25 mobile), zero falhas e zero painéis inadequados. P5 anônimo: 13 seções e 8 links de menu válidos, sem exposição de dados privados, `mutations=0`. O teste P4 reconhece a composição **intencionalmente fotográfica** de `contato/a` mobile somente quando a imagem existe e decodifica; todos os demais painéis mantêm critérios originais de conteúdo. Lighthouse mediano: mobile 75/LCP 4,69 s; desktop 94/LCP 1,56 s. Gate de regressão passou, mas LCP mobile ≤2,5 s **não está aprovado**. Aceite humano permanece aberto.

## Adendo — CMS de Seções/Mídia revisado (28/10/2026)

A nova frente manual solicitou tradução de status, confirmação e feedback de salvamento, verificação de layout/tema/motion/visibilidade, Biblioteca de mídia simplificada e editor de enquadramento por uso. O código implementa status em português nas listas, toast transiente em todos os módulos de escrita, confirmação de arquivamento/publicação e restrição dos layouts fixos. `is_visible` continua fonte pública de visibilidade, sem alterar schema ou as 13 seções visíveis da auditoria anterior. A Biblioteca agora abre campos apenas do asset selecionado; o título é o nome real do arquivo e o campo crédito/licença não é usado pela UI.

**Supabase leitura/gravação editorial autorizada:** 21/21 títulos `media_assets.title` ajustados para o nome do arquivo final com extensão; 19 valores de `credit` anteriores **não foram apagados** para preservar histórico, mas estão excluídos do editor e de novas gravações. Nenhum arquivo Storage, RLS, schema, conta administrativa ou custo foi alterado. Configuração X/Y/zoom usa propriedades opcionais JSONB somente em usos escolhidos; nenhuma mídia existente recebeu crop automático.

**Aceite:** a compilação e os testes automatizados validam código, não o fluxo de escrita com JWT real. O P2 transacional continua deliberadamente suspenso; requer autorização expressa para homologação autenticada. O aceite manual estético permanece aberto.
