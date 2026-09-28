# Plano de Fechamento dos Gates do Mapa

**Versao do plano:** 1.0  
**Data-base:** 27 de setembro de 2026  
**Candidato atual:** 0.7.0-rc.0  
**Decisao atual:** NO-GO para dados reais  
**Objetivo:** transformar o candidato sintético em uma versão tecnicamente verificável e institucionalmente autorizada, sem tratar a conclusão do desenvolvimento como prova de segurança.

---

## 1. Resultado-alvo

O plano termina somente quando existirem três resultados separados:

1. **Release técnica aprovada:** instalação, compilação, testes, segurança, persistência, acessibilidade e dispositivos aprovados.
2. **Release clínica aprovada:** conteúdo clínico e farmacológico revisado por profissionais independentes, com escopo e limites formalizados.
3. **Uso institucional autorizado:** faculdade, preceptoria e UBS definem finalidade, responsabilidades, base legal, dispositivo, retenção e relação com o prontuário oficial.

A autorização para dados reais exige os três resultados. Sucesso técnico isolado não libera uso real.

---

## 2. Princípios de execução

1. **Dados sintéticos até a decisão GO.** Nenhuma fase usa dados identificáveis para “testar melhor”.
2. **Evidência antes de status.** Gate só muda para `passed` com artefato verificável.
3. **Falha reproduzível vale mais que aprovação informal.** Toda falha gera caso de teste ou registro estruturado.
4. **Correções não apagam evidências anteriores.** Relatórios antigos permanecem versionados.
5. **Revisão independente nos domínios de alto risco.** O autor do conteúdo não é o único aprovador.
6. **GO pode ser restrito.** Uma primeira liberação pode permitir acompanhamento pseudonimizado e proibir farmacologia posológica, IA externa ou dispositivo pessoal.
7. **O prontuário oficial permanece na UBS.** O Mapa não assume essa função por evolução implícita.

---

## 3. Ordem crítica

```text
Fase 0: Congelamento e ambiente reproduzível
    ↓
Fase 1: Build, typecheck, lint e testes
    ↓
Fase 2: Persistência, backup e falhas de armazenamento
    ↓
Fase 3: Segurança e modelo criptográfico
    ↓
Fase 4: Privacidade e autorização institucional
    ↓
Fase 5: Acessibilidade e dispositivos reais
    ↓
Fase 6: Revisão clínica independente
    ↓
Fase 7: Auditoria farmacológica por produto
    ↓
Fase 8: Piloto sintético integral e decisão final
```

As fases 4, 6 e 7 podem começar em paralelo após o congelamento documental. A autorização final continua dependente de todas.

---

# 4. Fases de trabalho

## Fase 0 — Congelar o candidato e preparar rastreabilidade

### Objetivo

Impedir que a versão auditada continue mudando silenciosamente durante os testes.

### Ações

- criar tag `v0.7.0-rc.0-audit`;
- registrar commit, Node, npm, sistema operacional e hash do pacote;
- gerar `package-lock.json` por instalação limpa;
- separar ambientes `development`, `synthetic-demo` e `release-candidate`;
- bloquear qualquer configuração que aceite dados reais;
- criar registro central de defeitos com severidade, reprodução, responsável e versão corrigida;
- definir convenção das evidências de gate.

### Artefatos

```text
/docs/release/BASELINE.md
/docs/release/DEFECT_LOG.md
/docs/release/EVIDENCE_INDEX.md
package-lock.json
tag Git assinada ou hash documentado
```

### Critério de saída

A mesma revisão do código pode ser reconstruída sem depender de estado oculto da máquina.

---

## Fase 1 — Fechar o gate de build e qualidade automatizada

### Objetivo

Produzir uma compilação reproduzível e eliminar erros estruturais detectáveis automaticamente.

### Ações

1. Executar instalação limpa:

```bash
rm -rf node_modules .next
npm ci
```

2. Executar separadamente:

```bash
npm run verify:docs
npm run verify:synthetic
npm run verify:marco1
npm run verify:marco2
npm run verify:marco3
npm run verify:marco4
npm run verify:marco5
npm run verify:marco6
npm run verify:marco7
npm run audit:static
npm run typecheck
npm run lint
npm run test
npm run build
```

3. Corrigir todos os erros sem reduzir artificialmente o rigor do TypeScript ou do lint.
4. Adicionar testes para cada defeito funcional descoberto.
5. Repetir em ambiente limpo e em CI.
6. Produzir SBOM e auditoria de dependências.

