# Pendências abertas

1. Invest RS: cargo divergente entre PDF e Canva.
2. Idiomas: rótulos fluente/avançado versus C1/B2.
3. Vale: confirmar contextos de 6 pessoas e 14 países.
4. Diferenciar viagens a 34 países e articulação com 14 países.
5. Confirmar cargos/descrições de InPress e CDI.
6. Resolver X/Y/Z/XXXXX da seção Resultados.
7. Substituir mídias temporárias da Invest RS.
8. Confirmar licenças/créditos finais de mídias.
9. Confirmar licença web da Neue Montreal; Heading Now Trial permanece excluída.

Backend: o schema do CMS já está ativo. As migrations P0/P1 e a migration P3.1 de revogação de privilégios estão aplicadas. A migration inicial de baseline existe no repositório, mas não está registrada no histórico remoto: **não a reaplicar**, apenas reconciliar historicamente em uma etapa controlada. Persistem testes E2E de escrita, publicação, rollback e Storage com sessão administrativa real.

Produto: UI de rollback granular permanece evolução futura; a listagem de revisões, os editores estruturados e os RPCs já estão implementados.

Qualidade: existem testes automatizados de Lighthouse, rotas anônimas, menu e responsividade com evidências nos artifacts do GitHub Actions. A auditoria automatizada passou em 8/8 viewports, inclusive 768 px, sem overflow. Restam inspeção visual humana contra as referências de Figma/PDF, zoom nativo de 200% e melhorias de performance mobile. Detalhes em `docs/P3_FECHAMENTO.md`.

## Pendências de segurança e aceite P5 (25/10/2026)

**Segurança urgente:** revogar no dashboard de tokens da conta Supabase o PAT exposto em histórico público do GitHub; apagar o valor do HEAD não invalida o token. Conferir outras integrações dependentes. Sem confirmação de revogação até esta verificação.

**Leaked Password Protection:** indisponível na organização Supabase no plano Free; requer Pro/pagamento, decisão pendente. Não fazer upgrade sem orçamento/aceite.

**CMS:** oito fluxos SQL e gatilhos de revisão/auditoria aprovados em transação revertida, mais isolamento de Storage por RLS em metadados temporários. Pendentes: E2E por navegador com JWT admin real, upload/download/substituição de arquivo, publicação e retorno do conteúdo no site em cenário isolado, restauração editorial a partir das revisões. Preservar dados reais; não confundir rollback da transação SQL com rollback funcional de versão.
