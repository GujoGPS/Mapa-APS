# ADR 0015: Snapshot imutável e adendos

## Estado
Aceita.

## Decisão
Encerramento cria cópia estruturada com checksum e relatório. Dados vivos podem continuar evoluindo, sem alterar o snapshot. Correções posteriores são adendos vinculados, nunca reescrita do original.
