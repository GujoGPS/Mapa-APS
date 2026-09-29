# Estado Canônico do Projeto

## Identidade

- **Nome de trabalho aprovado:** Mapa
- **Assinatura:** Clínica, família e território
- **Forma:** PWA mobile-first, responsiva, instalável e offline-first
- **Distribuição:** Vercel em domínio de produção estável
- **Armazenamento primário:** IndexedDB no dispositivo
- **Sincronização em nuvem:** fora da primeira versão
- **IA embarcada:** não
- **Uso de IA externa:** prompts estruturados, desidentificados, revisados e copiados manualmente

## Contexto de uso

O Mapa apoiará um estudante de Medicina durante atividades longitudinais na APS. A previsão acadêmica é acompanhar duas famílias ao longo do semestre. Essa quantidade é uma expectativa, não um limite técnico, porque uma família pode recusar acompanhamento ou precisar ser substituída.

## Finalidades

1. consulta clínica rápida sobre DCNTs;
2. interpretação contextual de exames e tendências;
3. farmacologia aplicada e auditável;
4. registro longitudinal de pessoas e famílias;
5. rastreamento como processo;
6. abordagem familiar com genograma, ecomapa e instrumentos pertinentes;
7. resumo de acompanhamento compreensível à pessoa;
8. passagem estruturada à preceptoria;
9. transcrição organizada para papel;
10. Jornada acadêmica visitável e encerrável;
11. preparação segura de prompts para IA externa;
12. backup e restauração verificáveis.

## Invariantes

1. Dados reais permanecem locais por padrão.
2. Deploys temporários e ambientes de demonstração recebem somente dados sintéticos.
3. O Mapa não se apresenta como prontuário institucional.
4. O prontuário oficial permanece na UBS; o Mapa mantém um resumo pessoal de acompanhamento.
5. Nenhum dado é enviado automaticamente a uma IA.
6. A ausência de alerta não significa ausência de risco ou interação.
7. Dados brutos e interpretações permanecem separados.
8. História clínica não é silenciosamente sobrescrita.
9. Informação de terceiro é bloqueada em resumos compartilháveis por padrão.
10. Conteúdo clínico declara fonte, população, escopo, versão e data de revisão.
11. O motor clínico pode recusar interpretação quando faltarem dados.
12. Uso rápido não exige preenchimento completo de módulos irrelevantes.
13. Encerrar semestre produz snapshot e não apaga dados.
14. Família e domicílio são conceitos distintos.
15. Pessoa pode participar de mais de uma família e de mais de um domicílio.
16. Quantidade esperada de famílias no semestre não constitui limite técnico.
17. O aplicativo deve explicar o que salvou, o que falhou e o que permanece pendente.

## Rounds concluídos

- Round 1: arquitetura e dados.
- Round 2: clínica e farmacologia.
- Round 3: experiência, compartilhamento e privacidade operacional.
- Round 4: auditoria adversarial.
- Round 5: simulação integral de semestre com duas famílias sintéticas.

## Próximo marco

Iniciar produção somente após comando explícito. A produção começa pelo repositório, documentação viva e fundação local-first, não pelo preenchimento integral da biblioteca clínica.


## Produção

### Marco 0

- **Estado:** concluído em 27 de setembro de 2026.
- repositório estruturado;
- documentação canônica incorporada;
- contratos TypeScript iniciais;
- dados sintéticos adicionados;
- testes de invariantes adicionados;
- CI e verificações do repositório preparadas;
- aplicação placeholder identificada como ambiente sem dados reais.

### Próximo

Marco 1: fundação local-first.


### Marco 1

- **Estado:** concluído em 27 de setembro de 2026.
- IndexedDB versionado;
- gravação com releitura e checksum;
- estado e solicitação de persistência;
- autosave de rascunhos;
- coordenação entre abas;
- PIN local com política mínima, bloqueio ao ocultar e bloqueio por inatividade;
- backup comum e protegido;
- validação e restauração atômica entre stores;
- Service Worker e fallback offline;
- dashboard de armazenamento;
- testes e verificações adicionados.

### Próximo

Marco 2: pessoas, famílias e encontros.


### Marco 2

- **Estado:** concluído em 27 de setembro de 2026.
- pessoas, famílias e participações;
- famílias esperadas sem limite técnico;
- Jornada básica;
- encontros rápidos modulares;
- pendências explícitas;
- timeline derivada;
- persistência por contratos de domínio;
- demonstração Horizonte e Travessia;
- navegação mobile com bottom bar;
- formulários em bottom sheets.

### Próximo

Marco 3: cuidado longitudinal e compartilhamento.


### Marco 3

- **Estado:** concluído em 27 de setembro de 2026.
- condições e problemas;
- medicamentos da pessoa;
- exames e resultados;
- rastreamentos;
- planos de cuidado;
- política central de compartilhamento;
- resumo de acompanhamento com saída autenticada;
- sugestões da pessoa;
- passagens de 30 segundos, 2 minutos e completa;
- visão para transcrição.

### Próximo

Marco 4: biblioteca clínica piloto e farmacologia auditada.


### Marco 4

- **Estado:** concluído em 27 de setembro de 2026, nível editorial essencial/ampliado.
- cinco condições piloto;
- catálogo de fontes oficiais;
- afirmações clínicas atômicas e versionadas;
- exames prioritários com travas interpretativas;
- farmacologia contextual por classes;
- distinção entre fonte vigente e relatório preliminar;
- doses bloqueadas até auditoria regulatória por produto e indicação;
- interface Clínica com busca, fontes e escopo.

### Próximo

Marco 5: genograma, ecomapa e abordagem familiar.


### Marco 5

- **Estado:** concluído em 27 de setembro de 2026.
- relações interpessoais com perspectiva e tempo;
- recursos externos e vínculos territoriais;
- genograma em camadas;
- ecomapa automático;
- estado divergente preservado;
- narrativa textual acessível;
- prompt para IA com manifesto;
- detector local de identificadores óbvios;
- exportação SVG.

### Próximo

Marco 6: Jornada completa, encerramento, snapshot e relatórios.


### Marco 6

- **Estado:** concluído em 27 de setembro de 2026.
- visita longitudinal por família;
- reflexões acadêmicas;
- evidências de competência;
- feedbacks de preceptoria;
- relatório do semestre;
- destinação explícita de pendências;
- encerramento por etapas;
- snapshot com checksum;
- dados vivos separados do retrato histórico;
- adendos sem alteração do original.

### Próximo

Marco 7: auditoria pré-uso real, build, testes em dispositivos e gates institucionais.


### Marco 7

- **Estado da auditoria:** concluída em 27 de setembro de 2026.
- **Decisão operacional:** GO LOCAL.
- **Dados reais:** continuam condicionados às regras da instituição, do serviço, da preceptoria e do prontuário oficial.
- **Distribuição pública:** não autorizada por esta decisão.
- **Substituição de prontuário:** não autorizada; o Mapa permanece ferramenta acadêmica local.
- headers defensivos e CSP adicionados;
- painel de gates adicionado;
- auditoria estática adicionada;
- checklists de segurança, acessibilidade, dispositivos e instituição adicionados;
- bloqueadores clínicos, farmacológicos, técnicos e institucionais formalizados.

### Delimitação operacional

GO LOCAL representa prontidão técnica para uso acadêmico local e demonstração supervisionada. Não é autorização institucional para dados reais, distribuição pública irrestrita ou assistência autônoma.
