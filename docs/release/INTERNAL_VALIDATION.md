# Validação Interna sem Instalação npm

## Motivação

O registro npm está inacessível neste ambiente, mas existem `bun` e compilador TypeScript globais. A validação interna foi ampliada sem alegar equivalência com o build Next.js oficial.

## Descoberta crítica

O primeiro bundle interno encontrou seis arquivos com literais de nova linha quebrados, totalizando oito ocorrências:

- `app/journey-dashboard.tsx`: 2;
- `app/person-care-panel.tsx`: 1;
- `src/domain/care-selectors.ts`: 1;
- `src/domain/diagram-engine.ts`: 1;
- `src/domain/diagram-prompt.ts`: 2;
- `src/domain/journey-report.ts`: 1.

A causa foi a gravação de `"\n"` como nova linha física dentro de literais TypeScript durante a geração dos marcos. Os validadores textuais anteriores não compilavam os arquivos e, portanto, não detectavam essa classe de defeito.

## Correção

As oito ocorrências foram convertidas para literais escapados válidos (`"\n"`).

## Validações posteriores

### Bundle transitivo da aplicação

```text
bun build app/page.tsx
40 módulos empacotados
207,20 KB
resultado: PASS
```

As dependências externas de runtime foram marcadas como externas. Esse teste valida parsing, resolução dos módulos locais alcançáveis e transformação TS/TSX. Não equivale ao `next build`.

### Parsing individual

Todos os arquivos `.ts` e `.tsx` em `app`, `src` e `tests` foram submetidos individualmente ao bundler interno.

```text
falhas: 0
resultado: PASS
```

### Smoke tests de domínio

Foram executadas 10 asserções sobre:

- bloqueio de informação de terceiro;
- exame sem unidade;
- genograma;
- ecomapa;
- regra de não invenção no prompt;
- detector de telefone;
- bloqueio de encerramento com pendência aberta;
- checksum do snapshot;
- cópia independente do snapshot;
- validade da biblioteca clínica.

```text
asserções: 10
falhas: 0
resultado: PASS
```

## Interpretação

A validação interna mudou o estado do projeto de “não parseado” para “sintaticamente validado por ferramenta independente e smoke-tested no domínio”. O gate do build oficial continua bloqueado porque ainda faltam dependências reais, tipos oficiais, lint, Vitest e `next build`.
