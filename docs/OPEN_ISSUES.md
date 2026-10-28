# Pendências abertas

> **Índice vigente, reconferido em 28/10/2026:** [Auditoria consolidada e estado atualizado](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md). As notas abaixo formam um **histórico acumulado**: menções anteriores a quota Vercel, 0 mídias, 18 slides sem ilustrações, 2 revisões e SHAs antigos pertencem às datas em que foram observadas. Para o estado atual, usar o quadro novo ao final deste documento e as evidências ao vivo.

1. Invest RS: cargo divergente entre PDF e Canva.
2. Idiomas: rótulos fluente/avançado versus C1/B2.
3. Vale: confirmar contextos de 6 pessoas e 14 países.
4. Diferenciar viagens a 34 países e articulação com 14 países.
5. Confirmar cargos/descrições de InPress e CDI.
6. ~~Resolver X/Y/Z/XXXXX da seção Resultados.~~ Resolvido em 26/10/2026: lista do painel B substituída pelos cinco temas da abertura, com registro editorial preservado.
7. Substituir mídias temporárias da Invest RS.
8. Confirmar licenças/créditos finais de mídias.
9. Confirmar licença web da Neue Montreal; Heading Now Trial permanece excluída.

Backend: o schema do CMS já está ativo. As migrations P0/P1 e a migration P3.1 de revogação de privilégios estão aplicadas. A migration inicial de baseline existe no repositório, mas não está registrada no histórico remoto: **não a reaplicar**, apenas reconciliar historicamente em uma etapa controlada. Persistem testes E2E de escrita, publicação, rollback e Storage com sessão administrativa real.

Produto: UI de rollback granular permanece evolução futura; a listagem de revisões, os editores estruturados e os RPCs já estão implementados.

Qualidade: existem testes automatizados de Lighthouse, rotas anônimas, menu e responsividade com evidências nos artifacts do GitHub Actions. A auditoria automatizada passou em 8/8 viewports, inclusive 768 px, sem overflow. Restam inspeção visual humana contra as referências de Figma/PDF, zoom nativo de 200% e melhorias de performance mobile. Detalhes em `docs/P3_FECHAMENTO.md`.

## Pendências de segurança e aceite P5 (25/10/2026)

**Token Supabase exposto:** proprietário decidiu não revogar; risco permanece aceito, não corrigido. Não cobrar essa ação novamente sem mudança de decisão.

**Leaked Password Protection:** proprietário decidiu não habilitar e não fazer upgrade para esse fim. Aviso técnico permanece, por decisão expressa.

**CMS:** oito fluxos SQL e gatilhos de revisão/auditoria aprovados em transação revertida, mais isolamento de Storage por RLS em metadados temporários. Pendentes: E2E por navegador com JWT admin real, upload/download/substituição de arquivo, publicação e retorno do conteúdo no site em cenário isolado, restauração editorial a partir das revisões. Preservar dados reais; não confundir rollback da transação SQL com rollback funcional de versão.

## Decisão expressa do proprietário — 25/10/2026

O proprietário determinou **não revogar o token pessoal Supabase anteriormente exposto** e **não ativar o recurso Leaked Password Protection**. Estas duas ações ficam **fora do escopo**, por decisão do proprietário, e não devem ser novamente solicitadas como condição de avanço de P4/P5/P6, salvo nova orientação expressa. Nenhuma revogação, ativação ou upgrade foi realizada por esta decisão.

Esta decisão **não demonstra que o token exposto seja seguro**: caso ainda esteja válido, permanece o risco de uso não autorizado, inclusive porque versões históricas do Git podem conter a credencial. Também permanece desativada a checagem de senhas comprometidas. A decisão do proprietário registra aceitação de prosseguir sem essas duas medidas, **não** aprovação técnica do risco ou resolução dos avisos de segurança.

Prosseguir com P4/P5/P6 sem alterar essa escolha; registrar em relatórios futuros como **risco aceito, não corrigido**, sem cobranças repetidas.

## Ajustes visuais da seção 01 — fase de avaliação manual (25/10/2026)

