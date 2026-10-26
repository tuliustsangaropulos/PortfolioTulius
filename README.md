# Portfólio editorial — Tulius Tsangaropulos

Site pessoal, currículo e CMS editorial em React, TypeScript, Vite e Tailwind CSS v4. O conteúdo pode ser exibido pelo fallback local ou sincronizado com o projeto Supabase existente (`zfnrhzplwpjpdljraypt`). O projeto roda localmente no VS Code e pode ser publicado na Vercel.

## Requisitos

- Node.js compatível com Vite 8
- pnpm

## Desenvolvimento local

```bash
pnpm install --frozen-lockfile
```

Copie `.env.example` para `.env.local` e use os valores públicos já fornecidos para o projeto Supabase. O arquivo de exemplo contém somente um placeholder para a chave publishable; não coloque credenciais reais nele.

```bash
pnpm dev
```

O Vite inicia o site localmente e atualiza a página quando os arquivos mudam. Para gerar e servir uma versão de produção local:

```bash
pnpm build
pnpm preview
```

## Verificações

```bash
pnpm format:check  # verifica formatação
pnpm typecheck     # verifica TypeScript
pnpm test          # testes Vitest
pnpm build         # build de produção
pnpm check         # executa tudo acima
```

## Aplicação

- `/`: portfólio público
- `/admin/login`: autenticação administrativa
- `/admin`: CMS protegido
- `/admin/preview`: prévia protegida de rascunhos
- demais rotas: página 404

A aplicação mantém o conteúdo editorial local como fallback enquanto o CMS Supabase não estiver disponível. A integração usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; não use uma chave `service_role` no frontend.

## Supabase

O cliente segue ligado ao projeto existente `zfnrhzplwpjpdljraypt`. A migration e o seed em `supabase/` não são aplicados automaticamente. Consulte `docs/ARCHITECTURE.md`, `docs/SECURITY_RLS.md` e `docs/ADMIN_CMS.md` antes de operações no banco. Este repositório não altera o banco durante o desenvolvimento ou build.

## Vercel

Configure as duas variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nos ambientes Vercel necessários. O build é `pnpm build`; a saída estática é `dist/`. Domínio, canonical e metadados sociais devem ser revisados para o domínio final conforme `docs/DEPLOYMENT.md`. Este projeto não faz deploy automaticamente a partir das instruções deste README.

## Segurança e colaboração

`.gitignore` protege `.env.local`, `.env.*`, `.vercel/`, `node_modules/` e `dist/`, mantendo `.env.example` disponível para versionamento. Nunca versione tokens ou chaves privadas. Revise `git status` e o diff antes de qualquer commit; este README não autoriza commits, push, alterações na Vercel ou deploy.

## Estado atual

O portfólio está publicado em **https://tulius.work/** na Vercel, com deploy automático da branch `main` e CMS conectado ao Supabase. A página `/` usa os conteúdos publicados do banco; quando Supabase está configurado e falha, a interface indica erro, sem substituir silenciosamente conteúdo por fallback. As rotas de administração têm carregamento separado e autenticação obrigatória.

Automação de qualidade: workflows `Validate PortfolioTulius` (formato, tipos, testes, build e smoke offline) e `Audit P3 Lighthouse` (smoke HTTP, Lighthouse, testes P4/P5 e evidências). Testes com JWT admin real requerem `P5_ADMIN_EMAIL` e `P5_ADMIN_PASSWORD` armazenados exclusivamente em GitHub Actions Secrets e execução controlada do workflow manual `P5 Admin Read-Only E2E`.

O estado de validação, os limites da automação e a última homologação manual do proprietário estão documentados em [`docs/P4_P5_P6_FECHAMENTO.md`](docs/P4_P5_P6_FECHAMENTO.md).

## Documentação adicional

Consulte `docs/` para arquitetura, modelo de conteúdo, CMS, segurança, layout responsivo, sistema visual, motion e publicação.

## Continuidade P4 e P5

Os resultados, limites e instruções de execução dos testes visuais e do CMS estão documentados em [`docs/P4_P5_EXECUCAO.md`](docs/P4_P5_EXECUCAO.md). A suíte autenticada da P5 exige configuração separada de Secrets no GitHub Actions; não registrar credenciais aqui.

## Ajustes de navegação da abertura — 25/10/2026

Os cinco cards numerados da primeira seção agora são links internos com hover/foco e destino padrão na seção 03 (`#resultados`); o destino é editável em `/admin` → **Blocos e painéis** → Perfil / painel B → itens 01–05. O selo circular tem frase ampliada e a seta inferior navega à seção 02 com rolagem suave. O menu lateral exibe **MENU**.

Detalhes técnicos, limitações e handoff para a próxima fase estão em [`docs/CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md`](docs/CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md).

## Seção 02 — composição editorial e administração (26/10/2026)

A seção **Olá!** (`#sobre`) tem composição desktop própria: texto introdutório à esquerda, imagem central de altura integral e três declarações à direita. O retrato central padrão é o arquivo existente `/media/tulius-contact.jpg` (Tulius segurando um tablet); não foi criada imagem artificial. O primeiro item do bloco A alimenta a imagem central e a terceira declaração da direita **sem duplicação no banco**, enquanto os dois itens do bloco B alimentam as duas declarações anteriores. No mobile, a estrutura anterior permanece.

Edição: **Seções → Olá!** gerencia os textos da esquerda; **Blocos e painéis → Olá! → painel A** gerencia o terceiro título/texto da direita e os campos específicos de imagem e texto alternativo desktop; **painel B** gerencia os dois primeiros itens da direita. Os campos opcionais usam JSONB existente; nenhuma migration ou mudança de permissões foi necessária. Consulte [`docs/CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md`](docs/CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md).

## Conteúdo da seção 02 e títulos da seção 03 — 26/10/2026

- **Seção 02:** os cinco textos da coluna direita são gerenciados no único bloco **Olá! → painel B** do CMS. Os controles **Adicionar item**, edição de título/texto, setas de ordenação e exclusão já fazem parte do editor; é necessário salvar para persistir. O painel A mantém apenas os atributos da fotografia. No mobile, o primeiro texto da lista B é apresentado junto à foto no painel A; os quatro seguintes aparecem no painel B, sem duplicação de conteúdo.
- **Seção 03:** a lista do painel B agora contém os cinco títulos das especialidades dos cards clicáveis da seção 01, na mesma ordem; os quatro indicadores de resultados do painel A permanecem intactos. O antigo placeholder `XXXXX · X/Y/Z` foi substituído e sua pendência editorial registrada como resolvida no Supabase.

O Supabase e o fallback versionado foram sincronizados sem alterar schema/RLS. Ver [continuidade das seções 02 e 03](docs/CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md).
