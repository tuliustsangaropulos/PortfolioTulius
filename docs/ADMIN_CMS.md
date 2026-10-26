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