Implementados no código: links integrais e hover dos cinco cards de especialidades, destino padrão para `#resultados` com seletor no CMS, selo reposicionado e texto expandido para Comunicação e Marketing, seta inferior animada e navegação sem mostrar a faixa da seção anterior, e título **MENU** no drawer. Sem alteração de schema ou dados publicados do Supabase (o padrão de texto do selo não exige persistência porque o JSON do perfil ainda não declara `hero.badgeText`).

**A validar pelo proprietário:** conferir visualmente o círculo e a legibilidade da frase em tamanhos diferentes; os cinco hover/foco e o clique no desktop e mobile; se `#sobre` ocupa integralmente a tela após clicar na seta; uso do seletor no admin com JWT real, gravação/preview/publicação e rollback editorial em contexto controlado. A confirmação de build Vercel `READY` **não substitui** essas verificações visuais nem o aceite. Próxima frente acordada: avaliar a **seção 02**, sem iniciar mudança nela nesta entrega.

## Seção 02 — atualização visual implementada (26/10/2026)

**Implementado em `main`:** composição desktop de três colunas com introdução original à esquerda, foto existente do Tulius segurando tablet no centro em altura integral, halo circular claro, e três blocos textuais na direita (incluindo “Estratégia também é escuta” deslocado do centro, sem repetir miniatura). Foto central e seu alt têm campos exclusivos no CMS, enquanto os textos já utilizam os campos existentes. O mobile não foi redesenhado. Sem alterações nos dados ou schema Supabase; nenhum asset novo foi criado.

**Qualidade técnica:** o GitHub Actions `Validate PortfolioTulius` passou completamente no commit `d6e1083` (formatação, TypeScript, Vitest, build, smoke e sintaxe das suítes). Evidência: https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40263871192. Uma melhoria na rotina CI exibe o diff sugerido por `oxfmt` quando a checagem de formatação falha; não modifica arquivos persistidos pelo runner.

**Homologação pendente:** comparar o resultado visual com o anexo 2 da solicitação em navegadores reais, incluindo ajuste fino de recorte/posição da imagem em desktop baixo, 768 px e zoom; testar a edição/salvamento de imagem desktop e dos três textos em sessão real do admin; confirmar o último deployment Vercel e o workflow Lighthouse no SHA final documental. Não registrar teste visual ou CMS autenticado como aprovado sem execução.

## Atualização de conteúdo das seções 02 e 03 — 26/10/2026

Concluído e verificado no Supabase: cinco textos em uma única lista editável no painel B de `sobre` (inicialmente 5; quantidade variável, com ações adicionar/editar/excluir/reordenar no CMS), enquanto o painel A permanece responsável pela fotografia. Renderers desktop/mobile usam uma única fonte de texto. Na seção `resultados`, os sete títulos anteriores do painel B foram substituídos pelos cinco temas de especialidades da seção 01; os quatro indicadores do painel A não foram alterados.

A pendência `panelB.placeholder` (X/Y/Z/XXXXX) da seção `resultados` foi marcada `resolved` no banco com justificativa; preservar registro histórico, mas **não classificar essa pendência específica como aberta daqui em diante**. Os outros itens editoriais e decisões de segurança permanecem inalterados. Este fechamento refere-se apenas ao placeholder removido do painel B, não a qualquer indicador ou informação que ainda precise comprovação.

**Pendências de aceite:** testar autenticamente inclusão, edição, ordem, exclusão, confirmação e salvamento do bloco `sobre/B` pela UI; inspecionar cinco textos em desktop/mobile e correspondência dos títulos da seção 03; confirmar acessibilidade/overflow em desktop baixo e mobile. Ver `docs/CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md`.

## Seção 03 interativa e remoção visual da seção 04 — 26/10/2026

**Implementado:** visão geral preservando os quatro valores numéricos, substituindo rótulos 01–04 por quatro ícones SVG configuráveis pelo CMS; cinco especialidades clicáveis com hover/foco/estado ativo; atualização dos dossiês centrais e métricas associadas a cada tema; ligação contextual pelos cinco cards da seção 01. Cada dossiê tem eixo central, título, subtítulo, temas relacionados, texto curto e trechos aproveitados dos cinco itens da antiga seção 04. A seção `competencias` foi ocultada do site por `is_visible=false`, sem excluir seus blocos ou conteúdo histórico.

