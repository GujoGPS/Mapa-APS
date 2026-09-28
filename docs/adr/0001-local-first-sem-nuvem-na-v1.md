# ADR 0001: Local-first sem nuvem na primeira versão

## Estado

Aceita.

## Contexto

O Mapa armazena dados sensíveis e precisa operar em ambiente com conectividade instável. Contas e sincronização aumentariam superfície de risco, complexidade e dependência.

## Decisão

A primeira versão utiliza armazenamento local no dispositivo. Vercel distribui os arquivos do aplicativo, mas não recebe registros clínicos. IA externa funciona por cópia manual e desidentificada.

## Consequências

- funcionamento offline;
- necessidade de backup explícito;
- dados associados ao domínio de produção;
- ausência de sincronização entre dispositivos;
- necessidade de comunicar limites de persistência.
