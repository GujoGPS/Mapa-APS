# ADR 0021: Serviços da ficha como proposta revisada

## Estado
Aceita.

## Contexto
O bloco de serviços e encaminhamentos da ficha é um roteiro de rede. Tratar a marcação como vínculo
de ecomapa criaria rede de apoio fictícia, e a origem `digital-adaptation` não pode produzir vínculo
ativo.

## Decisão
Cada serviço marcado gera `EcomapLinkProposal` com decisão `pending-review`. Somente decisão humana
confirmada ou modificada gera `EcomapLink`, sempre com `originApplicationId` e origem
`printed-local-form`. Rejeição fica registrada e não cria vínculo. Confirmar ou modificar exige texto
compartilhável; rejeitar não exige, porque não há nada a compartilhar.

A proposta é criada ao concluir a aplicação e revisada na ficha de relações da família. O genograma
não recebe mudanças automáticas: o bloco de diagrams da fonte está disponível apenas pelo título.

## Alternativas
- Criar recurso externo automaticamente: rejeitada, criaria vinculo sem revisao.
- Exigir texto compartilhável na rejeição: rejeitada, a mensagem do validador não previa isso.

## Consequências
A ecomapa só muda por decisão humana rastreável; a proposta preserva a origem da aplicação.

## Impacto
- Privacidade: o texto compartilhável é redigido para a pessoa; a justificativa privada não sai.
- Clínica: proposta não é encaminhamento.
- Dados: entidades `proposed-domain-change` e `ecomap-link`.
- Testes: `tests/assessment-proposals.test.ts`, `tests/assessment-facts-storage.test.ts`.