**Critérios técnicos:** após ocultar uma seção e unificar o painel mobile de resultados, o contrato público passa a 13 seções e 25 painéis mobile. `scripts/p3-browser-smoke.mjs`, `scripts/p4-visual-audit.mjs` e `scripts/p5-public-rls.mjs` foram atualizados conforme esse contrato, preservando verificações de overflow, RLS e visibilidade. Ícones e associações `relatedThemeKeys` ficam no bloco A; textos e tema `themeKey` no bloco B da seção Resultados; os cinco cards Perfil/B também têm `themeKey` estável.

**Homologação pendente:** interação real mouse/teclado e navegação desde todos os cards; captura visual dos temas em desktop e mobile, inclusive alturas pequenas; gravação dos ícones/temas/textos via JWT administrativo real e revisão de rollback; auditoria completa após atualização dos testes. A ausência de métricas associadas a temas sem números comprovados é intencional, não perda de informação. Ver `docs/CONTINUIDADE_INTERATIVIDADE_SECAO_03_2026-10-26.md`.

## Formação e experiências em camadas — 26/10/2026

**Implementado no GitHub e Supabase:** Formação `theme=ink`, texto branco/laranja; seis experiências `theme=paper` e composição sticky sobreposta; seletor fixo das seis empresas com marca/título, links de âncora e estados ativos; galeria por projeto com setas, contador e indicadores; CMS para cadastrar/remover/reordenar slides, logo, URLs, alt e legendas, sem schema/RLS novo. Os blocos A/B existentes foram preservados. Foram criados 18 slides editoriais de texto (três por empresa) associados a projetos cadastrados.

**PENDÊNCIA DE ATIVOS OBRIGATÓRIOS:** não há fotos reais dos projetos nem logotipos autorizados em `media_assets`, Storage ou `public/media`. As galerias exibem placeholders, e as marcas são monogramas temporários. O usuário deverá fornecer/aprovar arquivos (logo e fotografias com direitos de uso) para concluir o requisito visual. Não afirmar que as fotos foram publicadas.

**PENDÊNCIA DE PUBLICAÇÃO / CI:** a API da Vercel respondeu HTTP 402 `api-deployments-free-per-day` ao tentar novo deploy (limite diário); foi encontrada publicação automática `READY` em commit de código anterior ao último ajuste de testes. Confirmar o SHA do deployment efetivamente ativo antes de declarar o código atualizado em produção. O GitHub `main` recebeu commits posteriores. Não alterar cobrança ou quota sem autorização.

**PENDÊNCIA DE ACEITE:** validar os seis layers por rolagem real (especialmente mobile e alturas baixas), seleção de empresas, sliders/pontos e links no navegador; conferir o header global e ausência de sobreposição indevida; homologar campos de mídia pelo admin autenticado e revisão/rollback; entregar fotografias/logos.

**Ajuste pós-auditoria:** screenshot mobile revelou sobreposição do conteúdo do próximo empregador sobre a galeria atual. Corrigido no código em `6cfe4d04` por desativação do sticky de cards abaixo de 768px, preservando a navegação fixa e o efeito desktop. **A produção `READY` mais recente ainda aponta `f8bc345c`**, portanto a correção não está confirmada no site público e requer novo deployment após liberação da quota Vercel. Não confundir sucesso da auditoria P3 sobre o código em produção antigo com aprovação visual da correção ainda não implantada.

## Ferramentas, links de carreira e contato — 26/10/2026

**Implementado em código e conteúdo:** seção Ferramentas `theme=ink` com pictogramas locais configuráveis por item (até três, sem repetições); seis cards de experiência da seção 01 com destinos individuais corretos e hover/foco na superfície inteira; hover/foco dos valores e títulos clicáveis na seção Contato. Conteúdo original preservado. Banco atualizado com transação que verificou título/contagem dos itens e existência das seções; consultas posteriores confirmaram seis `targetSlug` e seis conjuntos de ícones.

