# Baseline da Onda A

## Identificação

- Projeto: Mapa
- Candidato: `0.7.0-rc.0`
- Baseline: `v0.7.0-rc.0-audit`
- Data: 27 de setembro de 2026
- Dados reais: proibidos
- Decisão: NO-GO

## Ambiente observado

- Sistema: Linux
- Node: v24.16.0
- npm: 11.19.1
- Registro configurado: npmjs
- Dependências instaladas: não
- `package-lock.json`: não disponível porque o registro npm não respondeu neste ambiente

## Evidência de conectividade

`npm ping --fetch-timeout=10000 --fetch-retries=0` terminou com `FETCH_ERROR` por timeout. A falha foi classificada como indisponibilidade do ambiente de execução, não como aprovação ou reprovação do código.

## Escopos separados

- `development`: desenvolvimento local, dados sintéticos.
- `synthetic-demo`: demonstração, somente dados marcados como sintéticos.
- `release-candidate`: candidato congelado para validação; `realDataAllowed` permanece `false`.

## Reprodutibilidade esperada

Em ambiente com acesso ao registro:

```bash
npm ci
npm run verify
npm run build
```

O hash do artefato e os logs devem ser anexados ao índice de evidências.

## Identificadores Git

- Commit preliminar do congelamento: `b31bc3a741e6f5ed0a1c1601a7e5c157e635bdd3`
- Tag anotada: `v0.7.0-rc.0-audit`
