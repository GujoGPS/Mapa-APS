# ADR 0018: Demonstração isolada com snapshot reversível

## Estado
Aceita.

## Contexto
O modo de demonstração semeava famílias sintéticas no mesmo armazenamento do usuário e não havia
caminho para voltar ao estado anterior sem limpar o cache do aplicativo. Isso misturava dados de
ensino com dados de cuidado e quebrava a promessa de backup fiel ao estado real.

## Decisão
A demonstração é uma sessão explícita. Ao entrar, o aplicativo:
1. guarda em um snapshot local os registros normais (records, drafts, events);
2. limpa o espaço ativo e semeia o conjunto sintético;
3. marca cada registro criado com `dataOrigin: "synthetic-demo"`.

Ao sair, o snapshot substitui o estado ativo e a sessão é removida. A segurança (PIN) nunca é
restaurada nem tocada. O backup normal exclui registros sintéticos e a sessão de demonstração; a
inclusão sintética só ocorre por marcação explícita na interface.

## Alternativas
- Marcar campos em cada entidade: rejeitada, exigiria decisões em todos os contratos.
- Guardar a demonstração em outro banco: rejeitada, duplicaria o esquema e a migração.
- Apagar tudo ao sair: rejeitada, destruiria dados reais.

## Consequências
Registros normais não são editáveis durante a demonstração; o snapshoting é replace de stores e,
portanto, atômico por operação. Leva à criação da entidade `care-fact`, que precisa carregar a
mesma origem para participate do isolamento.

## Impacto
- Privacidade: demonstração nunca alimenta backup normal.
- Clínica: dados sintéticos são identificáveis na interface e nos arquivos exportados.
- Dados: `DEMO_SESSION_META_ID` em `meta`, snapshot com checksum por store.
- Testes: `tests/demo-mode.test.ts` e `tests/family-assessments-demo.test.tsx`.