**Pendências de aceitação:** validar edição autenticada dos destinos e dos ícones no CMS, testar a navegação por mouse e teclado em desktop/mobile e confirmar que a versão mais recente está implantada na Vercel. Os ícones são pictogramas semelhantes às plataformas, não assets oficiais; se a exigência passar a ser fidelidade às marcas, cadastrar os respectivos SVGs autorizados é uma tarefa editorial separada.

**Nota de deployment:** acompanhar o limite Vercel `api-deployments-free-per-day` já observado na etapa anterior antes de declarar a atualização publicada.

**Situação confirmada no encerramento da etapa:** GitHub Actions `Validate PortfolioTulius` **sucesso** no commit `9294fa2e92af918e4c5b372db82fb62608864631` (run `40277247507`; formatação, TypeScript, Vitest e build). Tentativa manual de deployment **bloqueada pela Vercel** com HTTP 402 / `api-deployments-free-per-day`, indicação de aguardar 1 dia. A produção `READY` observada antes desta tentativa aponta `382ec95f41fe`, anterior aos componentes e ajustes completos de Ferramentas/carreira/Contato. **Não considerar entrega visual concluída em produção** até novo SHA `READY`. O tema da seção Ferramentas pode aparecer já modificado em `tulius.work` porque vem diretamente do Supabase; os componentes React/CSS atualizados dependem de deployment.

## Conferência documental cruzada — 26/10/2026

**Documentação harmonizada:** `README.md` foi corrigido para descrever a seção 02 com cinco declarações gerenciadas em `sobre/B` e imagem/metadados em `sobre/A`, diferenciando o relatório histórico de três declarações. `docs/RESPONSIVE_LAYOUT.md` passou a documentar **13 seções públicas, 25 painéis mobile e 38 capturas** (seção 04 oculta, resultados com painel único), além da sobreposição de empresas no desktop e da leitura sequencial mobile. `docs/DEPLOYMENT.md` registra CI, SHA de produção e o procedimento de retomada após limite de deployments.

**Evidências confirmadas antes desta atualização documental:** `Validate PortfolioTulius` **aprovado** no commit `52a5b61bfde881c05a67bc3d7fa665eb26f1182f` (run [40277484553](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40277484553)). O último deployment Vercel de produção `READY` observado estava em **`382ec95f41fe35452602a7327e75a57565caeebf`** (`dpl_frYDWCnqoMqeKHt3BjVBwQc7Z9FP`). A tentativa anterior de publicar o bundle de Ferramentas, cards profissionais e Contato foi rejeitada com HTTP 402 / `api-deployments-free-per-day`. **Não há confirmação de que esse bundle e a correção mobile posterior estejam ativos no site.** GitHub validado e Supabase com dados atualizados não equivalem à homologação da UI na Vercel.

**Ações ainda abertas:** quando a quota permitir, publicar SHA de produção correspondente à `main`, verificar aliases e rodar testes de navegação/interação/capturas em desktop e mobile; testar CRUD, gravação e rollback por sessão admin real; providenciar mídias/logos aprovados dos projetos das seis empresas (18 slots preparados, sem imagens). Preservar os registros históricos das fases anteriores mesmo quando citarem 14/28/42 no contexto de sua execução original.

Esta atualização é documental. **Nenhuma mudança foi feita no código da aplicação, no Supabase ou em configurações de infraestrutura nesta conferência.**

### Atualização de status após recuperação da Vercel — 26/10/2026

**Supera apenas o bloqueio de publicação indicado nos registros anteriores.** Foi confirmado deployment Vercel de produção **READY** `dpl_DEAtJaZsRybM7HRV84TbYkZpT8gX` com commit `1f528b9560a062a5a0459de88516fd56ee9fc6b8` e aliases `tulius.work` / `www.tulius.work` sem erro de alias. Esse commit **inclui** o código das ferramentas, hover de contato, seis cards clicáveis e a correção mobile da sobreposição das experiências. O erro anterior `api-deployments-free-per-day` deve ser tratado como ocorrência histórica, não bloqueio ainda vigente da última versão publicada.

