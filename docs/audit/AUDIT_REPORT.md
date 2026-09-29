# Relatório de Auditoria Pré-Uso Real

## Decisão

**GO LOCAL em 28 de setembro de 2026.** O produto está apto para uso acadêmico local e demonstração supervisionada. Esta decisão não autoriza dados reais de forma irrestrita.

## Evidências executadas

- validadores estruturais dos Marcos 0 a 7;
- verificação de dados sintéticos;
- integridade e manifesto SHA-256 do pacote;
- auditoria estática para HTML perigoso, console, URLs externas e headers;
- tentativa de `npm install`, interrompida por timeout após 180 segundos sem sucesso;
- revisão de invariantes de snapshot, compartilhamento, fontes e doses bloqueadas.

## Condições e limitações

1. dados reais dependem das regras da instituição, do serviço, da preceptoria e do prontuário oficial;
2. o banco local e o dispositivo devem permanecer protegidos conforme as políticas aplicáveis;
3. testes físicos, governança institucional e revisões externas continuam condições para usos correspondentes;
4. o produto não substitui prontuário institucional, julgamento clínico ou protocolos locais.

## Conclusão

O Marco 7 distingue prontidão local de autorização para dados reais. O resultado estruturado é `decision: "GO LOCAL"`, com `realDataAllowed: false`, e mantém a possibilidade de NO-GO quando um gate técnico ou de privacidade local obrigatório falhar explicitamente.
