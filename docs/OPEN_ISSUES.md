# Pendências abertas

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

No código, foram abordados o contraste dos metadados da Formação e a compensação de falhas no Storage, com novos testes unitários. Permanecem abertas: homologação autenticada do CMS e upload/download real; Lighthouse do novo código em produção (performance mobile); aprovação de fotos e logotipos; ajuste secundário de navegação para a seção `competencias` oculta; revisão cuidadosa de grants `private`. Consulte `docs/ETAPA_3_AJUSTES_2026-10-26.md` para o escopo e os limites. As notas anteriores permanecem como histórico, não como inventário de estado atual.