**Ainda abertos:** inspeção manual do site publicado (desktop, mobile, barra sticky, seis destinos e galerias, Ferramentas e Contato), fluxo CMS autenticado de escrita/revisão/rollback, inclusão e licença de seis marcas/18 imagens de projetos; melhorias já enumeradas nas pendências editoriais. O CI mais recente do ramo deve ser conferido por SHA: a existência de um deployment READY não constitui aceite humano nem E2E admin.

## Consolidação da etapa 3 — 26/10/2026

O proprietário autorizou validar o texto já publicado em três blocos sinalizados como provisórios: `resultados/A`, `invest-rs/A`, `invest-rs/B`. Os três blocos estão agora `is_placeholder=false`, com nota editorial explícita. **A pendência real de imagens não foi resolvida:** `invest-rs/B` mantém `items[3].placeholder=true`, enquanto todos os 18 slots de mídia profissional continuam sem imagens aprovadas. As oito pendências editoriais abertas não foram fechadas por inferência.

No código, foram abordados o contraste dos metadados da Formação e a compensação de falhas no Storage, com novos testes unitários. Permanecem abertas: homologação autenticada do CMS e upload/download real; Lighthouse do novo código em produção (performance mobile); aprovação de fotos e logotipos; revisão cuidadosa de grants `private`. Consulte `docs/ETAPA_3_AJUSTES_2026-10-26.md` para o escopo e os limites. As notas anteriores permanecem como histórico, não como inventário de estado atual.

**Fechamento adicional da inconsistência de navegação:** o registro de `navigation_items` para `competencias` foi marcado `is_visible=false` em transação protegida por condição de seção oculta. Consulta posterior: **13** itens de navegação públicos e **0** referências visíveis à seção oculta. Não houve exclusão de conteúdo histórico.

## Atualização de pendências — P0 documental de 28/10/2026

Esta atualização **não fecha automaticamente as oito pendências editoriais** do Supabase (9 registros: 8 abertos, 1 resolvido). A lista numerada inicial é histórica/editorial; os pontos abaixo distinguem riscos técnicos, pendências de qualidade e trabalho posterior:

