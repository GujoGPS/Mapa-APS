# Mapa

**Clínica, família e território**

Aplicativo local de apoio ao estudo, à organização longitudinal do cuidado familiar e à comunicação clínica supervisionada na Atenção Primária à Saúde.

> O Mapa é uma ferramenta acadêmica e pessoal. Não substitui prontuário institucional, julgamento clínico, protocolos locais, prescrição profissional, receitas ou laudos.

## Estado atual

- Versão: `1.0.4`
- Escopo: uso acadêmico local e demonstração supervisionada
- Decisão operacional: `GO LOCAL`
- Build de produção: aprovado
- Biblioteca clínica: implementada
- Caderno farmacológico autoral: implementado e pesquisável
- Catálogo farmacológico: preenchido e mantido pelo autor do projeto
- Persistência local: implementada
- Backup protegido: implementado com AES-GCM
- Dados sintéticos: disponíveis para demonstração e testes
- Dados reais: condicionados às regras da instituição, do serviço e do prontuário oficial

## Principais recursos

- acompanhamento longitudinal por semestre;
- organização de famílias, pessoas, encontros e pendências;
- Jornada acadêmica com reflexões, competências e feedbacks;
- genograma e ecomapa com representação estruturada;
- biblioteca clínica com condições, exames e fontes;
- caderno farmacológico autoral separado por indicação, população, via e apresentação;
- busca por medicamento, classe terapêutica e nome comercial;
- perfis farmacológicos com campos para início, titulação, dose usual, alvo, teto, duração e ajustes orgânicos;
- bloqueio local por PIN e proteção por inatividade;
- persistência no navegador e solicitação de armazenamento persistente;
- exportação, backup protegido, checksums e restauração atômica;
- auditoria local de prontidão operacional;
- aplicação responsiva e instalável como PWA.

## Requisitos

- Node.js 22 ou superior
- npm 11 ou superior

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Verificação e build

```bash
npm run lint
npm run typecheck
npm run test
npm run verify
npm run build
```

## Execução em produção local

Depois de concluir o build:

```bash
npm run start
```

Abra:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
app/                                  App Router, interface e componentes
src/audit/                            Gates e prontidão operacional
src/backup/                           Exportação, proteção e restauração
src/clinical/                         Biblioteca clínica e fontes
src/clinical/pharmacology/            Caderno farmacológico autoral
src/contracts/                        Contratos TypeScript do domínio
src/data/synthetic/                   Cenários e famílias sintéticas
src/domain/                           Regras de domínio e diagramas
src/security/                         PIN, codificação e utilidades de segurança
src/storage/                          Persistência local, schema e checksums
tests/                                Testes unitários e de contrato
docs/                                 Memória canônica, decisões e documentação
scripts/                              Verificações e auditorias do repositório
.github/workflows/                    Integração contínua
```

## Caderno farmacológico autoral

O catálogo farmacológico utilizado pela interface está em:

```text
src/clinical/pharmacology/catalog.ts
```

Os arquivos relacionados são:

```text
src/clinical/pharmacology/types.ts       Contratos TypeScript
src/clinical/pharmacology/catalog.ts     Catálogo exibido no aplicativo
src/clinical/pharmacology/example.ts     Molde estrutural não exibido
src/clinical/pharmacology/validation.ts  Validação das fichas
src/clinical/pharmacology/README.md      Instruções específicas
```

Estados editoriais aceitos:

```text
draft
checked-source
checked-preceptor
reviewed
archived
```

Após modificar o catálogo, execute:

```bash
npm run verify
npm run build
```

## Regra documental

Antes de uma mudança arquitetural:

1. ler `docs/PROJECT_STATE.md`;
2. consultar `docs/DECISIONS.md`;
3. criar ou atualizar um ADR em `docs/adr/`;
4. registrar a mudança em `docs/CHANGELOG.md`;
5. atualizar critérios, contratos e testes afetados.

## Segurança e privacidade

- mantenha o dispositivo protegido por senha, PIN ou biometria;
- utilize o bloqueio local do Mapa;
- gere backups protegidos regularmente;
- não publique bancos locais, backups ou dados identificáveis no GitHub;
- não registre dados pessoais em issues, logs, fixtures ou testes;
- não use previews públicos para informações identificáveis;
- respeite as regras da instituição, da preceptoria, da unidade de saúde e do prontuário oficial;
- trate o Mapa como ferramenta complementar, não como substituto do sistema institucional.

Consulte também:

```text
SECURITY.md
docs/PRIVACY_MODEL.md
docs/release/GO_LOCAL.md
docs/release/PHARMACOLOGY_AUTHORING.md
```

## Dados sintéticos

Os cenários sintéticos existem para:

- demonstração;
- regressão;
- desenvolvimento;
- validação de fluxos;
- testes de backup e restauração;
- testes dos diagramas familiares.

Dados sintéticos não devem ser confundidos com registros reais.

## Integração contínua

O workflow localizado em:

```text
.github/workflows/ci.yml
```

pode executar verificações automatizadas do repositório no GitHub Actions.

## Status resumido

```text
Instalação:              aprovada
TypeScript:              aprovado
Lint:                    aprovado
Testes:                  aprovados
Build de produção:       aprovado
Execução local:          aprovada
Persistência:            implementada
Backup protegido:        implementado
Piloto sintético:        aprovado
Uso acadêmico local:     GO
```

## Licença e autoria

Projeto acadêmico autoral. A definição de licença, distribuição e colaboração deve ser feita explicitamente antes de reutilização por terceiros.
