# Correção do runtime local

## CSP em desenvolvimento

A diretiva `unsafe-eval` é adicionada exclusivamente quando `NODE_ENV=development`, pois o React a utiliza para recursos de depuração. Ela permanece ausente em produção.

## Hidratação

O elemento `body` usa `suppressHydrationWarning` somente no nível raiz para tolerar atributos injetados por extensões do navegador, como Grammarly. Diferenças internas dos componentes continuam visíveis.

## Catálogo clínico

A busca por marcação HTML em `src/clinical/sources.ts` não encontrou `<a`, `href=`, `rel=` ou `target=`. As URLs permanecem como strings TypeScript no catálogo autorizado.
