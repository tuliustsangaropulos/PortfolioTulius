# Modelo de conteúdo

`pages → sections → section_panels/content_blocks → block_placements` separa conteúdo e apresentação. Coleções normalizadas cobrem experiências, projetos, métricas, competências, formação, idiomas, ferramentas, depoimentos e contatos.

Campos de status usam `draft`, `in_review`, `published` e `archived`. `editorial_issues` preserva divergências; `is_placeholder` e `editorial_note` impedem que X/Y/Z sejam convertidos em fatos.

O seed registra as 14 seções, dois blocos por seção, tokens, navegação, experiências e nove pendências. Os mesmos blocos alimentam desktop e mobile, evitando cópias editoriais.

## Navegação interna dos cards de especialidades (seção 01)

Os cinco primeiros itens de `content_blocks.content_json.items` no bloco `perfil` / painel `b` admitem o campo opcional `targetSlug` (texto, slug de seção, sem URL externa). O valor é compartilhado por desktop e mobile e editado no módulo **Blocos e painéis** do admin. Quando ausente, o renderer aponta para `#resultados` (seção 03). Destino inexistente ou não publicado é rejeitado na renderização com fallback para `#resultados`; se `resultados` também estiver indisponível, o card é apresentado sem link para evitar âncora quebrada.

Esse campo é armazenado no JSONB já existente, validado no cliente e persistido pela RPC `save_content_block_atomic`. **Nenhuma nova coluna, tabela, migration ou permissão foi criada.** A configuração do card é distinta dos itens do menu (`navigation_items`).

## Seções 02 e 03 — conteúdo após revisão de 26/10/2026

A seção `sobre` mantém dois blocos `content_blocks` e não recebeu novas tabelas:
- `mobile_panel='a'`: **um item técnico de foto**, com `title="Imagem da seção 02"`, `image/alt` mobile e campos opcionais `aboutDesktopImage/aboutDesktopAlt` para o centro desktop.
- `mobile_panel='b'`: **array JSONB de declarações** (inicialmente 5, sem limite fixo), cada uma contendo `title` e `text`. Ordem: Estratégia também é escuta.; Comunicação de ponta a ponta; Visão editorial; Resultados que orientam decisões; A voz de quem lidera. O componente desktop percorre a lista completa e o mobile reutiliza o primeiro título/texto com a foto no painel A e os demais no painel B. Não há duplicação do texto no banco.

Na seção `resultados`, o painel B contém os cinco títulos correspondentes aos cards de especialidades da seção 01, em substituição aos sete títulos anteriores, inclusive ao placeholder `XXXXX · X/Y/Z`. O painel A de métricas não foi alterado. O registro de `editorial_issues` para o placeholder foi mantido com `status='resolved'` e motivo da resolução; não foi apagado.

Todas as edições do administrador seguem `save_content_block_atomic` e a estrutura existente de RLS/revisões; a mudança dos dados publicados foi realizada por transação SQL controlada e confirmada com leitura posterior. **Os títulos da seção 03 são um snapshot editorial, não uma referência relacional dinâmica às especialidades da seção 01.**
