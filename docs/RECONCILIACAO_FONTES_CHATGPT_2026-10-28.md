# PortfolioTulius — reconciliação atual das Fontes ChatGPT

**Conferência:** 28/10/2026. **Estado vigente:** [`ESTADO_ATUAL_VIGENTE.md`](ESTADO_ATUAL_VIGENTE.md). O [registro inicial de reconciliação](historico/RECONCILIACAO_FONTES_CHATGPT_INICIAL_2026-10-28.md) é histórico. Esta página é um inventário de fontes **anexadas ao projeto ChatGPT**, não um substituto para o banco, repositório ou arquivos originais.

## Fontes permanentes observadas antes desta atualização — 8

1. `GUIA_FONTES_VIGENTES_PORTFOLIOTULIUS_2026-10-28.md` — **manter até substituir por guia atualizado** com este índice, depois retirar a versão antiga.
2. `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md` — **manter** como contexto de produto/design histórico, com precedência do código e documentos atuais.
3. `INVENTARIO_GITHUB_ESTADO_ATUAL_PORTFOLIOTULIUS.md` — **retirar das Fontes ativas após backup**; inventário antigo do GitHub não representa o estado corrente.
4. `CONTINUIDADE_P3_APRENDIZADOS_PLANO_PORTFOLIOTULIUS.md` — **retirar após backup**, plano antigo.
5. `HISTORICO_CORRECOES_EVOLUCAO_PORTFOLIOTULIUS.md` — **arquivar após backup**, história importante, não situação operacional.
6. `ESTADO_ATUAL_AUDITORIA_2026-10-25.md` — **retirar após backup**, snapshot superado; versão idêntica no GitHub.
7. `CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md` — **retirar após backup**, idêntica ao equivalente no GitHub.
8. `CONTINUIDADE_AJUSTES_SECAO_01_PORTFOLIOTULIUS_2026-10-25.md` — **preservar integralmente antes de retirar**; Fonte de **80 linhas**, enquanto [GitHub](CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md) tem **53**.

## Backups e preservação

Neste atendimento foram preparados **dois ZIPs locais para download** (8 Fontes ativas, 6 documentos históricos disponíveis na sessão), ambos com `MANIFESTO_SHA256.json`; também uma cópia `.md` da variante de 80 linhas. O SHA-256 da Fonte original seção 01 é `67db85f1cc497e6f51625f19472f76a753707cb0c7b34407af73d7f23b4ff288`. Esses anexos são **de uso privado do proprietário**, e **não foram publicados no repositório público**. Arquivar os ZIPs em local seguro antes de remover Fontes. O repositório GitHub preserva sua variante de 53 linhas e os snapshots das outras seis continuidades sem modificações.

## Seleção ativa recomendada depois da reorganização

- **Obrigatórias:** guia atualizado das Fontes e `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md`.
- **Altamente úteis sem conector:** cópia atual de [índice operacional](ESTADO_ATUAL_VIGENTE.md), [DESIGN_SYSTEM](DESIGN_SYSTEM.md), [RESPONSIVE_LAYOUT](RESPONSIVE_LAYOUT.md), [CONTENT_MODEL](CONTENT_MODEL.md) e [ADMIN_CMS](ADMIN_CMS.md).
- **Por necessidade:** [P1](P1_INVESTIGACAO_HIGIENE_2026-10-28.md), [P2](P2_HOMOLOGACAO_ADMINISTRATIVA_2026-10-28.md), [P3](P3_QUALIDADE_ACEITE_2026-10-28.md). Consultar preferencialmente pelo conector GitHub para evitar anexos congelados.

**Atenção:** o conector GitHub não remove nem substitui as Fontes do projeto ChatGPT. Até a troca manual, o guia antigo continua anexado. Não duplicar versões sem indicar qual é a vigente.

## Precedência

1. GitHub `main` + Vercel `READY` no SHA correto + Supabase atual (somente quando pertinente).
2. [AGENTS](../AGENTS.md), [índice](ESTADO_ATUAL_VIGENTE.md), [pendências](OPEN_ISSUES.md) e documentação do módulo.
3. Fontes históricas somente para recuperar decisões; não inferir contagens, status P5 ou proveniência real dos ativos a partir delas.
