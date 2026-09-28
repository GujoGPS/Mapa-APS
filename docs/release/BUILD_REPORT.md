# Relatório de Build da Onda A

## Resultado

**BLOCKED BY ENVIRONMENT**

## Executado

```text
node --version: v24.16.0
npm --version: 11.19.1
npm registry: configurado para registry.npmjs.org
npm ping: FETCH_ERROR, network timeout
npm install: tentativa anterior excedeu 180 segundos
```

## Não executado por ausência de dependências

```text
npm run typecheck
npm run lint
npm run test
npm run build
```

## Controles que passaram sem dependências

- validadores estruturais dos Marcos 0 a 7;
- verificação de dados sintéticos;
- auditoria estática em 57 arquivos;
- integridade do ZIP;
- manifesto SHA-256.

## Interpretação

Este relatório não reprova o código e não aprova o build. O gate permanece bloqueado até instalação limpa e execução integral em outro ambiente.


## Validação interna adicional

Após identificar a disponibilidade do Bun, foi executado um bundle transitivo da aplicação. A primeira execução detectou oito literais inválidos em seis arquivos. Todos foram corrigidos.

Resultado após correção:

```text
Bundle transitivo: PASS
Módulos locais empacotados: 40
Parsing individual de app/src/tests: PASS
Falhas de parsing: 0
Smoke tests de domínio: 10/10 PASS
```

O build oficial permanece bloqueado, mas agora há evidência direta de validade sintática e execução de partes críticas do domínio.
