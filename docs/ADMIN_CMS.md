# CMS administrativo

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

## Primeiro administrador

Crie a conta no Supabase Auth e insira o UID em `admin_users` usando o SQL Editor com privilégios de operador. Não existe autopromoção, signup administrativo público ou autorização baseada apenas em `authenticated`.

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