### Testes mínimos adicionais

- serialização e restauração de todas as entidades;
- propriedades opcionais com `exactOptionalPropertyTypes`;
- isolamento do modo pessoa;
- snapshot imutável;
- fontes preliminares não promovidas;
- informação de terceiro bloqueada;
- migração de schema;
- concorrência entre abas;
- erro de quota;
- importação malformada.

### Critério de saída

- `npm ci` aprovado;
- `npm run verify` aprovado;
- `npm run build` aprovado;
- zero erro de alta severidade em dependências sem mitigação documentada;
- CI reproduz o resultado em duas execuções consecutivas.

### Evidência

```text
BUILD_REPORT.md
logs completos do CI
artefato de build com SHA-256
relatório de dependências
SBOM
```

---

## Fase 2 — Persistência, backup, restauração e perda controlada

### Objetivo

Demonstrar que o dado local não depende de um “caminho feliz”.

### Cenários obrigatórios

- persistência concedida e recusada;
- armazenamento `best-effort`;
- quota próxima do limite;
- falha durante gravação;
- duas abas editando a mesma entidade;
- fechamento do navegador durante operação;
- atualização do aplicativo com banco antigo;
- backup comum;
- backup protegido;
- senha incorreta;
- arquivo adulterado;
- checksum inválido;
- relação órfã;
- versão futura desconhecida;
- restauração interrompida;
- rollback após restauração falha;
- troca de dispositivo;
- limpeza deliberada do navegador.

### Protocolo

Para cada cenário, registrar:

```text
ID do teste
Ambiente
Pré-condições
Passos
Resultado esperado
Resultado observado
Dados preservados
Dados rejeitados
Mensagem apresentada
Evidência
Defeito associado
```

### Critério de saída

- nenhuma restauração parcial é aplicada;
- corrupção é detectada antes da substituição do banco;
- falha mostra exatamente o que foi e não foi salvo;
- backup restaura snapshots, layouts, relações, visibilidade e versões;
- risco de remoção pelo navegador permanece explicado;
- existe procedimento testado de recuperação.

### Evidência

```text
PERSISTENCE_TEST_REPORT.md
BACKUP_RESTORE_REPORT.md
arquivos de teste corrompidos e válidos
capturas ou vídeo dos cenários críticos
```

---

## Fase 3 — Segurança e decisão sobre cifragem

### Objetivo

Fechar o modelo de ameaça e provar controles proporcionais aos dados de saúde.

### Trilha A: modelo de ameaça

Mapear:

- perda ou roubo do dispositivo;
- acesso casual por terceiro;
- acesso ao perfil do navegador;
- ferramentas de desenvolvimento;
- malware;
- backup copiado;
- captura de tela;
- alternador de aplicativos;
- exportação para IA;
- engenharia social;
- sessão esquecida aberta.

### Trilha B: decisão criptográfica

Comparar formalmente:

#### Alternativa 1 — proteção do dispositivo

- criptografia nativa;
- PIN/biometria do sistema;
- dispositivo gerenciado;
- perfil separado;
- bloqueio automático;
- proibição de backup em nuvem pessoal.

#### Alternativa 2 — cifragem no aplicativo

- chave derivada de segredo;
- envelopes cifrados;
- migração e rotação;
- tratamento de índices;
- busca sobre dados cifrados;
- recuperação impossível sem segredo;
- bloqueio e descarte de chave da memória.

A alternativa escolhida deve ser aprovada institucionalmente. O PIN atual não pode ser descrito como criptografia do banco.

### Outras ações

- checklist proporcional do ASVS;
- teste de XSS em todos os campos e importações;
- teste de CSP no build real;
- revisão de Service Worker e cache;
- análise de dependências;
- revisão do fluxo de PIN;
- teste de temporização e limite de tentativas;
- plano de incidente;
- política de logs sem dados sensíveis;
- revisão externa independente.

### Critério de saída

- modelo de ameaça aprovado;
- decisão de cifragem documentada;
- nenhuma vulnerabilidade crítica ou alta aberta;
- vulnerabilidades moderadas possuem mitigação e prazo;
- plano de incidente testado em exercício de mesa;
- revisão independente concluída.

### Evidência

```text
THREAT_MODEL.md
CRYPTO_DECISION.md
ASVS_REPORT.md
PEN_TEST_REPORT.md
INCIDENT_RESPONSE_PLAN.md
```

