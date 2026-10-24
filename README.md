# Portfólio editorial — Tulius Tsangaropulos

Site pessoal, currículo e CMS editorial em React + TypeScript, com Supabase Auth, Postgres, RLS e Storage. A composição foi reconstruída em HTML/CSS a partir dos PDFs fornecidos; as páginas dos PDFs não são usadas como imagens.

## Estado verificável

- Site público: 14 seções desktop, 28 painéis mobile e 14 âncoras estáveis.
- Navegação: menu acessível, hash/back, indicador de seção/painel, Escape e foco visível.
- Conteúdo: textos do PDF, três depoimentos sem duplicação e placeholders preservados.
- Admin: login, role guard, dashboard, edição/ordenação/duplicação/arquivo de seções, design tokens, mídia, navegação e prévia de rascunho.
- CMS modular: editor de blocos e itens, distribuição mobile A/B, placements, motion, coleções estruturadas, SEO, pendências e revisões.
- Supabase: cliente configurado para o projeto existente; schema, seed, RLS, Storage e testes foram gerados.
- Engenharia: formato, TypeScript, 6 testes unitários/estruturais e build validados por `pnpm check`.

**A migration e o seed não foram aplicados automaticamente:** uma chave pública nunca deve possuir DDL. Até a aplicação, o site mostra o seed editorial local e o admin informa que o schema está pendente.

## Execução

```bash
pnpm install
cp .env.example .env.local
# preencha somente as variáveis públicas
pnpm dev
```

No Figma Make, o servidor de desenvolvimento é iniciado automaticamente; não execute `pnpm dev` ali.

```bash
pnpm check        # formato + TypeScript + testes + build
pnpm test         # Vitest
pnpm build        # produção
```

## Aplicar o Supabase existente

1. Confirme que o projeto selecionado é `zfnrhzplwpjpdljraypt`.
2. Faça backup e revise objetos já existentes; a migration é aditiva.
3. No Supabase Dashboard → SQL Editor, execute `supabase/migrations/202610220001_portfolio_cms.sql`.
4. Execute `supabase/seed.sql`.
5. Em Authentication, crie ou convide a primeira conta. Copie seu UUID.
6. Ainda no SQL Editor, como operador privilegiado, execute:

```sql
insert into public.admin_users (user_id, role)
values ('UUID-DA-CONTA', 'owner');
```

Não exponha esse comando como cadastro público e não use `service_role` no frontend.

7. Entre em `/admin/login`, faça uma alteração em rascunho e valide a prévia.
8. Execute o roteiro de `supabase/tests/rls.sql`, incluindo os testes negativos com usuário comum.

A migration inclui RPCs transacionais para reorder, duplicação e publicação, além de revisões/auditoria automáticas. O seed popula os painéis desktop/mobile, placements e as coleções editoriais.

## Variáveis

| Nome | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL pública do projeto existente |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | chave publishable/anon pública; protegida por RLS |

## Rotas

- `/`: portfólio público
- `/admin/login`: autenticação
- `/admin`: CMS protegido
- `/admin/preview`: prévia protegida de drafts
- `*`: página 404 editorial

## Conteúdo e GitHub

O seed local existe para bootstrap e indisponibilidade antes da migration; após a aplicação, o frontend prioriza os registros publicados no Supabase. Assets iniciais extraídos do material fornecido ficam em `public/media` e podem ser promovidos ao Storage pelo fluxo editorial.

O push do Figma Make para GitHub é unidirecional. Defina uma fonte de verdade por ciclo de trabalho, revise o diff antes do push e nunca versione `.env.local`, tokens ou chaves privadas.

## Checklist pendente externo

- [ ] Aplicar migration e seed ao projeto Supabase.
- [ ] Cadastrar primeiro administrador por operador privilegiado.
- [ ] Executar testes RLS com sessões anon, usuário comum e admin.
- [ ] Promover mídias aprovadas ao bucket público e cadastrar alt/créditos.
- [ ] Resolver as nove pendências editoriais antes de publicar como definitivo.
- [ ] Configurar domínio e variáveis na Vercel; validar Open Graph no domínio final.
- [ ] Executar homologação visual/E2E nos viewports de aceite; o servidor supervisionado não estava acessível nesta execução.

Leia `docs/` para arquitetura, CMS, segurança, layout e deploy.
