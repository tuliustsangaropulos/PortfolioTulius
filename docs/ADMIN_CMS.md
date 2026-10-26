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

## Seção 02: foto central e conteúdo lateral (26/10/2026)

O layout desktop de **Olá!** é especial e mantém o conteúdo CMS centralizado em dois blocos existentes:

- **Esquerda:** `/admin` → módulo **Seções**, selecionar **Olá!** (`sobre`). Campos **título**, **subtítulo/eyebrow** e **introdução** alimentam a coluna esquerda.
- **Centro:** módulo **Blocos e painéis** → seção **Olá!** → bloco do **painel A** → item 01: **Imagem central da seção 02 (desktop)** (`aboutDesktopImage`) e **Descrição da imagem central (desktop)** (`aboutDesktopAlt`). Ao deixar a imagem desktop vazia, a página usa `/media/tulius-contact.jpg` e o alt `Tulius Tsangaropulos segurando um tablet`. A **Imagem** convencional do mesmo item segue sendo usada no painel mobile e não muda por editar a imagem desktop.
- **Direita:** os **dois itens do painel B** aparecem primeiro, na ordem do CMS; **título e texto do item 01 do painel A** aparecem em terceiro, sem repetir sua miniatura. Altere os mesmos campos `Título` e `Texto` que já existem no editor. O conteúdo não é clonado para painel B.

O editor salva as chaves opcionais no `content_json.items` por `save_content_block_atomic`. A nova imagem aceita URL HTTPS ou arquivo de `/media/` com nome seguro; quando personalizada exige descrição alternativa própria. Não foi criada coluna/tabela/migration. **Ainda não foi testada a alteração real com JWT administrativo**, permanecendo pendente a homologação de gravação/publicação e a conferência visual posterior.
