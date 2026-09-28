# ADR 0005: Service Worker conservador

## Estado

Aceita.

## Decisão

- navegações usam rede com fallback de cache;
- ativos estáticos podem ser armazenados após resposta válida;
- rotas centrais possuem fallback offline;
- atualizações não dependem de AppCache;
- nenhuma resposta clínica remota é cacheada porque a primeira versão não possui API clínica pessoal.
