# Arquitetura

> **Estado:** reescrito em 05/10/2026. A versão anterior (28/09) descrevia um app anterior à
> ficha ESF, ao calendário de vacinação, à aba UBS, à identidade visual e à revisão de texto.
> Se você chegou aqui procurando os marcos 0–7, eles continuam em `PROJECT_STATE.md` e no
> `CHANGELOG.md`, que estão atualizados.

## Princípios

Estes não mudaram desde 28/09 e continuam valendo:

- **local-first** — nada sai do aparelho sem ação explícita da pessoa;
- **uma fonte de verdade, várias apresentações** — o mesmo dado vira tela, resumo, prontuário e prompt;
- **separação entre conteúdo clínico e dados pessoais**;
- **histórico preservado** — corrigir cria versão nova, não apaga a antiga;
- **regras explicáveis** — nenhum cálculo clínico é caixa-preta;
- **profundidade progressiva** — primeiro o essencial, o detalhe sob demanda;
- **migrações versionadas**;
- **falha segura** —-validação antes de restauração, e nada é sobrescrito em silêncio.

Abaixo, o que mudou: a arquitetura **deixa de ser sóFamily/Care** e ganha uma cadeia clínica
de verdade.

---

## As três camadas

```text
app/          telas e componentes        não conhecem o banco
  ↓ importa de
src/domain/   entidades, comandos, casos de uso, seletores
  ↓
src/contracts/  tipos que tudo compartilha
  ↓
src/storage/  IndexedDB, repositório, autosave, concorrência
```

**A regra que sustenta o resto:** nenhuma tela escreve no banco. Uma tela importa comandos de
`src/domain` e casos de uso de `src/clinical`. Isso é o que permite trocar a interface inteira
sem tocar em regra clínica — foi exatamente o que aconteceu na revisão visual.

---

## Domínios

### Conhecimento clínico — `src/clinical`

22 arquivos. Condições, exames, medicamentos, **calendário de vacinação**, fontes e versões.

### Instrumento e avaliação — `src/clinical/assessments`

A parte que mais cresceu. Onze arquivos que formam uma cadeia:

| Arquivo | Responsabilidade |
|---|---|
| `instruments/adult-dcnt-esf/definition.ts` | o instrumento tipado e versionado |
| `types.ts` | contratos, incluindo **status por provenance** |
| `applicability.ts` | quem responde a quê, com override humano |
| `validation.ts` | o que impede concluir |
| `calculations.ts` | IMC, PA média, controle pressórico, risco cardiovascular |
| `application.ts` | ciclo de vida: criar, salvar, revisar, concluir, arquivar, **desarquivar**, retificar |
| `facts.ts` | derivação dos **fatos clínicos** a partir das respostas |
| `fact-repository.ts` | persistência dos fatos, com supersessão na retificação |
| `proposals.ts` | serviço marcado → proposta, que nunca vira vínculo sozinho |
| `migration.ts` | leitura de registros legados sem inventar origem |

**O instrumento, em números que o teste garante:** 7 seções, 45 perguntas, 114 opções, 9 ambiguidades
declaradas. Seis seções são preenchíveis; a sétima — genograma, ecomapa e observações — **remete
para a aba Cuidado**, onde já é registrada. É por isso que a ficha não inventa bloco: a folha
pula do 2 para o 6, e a app também.

### Pessoas, famílias e relações — `src/contracts`, `src/domain`

Famílias, participações, domicílios, relações com **trilha de alteração**, recursos externos e
links de ecomapa.

### Cuidado longitudinal — `src/domain/longitudinal-factories.ts`

Encontros, condições, medicamentos em uso, resultados, planos, rastreamentos e pendências.

### Jornada acadêmica — `src/domain/journey-factories.ts`

Semestres, vínculos, competências, reflexões, feedbacks, encerramento e snapshot.

### Diagramas — `src/domain/diagram-engine.ts` + `app/family-relations-flow.tsx`

O motor de domínio monta o modelo; a tela só desenha com **React Flow**. Perspectiva e camada
mudam o modelo, não o desenho. A exportação SVG sai do viewport renderizado.

### Comunicação externa — `src/clinical/ai/prompt-builder.ts`

Sanitização **por padrão**. Identificadores saem; entram o código da família, o da pessoa e a
idade. O que foi retirado por privacidade e o que é lacuna de preenchimento são **grupos
separados**, cada um com a lista do que saiu.

### Modo demonstração — `src/domain/demo-mode.ts`

Guarda o estado normal, semeia três famílias sintéticas num espaço separado e devolve tudo ao
sair. Rascunhos e eventos também são isolados; o backup normal nunca inclui sintético.

### Infraestrutura — `src/storage`, `src/security`, `src/backup`

Cinco lojas no IndexedDB: `meta`, `records`, `drafts`, `events`, `security`. Autosave com
debounce, detecção de múltiplas abas, backup com AES-GCM e checksum, e PIN local.

---

## Armazenamento

```text
meta       versão do schema e marcadores de migração
records    entidades do domínio, com recordVersion e proveniência
drafts     trabalho em andamento, por usuário do aparelho
events     trilha de auditoria
security   PIN e preferências locais
```

Concorrência: todo registro tem versão. Alteração em outra aba gera **conflito explícito** —
sobrescrita silenciosa continua proibida.

---

## Interface

`app/` tem 24 componentes. A hierarquia é:

```text
layout.tsx        SecurityGate > ToastProvider > children
page.tsx          Workspace
workspace.tsx     as 5 abas: Início, Clínica, Cuidado, UBS, Mais
ui.tsx            Botão, Aba, Aviso, Cartao, Campo, Salvo
sheet.tsx         folha inferior em portal no document.body
toast.tsx         aviso passageiro
```

**Todos os overlays saem por `createPortal(..., document.body)`.** O `.card` usa
`backdrop-filter`, que cria containing block: um descendente com `position: fixed` dentro de um
card deixa de ser fixo em relação à viewport. O portal resolve sem remover o desfoque.

O sistema visual tem **um tema só**. As cores saíram de amostragem da marca
(`public/brand/mapa-logo.png`) e vivem como tokens em `styles.css`; nenhum componente escreve cor
solta.

---

## Fluxo de dados

O fluxo conceitual de 28/09 continua, com a etapa clínica no meio:

```text
resposta na ficha
  → regra de aplicabilidade
  → validação
  → fato clínico derivado (com provenance, regra e certeza)
  → serviço marcado vira proposta
  → decisão humana
  → vínculo no ecomapa, com origem registrada
```

Nenhuma etapa é automática. A última é sempre humana.

---

## Atualizações

As quatro regras originais continuam:

- atualização da interface não apaga banco;
- atualização clínica não reescreve interpretação histórica;
- migração crítica gera proteção prévia;
- Service Worker não aplica atualização durante edição não salva.

Acrescentada: **`unarchiveApplication` devolve a avaliação ao status de origem**, gravado em
`archivedFrom` no momento do arquivamento. Arquivar sem volta seria exclusão com outro nome.

---

## Verificação

```bash
npm run verify   # docs, dados sintéticos, marcos 1–7, auditoria, tipos, lint, 308 testes
```

A arquitetura é testada por comportamento, não por descrição: há teste de contrato do
instrumento, de paridade do motor de diagramas, de isolamento do modo demonstração e de
portabilidade dos tipos de transição.
