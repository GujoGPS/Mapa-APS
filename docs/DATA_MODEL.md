# Modelo de Dados Conceitual

## Entidades nucleares

### Person

Indivíduo independente de família, domicílio ou semestre.

Campos essenciais:

- id imutável;
- código visível editável;
- pseudônimo ou nome preferido opcional;
- faixa etária;
- dados demográficos clinicamente pertinentes;
- necessidades de comunicação e acessibilidade;
- estado vital;
- política de sensibilidade.

### Family

Unidade relacional de cuidado.

- id;
- código;
- apelido opcional;
- descrição;
- estado;
- ciclo de vida;
- contexto territorial geral;
- preocupações, recursos e vulnerabilidades.

### FamilyMembership

Relação muitos-para-muitos entre pessoa e família.

- papel;
- vínculo;
- período;
- convivência;
- função de cuidado;
- dependência;
- responsabilidade;
- perspectiva;
- proveniência.

### Household

Domicílio independente do conceito de família.

- tipo;
- contexto territorial aproximado;
- acessibilidade;
- riscos e recursos ambientais;
- períodos de residência.

### InterpersonalRelationship

Relação entre duas pessoas.

- tipo formal;
- proximidade;
- qualidade;
- frequência;
- direção do cuidado;
- conflito;
- estabilidade;
- perspectiva;
- fonte;
- validade temporal.

### ExternalResource e ExternalLink

Recursos do ecomapa e seus vínculos com pessoa ou família.

### Encounter

Contêiner modular para consulta, visita, contato, discussão, reunião, revisão ou atividade.

### ReportedTerm

Preserva a linguagem original antes da normalização clínica.

- texto original;
- conceito relacionado opcional;
- estado da associação;
- autor;
- data;
- proveniência.

### ConditionRecord

Condição confirmada, relatada, hipótese, fator de risco, sintoma, vulnerabilidade ou necessidade preventiva.

### MedicationReference

Conhecimento farmacológico de referência.

### PersonMedication

Uso real, relatado ou histórico de uma pessoa.

### ExamDefinition e ExamResult

Definição do exame separada de valor bruto e da interpretação.

### Interpretation

Interpretação versionada, dependente de contexto e preservada historicamente.

### ScreeningEpisode

Processo longitudinal de rastreamento.

### CarePlan e CarePlanItem

Plano com alvo individual, díade, cuidador, família, recurso ou equipe.

### PendingItem

Pendência com tipo, prioridade, destino e estado.

### SupervisorFeedback

Registro único ligável a pessoa, família, encontro, resultado, tema e Jornada.

### PatientSuggestion

Correção ou dúvida sugerida no modo acompanhamento.

### LongitudinalMarker

Evento contextual que aparece em timeline e gráfico sem afirmar causalidade.

### Semester e SemesterFamilyLink

Semestre e vínculo longitudinal com família. Quantidade esperada de famílias não é limite.

### Reflection, CompetencyEvidence, Snapshot e Addendum

Memória acadêmica, evidência de competência, estado congelado do semestre e correção posterior preservando o original.

## Tempo

Cada registro pode ter:

- tempo do evento;
- tempo do registro;
- período de validade;
- tempo de revisão.

A interface pergunta apenas o necessário; metadados técnicos são automáticos.

## Instrumentos clínicos versionados

`src/clinical/assessments/` contém definições tipadas de instrumentos, separadas de aplicações futuras. Uma `InstrumentApplication` pertence a uma pessoa por `personId`; `familyId` é somente o contexto familiar. A definição possui versão imutável, perguntas e opções com IDs estáveis, proveniência, visibilidade, sensibilidade e regras de aplicabilidade.

Aplicações futuras podem gerar resultados derivados, classificações manuais e propostas de alteração familiar/ecomapa, mas propostas exigem revisão humana e não atualizam o domínio automaticamente. A mesma aplicação canônica poderá alimentar projeção clínica/acadêmica e projeção da pessoa sem duplicar respostas.

## Proveniência

- observado;
- relatado pela pessoa;
- relatado por familiar;
- relatado por terceiro;
- documento;
- prontuário institucional consultado conforme autorização;
- resultado laboratorial;
- orientação de preceptoria;
- inferência clínica;
- produção automática do sistema.

## Confirmação

- não verificado;
- relatado;
- parcialmente confirmado;
- confirmado documentalmente;
- observado;
- divergente;
- desconhecido.