---

## Fase 4 — Privacidade, LGPD e autorização institucional

### Objetivo

Definir se o tratamento é legítimo e quem responde por ele antes de discutir conveniência técnica.

### Perguntas obrigatórias

- Qual é a finalidade exata?
- Qual é a base legal?
- Quem é controlador, operador e usuário autorizado?
- Um estudante pode manter esses dados?
- O dispositivo pessoal é permitido?
- Quais dados podem existir fora do prontuário?
- Qual pseudonimização mínima é obrigatória?
- Quanto tempo os dados permanecem?
- Como excluir ou arquivar?
- Como responder a incidente?
- Como atender direitos do titular?
- Como tratar adolescentes?
- Como tratar relatos de terceiros?
- Quando o modo pessoa pode ser usado?
- É permitido prompt para IA externa?
- Onde backups podem ser guardados?

### Ações

- reunião formal com faculdade, preceptoria, UBS e responsável por privacidade;
- mapa do ciclo de vida do dado;
- inventário de campos e finalidade;
- política de minimização;
- matriz dado × destino;
- definição de retenção;
- procedimento de incidente;
- avaliação de impacto ou documento equivalente;
- termo de autorização institucional;
- instrução operacional para o estudante.

### Possíveis resultados

#### Aprovação integral

Uso real dentro de limites definidos.

#### Aprovação restrita

Por exemplo:

- somente códigos pseudônimos;
- sem informação de terceiro;
- sem IA externa;
- sem adolescentes;
- sem farmacologia posológica;
- somente dispositivo institucional.

#### Não aprovação

O Mapa permanece ferramenta sintética e acadêmica.

### Critério de saída

Documento assinado que define permissão, limites, responsáveis e revogação. Silêncio ou aprovação verbal contam como gate não fechado.

### Evidência

```text
DATA_LIFECYCLE.md
DATA_INVENTORY.md
PRIVACY_IMPACT_ASSESSMENT.md
INSTITUTIONAL_AUTHORIZATION.pdf
OPERATING_POLICY.md
```

---

## Fase 5 — Acessibilidade e matriz de dispositivos

### Objetivo

Demonstrar uso efetivo, não apenas aparência visual adequada.

### Testes automatizados

- axe;
- Lighthouse;
- lint de acessibilidade;
- contraste;
- estrutura de headings;
- nomes acessíveis;
- erros de formulário.

### Testes manuais

- teclado completo;
- foco previsível;
- diálogos e bottom sheets;
- zoom 200% e 400%;
- reflow em 320 CSS px;
- modo paisagem;
- TalkBack;
- VoiceOver;
- redução de movimento;
- tamanho de alvo;
- mensagens compreensíveis;
- genograma e ecomapa pela narrativa textual.

### Dispositivos mínimos

- Android atual com Chrome e PWA;
- Android de desempenho intermediário;
- iPhone atual com Safari e PWA;
- uma versão anterior de iOS suportada;
- desktop Chromium;
- Firefox;
- Safari macOS, quando disponível.

### Critério de saída

- critérios WCAG 2.2 AA aplicáveis aprovados;
- nenhum bloqueio de tarefa essencial com tecnologia assistiva;
- fluxo offline e atualização aprovados em Android e iOS;
- defeitos altos corrigidos.

### Evidência

```text
WCAG_AUDIT.md
DEVICE_MATRIX_RESULTS.md
A11Y_DEFECT_LOG.md
capturas e vídeos de fluxos críticos
```

---

## Fase 6 — Revisão clínica independente

### Objetivo

Validar cada afirmação clínica no escopo real da APS e da população-alvo.

### Unidade de revisão

Cada `ClinicalClaim` deve receber:

```text
Fonte correta
Fonte vigente
Texto fiel à fonte
População correta
Escopo correto
Ausências perigosas
Linguagem profissional adequada
Linguagem para a pessoa adequada
Critérios de recusa suficientes
Data de revisão
Revisor
Decisão
```

### Revisores

- médico de família ou profissional equivalente com experiência em APS;
- segundo revisor para conteúdo de maior risco;
- preceptoria local para aderência ao fluxo real;
- responsável editorial para conflitos de fonte.

### Condições

- hipertensão;
- diabetes tipo 2;
- doença renal crônica;
- dislipidemia;
- sobrepeso e obesidade.

