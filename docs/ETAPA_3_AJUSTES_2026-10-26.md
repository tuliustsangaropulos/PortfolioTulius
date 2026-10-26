# Etapa 3 — correções pontuais e consolidação editorial (26/10/2026)

## Alcance e critérios de verdade

Esta atualização é prospectiva; não substitui relatórios históricos de fases anteriores. Referência inicial: `main e6cba1e`; projeto Supabase `zfnrhzplwpjpdljraypt`.

## Conteúdo consolidado no banco

Mediante solicitação expressa do proprietário, três registros publicados de `content_blocks` foram marcados `is_placeholder=false` após conferência exata de seção, painel, título e quantidade de itens:

- `resultados/A`: quatro indicadores existentes (valores, textos e vínculos temáticos inalterados).
- `invest-rs/A`: três itens textuais existentes, incluindo as competências e dois projetos; galeria com três títulos permanece sem fotografias.
- `invest-rs/B`: quatro textos existentes, mantendo **`items[3].placeholder=true`** no item **Ativos visuais**, pois imagens finais ainda aguardam aprovação.

Foram incluídas notas editoriais de consolidação sem alterar `content_json`, título, métrica, número, conteúdo, status de publicação ou ordem. A pendência de mídia da Invest RS e as outras questões editoriais continuam abertas. `resultados/B` já estava validado e foi preservado. Não interpretar a validação de textos como validação independente de números ou aprovação de mídias não fornecidas.

## Correções de código e testes

1. Regra CSS explícita em `#formacao .item-meta` prioriza contraste claro sobre o fundo escuro, corrigindo a causa observada no Lighthouse (5 nós). A correção exige nova medição de acessibilidade em produção.
2. Upload da biblioteca de mídia privada agora tenta remover o objeto recém-enviado caso falhe a inserção em `media_assets`.
3. Substituição de arquivo privado usa novo caminho temporário, atualiza metadados para o novo objeto e só então exclui o objeto antigo. Falha da atualização limpa o novo objeto sem alterar o antigo. Se a limpeza falhar, o CMS informa a necessidade de remoção manual.
4. Casos unitários simulam sucesso, erro de upload, erro de persistência, compensação, ordenação das operações e falha da limpeza. Não substituem teste de upload/download real com sessão administrativa.
5. Fotografia de abertura superdimensionada, bundle JS e lacunas de autenticação E2E permanecem oportunidades de otimização/homologação, não declaradas corrigidas.

## Segurança e pendências preservadas

Não há alteração de schema, RLS, grants, funções, Auth, buckets, PAT, Leaked Password Protection nem usuários. O item de navegação para a seção oculta `competencias` ainda merece alinhamento de metadados, mas não é exposto pelo menu público graças ao filtro de seções visíveis.

Pendências de aceite: execução Lighthouse/P3 no código final implantado, validação de performance mobile, sessão real P5 Admin Read-Only, simulações de falhas em Storage com JWT real e confirmação de UX nos principais breakpoints. Commit/CI/deployment devem ser verificados por SHA: alterações no repositório não garantem publicação automática.
