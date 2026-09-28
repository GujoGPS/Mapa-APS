# ADR 0002: Famílias esperadas não constituem limite técnico

## Estado

Aceita.

## Contexto

A previsão acadêmica é acompanhar duas famílias. Uma família pode recusar, interromper ou precisar ser substituída.

## Decisão

O semestre armazena `expectedFamilyCount`, mas permite qualquer quantidade de vínculos. A substituição encerra ou altera o vínculo com o semestre sem apagar a família ou seu histórico.

## Consequências

- Jornada permanece estável diante de recusas;
- histórico de famílias anteriores é preservado;
- critérios e testes devem cobrir substituição;
- interface comunica expectativa em vez de capacidade máxima.
