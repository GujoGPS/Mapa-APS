# Relatório de Auditoria Pré-Uso Real

## Decisão

**NO-GO para dados reais em 27 de setembro de 2026.** O produto é um candidato de demonstração sintética, não uma versão clínica autorizada.

## Evidências executadas

- validadores estruturais dos Marcos 0 a 7;
- verificação de dados sintéticos;
- integridade e manifesto SHA-256 do pacote;
- auditoria estática para HTML perigoso, console, URLs externas e headers;
- tentativa de `npm install`, interrompida por timeout após 180 segundos sem sucesso;
- revisão de invariantes de snapshot, compartilhamento, fontes e doses bloqueadas.

## Bloqueadores críticos

1. pipeline completo não executado;
2. ausência de testes em dispositivos físicos;
3. restauração não testada sob interrupção e pressão de armazenamento;
4. banco local vivo não é integralmente cifrado pelo aplicativo;
5. ausência de revisão ASVS independente;
6. ausência de auditoria WCAG 2.2 AA;
7. ausência de revisão clínica independente;
8. doses farmacológicas não auditadas por produto;
9. ausência de base legal, governança e autorização institucional documentadas.

## Conclusão

O Marco 7 está concluído como auditoria, não como aprovação. A decisão honesta é manter `realDataAllowed: false` até fechamento verificável dos gates.
