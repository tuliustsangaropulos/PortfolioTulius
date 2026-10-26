# Modelo de conteúdo

`pages → sections → section_panels/content_blocks → block_placements` separa conteúdo e apresentação. Coleções normalizadas cobrem experiências, projetos, métricas, competências, formação, idiomas, ferramentas, depoimentos e contatos.

Campos de status usam `draft`, `in_review`, `published` e `archived`. `editorial_issues` preserva divergências; `is_placeholder` e `editorial_note` impedem que X/Y/Z sejam convertidos em fatos.

O seed registra as 14 seções, dois blocos por seção, tokens, navegação, experiências e nove pendências. Os mesmos blocos alimentam desktop e mobile, evitando cópias editoriais.

## Navegação interna dos cards de especialidades (seção 01)

Os cinco primeiros itens de `content_blocks.content_json.items` no bloco `perfil` / painel `b` admitem o campo opcional `targetSlug` (texto, slug de seção, sem URL externa). O valor é compartilhado por desktop e mobile e editado no módulo **Blocos e painéis** do admin. Quando ausente, o renderer aponta para `#resultados` (seção 03). Destino inexistente ou não publicado é rejeitado na renderização com fallback para `#resultados`; se `resultados` também estiver indisponível, o card é apresentado sem link para evitar âncora quebrada.

Esse campo é armazenado no JSONB já existente, validado no cliente e persistido pela RPC `save_content_block_atomic`. **Nenhuma nova coluna, tabela, migration ou permissão foi criada.** A configuração do card é distinta dos itens do menu (`navigation_items`).

## Seção 02: uma fonte de conteúdo, duas apresentações

`sections.slug = 'sobre'` mantém o layout editorial padrão no banco, mas `PublicSite.tsx` seleciona uma composição desktop de três colunas. `content_blocks` / `mobile_panel='a'` contém o item **Estratégia também é escuta**: `title` e `text` são renderizados como **terceiro texto da coluna direita** sem `image` no desktop; o mesmo item preserva seu formato original no mobile. O campo `image` existente alimenta o mobile; os novos opcionais `aboutDesktopImage` e `aboutDesktopAlt` permitem a imagem central desktop com fonte independente e alt próprio. `mobile_panel='b'` fornece os outros dois textos da direita na ordem atual.

Os campos opcionais ficam dentro do JSONB `content_blocks.content_json.items`, sem migração. Se a imagem desktop estiver ausente, utiliza-se o asset já versionado `/media/tulius-contact.jpg` com alt padrão descritivo. No CMS, o mesmo item continua editável pelo fluxo transacional existente.
