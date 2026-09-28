# Arquitetura do Sistema

## Princípios

- local-first;
- uma fonte de verdade, várias apresentações;
- separação entre conteúdo clínico e dados pessoais;
- histórico preservado;
- regras explicáveis;
- profundidade progressiva;
- migrações versionadas;
- falha segura.

## Domínios

### Conhecimento clínico

DCNTs, exames, medidas, medicamentos, farmacologia, MIPs, rastreamentos, sinais de alarme, fontes e versões.

### Pessoas e identidades

Pessoas pseudonimizadas, preferências, necessidades de comunicação e acessibilidade.

### Famílias e relações

Famílias, participações, domicílios, relações, cuidadores, recursos, vínculos externos, genogramas e ecomapas.

### Cuidado longitudinal

Encontros, condições, medicamentos em uso, resultados, planos, tarefas, rastreamentos, feedbacks e pendências.

### Jornada acadêmica

Semestres, vínculos com famílias, atividades, competências, reflexões, feedbacks, encerramentos, snapshots e adendos.

### Transformação

Visão profissional, resumo de acompanhamento, passagem, transcrição, relatórios, narrativas e prompts.

### Infraestrutura

IndexedDB, cache, Service Worker, bloqueio, versões, migrações, backup, restauração, integridade e concorrência.

## Fluxo de dados

```text
Dado original estruturado
  -> política de visibilidade
  -> transformação apropriada
  -> visão profissional | resumo | passagem | relatório | prompt
```

## Atualizações

- atualização da interface não apaga banco;
- atualização clínica não reescreve interpretações históricas;
- migrações críticas geram proteção prévia;
- Service Worker não aplica atualização durante edição não salva;
- preview e produção utilizam origens separadas e explicitamente identificadas.

## Concorrência

Registros possuem versão. Alterações em outra aba ou janela geram conflito explícito; sobrescrita silenciosa é proibida.
