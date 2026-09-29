# Modelo de Conteúdo Clínico

## Escopo piloto

1. hipertensão arterial sistêmica;
2. diabetes mellitus tipo 2;
3. doença renal crônica;
4. dislipidemia;
5. obesidade.

## Estrutura de cada condição

1. identidade e escopo;
2. visão rápida;
3. suspeita e diagnóstico;
4. avaliação inicial;
5. estratificações independentes;
6. exames e monitoramento;
7. manejo não farmacológico;
8. manejo farmacológico;
9. acompanhamento longitudinal;
10. complicações e encaminhamento;
11. populações especiais;
12. resumo compartilhável;
13. fontes e versão.

## Exames

Cada exame responde:

- por que solicitar;
- quando solicitar;
- o que se espera;
- o que interfere;
- como interpretar;
- o que representa risco;
- que mudança relativa importa;
- como muda a conduta;
- quando repetir;
- qual fonte sustenta a afirmação.

## Categorias distintas

- intervalo de referência;
- limiar diagnóstico;
- meta terapêutica;
- limiar de ação;
- valor potencialmente crítico;
- mudança em relação à referência inicial registrada;
- tendência longitudinal.

## Saídas do motor clínico

### Determinística

Cálculo, unidade, ausência de basal, posição em relação ao intervalo informado.

### Contextual

Medicamentos, sintomas, população especial, interferentes, intercorrências.

### Clínica supervisionada

Hipótese, urgência, ajuste, encaminhamento e decisão terapêutica.

O motor pode recusar classificação.

## Instrumento local da ESF

A fundação em `src/clinical/assessments/instruments/adult-dcnt-esf/` representa a página 28 de `AVALIAÇÃO DE SAÚDE E DCNT DO ADULTO`, versão `local-esf-2026-page-28-v1`. Ela preserva origem local, IDs estáveis, ambiguidades da ficha e políticas de visibilidade. As aplicações futuras são individuais (`personId`) com `familyId` como contexto, e não transformam a família em prontuário coletivo.

As únicas derivações implementadas são idade/faixa etária, IMC, média de duas aferições de pressão e circunferência conforme regra local explicitamente escolhida. Controle da pressão, risco cardiovascular, HbA1c, CIAP-2 e encaminhamentos permanecem manuais ou pendentes de fonte. Blocos 3, 4 e 5 são ausentes; o Bloco 8 tem somente título na fonte. A definição não substitui decisão clínica nem prontuário institucional.

## Conteúdo em níveis

- essencial;
- ampliado;
- auditado;
- revisão necessária.

## Versionamento

Resultado bruto é imutável. Interpretação histórica é preservada. A referência atual pode ser exibida ao lado sem reescrever o passado.
