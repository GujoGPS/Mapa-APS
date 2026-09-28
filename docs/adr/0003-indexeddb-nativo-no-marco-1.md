# ADR 0003: IndexedDB nativo no Marco 1

## Estado

Aceita.

## Contexto

A fundação precisa controlar schema, transações, verificação e migrações sem acoplar o domínio a uma biblioteca. IndexedDB é assíncrono, transacional e adequado a dados estruturados locais.

## Decisão

O Marco 1 usa uma camada própria e pequena sobre IndexedDB nativo. O domínio não acessa a API diretamente. Uma biblioteca poderá ser adotada depois por ADR, sem alterar contratos de domínio.

## Consequências

- menos dependências na fundação;
- maior responsabilidade de teste;
- controle explícito das transações;
- adaptador substituível.
