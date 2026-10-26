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
