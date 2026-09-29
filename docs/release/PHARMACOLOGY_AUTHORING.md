# Preenchimento do farmacológico

- Arquivo editável: `src/clinical/pharmacology/catalog.ts`
- Molde completo: `src/clinical/pharmacology/example.ts`
- Contrato de tipos: `src/clinical/pharmacology/types.ts`
- Validação: `src/clinical/pharmacology/validation.ts`

O catálogo atual já está preenchido e é consumido como conteúdo estático tipado pela biblioteca clínica. A interface usa `publishablePharmacologyEntries` para excluir fichas arquivadas ou que não passam pela validação. O molde contém placeholders, fica separado do catálogo e não é importado nem exibido no aplicativo.
