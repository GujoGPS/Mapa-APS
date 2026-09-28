# Padrões de Código

## TypeScript

- modo strict;
- `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`;
- evitar `any`;
- entidades recebem IDs imutáveis;
- dados clínicos usam tipos explícitos;
- transformações devem ser funções puras quando possível.

## React e Next.js

- Server Components por padrão;
- Client Components somente quando exigidos por estado, eventos ou APIs do navegador;
- lógica de domínio fora de componentes visuais;
- componentes acessíveis e estados não dependentes apenas de cor.

## Dados sensíveis

- não registrar conteúdo clínico em console;
- não incluir dados reais em fixtures;
- não capturar analytics com dados pessoais;
- não enviar dados pessoais à Vercel;
- revisar toda nova exportação.

## Testes

Toda regra de segurança, migração ou visibilidade exige teste. Bugs com risco de perda ou vazamento recebem teste de regressão antes do fechamento.
