# ADR 0019: Fatos derivados com proveniência e visibilidade

## Estado
Aceita.

## Contexto
A ficha ESF precisa alimentar o acompanhamento longitudinal, a visão acadêmica, a visão da pessoa e
o ecomapa. Sem uma camada própria, cada consumidor reinterpreta as respostas e o produto passa a
inventar regra clínica onde a fonte impressa é ambígua.

## Decisão
Respostas da ficha geram `CareFact` derivados e versionados (`factVersion`). Cada fato carrega:
- origem da derivação (`reported`, `measured`, `calculated`, `manually-classified`,
  `missing-information`, `care-follow-up`, `proposed-domain-change`, `source-limitation`);
- regra e versão, quando calculado;
- proveniência e `certaintyState`;
- visibilidade independente para clínica, pessoa e família;
- `reviewStatus`, com `superseded` e `invalidatedAt` quando uma retificação assume.

Fatos derivados nunca são gravados como resposta da ficha. Limitações da fonte são fatos
`source-limitation`, não omissões silenciosas.

## Alternativas
- Ler respostas direto na interface: rejeitada, duplicaria a lógica em cada visão.
- Derivar no salvamento e gravar resultado como resposta: rejeitada, mistura dado com derivado.
- Promover respostas a prontuário: rejeitada, o Mapa é instrumento de ensino, não prontuário.

## Consequências
Fatos são persistidos ao concluir a aplicação e ficam disponíveis para a família, a pessoa e a
academia com recortes diferentes. A retificação marca os fatos anteriores como superados sem
apagá-los.

## Impacto
- Privacidade: a visão da pessoa esconde notas internas e fatos pendentes de revisão.
- Clínica: nada é classificado além do que a fonte permite; ausência de regra vira limitação.
- Dados: entidade `care-fact`, id estável `${applicationId}:fact:${key}`.
- Testes: `tests/assessment-facts.test.ts`, `tests/assessment-facts-storage.test.ts`.
