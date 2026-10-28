# PortfolioTulius — reconciliação de Fontes do ChatGPT e documentos GitHub

**Conferência:** 28/10/2026 · **Natureza:** inventário documental, sem modificações das Fontes anexadas no ChatGPT ou dos arquivos históricos originais.  
**Estado técnico de referência:** [índice vigente](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md); GitHub `main` em `dcb8831221a54fb713031011c8da8b20fe157b38` na conferência anterior a esta publicação documental.

## Critério de precedência e preservação

1. Para estado atual, consultar **GitHub, CI, deployment e Supabase na data da verificação**; um arquivo histórico não é um inventário vivo.
2. Preservar os **cinco arquivos de base/história** das Fontes ChatGPT como retratos históricos: `CONTEXTO_PRODUTO_DESIGN_PORTFOLIOTULIUS.md`, `CONFIGURACAO_AMBIENTE_PORTFOLIOTULIUS.md`, `HISTORICO_CORRECOES_EVOLUCAO_PORTFOLIOTULIUS.md`, `CONTINUIDADE_P3_APRENDIZADOS_PLANO_PORTFOLIOTULIUS.md` e `INVENTARIO_GITHUB_ESTADO_ATUAL_PORTFOLIOTULIUS.md`. O inventário de **86 arquivos** e SHA `9fac3c0` eram corretos no seu momento; não representam o HEAD atual.
3. Preservar também os **sete relatos de continuidade/auditoria** anexados ao projeto que possuem equivalentes em `docs/`: `ESTADO_ATUAL_AUDITORIA_2026-10-25.md`, `CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md`, `CONTINUIDADE_AJUSTES_SECAO_02_2026-10-26.md`, `CONTINUIDADE_FORMACAO_EXPERIENCIAS_2026-10-26.md`, `CONTINUIDADE_FERRAMENTAS_CARDS_CONTATO_2026-10-26.md`, `CONTINUIDADE_CONTEUDO_SECOES_02_03_2026-10-26.md` e `CONTINUIDADE_INTERATIVIDADE_SECAO_03_2026-10-26.md`.
4. A auditoria anexada em conversa `AUDITORIA_GERAL_PORTFOLIOTULIUS_2026-10-26.md` acrescenta snapshot cross-service de 26/10; continua como evidência temporal. A verificação de 28/10 atualiza suas contagens, não a transforma em documento editável do GitHub.

## Divergência específica da seção 01

A auditoria de 26/10 identificou **80 linhas na fonte do projeto ChatGPT** `CONTINUIDADE_AJUSTES_SECAO_01_PORTFOLIOTULIUS_2026-10-25.md` versus **53 linhas no arquivo versionado** [`docs/CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md`](CONTINUIDADE_AJUSTES_SECAO_01_2026-10-25.md). Não são cópias byte a byte, mas ambas se referem à fase histórica de 25/10 e documentam cards 01–05, selo, seta, âncora, MENU e teste JWT pendente.

**Revisão sem perda:** a fonte mais extensa detalha separadamente implementação, caminhos de código, checklist de homologação, bloqueios de prova e encaminhamento. A versão Git organiza esses pontos mais concisamente. **Não substituir nenhuma delas automaticamente**: mantê-las como duas redações históricas. O código e as validações de commits posteriores têm precedência para comportamento atual; uma eventual fusão textual requer comparar minuciosamente as duas variantes, não apagar informação.

## Estado da reconciliação

A auditoria de 26/10 verificou que **seis dos sete pares** com equivalentes em `docs/` coincidiam byte a byte naquela data; a seção 01 era a exceção. Este registro não afirma nova comparação integral dos bytes dos 12 anexos na data de 28/10.

As **Fontes do projeto ChatGPT não são modificadas por um commit no GitHub**. Para mantê-las operacionais, adicionar como novas fontes correntes, **sem retirar as antigas**, pelo menos:

- [Índice consolidado atualizado](AUDITORIA_ETAPAS_1_A_3_ESTADO_ATUAL_2026-10-26.md) — entrada de estado atual e limites por SHA.
- [Incorporação de conteúdo e 19 SVGs](CONTINUIDADE_INCORPORACAO_CONTEUDO_2026-10-26.md) — posterior aos snapshots que mencionam Storage vazio.
- [Este mapa de reconciliação](RECONCILIACAO_FONTES_CHATGPT_2026-10-28.md) — precedência, lacunas e variantes.
- Manter o relatório de auditoria de 26/10 como fonte histórica, identificado pela data.

O workflow [`Export PortfolioTulius Documentation`](../.github/workflows/export-docs-snapshot.yml) publica `README.md` e `docs/*.md` em artifact com **retenção de apenas 7 dias**; não exporta as cinco bases exclusivas do projeto ChatGPT. A exportação temporária não substitui repositório, histórico Git ou cópias permanentes do proprietário.

## Limites

- A reconciliação documental **não equivale** ao histórico integral de chats, PDFs, Canva, capturas visuais e anexos não inventariados.
- Esta etapa não altera mídia, autorização, schema, secrets, branches, código ou conteúdo editorial.
- A próxima auditoria deverá registrar o SHA e o deployment **após** o commit documental, pois um push na `main` pode disparar nova publicação.