- **Publicação:** antes do commit de documentação, `main` estava em `dcb8831221a54fb713031011c8da8b20fe157b38`; [CI 40301041397](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40301041397) aprovado; [deployment de produção `dpl_FEJWKVLYi69qqFmg1da71H82Sue4`](https://vercel.com/tuliustsangaropulos-creates-projects/portfolio-tulius/FEJWKVLYi69qqFmg1da71H82Sue4) `READY` no mesmo SHA. O erro de quota anterior foi superado; avaliar separadamente o status após este novo commit documental.
- **Mídia:** 21 registros publicados em `media_assets` (19 SVG + 2 PNG), todos com objeto e `alt_text`; 23 objetos físicos (21 no bucket público, 2 no privado). Os **2 privados não catalogados** requerem decisão de preservação/exclusão após inspeção, **não** exclusão por ausência de linha. Direitos/créditos dos 2 PNGs e proveniência editorial das ilustrações ainda exigem validação; SVG editorial não é fotografia nem logotipo oficial.
- **Conteúdo profissional:** a fase de 18 slots sem imagens era anterior à incorporação dos 19 SVGs. O requisito de fotografias/logotipos profissionais **aprovados** não foi resolvido pela ilustração. Não apagar os slides existentes e não criar métricas ou clientes fictícios.
- **CMS/segurança:** 22/22 tabelas públicas com RLS, 7 migrations remotas e 8 arquivos SQL em `supabase/migrations/`; a baseline `202610220001_portfolio_cms.sql` não consta como aplicada e **não deve ser reaplicada**. Seis RPCs `SECURITY DEFINER` com guarda administrativa exigem testes negativos com JWT real; não houve execução P5 nas 411 runs consultadas. Testes de gravação, publicação, revisão/rollback UI e upload/download binário real continuam abertos.
- **Históricos:** `content_revisions=12` e `audit_logs=12`; não confundir existência de registros com implementação/homologação de rollback. A função `portfolio-illustrative-import-20261026` permanece implantada `ACTIVE` (v2, `verify_jwt=true`); o relatório anterior descreveu retorno HTTP 410 e encerramento lógico, mas remoção só entra em P1 após inspeção de dependências.
- **Branches:** há três branches remotas; usar somente `main` para novos trabalhos. `fix/header-hero-section-navigation-20261025` tem 4 commits próprios e `fix/p3-motion-units-20261024` nenhum; não excluir sem revisão/autorização.
- **Qualidade:** o [Lighthouse histórico de 26/10](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40288148755) apontou Performance 80 mobile, LCP 3,86 s; não representa medição do HEAD `dcb8831` ou do commit documental. Pendentes nova auditoria do deployment, 13 seções públicas / 25 painéis mobile / 38 capturas, zoom 200%, dispositivos reais, acessibilidade, SEO e otimização causal de LCP mobile.
- **Fontes ChatGPT:** consultar [reconciliação documental](RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md), preservar as cinco referências históricas, anexar cópias correntes quando necessário e manter as duas variantes históricas do relatório da seção 01 sem escolher uma silenciosamente. A exportação Actions retém o artifact por apenas 7 dias.

**Escopo desta P0:** somente documentação GitHub; sem alterações em aplicação, migrations, Auth, RLS, Storage, CMS, DNS ou direitos/risco previamente aceitos.

## Resultado da investigação P1 — 28/10/2026

A análise técnica foi documentada em [`P1_INVESTIGACAO_HIGIENE_2026-10-28.md`](P1_INVESTIGACAO_HIGIENE_2026-10-28.md), **sem excluir nem modificar** objetos, Edge Functions, branches, migrations, CMS ou dados aprovados.

- **2 objetos privados:** cada PNG corresponde, em path, tamanho e `eTag`, a uma versão pública catalogada. O código do CMS deixa a origem privada após promover a cópia pública, explicando os órfãos aparentes. **Manter** até política de retenção e homologação JWT/Storage com recuperação.
- **19 SVGs:** as versões publicadas no Storage não são byte a byte iguais às 19 versões `public/media/editorial-*.svg` no GitHub (19 tamanhos diferentes). Preservar ambas, validar qual versão editorial é aprovada e corrigir proveniência/alt/créditos só com informação comprovada.
- **2 PNGs de logotipo:** usados por InPress/Vale, com `credit` nulo. Direitos/origem precisam de decisão humana; não declarar logotipo oficial licenciado sem confirmação.
- **Função de importação:** status `ACTIVE` v2, código HTTP 410 sem rotina de importação; log histórico v1 HTTP 200 em 26/10 e nenhuma chamada identificada na janela consultada de 27/10. **Não remover** até checar dependências externas e obter autorização.
- **Branches:** quatro commits exclusivos da branch de navegação revisados; características principais já aparecem na `main`, sem justificativa comprovada para cherry-pick. Branch de motion sem commits exclusivos. Ambas preservadas, aguardando decisão de arquivamento/exclusão.

**Status P1:** investigação read-only encerrada; **limpeza física/operacional pendente de autorização e condições técnicas**. P2 segue pendente e não foi confundida com testes de Storage real ou JWT admin.

## P2 — verificação administrativa parcial (28/10/2026)

Consultar [`P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md`](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md). Três transações **`READ ONLY`/`ROLLBACK`** passaram: `anon` enxerga 13 seções e 21 mídias públicas (0 dados administrativos/Storage privado); usuário comum `authenticated` **simulado** recebe `portfolio_admin_required`; admin **simulado** acessa 14 seções, 2 objetos privados, 9 questões editoriais e 12/12 históricos. 22/22 tabelas públicas possuem RLS; todas as seis RPCs públicas administrativas verificadas chamam a guarda `private.require_portfolio_admin()`. Contagens antes/depois inalteradas.

**Não homologado:** JWT administrativo emitido pelo Auth, login/preview/logout no navegador real, upload/download binário do Storage, gravação/publicação/rollback de fixture pela UI. O workflow manual [`P5 Admin Read-Only E2E`](../.github/workflows/p5-admin-readonly.yml) requer `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` configurados exclusivamente em GitHub Actions Secrets e execução `workflow_dispatch` por usuário autorizado. A consulta GitHub retornou **0 execuções `workflow_dispatch`** no repositório. Os conectores desta sessão não fornecem gestão de Secrets ou despacho inicial do workflow; não pedir senha no chat.

**Próximo gate P2:** execução autenticada em Actions e registro de run/SHA; depois, ambiente de ensaio isolado e autorização para escrita/Storage de bytes em fixture reversível. **Não declarar P2 concluída** nem criar dados/mídias de teste em produção sem salvaguardas.
 
## P5 — tentativa autenticada real e correção do teste (28/10/2026)

Na execução manual [#40743655591, tentativa 2](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40743655591), o workflow **passou no login administrativo com JWT real e no acesso aos 8 módulos**; falhou depois na prévia por verificar as 14 seções imediatamente após aparecer a faixa de pré-visualização, antes de aguardar o carregamento do Supabase. O logout e o resumo final de ausência de mutações não foram executados. A suíte `scripts/p5-admin-readonly.mjs` foi ajustada para aguardar 14 seções e capturar apenas diagnósticos estruturais, sem tokens ou conteúdo.

**Pendente:** disparar um **novo** `Run workflow` na `main` após a publicação do commit corrigido (não reexecutar o SHA histórico), verificar os quatro gates completos e, separadamente, testar CRUD/Storage binário somente com fixture reversível. Relatório [P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md).

## P5 — terceira execução e ajuste de viewport (28/10/2026)

A [execução manual #40745002663](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745002663), no SHA `c4f0358`, **aprovou login JWT real, 8 módulos e prévia com 14 seções**. Falhou somente ao tentar clicar em `Sair` via Puppeteer (`Node is either not clickable or not an Element`); logout e bloqueio pós-logout não foram verificados. A suíte foi atualizada para viewport desktop 1440×900, verificação do botão na área clicável e clique físico. **Novo Run workflow** ainda necessário. Não confundir `FAIL` do driver com um teste negativo de Auth. Ver [relatório P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md); CRUD/Storage real seguem pendentes.

## P5 — aceite autenticado read-only concluído (28/10/2026)

**Concluído:** [P5 Admin Read-Only E2E #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770), SHA `af95b5daac2032b10ff1b5962918618a417dd862`, **SUCCESS**. Nos logs: `P5_ADMIN_LOGIN PASS`, `P5_ADMIN_MODULES PASS` (8), `P5_ADMIN_PREVIEW PASS` (14, incluindo `competencias`), `P5_ADMIN_LOGOUT PASS` (reacesso bloqueado) e `P5_READONLY_RESULT {"passed":4,"expected":4,"contentMutations":0}`. **Não é mais uma pendência configurar Secrets, iniciar workflow ou validar logout deste P5.** As tentativas falhas acima permanecem como histórico.

**P2 ainda pendente:** testes reais de CRUD/publicação/restauração pela UI e upload/download/substituição de bytes no Storage com fixture isolada e limpeza autorizada; teste negativo JWT de usuário não admin real não foi executado. Ver [relatório P2 atualizado](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md). Não fechar as 8 pendências editoriais de produção com base neste aceite read-only.

## P3 — auditoria de qualidade e aceite automatizado (28/10/2026)

O [run #40747019980](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40747019980) foi **SUCCESS** após confirmação de deployment Vercel `READY` para o **mesmo SHA e3bfccf** antes de iniciar Lighthouse. **13 seções públicas, 25 painéis mobile, 38 capturas, 8 viewports e RLS anônimo passaram; A11y/Boas Práticas/SEO=100/100** em ambos os dispositivos. Mobile **Performance 82 / LCP 4,38 s**, desktop **97 / LCP 1,26 s**. O primeiro run P3 #40746505324 é preliminar porque iniciou medição mobile antes de o deployment ficar `READY`; não misturar resultados.

**Prioridade P3 ainda aberta:** LCP mobile acima do objetivo `<=2,5 s`. Elemento LCP é retrato local de 13 KB já pré-carregado; a principal investigação deve ser o atraso de render/hidratação CMS/React, com A/B medido e sem mexer na identidade visual por tentativa. Também estão **pendentes** comparação estética final com Canva/Figma, zoom 200% e leitor de tela real. Detalhes e plano de otimização em [`P3_QUALIDADE_ACEITE_2026-10-28.md`](P3_QUALIDADE_ACEITE_2026-10-28.md).
