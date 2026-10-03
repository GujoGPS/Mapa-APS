# Changelog da Especificação

## Não datado - fluxo ESF do adulto e projeções derivadas

### Acrescentado

- questionário da ficha "Avaliação de Saúde e DCNT do Adulto" como instrumento tipado e
  versionado, com as opções legíveis da página e as limitações de bloco declaradas;
- fatos clínicos derivados (`care-fact`), com proveniência, regra, certeza e visibilidade
  independente para clínica, pessoa e família;
- projeção de informação faltante baseada nas condições de aplicabilidade da própria ficha;
- persistência dos fatos ao concluir a aplicação, com supersessão na retificação;
- demonstração isolada com snapshot reversível, saída pela interface e backup normal limpo;
- edição de família e de pessoa preservando identidade, vitalidade e origem;
- serviços da ficha como propostas revisadas: nenhum vínculo de ecomapa nasce sem confirmação
  humana e texto compartilhável;
- visões acadêmica, da pessoa e comparação entre aplicações dentro da área da família.

- camada de desenho dos diagramas familiares migrada para React Flow, com o motor de dominio
  intacto como fonte de verdade, teste de renderizacao e teste de paridade do painel;
- exportacao de diagrama em vetor preservada via `html-to-image` sobre o viewport do fluxo.

- clique em um nó abre a pessoa selecionada;
- legenda das cores por qualidade de vínculo, gerada a partir da mesma fonte que pinta as arestas;
- reenquadramento automático ao trocar de família, perspectiva ou camada;
- posição de nó arrastada guardada como sobreposição do desenho do motor, com volta ao original;
- exportação do SVG agora enquadra todos os nós, e não apenas a fatia visível.

### Corrigido

- `summary.services` ace selections múltiplas, como na ficha impressa;
- rejeição de proposta não exige texto compartilhável;
- parametricidade de `supersedeFacts` corrigida;
- aplicabilidade movida da interface para o domínio.

## 1.0.0 - 2026-09-27

### Consolidado

- identidade Mapa e assinatura;
- arquitetura local-first;
- domínios e entidades;
- máquinas de estado;
- modelo clínico e farmacológico;
- UX mobile;
- resumo compartilhável;
- Jornada;
- IA externa por prompts;
- privacidade;
- backup;
- simulação end-to-end;
- critérios de aceitação;
- roadmap.

### Decisão final incorporada

A Jornada trabalha com quantidade **esperada** de duas famílias, sem limite técnico. Famílias podem recusar ou sair do acompanhamento e serem substituídas sem apagar o histórico ou quebrar o semestre.

### Status

Planejamento conceitual concluído. Produção ainda não iniciada.


## 1.1.0 - 2026-09-27

### Marco 0

- criada fundação Next.js com TypeScript estrito;
- incorporada documentação canônica;
- adicionados ADRs e padrões de código;
- adicionados contratos iniciais;
- adicionadas famílias sintéticas Horizonte e Travessia;
- adicionados testes dos invariantes;
- adicionada CI;
- preparada tela inicial de estado do projeto;
- mantida proibição de dados reais.


## 1.2.0 - 2026-09-27

### Marco 1

- implementada fundação IndexedDB;
- adicionada gravação verificada;
- adicionada solicitação de persistência;
- adicionado autosave de rascunhos;
- adicionada coordenação entre abas;
- adicionado PIN local, bloqueio por inatividade e ao ocultar;
- adicionados backups JSON comum e AES-GCM protegido;
- adicionada validação de checksums e restauração atômica entre stores;
- adicionado Service Worker e página offline;
- adicionados dashboard e testes de integridade.


## 1.3.0 - 2026-09-27

### Marco 2

- adicionadas pessoas, famílias, participações e vínculos com semestre;
- adicionados encontros e pendências;
- adicionada Jornada básica com famílias substituíveis;
- adicionadas timeline e seletores;
- adicionada navegação mobile;
- adicionada carga sintética do semestre;
- adicionados testes de domínio e invariantes.


## 1.4.0 - 2026-09-27

### Marco 3

- adicionados registros longitudinais de condições, medicamentos, exames, rastreamentos e planos;
- adicionadas políticas de compartilhamento;
- adicionado resumo de acompanhamento com saída autenticada por PIN;
- adicionadas sugestões da pessoa;
- adicionadas passagens estruturadas;
- adicionada visão para transcrição;
- adicionados testes de privacidade e transformação.


## 1.5.0 - 2026-09-27

### Marco 4

- adicionada biblioteca clínica piloto;
- adicionadas cinco DCNTs prioritárias;
- adicionados catálogo e links de fontes oficiais;
- adicionados exames e farmacologia contextual;
- adicionada validação editorial;
- adicionada distinção de fonte preliminar;
- bloqueada publicação de doses ainda não auditadas por produto.

## 1.6.0 - 2026-09-27

### Marco 5

- adicionadas relações interpessoais e recursos territoriais;
- adicionados genograma e ecomapa determinísticos;
- adicionadas camadas e perspectivas;
- adicionada narrativa textual equivalente;
- adicionado prompt de IA com manifesto;
- adicionada exportação SVG;
- adicionados testes de diagramas e privacidade.


## 1.7.0 - 2026-09-27

### Marco 6

- completada a Jornada longitudinal;
- adicionadas reflexões, competências e feedbacks;
- adicionados relatórios textuais;
- adicionado encerramento com destinação de pendências;
- adicionado snapshot imutável com checksum;
- adicionados adendos;
- adicionados testes de encerramento e invariantes históricos.


## 1.8.0-rc.0 - 2026-09-27

### Marco 7

- adicionada auditoria pré-uso real;
- adicionados headers de segurança;
- adicionada decisão de release calculada;
- adicionados checklists e matriz de dispositivos;
- adicionada auditoria estática;
- mantido NO-GO e bloqueio de dados reais por evidência insuficiente.


## 1.9.0-rc.0 - 2026-09-28

### Fundação do instrumento ESF

- adicionada definição tipada e versionada da página 28 da avaliação adulta de DCNT;
- adicionados contratos para aplicações individuais, projeções e propostas familiares/ecomapa;
- adicionados cálculos puros e testes de completude, condicionais, privacidade e isolamento por pessoa;
- preservados como manuais os itens sem regra clínica autorizada.
### Interface de avaliações

- adicionada a área Avaliações dentro da família;
- incluída seleção explícita de pessoa, histórico individual, rascunho, revisão, conclusão, arquivamento e retificação;
- concluída a interface com pressão por visita, critério explícito e classificação de cintura, progresso por bloco, revisão estrutural detalhada, estado de salvamento e preservação de respostas não aplicáveis;
- formulário renderizado a partir da definição versionada, com indicação de blocos sem fonte;
- preservado o isolamento de respostas entre integrantes.
