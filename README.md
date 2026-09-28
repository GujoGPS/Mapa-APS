# Mapa

**Clínica, família e território**

Marco 7 do projeto Mapa: repositório, documentação viva, contratos iniciais, dados sintéticos e fundação verificável para a produção.

> O Mapa é uma ferramenta pessoal de apoio ao estudo, à organização do cuidado e à comunicação supervisionada. Não substitui prontuário institucional, julgamento clínico, protocolos locais, receitas ou laudos.

## Estado

- Marco: `7 - Auditoria pré-uso real`
- Biblioteca clínica piloto implementada em nível essencial/ampliado; doses seguem bloqueadas até auditoria por produto
- Dados reais: proibidos neste marco
- Dados incluídos: exclusivamente sintéticos

## Requisitos

- Node.js 22 ou superior
- npm 11 ou superior

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```

## Estrutura

```text
app/                  App Router e tela de estado do Marco 0
src/contracts/        Contratos TypeScript iniciais
src/data/synthetic/   Duas famílias sintéticas da simulação
src/lib/               Utilidades puras e metadados do projeto
tests/                 Testes unitários e de contrato
docs/                  Memória canônica e ADRs
scripts/               Verificações do repositório
.github/workflows/     Integração contínua
```

## Regra documental

Antes de uma mudança arquitetural:

1. ler `docs/PROJECT_STATE.md`;
2. consultar `docs/DECISIONS.md`;
3. criar ou atualizar um ADR em `docs/adr/`;
4. registrar a mudança em `docs/CHANGELOG.md`;
5. atualizar critérios e testes afetados.

## Segurança

Não cadastre informações reais em:

- desenvolvimento local sem autorização institucional;
- preview da Vercel;
- homologação;
- dados sintéticos;
- issues, logs ou testes.

Veja `SECURITY.md` e `docs/PRIVACY_MODEL.md`.
