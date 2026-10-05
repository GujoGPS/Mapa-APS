# Contribuição

## Antes de alterar

1. leia `docs/PROJECT_STATE.md`;
2. leia `docs/DECISIONS.md`;
3. identifique critérios afetados;
4. crie ADR se necessário;
5. rode `npm run verify` antes e depois.

## Regras que não se negociam

- **Nada de dado real.** Nem em teste, fixture, issue, log ou exemplo.
- **Mudança clínica** precisa de teste de comportamento junto — não basta o teste passar.
- **Texto visível é parte do produto.** Rótulo, mensagem e estado vazio entram na revisão.
- **Interface puxa dos tokens** em `app/styles.css`. Estilo solto não entra.
- **Alvo de toque mínimo: 44 px.** Estado nunca pode depender só de cor.
- **Animação respeita `prefers-reduced-motion`**, e movimento nunca é condição para o app funcionar.
- **Um commit por etapa.** Verificação padrão em cada um: `typecheck`, testes, lint, build, `verify`.
- **Restaure `tsconfig.tsbuildinfo`** e `next-env.d.ts` depois do build.

## O que não se toca

- `copilot-context/` e `create-copilot-bundles-final.ps1`;
- o `SecurityGate` em `app/layout.tsx` — só com autorização explícita, e sempre restaurado.

## Commits

Use mensagens objetivas, por exemplo:

```text
feat(storage): cria contrato de migração do IndexedDB
test(privacy): impede terceiro no resumo compartilhável
docs(adr): registra escolha do motor de ecomapa
```

## Pull requests

Devem declarar:

- objetivo;
- impacto em dados;
- impacto clínico;
- impacto em privacidade;
- testes executados;
- documentação atualizada.
