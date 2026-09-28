# ADR 0006: Store genérico com contratos de domínio

## Estado
Aceita.

## Decisão
Entidades de domínio são gravadas em envelopes no store `records`, identificadas por `entityType`. Contratos TypeScript e fábricas controlam a forma do domínio. Isso evita migrações de stores a cada nova entidade durante a fase de construção, preservando índices comuns, checksum e restauração.

## Consequências
Consultas são filtradas no adaptador neste marco. Índices especializados poderão ser adicionados por migração quando volume e padrões reais justificarem.
