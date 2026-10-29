# CMS administrativo

> **Estado operacional em 28/10/2026:** confira [índice vigente](ESTADO_ATUAL_VIGENTE.md) e [pendências P2](OPEN_ISSUES.md). O [P5 de leitura autenticada #40745631770](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40745631770) **passou 4/4** (login, 8 módulos, prévia, logout, zero requisições de escrita CMS/Storage detectadas). **Não testou salvar, publicar, alterar, promover upload ou restaurar via UI.** Os fluxos descritos abaixo são funcionalidades do código, não provas de homologação transacional. A restauração de snapshots pela interface **não está implementada**. A seção antiga de 26/10 deve ser lida como histórico das alterações; não criar usuário administrativo adicional sem pedido explícito.

## Capacidades implementadas

- Login Supabase Auth e verificação adicional em `admin_users`.
- Dashboard de estado e pendências.
- Seções: editar, publicar, ocultar, ordenar por botões, duplicar e arquivar com confirmação.
- Blocos: criar, editar e arquivar; editar itens, ordem, painel A/B, placement, layout e motion.
- Coleções: experiências, projetos, métricas, competências, formação, idiomas, ferramentas, depoimentos e contato.
- Design: editar/publicar cores, fontes autorizadas, container, espaçamento, raio e duração.
- Mídia: upload privado, alt, crédito, substituição e promoção ao bucket público.
- Navegação: criar e editar rótulo, grupo, âncora, ordem, status e visibilidade.
- SEO: título, descrição, Open Graph e canonical.
- Governança: pendências editoriais, revisões automáticas e audit log no banco.
- Preview: rota protegida com consulta incluindo drafts.

Nenhuma configuração executa JS/CSS do banco. Slugs publicados são bloqueados no editor.

## Conta administrativa e provisionamento excepcional

Já existe **uma conta Auth associada a um registro em `admin_users`** no snapshot verificado de 28/10. Não criar ou substituir contas durante homologação documental. **Somente se for solicitada expressamente uma nova conta**, provisionar via Supabase Auth e inserir seu UID em `admin_users` pelo operador autorizado. Não existe autopromoção, signup administrativo público ou autorização baseada apenas em `authenticated`.

Revisões e auditoria são gravadas por trigger. Restauração de snapshots pela interface permanece evolução futura.

## Destino dos cinco cards da abertura (25/10/2026)

Em `/admin`, abra **Blocos e painéis**, escolha **Perfil** e selecione o bloco de **painel B** (com cinco especialidades e seis experiências). Nos **itens 01 a 05**, aparece **Destino do card (seção interna)**. Selecione a seção desejada e clique em **Salvar alterações**; o valor é salvo como `targetSlug` em cada item de `content_json.items` pela mesma RPC atômica existente. Os cards são links em toda a superfície, tanto no desktop como no painel B mobile. O destino padrão, inclusive para itens antigos sem o campo, é **Resultados e projetos em destaque (`#resultados`, seção 03)**.

Os destinos são selecionados entre slugs do CMS. O renderer aceita somente slugs que correspondam a seções visíveis e publicadas; um alvo ausente/não publicado cai para `#resultados` (ou apresenta card sem link se também faltar a seção 03). Não usar `meta` para configurar esses links: `meta` permanece reservado ao conteúdo/metadado existente. A gravação do editor com JWT administrativo real ainda exige homologação manual; a disponibilização do campo no código não prova o teste de gravação em produção.

## Seção 02 — gestão completa dos cinco textos (26/10/2026)

Em `/admin` → **Blocos e painéis**, escolha **Olá!** e o **painel B**. Os cinco títulos e respectivos textos da coluna direita estão no mesmo bloco, em `content_json.items`, podendo ser:
- **Adicionados** por **Adicionar item**;
- **Editados** nos campos **Título** e **Texto**;
- **Reordenados** pelas setas para cima/baixo;
- **Excluídos** pelo botão de remoção, sujeito a confirmação.

Use **Salvar alterações** para gravar via RPC `save_content_block_atomic`. A quantidade não fica limitada a cinco: cinco é o conteúdo inicial solicitado. Não remova o único item do **painel A**, que armazena a fotografia e seus campos desktop, inclusive `aboutDesktopImage` e `aboutDesktopAlt`. A coluna esquerda continua sendo editada em **Seções → Olá!** (título, subtítulo e introdução).

**Renderização:** no desktop, toda a lista B aparece à direita na mesma ordem. No mobile, a foto do painel A é acompanhada pelo título/texto do primeiro item B; os demais itens B aparecem no painel mobile B. Nenhuma cópia textual é mantida no item de foto. Se todos os textos forem excluídos, permanece apenas a fotografia no mobile A.

## Seção 03 — lista de especialidades

Em **Blocos e painéis → Resultados e projetos em destaque → painel B**, estão os cinco temas iguais aos cards 01–05 da seção 01. Podem ser editados pelo CMS, mas **não são ligados automaticamente** aos títulos da seção 01 após futuras alterações; para manter a equivalência editorial, modificar ambos os blocos ou solicitar a implantação de sincronização automatizada. O painel A da seção 03 contém os quatro indicadores de resultados e não foi alterado nesta rodada.

**Aceite pendente:** salvar/adicionar/excluir/reordenar com JWT administrativo real ainda requer teste autenticado de navegador; o sucesso do SQL e os testes unitários não demonstram o fluxo UI completo.

## Seção 03 — resultados temáticos e ícones (26/10/2026)

**Gerenciar indicadores:** em **Blocos e painéis → Resultados e projetos em destaque → painel A**, cada indicador continua com valor, título e texto. O campo **Ícone do indicador** escolhe entre dez pictogramas internos (gráfico, crescimento, pessoas, imprensa, meta, comunicação, projetos, eventos, destaque e estratégia), sem URLs de ícones externos. Em **Exibir este indicador nos temas**, marque uma ou mais especialidades às quais o resultado comprovado pertence. Na **Visão geral**, os quatro indicadores aparecem juntos; em cada tema, aparecem apenas os resultados vinculados. Não inferir números nem relacionar resultados sem fundamento.

**Gerenciar os cinco temas:** no mesmo módulo, abrir o **painel B** de Resultados. O campo **Título** é o rótulo clicável à direita; campos adicionais editam **Identificador do tema**, **Eixo central**, **Título central**, **Subtítulo central**, **Temas relacionados**, **Texto curto** e **Conteúdo reaproveitado da antiga seção 04** (uma linha por destaque). Ordem e itens continuam editáveis pelas ferramentas padrão do bloco. O identificador de tema deve ser único, minúsculo e sem caracteres especiais (`corporativa`, `projetos`, `eventos`, `marketing`, `imprensa` na entrega).

**Ligação desde a abertura:** em **Perfil → painel B → cards 01 a 05**, além do campo **Destino do card**, há **Tema selecionado na seção 03**. O tema é aplicado somente se o destino continuar sendo `resultados`. Identificadores permanecem estáveis após reorganizar os cards, desde que não sejam removidos ou editados indevidamente.

**Seção 04:** `competencias` recebeu `is_visible=false` em `sections`. Não foi excluída nem arquivada, continua disponível no admin. Os cinco registros originais de Habilidades, Gestão, Competências, Relações e Destaques também foram transpostos para os destaques temáticos da seção 03. Para reativar a antiga seção, usar a gestão de visibilidade do CMS em operação expressamente autorizada.

**Aceite pendente:** selecionar, salvar e publicar alterações com JWT administrativo real, verificar revisão/rollback, e testar vinculação/tema depois de reordenação. Atualização direta de JSONB e build não validam esse fluxo autenticado.

## Administração das galerias e logotipos das seis empresas — 26/10/2026

Em `/admin` → **Blocos e painéis**, selecione uma das seis empresas (Invest RS, Prefeitura de São Paulo, Vale, TV Globo/SporTV, Grupo InPress ou CDI Comunicação) e abra o **Painel A**. A seção **Identidade da empresa e galeria de projetos** edita diretamente `content_json.experienceMedia`, sem nova tabela:

- **URL do logo** (somente `/media/arquivo` ou HTTPS), **descrição alternativa do logo**; se não preenchidos, aparece um monograma tipográfico temporário, que **não representa a marca oficial**.
- **Slides**: adicionar/excluir/reordenar, editar título do projeto, URL da foto, texto alternativo e legenda. O conteúdo inicial contém três projetos por empresa sem foto aprovada. A galeria mantém espaço reservado identificando a pendência, nunca fotografia fictícia.
- Salvar com **Salvar bloco**, pela mesma RPC atômica `save_content_block_atomic` e mecanismo de revisão do CMS. URLs são validadas pela lista segura `isSafeEditorialImage`; cada foto e logo informativos exigem `alt`.

Os textos e conteúdos existentes dos **Painéis A e B** continuam administráveis e foram preservados. As imagens devem ser registros realmente relacionados ao projeto e com autorização de uso; **não inserir material ilustrativo genérico como se documentasse a atuação profissional**. Somente depois de cadastrar URLs válidas a galeria exibirá fotos. O sistema não cria arquivos nem transfere imagens automaticamente para o Storage.

A seção Formação mantém os mesmos blocos; sua identidade escura foi configurada no tema da seção. As seis empresas receberam `theme='paper'`, mas o layout especial é exclusivo desses slugs. Não alterar a ordem para fora do grupo sem reavaliar o componente `ExperienceStack`.

**Ainda pendente:** homologar inclusões e exclusões de slides, persistência/rollback com sessão autenticada, qualidade/ direitos das imagens e arquivo real das seis logomarcas.

## Ferramentas e links de experiência — 26/10/2026

- **Ferramentas:** em `/admin` → **Blocos e painéis** → **Ferramentas**, selecionar **Painel A** ou **Painel B**. Cada item possui checkboxes **Ícones de plataformas (até três)**: Google Analytics, Search Console, Meta Ads, indicadores, Salesforce, HubSpot, Sprinklr, Asana, Notion, Adobe, Figma, WordPress, social, vídeo e campanhas. A lista de quinze pictogramas é local e tipada; cada item aceita no máximo três sem repetições. Salvar alterações pela RPC existente `save_content_block_atomic`.
- **Experiência e atuação (seção 01):** em **Perfil → Painel B**, os itens **6–11** agora expõem **Empresa de destino (card clicável)**. Selecionar uma das seis seções de experiência publicadas, ou **Sem link**. Os cinco itens 1–5 continuam com seus campos de tema/destino existentes. O clique da caixa inteira funciona em desktop/mobile, com hover e foco.
- **Contato:** efeito de hover e foco no CSS, sem novos campos e sem mudanças em URLs.

A identidade da seção Ferramentas usa `sections.theme='ink'`. Na ausência de alteração explícita, preservar textos originais. **Pendente:** testar edição, salvamento, revisão/rollback de ícones e destinos usando uma sessão JWT administrativa real; os commits GitHub e SQL não substituem essa homologação.

## Etapa 3 — mídia com compensação e aprovação de textos (26/10/2026)

Uploads privados e substituições passam por procedimento compensatório: o arquivo novo é enviado, os metadados são gravados, e somente então um arquivo substituído é removido; se a gravação falha, tenta-se remover o novo arquivo. Uma falha de limpeza é reportada ao operador. **Não é uma transação distribuída entre PostgreSQL e Storage**; homologação com JWT administrativo real ainda falta.

A pedido do proprietário, os textos publicados de `resultados/A`, `invest-rs/A` e `invest-rs/B` tiveram a marca de placeholder do bloco removida. O item específico **Ativos visuais**, dentro de `invest-rs/B`, continua `placeholder=true` por não haver imagens aprovadas; as notas `editorial_note` documentam a distinção. O conteúdo `content_json` não foi reescrito. Ver [registro da etapa 3](ETAPA_3_AJUSTES_2026-10-26.md).


## Correção da pré-visualização da Biblioteca de mídia — 26/10/2026

A Biblioteca de mídia agora exibe a **imagem real**, em vez de um ícone fixo, em cartões de arquivos privados e públicos. A imagem usa `object-fit: contain` para preservar as proporções dos logotipos e tem fallback visível para caminho ausente, erro de assinatura ou falha de carregamento.

- **Bucket `portfolio-private`:** o admin autenticado solicita uma URL assinada com validade de 3.600 segundos por meio da sessão e das regras RLS existentes; a URL é mantida apenas no estado do componente e não é gravada no CMS. Após expirar, recarregue a Biblioteca de mídia para gerar uma nova prévia.
- **Bucket `portfolio-public`:** a URL pública é obtida pelo SDK via `getPublicUrl(storage_path)`; não é necessário abrir o bucket privado para visitantes.
- **Fluxos preservados:** upload privado, metadados, revisão, publicação, substituição e referência de logo por URL em `Blocos e painéis`. Não houve alteração de Auth, RLS, bucket nem conteúdo editorial.
- **Limite:** testes unitários cobrem geração da URL e falhas. Sem execução E2E com JWT admin, não afirmar que o carregamento de imagens privadas foi homologado no navegador real.


## Seleção de imagens nos Blocos — 26/10/2026

Em **Admin → Blocos e painéis**, os antigos campos de URL para imagens dos itens, foto principal desktop da seção Olá!, logos das seis empresas e fotografias dos slides foram substituídos por **Escolher da biblioteca**, com grade de miniaturas, busca pelo título/nome e indicação da seleção atual. A imagem escolhida grava a URL pública existente no mesmo campo do JSONB (sem migração) somente ao clicar em **Salvar alterações / Salvar bloco**.

A lista inclui exclusivamente imagens com `status=published`, `storage_bucket=portfolio-public`, MIME de imagem permitido e caminho válido. Arquivos privados e rascunhos não podem ser referenciados pelo site público. Primeiro envie e publique na aba **Mídia**, depois escolha em **Blocos**. A descrição alternativa é preenchida com o `alt_text` cadastrado na biblioteca; revise-a no contexto da seção antes de salvar. A ação **Remover imagem** limpa a associação no formulário e exige salvar o bloco; na foto desktop da seção Olá!, valor vazio preserva o fallback local `/media/tulius-contact.jpg`.

Referências antigas HTTPS ou `/media/` continuam exibidas/preservadas no formulário mesmo que não constem da biblioteca; não são apagadas automaticamente. Não foram alterados os registros de `media_assets`, os arquivos de Storage, as políticas RLS, nem as demais partes do CMS. Login, gravação e escolha visual com JWT administrativo real exigem homologação humana separada.


## Seletor de imagem em todos os formulários aplicáveis (26/10/2026)

Foi feita a inspeção dos formulários de `AdminApp.tsx` e `AdminModules.tsx`. A única referência de **imagem** ainda editável como texto livre fora de **Blocos e painéis** era **SEO → Imagem Open Graph** (`site_settings.seo_json.ogImage`). Esse campo passou a usar o componente visual `PublishedMediaPicker`, com busca, miniatura, remoção e seleção de mídias publicadas.

A alteração de `ogImage` preserva as demais propriedades de `seo_json`, inclusive `canonical` e `robots`. É gravada somente pelo botão **Salvar SEO**, pela RPC existente `save_home_seo_atomic`. Os metadados embutidos no HTML e nas prévias sociais são regenerados no **próximo build/deploy**; mudar o banco não altera imediatamente o HTML já entregue ao visitante.

Inventário de campos com seletor: `content_json.items[].image`, `content_json.items[].aboutDesktopImage`, `content_json.experienceMedia.logo`, `content_json.experienceMedia.slides[].image`, e `site_settings.seo_json.ogImage`. A Biblioteca de mídia propriamente dita administra objetos, prévias, upload e metadados, não vínculos de imagem em páginas. **Coleções** não expõe campo de imagem editável no formulário atual. URLs genéricas, endereços de contato, `canonical`, cores e seletores de ícones continuam sendo controles apropriados aos seus tipos — não imagens.

Não foram alterados imagens existentes, conteúdo editorial, banco de dados, Auth, Storage ou RLS. A sessão administrativa com JWT real e a prévia real de redes sociais continuam condições separadas de aceite.

## Revisão manual de conteúdo — 28/10/2026

**Blocos e painéis → experiências:** cada item possui a opção **Exibir este item em Projetos e realizações**. Quando desmarcada, o CMS destaca **Ocultado**; o conteúdo não é apagado do JSONB e pode ser reexibido com a mesma opção. A referência inicial é Vale, com seis itens visíveis por empregador sempre que existirem seis.

**Coleções → Depoimentos:** esta é a fonte pública autoritativa para os cinco cartões. Dois registros de demonstração são identificados como fictícios; evitar tratá-los como endossos reais. Os blocos em Depoimentos guardam conteúdo manual original, mas têm vínculo com `testimonials` (painel A: início 0, quantidade 2; painel B: início 2, restantes). Alterações publicadas na coleção são refletidas sem duplicação editorial; o painel B contém novos depoimentos conforme a ordem. Os cartões expandidos são controlados pelo visitante e não alteram o CMS.

**Contato:** o texto de rodapé provém de `sections.intro` e do campo Texto do primeiro item do painel A; fotografia e URLs são editáveis nos blocos existentes. **Menu:** usar o módulo Navegação para ajustar rótulos ou reexibir links individuais dos empregadores sem editar as seções.

## Revisão manual — comportamento dos módulos (28/10/2026)

**Seções:** as listas traduzem `draft` para **Rascunho**, `in_review` para **Em revisão**, `published` para **Publicado** e `archived` para **Arquivado**; os valores persistidos e as restrições de banco permanecem em inglês. `Salvar alterações` altera textos/tema/visibilidade/ordem editorial válida, mas não permite publicar rascunhos ou arquivar diretamente pelo combo: usar os botões específicos. **Publicar seção** solicita confirmação, chama `publish_section` e bloqueia placeholders. **Arquivar** solicita confirmação, marca `archived` e `is_visible=false`. **Exibir no site** continua em `sections.is_visible`, utilizado nas consultas públicas e no menu. Seções especiais têm layout/motion fixos visíveis como controles desabilitados, evitando prometer uma opção não renderizada. Em seções genéricas são utilizadas classes `layout-*`, `theme-*` e `motion-*`; temas de empregadores respeitam as classes públicas.

**Feedback transversal:** `AdminNotice` exibe toast acessível (duração 7 s, botão fechar) para operações de Seções, Blocos, Coleções, Identidade, Mídia, Navegação, SEO e Revisões; estados de salvamento distintos permitem múltiplas operações seguidas. Mensagens Supabase são exibidas sem afirmar sucesso quando o backend retorna erro. Fluxos e endpoints inspecionados: Seções (`sections.update`, `publish_section`, `duplicate_section`, `create_section_with_panels`, `swap_section_order`), Blocos (`save_content_block_atomic`), Coleções (`upsert/insert/update`), Identidade (`design_tokens.upsert`), Mídia (`media_assets`, buckets privado/público), Navegação (`navigation_items.upsert`), SEO (`save_home_seo_atomic`), Revisões (`editorial_issues.update`); Prévia permanece isolada por autenticação.

**Biblioteca de mídia:** primeiro nível é uma grade de **miniatura + nome do arquivo com extensão**. Clicar abre um único editor do arquivo (nome somente leitura, alt, status e ações); clicar de novo ou fechar recolhe. Campo Crédito/licença não aparece mais e não entra nas operações de gravação. A coluna antiga do PostgreSQL e seus 19 valores históricos não foram apagados. Os títulos de 21 registros da coleção `media_assets` foram sincronizados com o nome final de `storage_path` (somente texto); novos uploads/substituições seguem esse padrão.

**Seletores de mídia em Blocos:** orientações indicam dimensões e proporções de referência antes da escolha; botão **Ajustar posição e zoom** abre janela com controles X/Y (0–100%), zoom (100–300%) e prévia do recorte. **Aplicar ao formulário** só altera o rascunho em memória; **Salvar bloco** persiste JSONB, sem editar o arquivo original. O cancelamento/fechamento da janela não grava o enquadramento. Campos contemplados: imagem do item, imagem desktop da seção Olá!, logomarca e slides de experiência. O seletor SEO orienta 1200×630 px, mas não aplica crop HTML/CSS a uma mídia de compartilhamento de terceiros: prepare os pixels do próprio arquivo se desejar recorte OG.

**Homologação real ainda aberta:** não executar CRUD transacional com JWT administrativo em produção só para teste. Confirmação funcional de upload/download, autorização de gravação, RPCs, RLS e restauração depende de reabrir P2 com ambiente seguro e autorização expressa. A verificação estática e testes automatizados não são prova dessas mutações.

### Evidências da auditoria administrativa integral — 28/10/2026

[Relatório por aba](AUDITORIA_ADMIN_MANUAL_2026-10-28.md): auditoria de código de dez áreas, sem mutações P2. CI #40776321190 aprovado; auditoria pública P3 #40776111312 aprovada; 21/21 títulos de mídia sincronizados com nome de arquivo no Supabase e 19 créditos históricos preservados sem uso. O LCP mobile e o teste real de gravação do CMS permanecem pendentes.

## Ajustes técnicos de baixo risco após o aceite manual — 28/10/2026

- **Visão geral CMS:** substituída a frase fixa das 14 seções/2 distribuições por contagem dinâmica de seções visíveis e cadastradas, e contador das `editorial_issues` efetivamente abertas. Não houve alteração de registros.
- **Depoimentos:** grade desktop passa a ter duas linhas uniformes e cartões quadrados, com expansão ocupando duas linhas. No mobile mantém-se uma coluna fluida. Textos e cinco registros publicados preservados.
- **Janela X/Y/zoom:** o diálogo agora recebe foco inicial, retém Tab/Shift+Tab, permite Escape e devolve o foco ao controle anterior ao fechar; o arquivo original e configurações preexistentes continuam intocados.
- **Carregamento público:** a consulta de depoimentos, única coleção atualmente vinculada no Supabase público, é iniciada em paralelo à consulta da estrutura de seções. Isso remove uma etapa sequencial de rede no carregamento inicial; não constitui por si só comprovação de LCP ≤2,5 s.
- **Aceite humano:** declarado concluído pelo proprietário nesta conversa. P2, direitos de mídias, riscos de segurança anteriormente aceitos, exclusões de Storage/branches, 8 ocorrências editoriais e reconciliação de Fontes ChatGPT seguem como decisões separadas.

## Menu público sem grupos — compactação final (29/10/2026)

**Solicitação do proprietário:** manter as oito opções integralmente visíveis, evitando rolagem vertical nas alturas usuais; remover da navegação pública os subtítulos `PERFIL`, `EXPERIÊNCIA`, `REFERÊNCIAS` e a assinatura `Comunicação · Estratégia · Reputação`. Não modificar nomes, ordem, numeração nem âncoras dos oito links.

**Implementação:** `src/components/public/Navigation.tsx` não renderiza títulos de grupo nem a assinatura estática. `src/index.css` usa espaçamento compacto e linhas com `grid-auto-rows: clamp(44px, 9dvh, 72px)`; todos os alvos têm altura mínima de 44 px. A rolagem permanece apenas como fallback para zoom de acessibilidade, excesso futuro de itens ou viewport excepcionalmente baixo. Menu responsivo sem `zoom` CSS ou mudanças na identidade visual.

**Admin:** `NavigationStudio` remove o campo de grupos, mantém rótulo, âncora, status, visibilidade, reordenação e salvar. Novos registros e gravações posteriores usam `group_name='Menu'` por compatibilidade com a coluna existente. **Supabase:** os 14 registros da tabela `public.navigation_items` foram atualizados apenas no campo `group_name` de Perfil/Experiência/Referências para `Menu`, transação com guardas de 14 totais e 8 visíveis. Conferência após atualização: **14 registrados, 8 visíveis, 6 ocultos, grupo único Menu**. Sem DDL, alterações RLS, exclusões, mudança de textos/âncoras, custos ou migrações; a frase final era hardcoded, não existia em `site_settings`.

**Evidência:** commit funcional [`bfd3f7e`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/bfd3f7e25b03dc6fa0e647f44eb1f3bb92905f96) com formatação no [`0e06df6`](https://github.com/tuliustsangaropulos/PortfolioTulius/commit/0e06df6c031e01da3bf9453f8a6246d1f80409b1), [CI #40810591049](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810591049) **success** e [P3 #40810488285](https://github.com/tuliustsangaropulos/PortfolioTulius/actions/runs/40810488285) **success**. Teste `P3_MENU_FIT_MOBILE` em **390×844**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=844`, último link até y=662,09. Teste `P3_MENU_FIT_DESKTOP` em **1512×691**: 8 links, grupos 0, footer ausente, `scrollHeight=clientHeight=691`, último link até y=573,58. P3: **0 falhas**, 13 seções, 25 painéis mobile, 38 capturas, P5 anônimo 3/3, zero mutações. Mobile Lighthouse Performance 82, LCP **4,44 s**, meta ≤2,5 s ainda aberta; desktop LCP **1,18 s**.

**Prevenção:** os testes P3 agora verificam número de links, ausência de grupos/rodapé, ausência de rolagem interna e visibilidade do último link, além de foco e Escape. A frente de P2 transacional segue suspensa; não equiparar o teste de leitura pública à homologação de escrita CMS com JWT real.

