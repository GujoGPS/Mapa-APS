# ADR 0024: Posição arrastada como sobreposição, não como fonte

## Estado
Aceita.

## Contexto
Arrastar nós parece só efeito visual, mas passa a ser estado. O motor de domínio já calcula as
posições do genograma e do ecomapa de forma determinística, e o gerograma reproduz a mesma estrutura
a partir da mesma entrada. Guardar a posição do arrasto em outro lugar criaria duas verdades.

## Decisão
A posição salva é uma **sobreposição** do desenho calculado, nunca uma segunda fonte:

- o motor continua produzindo o desenho inicial; o que o usuário move fica por cima;
- nó que ainda não estava salvo usa a posição do motor;
- nó que saiu do grafo permanece no registro e recupera a posição se voltar;
- posição corrompida ou não finita é descartada em vez de quebrar o desenho;
- o escopo é família + tipo de diagrama + perspectiva + camada; trocar qualquer um deles desliga o layout;
- o botão "Voltar ao desenho original" limpa o registro.

O registro é a entidade `DiagramLayout`, que já existia no contrato, com `dataOrigin` para que o
isolamento da demonstração o alcance.

## Alternativas
- Deixar o arrasto só na tela: rejeitada, o desenho se perde a cada recarregamento.
- Gravar a posição como se fosse do domínio: rejeitada, quebraria o determinismo do motor.
- Um único layout por família: rejeitada, conflita entre genograma e ecomapa e entre perspectivas.

## Consequências
Passou a existir dado de interface persistido: entra em backup, restauração e migração por ser
registro normal. A exportação do SVG enquadra todos os nós antes de capturar e devolve a visão
anterior depois, para não deixar o grafo fora de lugar para quem está olhando.

## Impacto
- Privacidade: o layout não carrega conteúdo clínico, só coordenadas.
- Dados: `diagram-layout` no mesmo armazenamento dos demais registros, com checksum.
- Testes: `tests/diagram-layout.test.ts` e `tests/family-relations-panel.test.tsx`.
