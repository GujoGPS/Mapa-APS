# Registro de Defeitos

## Convenção

- `P0`: risco imediato de perda, exposição, decisão clínica incorreta ou impossibilidade de release.
- `P1`: bloqueia fluxo essencial ou conformidade exigida.
- `P2`: degradação relevante com alternativa segura.
- `P3`: aperfeiçoamento sem risco operacional relevante.

## Defeitos e bloqueios iniciais

### MAPA-001 — Pipeline não executável no ambiente atual

- Severidade: P0
- Estado: bloqueado por ambiente
- Reprodução: executar `npm ping` ou `npm install`
- Observado: timeout de rede para o registro npm
- Impacto: não há evidência de typecheck, lint, testes e build integrais
- Próxima ação: executar em ambiente com acesso ao registro
- Gate: build-pipeline

### MAPA-002 — Banco vivo não cifrado integralmente

- Severidade: P0
- Estado: decisão arquitetural pendente
- Impacto: PIN protege a interface, não o armazenamento extraído
- Próxima ação: concluir modelo de ameaça e decisão criptográfica
- Gate: full-db-encryption

### MAPA-003 — Farmacologia posológica não auditada por produto

- Severidade: P0
- Estado: gate de auditoria pendente; a interface atual já exibe fichas posológicas do catálogo.
- Mitigação atual: validação estrutural e exclusão de fichas arquivadas; isso não substitui auditoria farmacológica independente por produto.
- Próxima ação: documentar auditoria por produto ou restringir doses na interface, conforme ADR 0011.
- Gate: pharmacology

### MAPA-004 — Autorização institucional ausente

- Severidade: P0
- Estado: bloqueado
- Próxima ação: reunião formal com faculdade, preceptoria e UBS
- Gate: institutional

### MAPA-005 — Revisões externas ainda não nomeadas

- Severidade: P1
- Estado: aberto
- Escopo: clínica, farmacologia, segurança e acessibilidade
- Próxima ação: preencher `REVIEWER_NOMINATION.md`


### MAPA-006 — Literais de nova linha inválidos em arquivos TypeScript

- Severidade: P0
- Estado: corrigido internamente
- Descoberta: bundle com Bun
- Escopo: oito ocorrências em seis arquivos
- Impacto anterior: a aplicação não poderia ser compilada
- Correção: substituição por sequências escapadas válidas
- Evidência: `INTERNAL_VALIDATION.md`; bundle transitivo e parsing de todos os arquivos com zero falhas
- Teste de regressão necessário: manter parsing interno no pipeline


### MAPA-007 — Ausência de teste adversarial de backup sem navegador

- Severidade: P1
- Estado: corrigido internamente
- Correção: suíte pura de integridade, schema, AES-GCM, senha e adulteração
- Resultado: 10/10 PASS
- Limite residual: transações IndexedDB e quota exigem navegador real
