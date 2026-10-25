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

## Documentação adicional

Consulte `docs/` para arquitetura, modelo de conteúdo, CMS, segurança, layout responsivo, sistema visual, motion e publicação.

## Continuidade P4 e P5

Os resultados, limites e instruções de execução dos testes visuais e do CMS estão documentados em [`docs/P4_P5_EXECUCAO.md`](docs/P4_P5_EXECUCAO.md). A suíte autenticada da P5 exige configuração separada de Secrets no GitHub Actions; não registrar credenciais aqui.
