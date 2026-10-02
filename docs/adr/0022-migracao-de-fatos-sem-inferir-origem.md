# ADR 0022: Migração de fatos sem inferir origem

## Estado
Aceita.

## Contexto
Fatos derivados passaram a ser gravados junto das aplicações. Backups antigos podem conter fatos sem
`factVersion` e sem `dataOrigin`, e a migração roda antes da restauração.

## Decisão
`migrateCareFactPayload` completa o que falta e recalcula o checksum por store. Fato sem `dataOrigin`
migra para `normal`, nunca para sintético: a ausência de marca não pode ser lida como origem de
demonstração, porque isso faria o isolamento depender de adivinhação.

## Alternativas
- Inferir `synthetic-demo` por prefixo de identificador: rejeitada, ids não carregam essa semântica.
- Recalcular todos os fatos a partir das aplicações: rejeitada, apagaria revisões humanas.

## Consequências
Backups antigos restauram com fatos válidos e rastreáveis; a versão do fato continua explícita.

## Impacto
- Privacidade: migração não amplia nem reduz o alcance dos dados.
- Dados: checksum por store recalculado após migração.
- Testes: `tests/assessment-facts-migration.test.ts`.
