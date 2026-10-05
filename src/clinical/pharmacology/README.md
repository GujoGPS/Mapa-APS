# Caderno farmacológico autoral

## Onde preencher

Edite exclusivamente:

`src/clinical/pharmacology/catalog.ts`

O catálogo atual já contém fichas. Ele é um array TypeScript tipado, importado pela biblioteca clínica e filtrado por `publishablePharmacologyEntries` antes de ser exibido.

## Como preencher

1. Abra `src/clinical/pharmacology/example.ts`.
2. Copie o objeto `EXAMPLE_PHARMACOLOGY_ENTRY`.
3. Cole o objeto dentro do array de `catalog.ts`.
4. Troque todos os campos terminados em `_A_PREENCHER`.
5. Comece com `reviewStatus: "draft"`.
6. Execute `npm run verify` e `npm run build`.

O arquivo `example.ts` não é importado no aplicativo e serve somente como molde. A validação mantém fichas com placeholders fora da interface e também exclui as arquivadas.