### Casos adversariais

- resultado sem unidade;
- diagnóstico relatado e não confirmado;
- resultado isolado;
- população especial;
- documento ausente;
- diretrizes divergentes;
- sintoma de alerta;
- informação de terceiro;
- recomendação fora do escopo da APS.

### Critério de saída

- 100% das afirmações possuem decisão documentada;
- nenhuma afirmação crítica depende de fonte preliminar sem aviso;
- critérios de recusa foram testados;
- revisão clínica independente assinada;
- calendário de atualização definido.

### Evidência

```text
CLINICAL_CLAIM_REVIEW.csv
CLINICAL_REVIEW_REPORT.md
SOURCE_CONFLICT_LOG.md
CLINICAL_SIGNOFF.pdf
```

---

## Fase 7 — Auditoria farmacológica por produto

### Objetivo

Transformar farmacologia contextual em conteúdo verificável, ou manter doses bloqueadas de forma permanente.

### Estratégia

Não auditar “classes” como se fossem prescrições. Criar unidade por:

```text
Princípio ativo
Sal
Apresentação
Concentração
Forma farmacêutica
Via
Indicação
População
```

### Campos obrigatórios

- fonte regulatória;
- indicação coberta;
- apresentação;
- dose inicial;
- titulação;
- dose máxima, quando aplicável;
- ajuste renal;
- ajuste hepático;
- contraindicações;
- precauções;
- eventos adversos relevantes;
- interações clinicamente relevantes;
- monitoramento;
- situações de interrupção;
- gestação e lactação, quando aplicável;
- disponibilidade no SUS;
- data da bula consultada;
- revisor;
- nível editorial.

### Regra de publicação

```text
Sem auditoria completa do produto:
  doseStatus = not-published

Com auditoria completa e dupla revisão:
  doseStatus = source-verified
```

### Critério de saída

Existem duas opções válidas:

1. catálogo posológico auditado e aprovado; ou
2. decisão formal de manter doses fora do produto.

O gate não pode passar com conteúdo posológico parcial apresentado como completo.

### Evidência

```text
MEDICATION_PRODUCT_CATALOG.json
PHARMACOLOGY_REVIEW_REPORT.md
INTERACTION_CURATION_LOG.md
PHARMACOLOGY_SIGNOFF.pdf
```

---

## Fase 8 — Piloto sintético integral e decisão final

### Objetivo

Executar um semestre inteiro sem dados reais e demonstrar que o sistema suporta sucesso, falha, ambiguidade e encerramento.

### Cenário mínimo

#### Família Horizonte

- condição relatada e depois confirmada;
- medicamento parcialmente identificado;
- exame sem unidade;
- plano de cuidado;
- resumo para a pessoa;
- sugestão de correção;
- passagem para preceptoria;
- encerramento com continuidade.

#### Família Travessia

- adolescente em dois domicílios;
- perspectivas divergentes;
- informação de terceiro;
- rastreamento adiado e depois aceito;
- genograma em camadas;
- ecomapa por perspectiva;
- recurso potencial;
- adendo após snapshot.

### Testes durante o piloto

- dispositivo offline;
- atualização no meio do semestre;
- backup periódico;
- restauração em outro dispositivo;
- duas abas;
- modo pessoa;
- relatório;
- encerramento;
- snapshot;
- adendo;
- incidente simulado.

### Conselho de release

Participantes mínimos:

- engenharia;
- segurança;
- acessibilidade;
- responsável clínico;
- responsável farmacológico;
- preceptoria;
- representante institucional/privacidade;
- usuário responsável pelo produto.

### Decisões possíveis

```text
GO
CONDITIONAL-GO
NO-GO
```

### Critério de GO

- todos os gates críticos `passed`;
- nenhum defeito crítico ou alto aberto;
- limites de uso refletidos na interface;
- autorização institucional assinada;
- versão, checksum e evidências congelados;
- plano de rollback e incidente prontos.

---

# 5. Backlog priorizado

## P0 — Bloqueadores absolutos

1. pipeline completo e build;
2. decisão institucional e base legal;
3. modelo de ameaça e decisão criptográfica;
4. restauração adversarial;
5. revisão clínica independente;
6. decisão farmacológica explícita;
7. Android e iOS físicos;
8. acessibilidade de tarefas essenciais.

## P1 — Necessários antes de piloto real restrito

