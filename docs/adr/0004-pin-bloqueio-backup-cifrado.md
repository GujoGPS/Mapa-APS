# ADR 0004: PIN para bloqueio e senha separada para backup cifrado

## Estado

Aceita.

## Contexto

O bloqueio da interface e a cifragem restaurável cumprem papéis diferentes. Usar um PIN curto como chave direta de todos os dados criaria falsa segurança e risco de perda.

## Decisão

- PIN de 6 a 12 dígitos bloqueia a interface e é derivado com PBKDF2 e salt;
- backup protegido exige senha de pelo menos 12 caracteres;
- backup usa PBKDF2-SHA-256 e AES-GCM;
- não existe recuperação secreta;
- PIN não é apresentado como cifragem integral do banco.

## Consequências

A interface deve explicar o papel de cada mecanismo. Criptografia integral do banco poderá ser avaliada posteriormente por ADR e testes de desempenho.
