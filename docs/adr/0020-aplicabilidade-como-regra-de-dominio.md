# ADR 0020: Aplicabilidade como regra de domínio

## Estado
Aceita.

## Contexto
A ficha impressa traz condições de aplicabilidade por pergunta ("Se Hipertenso", "MULHER 25-64
ANOS", "contém outro"). A lógica vivia dentro do componente de interface, o que impedia o domínio de
reusá-la para projetar informação faltante.

## Decisão
`questionApplicable` e `automaticApplicabilityState` passam a viver em `src/clinical/assessments/
applicability.ts`. O override humano do avaliador prevalece sobre a leitura automática. A projeção de
informação faltante usa essas funções: só vira "faltante" o que a própria ficha declara aplicável
por condição ou por `required`; quando a aplicabilidade não é resolvível, nada é declarado ausente.

## Alternativas
- Tratar toda pergunta não respondida como faltante: rejeitada, inventaria obrigação onde a
  fonte não declara.
- Manter a lógica na interface: rejeitada, regra clínica fora do domínio.

## Consequências
A projeção de dados faltantes é conservadora e rastreável à coluna da ficha.

## Impacto
- Clínica: não se afirma obrigação que a fonte não declara.
- Dados: aplicabilidade manual continua registrada em `applicabilityOverrides`.
- Testes: `tests/assessment-facts.test.ts`.
