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