1. plano de incidente;
2. SBOM e dependências;
3. CI de release;
4. retenção e exclusão;
5. auditoria de IA externa;
6. política de backup;
7. erros de formulário plenamente acessíveis;
8. atualização e rollback da PWA.

## P2 — Pode seguir após uma liberação restrita

1. ampliação da biblioteca clínica;
2. novos instrumentos familiares;
3. relatórios institucionais adicionais;
4. refinamento visual;
5. novas condições clínicas;
6. automações não críticas.

---

# 6. Cronograma por ondas

## Onda A — Engenharia e governança inicial

**Duração estimada:** 1 a 2 semanas de trabalho focado.

- congelamento;
- instalação e build;
- CI;
- correções estruturais;
- SBOM;
- reunião institucional inicial;
- modelo de ameaça preliminar.

## Onda B — Resiliência e segurança

**Duração estimada:** 2 a 4 semanas.

- backup e restauração adversarial;
- dispositivos;
- segurança;
- decisão criptográfica;
- acessibilidade automatizada e manual;
- correções.

## Onda C — Clínica e farmacologia

**Duração:** dependente da disponibilidade dos revisores, provavelmente o caminho crítico real.

- revisão das cinco condições;
- resolução de conflitos;
- revisão de linguagem;
- decisão sobre doses;
- catálogo por produto, se aprovado.

## Onda D — Piloto sintético e conselho de release

**Duração estimada:** 1 a 2 semanas.

- semestre sintético integral;
- incidentes simulados;
- restauração em outro dispositivo;
- relatório consolidado;
- decisão GO, CONDITIONAL-GO ou NO-GO.

As estimativas são faixas operacionais, não promessas. Revisão institucional e farmacológica podem prolongar o caminho crítico.

---

# 7. Responsabilidades

## Engenharia

- build;
- testes;
- persistência;
- segurança técnica;
- CI;
- evidências reproduzíveis.

## Responsável clínico

- conteúdo;
- escopo;
- recusas;
- linguagem;
- vigência de fontes.

## Responsável farmacológico

- produto;
- dose;
- ajustes;
- contraindicações;
- interações;
- monitoramento.

## Instituição e privacidade

- base legal;
- finalidade;
- autorização;
- papéis;
- retenção;
- incidente;
- dispositivo.

## Acessibilidade

- auditoria WCAG;
- tecnologias assistivas;
- evidências;
- revalidação após correções.

## Produto

- manter o escopo;
- impedir que conveniência suplante o gate;
- organizar o conselho de release;
- garantir que a interface mostre os limites aprovados.

---

# 8. Critério de fechamento de cada gate

Um gate só muda para `passed` quando contém:

```text
ID
Versão avaliada
Escopo
Responsável
Data
Procedimento
Resultado
Evidências
Defeitos relacionados
Riscos residuais
Aprovação
Próxima revisão
```

Não são evidências suficientes:

- “parece funcionar”;
- “não deu erro comigo”;
- aprovação verbal;
- ausência de reclamação;
- documentação sem execução;
- teste apenas no computador do desenvolvedor.

---

# 9. Recomendação estratégica

A primeira meta não deve ser um GO irrestrito. O alvo racional é um **CONDITIONAL-GO estreito**, por exemplo:

```text
Dados pseudonimizados
Somente adultos
Somente duas famílias do semestre
Sem identificadores diretos
Sem informação confidencial de terceiro no dispositivo
Sem IA externa
Sem doses farmacológicas
Dispositivo autorizado e criptografado
Backup protegido em destino institucional
Supervisão e autorização formal
```

Depois de um piloto controlado, o escopo pode ser ampliado. Essa progressão reduz o risco de tentar resolver simultaneamente clínica, segurança, instituição, farmacologia e operação em escala completa.

---

# 10. Próxima ação imediata

A próxima ação concreta deve ser a **Onda A**:

1. mover o Marco 7 para um repositório executável;
2. obter instalação limpa;
3. executar o pipeline completo;
4. abrir o registro de defeitos;
5. convocar a reunião institucional inicial;
6. iniciar o modelo de ameaça;
7. nomear revisores clínico e farmacológico.

Ao final da Onda A, deve existir um novo relatório com:

```text
Build: PASS ou FAIL
Defeitos críticos: quantidade
Modelo de ameaça: rascunho aprovado ou pendente
Instituição: escopo preliminar aceito ou rejeitado
Revisores: nomeados ou não disponíveis
Cronograma revisado
```
