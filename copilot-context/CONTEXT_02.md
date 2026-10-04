# Mapa APS: pacote de contexto 2

Este pacote contem arquivos integrais do projeto.

Cada arquivo comeca com:

# FILE: caminho/original

e termina com:

# END FILE: caminho/original

Nao interprete a ausencia de um arquivo neste pacote como ausencia no projeto. Outros arquivos podem estar nos demais pacotes.

---

# FILE: docs/adr/0006-registros-genericos-com-contratos-de-dominio.md

``markdown
# ADR 0006: Store genérico com contratos de domínio

## Estado
Aceita.

## Decisão
Entidades de domínio são gravadas em envelopes no store `records`, identificadas por `entityType`. Contratos TypeScript e fábricas controlam a forma do domínio. Isso evita migrações de stores a cada nova entidade durante a fase de construção, preservando índices comuns, checksum e restauração.

## Consequências
Consultas são filtradas no adaptador neste marco. Índices especializados poderão ser adicionados por migração quando volume e padrões reais justificarem.

``

# END FILE: docs/adr/0006-registros-genericos-com-contratos-de-dominio.md

---

# FILE: docs/adr/0007-encontro-modular-e-pendencia-explicita.md

``markdown
# ADR 0007: Encontro modular e pendência explícita

## Estado
Aceita.

## Decisão
Registro breve pode ser suficiente e não entra automaticamente em `Revisar depois`. Pendências são entidades explícitas criadas somente quando falta ação, confirmação, documento, supervisão ou continuidade.

``

# END FILE: docs/adr/0007-encontro-modular-e-pendencia-explicita.md

---

# FILE: docs/adr/0008-politicas-de-compartilhamento-no-dado.md

``markdown
# ADR 0008: Políticas de compartilhamento no dado

## Estado
Aceita.

## Decisão
Sensibilidade, proveniência e estado editorial acompanham cada registro. Transformações consultam uma política central. Informação de terceiro permanece bloqueada por padrão; dado individual de saúde não se torna familiar automaticamente.

``

# END FILE: docs/adr/0008-politicas-de-compartilhamento-no-dado.md

---

# FILE: docs/adr/0009-resumo-derivado-nao-prontuario.md

``markdown
# ADR 0009: Resumo derivado, não prontuário

## Estado
Aceita.

## Decisão
O modo de acompanhamento deriva cartões selecionados dos registros estruturados. Ele declara que o prontuário completo permanece na UBS, isola a navegação clínica e recebe sugestões sem edição direta do dado original.

``

# END FILE: docs/adr/0009-resumo-derivado-nao-prontuario.md

---

# FILE: docs/adr/0010-biblioteca-clinica-versionada-em-codigo.md

``markdown
# ADR 0010: Biblioteca clínica versionada em código

## Estado
Aceita.

## Decisão
Conteúdo piloto é estruturado em objetos TypeScript com afirmações atômicas, fonte, população, nível editorial, data de revisão e vencimento. Relatórios preliminares são identificados e não substituem normas vigentes.

``

# END FILE: docs/adr/0010-biblioteca-clinica-versionada-em-codigo.md

---

# FILE: docs/adr/0011-doses-bloqueadas-ate-auditoria-de-produto.md

``markdown
# ADR 0011: Doses bloqueadas até auditoria de produto

## Estado
Aceita.

## Decisão
O Marco 4 publica mecanismos, finalidades, monitoramento e travas de segurança, mas não publica doses. Dose exige verificação por princípio ativo, sal, apresentação, indicação, população, via, função renal/hepática e bula profissional específica. A ausência de dose é uma barreira de segurança, não uma lacuna silenciosa.

``

# END FILE: docs/adr/0011-doses-bloqueadas-ate-auditoria-de-produto.md

---

# FILE: docs/adr/0012-diagramas-derivados-de-semantica.md

``markdown
# ADR 0012: Diagramas derivados de semântica

## Estado
Aceita.

## Decisão
Genograma e ecomapa são visualizações derivadas de pessoas, relações, recursos, perspectiva e tempo. Layout não é a fonte de verdade. O diagrama possui descrição textual equivalente e exportação SVG.

``

# END FILE: docs/adr/0012-diagramas-derivados-de-semantica.md

---

# FILE: docs/adr/0013-perspectiva-obrigatoria-em-relacoes.md

``markdown
# ADR 0013: Perspectiva obrigatória em relações

## Estado
Aceita.

## Decisão
Toda relação registra perspectiva textual; quando aplicável, pessoa que descreveu, proveniência, confirmação e validade. Divergência é estado legítimo e não é convertida em consenso.

``

# END FILE: docs/adr/0013-perspectiva-obrigatoria-em-relacoes.md

---

# FILE: docs/adr/0014-prompt-de-diagrama-com-manifesto.md

``markdown
# ADR 0014: Prompt de diagrama com manifesto

## Estado
Aceita.

## Decisão
Prompts externos incluem contagem de entidades, vínculos e divergências, exigem validação antes do desenho e proíbem invenção. Detector local procura identificadores óbvios, sem prometer anonimização perfeita.

``

# END FILE: docs/adr/0014-prompt-de-diagrama-com-manifesto.md

---

# FILE: docs/adr/0015-snapshot-imutavel-e-adendos.md

``markdown
# ADR 0015: Snapshot imutável e adendos

## Estado
Aceita.

## Decisão
Encerramento cria cópia estruturada com checksum e relatório. Dados vivos podem continuar evoluindo, sem alterar o snapshot. Correções posteriores são adendos vinculados, nunca reescrita do original.

``

# END FILE: docs/adr/0015-snapshot-imutavel-e-adendos.md

---

# FILE: docs/adr/0016-inconclusao-com-destino-explicito.md

``markdown
# ADR 0016: Inconclusão com destino explícito

## Estado
Aceita.

## Decisão
O semestre pode encerrar com processos inconclusos, desde que cada pendência receba destino explícito. Pendência aberta sem destino bloqueia o snapshot. O aplicativo não força falsa resolução.

``

# END FILE: docs/adr/0016-inconclusao-com-destino-explicito.md

---

# FILE: docs/adr/0017-no-go-e-um-resultado-valido.md

``markdown
# ADR 0017: NO-GO é um resultado válido

## Estado
Aceita.

## Decisão
O Marco 7 termina com uma decisão verificável, não com aprovação automática. Qualquer gate crítico não aprovado mantém dados reais proibidos. Concluir a auditoria e receber NO-GO é sucesso metodológico, não falha do projeto.

``

# END FILE: docs/adr/0017-no-go-e-um-resultado-valido.md

---

# FILE: docs/adr/README.md

``markdown
# Architecture Decision Records

Use o formato `NNNN-titulo-curto.md`.

Cada ADR deve conter:

- contexto;
- decisão;
- alternativas;
- consequências;
- impacto em privacidade, clínica, dados e testes;
- estado: proposta, aceita, substituída ou rejeitada.

``

# END FILE: docs/adr/README.md

---

# FILE: docs/AI_EXPORTS.md

``markdown
# Preparar para IA

## Objetivo

Oferecer acesso fácil a IA externa sem API, transmissão automática ou dependência de fornecedor.

## Fluxo

```text
selecionar objetivo
-> selecionar dados
-> aplicar desidentificação
-> detectar identificadores
-> revisar
-> gerar manifesto
-> copiar manualmente
```

## Templates iniciais

- ecomapa;
- discussão clínica;
- discussão familiar;
- passagem para preceptoria;
- revisão de lacunas;
- revisão farmacológica;
- linguagem acessível;
- reflexão acadêmica;
- roteiro de estudo.

## Regras comuns

- não inventar;
- separar fatos de inferências;
- declarar ausências;
- preservar códigos pseudônimos;
- não diagnosticar automaticamente;
- listar ambiguidades;
- validar entendimento antes do diagrama;
- não transformar resposta em fato sem revisão.

## Ecomapa

O prompt contém:

- perspectiva;
- período;
- entidades;
- vínculos;
- direção;
- intensidade;
- divergências;
- contagem esperada;
- manifesto para conferência.

## Conteúdo proibido por padrão

- identificadores diretos;
- informação confidencial de terceiro;
- conteúdo altamente sensível;
- notas ainda não revisadas;
- situações de proteção;
- dados além do necessário.

## Resposta externa

Pode ser colada como rascunho ou anotação para revisão. Nunca é reimportada automaticamente como verdade clínica ou familiar.

``

# END FILE: docs/AI_EXPORTS.md

---

# FILE: docs/ARCHITECTURE.md

``markdown
# Arquitetura do Sistema

## Princípios

- local-first;
- uma fonte de verdade, várias apresentações;
- separação entre conteúdo clínico e dados pessoais;
- histórico preservado;
- regras explicáveis;
- profundidade progressiva;
- migrações versionadas;
- falha segura.

## Domínios

### Conhecimento clínico

DCNTs, exames, medidas, medicamentos, farmacologia, MIPs, rastreamentos, sinais de alarme, fontes e versões.

### Pessoas e identidades

Pessoas pseudonimizadas, preferências, necessidades de comunicação e acessibilidade.

### Famílias e relações

Famílias, participações, domicílios, relações, cuidadores, recursos, vínculos externos, genogramas e ecomapas.

### Cuidado longitudinal

Encontros, condições, medicamentos em uso, resultados, planos, tarefas, rastreamentos, feedbacks e pendências.

### Jornada acadêmica

Semestres, vínculos com famílias, atividades, competências, reflexões, feedbacks, encerramentos, snapshots e adendos.

### Transformação

Visão profissional, resumo de acompanhamento, passagem, transcrição, relatórios, narrativas e prompts.

### Infraestrutura

IndexedDB, cache, Service Worker, bloqueio, versões, migrações, backup, restauração, integridade e concorrência.

## Fluxo de dados

```text
Dado original estruturado
  -> política de visibilidade
  -> transformação apropriada
  -> visão profissional | resumo | passagem | relatório | prompt
```

## Atualizações

- atualização da interface não apaga banco;
- atualização clínica não reescreve interpretações históricas;
- migrações críticas geram proteção prévia;
- Service Worker não aplica atualização durante edição não salva;
- preview e produção utilizam origens separadas e explicitamente identificadas.

## Concorrência

Registros possuem versão. Alterações em outra aba ou janela geram conflito explícito; sobrescrita silenciosa é proibida.

``

# END FILE: docs/ARCHITECTURE.md

---

# FILE: docs/audit/ACCESSIBILITY_CHECKLIST.md

``markdown
# Checklist de Acessibilidade

Referência de trabalho: WCAG 2.2 AA.

- [x] idioma da página;
- [x] labels em formulários principais;
- [x] status com regiões vivas;
- [x] descrição textual dos diagramas;
- [x] foco visível em componentes principais;
- [ ] axe e Lighthouse;
- [ ] teclado completo;
- [ ] zoom 200% e 400%;
- [ ] contraste medido;
- [ ] TalkBack;
- [ ] VoiceOver;
- [ ] mensagens de erro associadas aos campos;
- [ ] alvos de toque e reflow auditados.

``

# END FILE: docs/audit/ACCESSIBILITY_CHECKLIST.md

---

# FILE: docs/audit/AUDIT_REPORT.md

``markdown
# Relatório de Auditoria Pré-Uso Real

## Decisão

**GO LOCAL em 28 de setembro de 2026.** O produto está apto para uso acadêmico local e demonstração supervisionada. Esta decisão não autoriza dados reais de forma irrestrita.

## Evidências executadas

- validadores estruturais dos Marcos 0 a 7;
- verificação de dados sintéticos;
- integridade e manifesto SHA-256 do pacote;
- auditoria estática para HTML perigoso, console, URLs externas e headers;
- tentativa de `npm install`, interrompida por timeout após 180 segundos sem sucesso;
- revisão de invariantes de snapshot, compartilhamento, fontes e doses bloqueadas.

## Condições e limitações

1. dados reais dependem das regras da instituição, do serviço, da preceptoria e do prontuário oficial;
2. o banco local e o dispositivo devem permanecer protegidos conforme as políticas aplicáveis;
3. testes físicos, governança institucional e revisões externas continuam condições para usos correspondentes;
4. o produto não substitui prontuário institucional, julgamento clínico ou protocolos locais.

## Conclusão

O Marco 7 distingue prontidão local de autorização para dados reais. O resultado estruturado é `decision: "GO LOCAL"`, com `realDataAllowed: false`, e mantém a possibilidade de NO-GO quando um gate técnico ou de privacidade local obrigatório falhar explicitamente.

``

# END FILE: docs/audit/AUDIT_REPORT.md

---

# FILE: docs/audit/DEVICE_TEST_MATRIX.md

``markdown
# Matriz de Testes em Dispositivos

Executar com dados sintéticos.

## Ambientes mínimos

- Android atual, Chrome, PWA instalada;
- iPhone atual e uma versão anterior suportada, Safari e PWA;
- desktop Chromium;
- Firefox;
- Safari macOS quando disponível.

## Cenários

1. primeira instalação e criação do PIN;
2. bloqueio por inatividade e troca de aplicativo;
3. uso offline após reinício;
4. atualização do Service Worker;
5. duas abas editando a mesma entidade;
6. quota próxima do limite;
7. persistência recusada;
8. backup comum e protegido;
9. senha incorreta e arquivo adulterado;
10. restauração interrompida;
11. zoom 200% e 400%;
12. teclado sem mouse;
13. TalkBack e VoiceOver;
14. modo acompanhamento sem fuga para outras famílias;
15. encerramento e imutabilidade do snapshot.

Cada execução deve registrar dispositivo, SO, navegador, versão, resultado, evidência e responsável.

``

# END FILE: docs/audit/DEVICE_TEST_MATRIX.md

---

# FILE: docs/audit/GATE_CLOSURE_PLAN.md

``markdown
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

``

# END FILE: docs/audit/GATE_CLOSURE_PLAN.md

---

# FILE: docs/audit/INSTITUTIONAL_GATE.md

``markdown
# Gate Institucional

Antes de qualquer dado real, obter decisão documentada da faculdade, preceptoria e UBS sobre:

- finalidade e base legal do tratamento;
- papel do estudante e responsáveis institucionais;
- uso de dispositivo pessoal;
- retenção, exclusão, incidentes e atendimento ao titular;
- dados que podem sair do prontuário oficial;
- pseudonimização mínima;
- uso do modo pessoa;
- backups e destino dos arquivos;
- prompts para IA externa;
- adolescentes e informações de terceiros;
- aprovação clínica e farmacológica;
- contato para incidente de segurança.

Sem autorização explícita, o gate permanece bloqueado.

``

# END FILE: docs/audit/INSTITUTIONAL_GATE.md

---

# FILE: docs/audit/RELEASE_DECISION.json

``json
{
  "generatedAt": "2026-09-28T22:17:11-03:00",
  "candidate": "1.0.4",
  "realDataAllowed": false,
  "decision": "GO LOCAL",
  "publicDistributionAllowed": false,
  "replacesOfficialRecord": false,
  "conditions": [
    "Uso acadêmico local e supervisionado no dispositivo validado.",
    "Dados reais permanecem condicionados às regras da instituição, do serviço, da preceptoria e do prontuário oficial.",
    "Backup protegido e proteção local do dispositivo permanecem obrigatórios para qualquer uso permitido."
  ],
  "limitations": [
    "Não substitui prontuário institucional.",
    "Não substitui julgamento clínico, protocolos locais, prescrição, receitas ou laudos.",
    "Não representa autorização institucional nem distribuição pública irrestrita.",
    "Testes físicos, governança institucional e autorização para dados reais são decisões externas ao GO LOCAL."
  ],
  "evidence": [
    "npm run verify",
    "npm run build",
    "docs/release/GO_LOCAL.md",
    "docs/PROJECT_STATE.md"
  ],
  "passed": 5,
  "blocked": 0,
  "failed": 0,
  "manual": 7,
  "gates": [
    {
      "id": "build-pipeline",
      "status": "passed",
      "blocking": false
    },
    {
      "id": "device-matrix",
      "status": "manual",
      "blocking": false
    },
    {
      "id": "backup-restore",
      "status": "passed",
      "blocking": false
    },
    {
      "id": "storage-eviction",
      "status": "passed",
      "blocking": false
    },
    {
      "id": "pin-boundary",
      "status": "passed",
      "blocking": false
    },
    {
      "id": "full-db-encryption",
      "status": "manual",
      "blocking": false
    },
    {
      "id": "security-review",
      "status": "manual",
      "blocking": false
    },
    {
      "id": "privacy-workflow",
      "status": "manual",
      "status": "passed",
      "blocking": false
    },
    {
      "id": "accessibility",
      "status": "manual",
      "blocking": false
    },
    {
      "id": "clinical-review",
      "status": "manual",
      "blocking": false
    },
    {
      "id": "pharmacology",
      "status": "manual",
      "blocking": false
    },
    {
      "id": "institutional",
      "status": "manual",
      "blocking": false
    }
  ]
}

``

# END FILE: docs/audit/RELEASE_DECISION.json

---

# FILE: docs/audit/SECURITY_CHECKLIST.md

``markdown
# Checklist de Segurança

Referência de trabalho: OWASP ASVS 5.0.0.

- [x] bloqueio local e derivação PBKDF2;
- [x] backup protegido AES-GCM;
- [x] headers básicos e CSP;
- [x] ausência de backend e telemetria por padrão;
- [x] dados de demonstração marcados;
- [ ] revisão independente ASVS;
- [ ] análise de dependências após instalação;
- [ ] testes XSS e injeção em entradas/importações;
- [ ] cifragem integral ou decisão formal de risco;
- [ ] teste de captura, alternador e histórico;
- [ ] plano de incidente;
- [ ] rotação/migração criptográfica.

``

# END FILE: docs/audit/SECURITY_CHECKLIST.md

---

# FILE: docs/BACKUP_AND_RECOVERY.md

``markdown
# Backup e Recuperação

## Persistência operacional

O app informará:

- gravação confirmada;
- armazenamento persistente concedido ou não;
- data do último backup;
- integridade do banco;
- falhas de salvamento.

Não prometerá permanência absoluta.

## Tipos de saída

### Backup integral protegido

- restaurável;
- cifrado;
- exige senha;
- irrecuperável sem a senha.

### Backup integral comum

- restaurável;
- não cifrado pelo aplicativo;
- depende da proteção do destino.

### Backup de semestre

- restaurável dentro do escopo exportado;
- inclui snapshot e relações necessárias.

### Relatório desidentificado

- legível;
- não restaurável;
- adequado ao uso acadêmico.

## Manifesto

- versão do formato;
- versão do schema;
- data;
- instalação de origem;
- contagens por entidade;
- checksums;
- versões clínicas necessárias;
- estado de integridade.

## Restauração

1. validar arquivo sem alterar banco atual;
2. apresentar manifesto;
3. descriptografar quando necessário;
4. verificar compatibilidade;
5. migrar em área temporária;
6. reconstruir índices;
7. verificar relações órfãs;
8. confirmar substituição ou mesclagem quando suportada;
9. manter rollback em falha;
10. emitir relatório.

## Migrações

- nunca destruir silenciosamente;
- criar proteção antes de migração crítica;
- registrar versão anterior e posterior;
- testar com bases realistas;
- preservar política de visibilidade e snapshots.

Aplicações ESF participam do backup por meio do store `records`. A restauração executa migração lógica idempotente de payloads legados antes da validação final, recalcula checksums e rejeita aplicações que apontem para pessoa, família ou vínculo inexistente. Durante demonstração, backups normais usam o snapshot normal e não incluem aplicações `synthetic-demo`.

## Domínio

O armazenamento é associado à origem. O domínio de produção deve ser estável. URLs de preview não recebem dados reais.

``

# END FILE: docs/BACKUP_AND_RECOVERY.md

---

# FILE: docs/CHANGELOG.md

``markdown
# Changelog da Especificação

## 1.0.0 - 2026-09-27

### Consolidado

- identidade Mapa e assinatura;
- arquitetura local-first;
- domínios e entidades;
- máquinas de estado;
- modelo clínico e farmacológico;
- UX mobile;
- resumo compartilhável;
- Jornada;
- IA externa por prompts;
- privacidade;
- backup;
- simulação end-to-end;
- critérios de aceitação;
- roadmap.

### Decisão final incorporada

A Jornada trabalha com quantidade **esperada** de duas famílias, sem limite técnico. Famílias podem recusar ou sair do acompanhamento e serem substituídas sem apagar o histórico ou quebrar o semestre.

### Status

Planejamento conceitual concluído. Produção ainda não iniciada.


## 1.1.0 - 2026-09-27

### Marco 0

- criada fundação Next.js com TypeScript estrito;
- incorporada documentação canônica;
- adicionados ADRs e padrões de código;
- adicionados contratos iniciais;
- adicionadas famílias sintéticas Horizonte e Travessia;
- adicionados testes dos invariantes;
- adicionada CI;
- preparada tela inicial de estado do projeto;
- mantida proibição de dados reais.


## 1.2.0 - 2026-09-27

### Marco 1

- implementada fundação IndexedDB;
- adicionada gravação verificada;
- adicionada solicitação de persistência;
- adicionado autosave de rascunhos;
- adicionada coordenação entre abas;
- adicionado PIN local, bloqueio por inatividade e ao ocultar;
- adicionados backups JSON comum e AES-GCM protegido;
- adicionada validação de checksums e restauração atômica entre stores;
- adicionado Service Worker e página offline;
- adicionados dashboard e testes de integridade.


## 1.3.0 - 2026-09-27

### Marco 2

- adicionadas pessoas, famílias, participações e vínculos com semestre;
- adicionados encontros e pendências;
- adicionada Jornada básica com famílias substituíveis;
- adicionadas timeline e seletores;
- adicionada navegação mobile;
- adicionada carga sintética do semestre;
- adicionados testes de domínio e invariantes.


## 1.4.0 - 2026-09-27

### Marco 3

- adicionados registros longitudinais de condições, medicamentos, exames, rastreamentos e planos;
- adicionadas políticas de compartilhamento;
- adicionado resumo de acompanhamento com saída autenticada por PIN;
- adicionadas sugestões da pessoa;
- adicionadas passagens estruturadas;
- adicionada visão para transcrição;
- adicionados testes de privacidade e transformação.


## 1.5.0 - 2026-09-27

### Marco 4

- adicionada biblioteca clínica piloto;
- adicionadas cinco DCNTs prioritárias;
- adicionados catálogo e links de fontes oficiais;
- adicionados exames e farmacologia contextual;
- adicionada validação editorial;
- adicionada distinção de fonte preliminar;
- bloqueada publicação de doses ainda não auditadas por produto.

## 1.6.0 - 2026-09-27

### Marco 5

- adicionadas relações interpessoais e recursos territoriais;
- adicionados genograma e ecomapa determinísticos;
- adicionadas camadas e perspectivas;
- adicionada narrativa textual equivalente;
- adicionado prompt de IA com manifesto;
- adicionada exportação SVG;
- adicionados testes de diagramas e privacidade.


## 1.7.0 - 2026-09-27

### Marco 6

- completada a Jornada longitudinal;
- adicionadas reflexões, competências e feedbacks;
- adicionados relatórios textuais;
- adicionado encerramento com destinação de pendências;
- adicionado snapshot imutável com checksum;
- adicionados adendos;
- adicionados testes de encerramento e invariantes históricos.


## 1.8.0-rc.0 - 2026-09-27

### Marco 7

- adicionada auditoria pré-uso real;
- adicionados headers de segurança;
- adicionada decisão de release calculada;
- adicionados checklists e matriz de dispositivos;
- adicionada auditoria estática;
- mantido NO-GO e bloqueio de dados reais por evidência insuficiente.


## 1.9.0-rc.0 - 2026-09-28

### Fundação do instrumento ESF

- adicionada definição tipada e versionada da página 28 da avaliação adulta de DCNT;
- adicionados contratos para aplicações individuais, projeções e propostas familiares/ecomapa;
- adicionados cálculos puros e testes de completude, condicionais, privacidade e isolamento por pessoa;
- preservados como manuais os itens sem regra clínica autorizada.
### Interface de avaliações

- adicionada a área Avaliações dentro da família;
- incluída seleção explícita de pessoa, histórico individual, rascunho, revisão, conclusão, arquivamento e retificação;
- concluída a interface com pressão por visita, critério explícito e classificação de cintura, progresso por bloco, revisão estrutural detalhada, estado de salvamento e preservação de respostas não aplicáveis;
- formulário renderizado a partir da definição versionada, com indicação de blocos sem fonte;
- preservado o isolamento de respostas entre integrantes.

``

# END FILE: docs/CHANGELOG.md

---

# FILE: docs/CLINICAL_CONTENT_MODEL.md

``markdown
# Modelo de Conteúdo Clínico

## Escopo piloto

1. hipertensão arterial sistêmica;
2. diabetes mellitus tipo 2;
3. doença renal crônica;
4. dislipidemia;
5. obesidade.

## Estrutura de cada condição

1. identidade e escopo;
2. visão rápida;
3. suspeita e diagnóstico;
4. avaliação inicial;
5. estratificações independentes;
6. exames e monitoramento;
7. manejo não farmacológico;
8. manejo farmacológico;
9. acompanhamento longitudinal;
10. complicações e encaminhamento;
11. populações especiais;
12. resumo compartilhável;
13. fontes e versão.

## Exames

Cada exame responde:

- por que solicitar;
- quando solicitar;
- o que se espera;
- o que interfere;
- como interpretar;
- o que representa risco;
- que mudança relativa importa;
- como muda a conduta;
- quando repetir;
- qual fonte sustenta a afirmação.

## Categorias distintas

- intervalo de referência;
- limiar diagnóstico;
- meta terapêutica;
- limiar de ação;
- valor potencialmente crítico;
- mudança em relação à referência inicial registrada;
- tendência longitudinal.

## Saídas do motor clínico

### Determinística

Cálculo, unidade, ausência de basal, posição em relação ao intervalo informado.

### Contextual

Medicamentos, sintomas, população especial, interferentes, intercorrências.

### Clínica supervisionada

Hipótese, urgência, ajuste, encaminhamento e decisão terapêutica.

O motor pode recusar classificação.

## Instrumento local da ESF

A fundação em `src/clinical/assessments/instruments/adult-dcnt-esf/` representa a página 28 de `AVALIAÇÃO DE SAÚDE E DCNT DO ADULTO`, versão `local-esf-2026-page-28-v1`. Ela preserva origem local, IDs estáveis, ambiguidades da ficha e políticas de visibilidade. As aplicações futuras são individuais (`personId`) com `familyId` como contexto, e não transformam a família em prontuário coletivo.

As únicas derivações implementadas são idade/faixa etária, IMC, média de duas aferições de pressão e circunferência conforme regra local explicitamente escolhida. Controle da pressão, risco cardiovascular, HbA1c, CIAP-2 e encaminhamentos permanecem manuais ou pendentes de fonte. Blocos 3, 4 e 5 são ausentes; o Bloco 8 tem somente título na fonte. A definição não substitui decisão clínica nem prontuário institucional.

## Conteúdo em níveis

- essencial;
- ampliado;
- auditado;
- revisão necessária.

## Versionamento

Resultado bruto é imutável. Interpretação histórica é preservada. A referência atual pode ser exibida ao lado sem reescrever o passado.

``

# END FILE: docs/CLINICAL_CONTENT_MODEL.md

---

# FILE: docs/CLINICAL_RESEARCH_LOG.md

``markdown
# Registro de Pesquisa Clínica do Marco 4

Data de corte: 27 de setembro de 2026.

## Hierarquia utilizada

1. PCDT e diretriz nacional vigente;
2. Linha de cuidado do Ministério da Saúde;
3. Bulário Eletrônico da Anvisa;
4. Rename vigente;
5. relatório preliminar apenas como sinal de revisão futura.

## Situações editoriais

- Hipertensão: PCDT nacional de 2025.
- Diabetes tipo 2: PCDT atualizado pela Portaria SCTIE/MS nº 13, de 21 de fevereiro de 2026.
- DRC: PCDT de estratégias para atenuar progressão, de 2024.
- Dislipidemia: PCDT de 2019 permanece a fonte vigente cadastrada; consulta preliminar CP 94, publicada em setembro de 2026, é marcada como preliminar.
- Sobrepeso e obesidade: PCDT com anexo atualizado em 8 de julho de 2024.

## Limite deliberado

Este marco não publica doses. A auditoria farmacológica por apresentação e bula profissional será uma trilha incremental separada antes de uso real.

``

# END FILE: docs/CLINICAL_RESEARCH_LOG.md

---

# FILE: docs/CODING_STANDARDS.md

``markdown
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

``

# END FILE: docs/CODING_STANDARDS.md

---

# FILE: docs/DATA_MODEL.md

``markdown
# Modelo de Dados Conceitual

## Entidades nucleares

### Person

Indivíduo independente de família, domicílio ou semestre.

Campos essenciais:

- id imutável;
- código visível editável;
- pseudônimo ou nome preferido opcional;
- faixa etária;
- dados demográficos clinicamente pertinentes;
- necessidades de comunicação e acessibilidade;
- estado vital;
- política de sensibilidade.

### Family

Unidade relacional de cuidado.

- id;
- código;
- apelido opcional;
- descrição;
- estado;
- ciclo de vida;
- contexto territorial geral;
- preocupações, recursos e vulnerabilidades.

### FamilyMembership

Relação muitos-para-muitos entre pessoa e família.

- papel;
- vínculo;
- período;
- convivência;
- função de cuidado;
- dependência;
- responsabilidade;
- perspectiva;
- proveniência.

### Household

Domicílio independente do conceito de família.

- tipo;
- contexto territorial aproximado;
- acessibilidade;
- riscos e recursos ambientais;
- períodos de residência.

### InterpersonalRelationship

Relação entre duas pessoas.

- tipo formal;
- proximidade;
- qualidade;
- frequência;
- direção do cuidado;
- conflito;
- estabilidade;
- perspectiva;
- fonte;
- validade temporal.

### ExternalResource e ExternalLink

Recursos do ecomapa e seus vínculos com pessoa ou família.

### Encounter

Contêiner modular para consulta, visita, contato, discussão, reunião, revisão ou atividade.

### ReportedTerm

Preserva a linguagem original antes da normalização clínica.

- texto original;
- conceito relacionado opcional;
- estado da associação;
- autor;
- data;
- proveniência.

### ConditionRecord

Condição confirmada, relatada, hipótese, fator de risco, sintoma, vulnerabilidade ou necessidade preventiva.

### MedicationReference

Conhecimento farmacológico de referência.

### PersonMedication

Uso real, relatado ou histórico de uma pessoa.

### ExamDefinition e ExamResult

Definição do exame separada de valor bruto e da interpretação.

### Interpretation

Interpretação versionada, dependente de contexto e preservada historicamente.

### ScreeningEpisode

Processo longitudinal de rastreamento.

### CarePlan e CarePlanItem

Plano com alvo individual, díade, cuidador, família, recurso ou equipe.

### PendingItem

Pendência com tipo, prioridade, destino e estado.

### SupervisorFeedback

Registro único ligável a pessoa, família, encontro, resultado, tema e Jornada.

### PatientSuggestion

Correção ou dúvida sugerida no modo acompanhamento.

### LongitudinalMarker

Evento contextual que aparece em timeline e gráfico sem afirmar causalidade.

### Semester e SemesterFamilyLink

Semestre e vínculo longitudinal com família. Quantidade esperada de famílias não é limite.

### Reflection, CompetencyEvidence, Snapshot e Addendum

Memória acadêmica, evidência de competência, estado congelado do semestre e correção posterior preservando o original.

## Tempo

Cada registro pode ter:

- tempo do evento;
- tempo do registro;
- período de validade;
- tempo de revisão.

A interface pergunta apenas o necessário; metadados técnicos são automáticos.

## Instrumentos clínicos versionados

`src/clinical/assessments/` contém definições tipadas de instrumentos, separadas de aplicações futuras. Uma `InstrumentApplication` pertence a uma pessoa por `personId`; `familyId` é somente o contexto familiar. A definição possui versão imutável, perguntas e opções com IDs estáveis, proveniência, visibilidade, sensibilidade e regras de aplicabilidade.

Aplicações futuras podem gerar resultados derivados, classificações manuais e propostas de alteração familiar/ecomapa, mas propostas exigem revisão humana e não atualizam o domínio automaticamente. A mesma aplicação canônica poderá alimentar projeção clínica/acadêmica e projeção da pessoa sem duplicar respostas.

Aplicações persistidas usam `STORES.records` com `entityType: instrument-application` e checksum do envelope. `personId` é sempre o sujeito clínico; `familyId` é contexto e é validado por `FamilyMembership`. Respostas são discriminadas por tipo, aplicações concluídas são imutáveis e uma retificação cria novo registro ligado por `rectifiesApplicationId`. Resumos familiares expõem somente status e datas operacionais.

## Proveniência

- observado;
- relatado pela pessoa;
- relatado por familiar;
- relatado por terceiro;
- documento;
- prontuário institucional consultado conforme autorização;
- resultado laboratorial;
- orientação de preceptoria;
- inferência clínica;
- produção automática do sistema.

## Confirmação

- não verificado;
- relatado;
- parcialmente confirmado;
- confirmado documentalmente;
- observado;
- divergente;
- desconhecido.

``

# END FILE: docs/DATA_MODEL.md

---

# FILE: docs/DECISIONS.md

``markdown
# Registro de Decisões

## D-001: Nome conceitual

**Decisão:** Mapa, com assinatura “Clínica, família e território”.  
**Estado:** aprovado conceitualmente; validação de marca ocorre antes da publicação pública ampla.

## D-002: Local-first

**Decisão:** dados pessoais permanecem no dispositivo; sem conta e nuvem na primeira versão.

## D-003: IA

**Decisão:** nenhuma IA embarcada ou API. Uso por prompts manuais e desidentificados.

## D-004: Não prontuário

**Decisão:** o produto é resumo pessoal de acompanhamento e ferramenta acadêmica. O prontuário oficial permanece na UBS.

## D-005: Persistência

**Decisão:** IndexedDB com confirmação de gravação, armazenamento persistente quando concedido e backup validável.

## D-006: Família

**Decisão:** pessoa-família é muitos-para-muitos; família e domicílio são separados.

## D-007: Quantidade de famílias

**Decisão:** o semestre registra quantidade esperada, não limite. Substituições são naturais quando uma família recusa ou sai do acompanhamento.

## D-008: História

**Decisão:** alterações preservam trajetória; snapshots congelam o encerramento.

## D-009: Clínica

**Decisão:** dados brutos, referência, meta, risco e interpretação são distintos.

## D-010: Farmacologia

**Decisão:** princípio ativo, apresentação, regime e uso real são entidades distintas; auditoria é obrigatória.

## D-011: Interações

**Decisão:** primeira versão não é checador universal; cobre interações curadas e duplicidades estruturais.

## D-012: Compartilhamento

**Decisão:** resumo é deliberadamente preparado; informação de terceiro fica bloqueada.

## D-013: Adolescente

**Decisão:** bloqueio conservador por padrão, destinatário explícito e nenhuma automatização de acesso por responsáveis.

## D-014: Jornada

**Decisão:** espaço longitudinal de duas famílias esperadas, sem pontuação ou produtividade. Contagens servem à navegação e memória.

## D-015: Ecomapa

**Decisão:** gerador local determinístico e editável; IA externa opcional por prompt com manifesto.

## D-016: Genograma

**Decisão:** camadas estrutural, domiciliar, clínica e funcional.

## D-017: Backup

**Decisão:** backups protegido e comum coexistem; não há recuperação secreta de senha.

## D-018: Estados antes abertos

**Decisão:** ficam fechados com padrões conservadores documentados. Dependências externas, como protocolo institucional e disponibilidade de marca, não são indefinição arquitetural; são gates de validação antes do uso correspondente.

``

# END FILE: docs/DECISIONS.md

---

# FILE: docs/DEFINITION_OF_DONE.md

``markdown
# Definition of Done

Uma entrega só está concluída quando:

- atende aos critérios do marco;
- possui tipagem estrita;
- possui testes relevantes;
- não introduz dados reais;
- passa por lint, typecheck, testes e build;
- atualiza documentação e changelog;
- registra decisão arquitetural quando aplicável;
- considera acessibilidade;
- considera privacidade;
- inclui mensagem de erro acionável;
- não contradiz os invariantes do projeto.

``

# END FILE: docs/DEFINITION_OF_DONE.md

---

# FILE: docs/END_TO_END_SIMULATION.md

``markdown
# Simulação Integral do Semestre

## Objetivo

Validar o Mapa como sistema contínuo, não apenas conjunto de módulos.

## Semestre sintético

- código: SEM-2026-2;
- duas famílias esperadas;
- expectativa não limitante;
- possibilidade de substituição se uma família recusar acompanhamento.

## Família Horizonte

Foco em:

- pessoa idosa;
- hipertensão e diabetes relatadas;
- possível condição renal ainda não normalizada;
- medicamentos parcialmente conhecidos;
- exames seriados;
- divergência entre prescrição e uso;
- cuidadora familiar e possível sobrecarga.

### Fluxos validados

- termo relatado antes de conceito clínico;
- medicamento desconhecido;
- primeiro exame como referência inicial registrada;
- comparação longitudinal;
- marcador contextual;
- passagem à preceptoria;
- feedback com múltiplos vínculos;
- plano individual e familiar;
- resumo de acompanhamento;
- sugestão de correção da pessoa.

## Família Travessia

Foco em:

- família recomposta;
- adolescente em dois domicílios;
- perspectivas divergentes;
- informação de terceiro;
- rastreamento como processo;
- genograma por camadas;
- ecomapa por perspectiva;
- recurso comunitário potencial.

### Fluxos validados

- pessoa única em múltiplos domicílios;
- confidencialidade familiar;
- estado divergente de vínculo;
- adiamento e posterior aceitação de rastreamento;
- mudança de residência preservando histórico;
- prompt de ecomapa com manifesto;
- política conservadora para adolescente.

## Visitar semestre

A tela apresenta cada família como trajetória:

- foco;
- mudanças;
- pendências;
- ferramentas;
- último encontro;
- próximo passo;
- aprendizados.

## Encerramento

Cada pendência recebe destino. O semestre produz snapshot somente leitura. Dados vivos podem continuar fora do semestre sem alterar o relatório histórico.

## Resultado

A arquitetura representa incompletude, longitudinalidade, múltiplos domicílios, farmacologia parcial, supervisão, privacidade, perspectivas e processos inconclusos sem exigir falsa resolução.

``

# END FILE: docs/END_TO_END_SIMULATION.md

---

# FILE: docs/MANIFEST.json

``json
{
  "project": "Mapa",
  "spec_version": "1.0.0",
  "created_at": "2026-09-27T21:52:00-03:00",
  "status": "planning-complete-production-not-started",
  "files": [
    {
      "path": "ACCEPTANCE_CRITERIA.md",
      "sha256": "6c50edf2fde46885e4fa7e9eeb5aaa290351752624b757273bb1f2d2754e109c",
      "bytes": 2416
    },
    {
      "path": "AI_EXPORTS.md",
      "sha256": "378584013576c052aa582c2c757b0b58d50eea3f6e65a31318e3263487f21496",
      "bytes": 1376
    },
    {
      "path": "ARCHITECTURE.md",
      "sha256": "e5d007e734d71bff4f66b24c1bb3b8911a40c7ce708bc11b7a99a09b8196661b",
      "bytes": 1928
    },
    {
      "path": "BACKUP_AND_RECOVERY.md",
      "sha256": "26bb589101e804c72869e18233f5ee883b1573de985e9f3ea601ffe319d4344a",
      "bytes": 1618
    },
    {
      "path": "CHANGELOG.md",
      "sha256": "fc1b39227180dbedac06be6cef58fee5c7ef0dfdd1c0f3569af72682d1fd0aa2",
      "bytes": 702
    },
    {
      "path": "CLINICAL_CONTENT_MODEL.md",
      "sha256": "6f25c34837eefc33dfde9e4aa3e31911e2a05183d647c1fcf51340b97daf2b2a",
      "bytes": 1699
    },
    {
      "path": "DATA_MODEL.md",
      "sha256": "fa9dc0fdc3dceb5611f7546cf8c64c825e9dee281df5520da6b87aa8feeab7b7",
      "bytes": 3597
    },
    {
      "path": "DECISIONS.md",
      "sha256": "8de045985d77b199103eae7310d032c5be689be1e9cae92a54777a0517c44919",
      "bytes": 2589
    },
    {
      "path": "END_TO_END_SIMULATION.md",
      "sha256": "6376ebd946303d20e2b8ae4d3998f819c4c0cbb665112dc77767739a9532dbe5",
      "bytes": 2088
    },
    {
      "path": "OPEN_QUESTIONS.md",
      "sha256": "238208dcbc2097919a655ccd5456d75c532f770538541c745d7b9d82a52171ba",
      "bytes": 1450
    },
    {
      "path": "PHARMACOLOGY_GOVERNANCE.md",
      "sha256": "92300f64689f7230b6cf2768e73095e03dc5dfe847b4742880361976349f0818",
      "bytes": 2194
    },
    {
      "path": "PRIVACY_MODEL.md",
      "sha256": "30b0395a6f061602969310afd06c792278bbf849e265df6ef361e74bda9bee33",
      "bytes": 2378
    },
    {
      "path": "PROJECT_STATE.md",
      "sha256": "8925fd056cb959c1f583b96f6d5b463fa931128f111786c83f1944c44f5412d3",
      "bytes": 3116
    },
    {
      "path": "README.md",
      "sha256": "cbeee9702c3a591e50c2b20ae30bef1c967da1e3b773e3bdb6ee43b4a8c70ea7",
      "bytes": 1704
    },
    {
      "path": "RISKS.md",
      "sha256": "05c78980846d538518bf4abbe7b53b59b64529a2ef11e31d2baee068a302ff2e",
      "bytes": 1827
    },
    {
      "path": "ROADMAP.md",
      "sha256": "565e0f0f4f34365568c887aa0f3f901c6d294037ad0a4c12720af9b747fde1c1",
      "bytes": 1501
    },
    {
      "path": "SCOPE.md",
      "sha256": "cfe82381aa0f3b5b366e25c34f41937971100c9bc621e1763f8e609f57ea5824",
      "bytes": 2453
    },
    {
      "path": "STATE_MACHINES.md",
      "sha256": "313c502b85b5d9ea5576c25af42cd7419674cff343d9df118822dcf76b667147",
      "bytes": 2224
    },
    {
      "path": "TEST_PLAN.md",
      "sha256": "23e12cf26bf6e408c5f2f5ed0fabc83a3dac07d5724cd3013d8602f82656b8c2",
      "bytes": 1621
    },
    {
      "path": "UX_FLOWS.md",
      "sha256": "51d280d703a1595b363a56992c3aa0d2e87ffb4ec87e9de8e88c2d57b9871815",
      "bytes": 1775
    },
    {
      "path": "VISION.md",
      "sha256": "afee9a08925cbbf8bde23c70f3ffb217deadebb725c48514ca97389f955091e4",
      "bytes": 1945
    }
  ]
}

``

# END FILE: docs/MANIFEST.json

---

# FILE: docs/OPEN_QUESTIONS.md

``markdown
# Questões e Gates de Validação

As decisões arquiteturais dos cinco rounds estão fechadas. Os itens abaixo não são lacunas de projeto; são validações externas ou decisões de implementação que devem ocorrer na fase adequada.

## Antes de usar dados reais

- obter orientação da faculdade, preceptoria e UBS sobre registros pessoais;
- confirmar política institucional para dados de saúde e adolescentes;
- verificar permissões para uso de instrumentos familiares;
- validar política de retenção e descarte.

## Antes de publicar conteúdo clínico

- auditar fontes vigentes;
- obter protocolos locais aplicáveis;
- executar revisão farmacológica;
- testar casos sintéticos;
- revisar linguagem compartilhável.

## Antes da publicação pública ampla

- pesquisar disponibilidade de marca e domínio para “Mapa”;
- definir domínio canônico;
- revisar política de privacidade;
- revisar licenças de bibliotecas e instrumentos.

## Durante implementação

- escolher biblioteca de IndexedDB;
- testar estratégia de criptografia e desempenho;
- implementar PIN obrigatório e biometria oportunística;
- definir formato binário ou textual do backup;
- escolher motor gráfico aberto para ecomapa e genograma;
- testar compatibilidade iOS e Android.

## Regra

Nenhum gate pode ser silenciosamente ignorado. Se não for satisfeito, a feature correspondente permanece em demonstração ou bloqueada para dados reais.

``

# END FILE: docs/OPEN_QUESTIONS.md

---

# FILE: docs/PHARMACOLOGY_GOVERNANCE.md

``markdown
# Governança Farmacológica

## Princípio

A unidade mínima não é medicamento mais dose. É:

```text
princípio ativo + apresentação + indicação + população + via + contexto + fonte
```

## Entidades

- princípio ativo;
- produto ou apresentação;
- regime terapêutico;
- uso real pela pessoa.

## Ficha farmacológica

- identidade;
- classe;
- farmacodinâmica;
- farmacocinética clinicamente útil;
- indicações cobertas;
- apresentações;
- posologia por contexto;
- administração;
- contraindicações;
- precauções;
- efeitos adversos;
- ajuste renal e hepático;
- populações especiais;
- interações;
- monitoramento;
- educação da pessoa;
- fontes e datas.

## Auditoria obrigatória

Antes de publicar:

1. conferir princípio ativo, sal, forma, concentração, liberação e via;
2. conferir indicação e população;
3. conferir dose inicial, usual, máxima, titulação e duração;
4. conferir compatibilidade da apresentação;
5. conferir contraindicações, precauções e interrupção;
6. conferir ajustes renal e hepático;
7. conferir gestação, lactação e idosos quando aplicável;
8. conferir interações, duplicidades e monitoramento;
9. localizar fonte regulatória e clínica;
10. registrar divergências.

## Barreiras contra erros

- dose sem unidade é proibida;
- regime sem indicação é proibido;
- apresentação sem concentração é sinalizada;
- mg e mL não são intercambiáveis sem cálculo validado;
- concentração não é confundida com dose administrada;
- dose não é copiada automaticamente entre indicações;
- status MIP não é generalizado para a molécula;
- medicamento desconhecido permanece registrável sem falsa identificação.

## Interações

A primeira versão contém interações curadas para os medicamentos cobertos e duplicidades estruturalmente detectáveis. Não será um verificador universal.

Mensagem obrigatória:

> A ausência de alerta não confirma ausência de interação.

## MIPs

Organizados por uso frequente e relevância prática na APS, não por vendas ou marcas. A classificação depende de forma, concentração e indicação, e deve manter data da fonte regulatória.

``

# END FILE: docs/PHARMACOLOGY_GOVERNANCE.md

---

# FILE: docs/PRIVACY_MODEL.md

``markdown
# Modelo de Privacidade

## Princípio

Privacidade é propriedade do dado e do fluxo, não apenas uma tela de termos.

## Eixos

### Sensibilidade

- comum;
- pessoal;
- saúde;
- familiar;
- alta sensibilidade;
- informação de terceiro.

### Destinos

- visão profissional;
- resumo individual;
- resumo familiar;
- preceptoria;
- transcrição;
- Jornada;
- prompt para IA;
- backup integral.

### Estado editorial

- privado;
- revisar;
- compartilhável;
- compartilhado;
- retirado;
- bloqueado.

## Padrões por categoria

Políticas padrão reduzem burocracia. Exceções exigem revisão explícita.

## Modo acompanhamento

- isola a navegação;
- oculta outras pessoas e famílias;
- desabilita edição direta;
- aumenta legibilidade;
- sai com PIN ou biometria quando tecnicamente disponível;
- registra itens mostrados;
- aceita sugestão de correção sem alterar diretamente o registro.

## Informação de terceiro

Bloqueada por padrão em resumo, família, IA e relatório. Qualquer exceção exige justificativa e revisão.

## Adolescentes

Decisão de projeto fechada de forma conservadora:

- bloqueio por padrão em resumos familiares;
- destinatário explícito para cada item;
- nenhuma automatização de compartilhamento com responsáveis;
- observância dos fluxos institucionais e profissionais aplicáveis;
- situações de proteção não são resolvidas por regra doméstica do app.

## Desidentificação

É específica ao destino. Pode remover ou generalizar:

- nomes;
- documentos;
- contatos;
- datas;
- localização;
- instituições;
- profissão rara;
- eventos raros;
- combinações reidentificáveis.

O sistema estima risco aparente, mas não promete anonimização perfeita.

## Dispositivo

- bloqueio automático configurável;
- desfocagem no alternador quando possível;
- notificações genéricas;
- nenhuma promessa uniforme de bloquear capturas de tela;
- domínio de produção estável;
- preview somente com dados sintéticos.

## Status anteriormente aberto, agora decidido

- dispositivo compartilhado: primeira versão não suporta perfis múltiplos; exige bloqueio e uso individual;
- conteúdo interpretativo: revisão recomendada antes de mostrar;
- informação familiar: não herda visibilidade individual automaticamente;
- biometria: recurso oportunístico, com PIN como método obrigatório de fallback.

## Avaliações individuais

Respostas clínicas só são exibidas após seleção explícita da pessoa. Medidas e classificações calculadas permanecem diferenciadas de dados informados, e respostas que deixam de ser aplicáveis são preservadas como não aplicáveis, sem permanecer ativas na revisão. O modo demonstração mantém o mesmo isolamento por pessoa e remove aplicações sintéticas ao sair.

`familyId` é contexto de navegação; `personId` é o sujeito clínico. A lista familiar expõe somente metadados operacionais da aplicação. A interface filtra aplicações por ambos os identificadores, reinicializa o editor ao trocar de pessoa e o domínio valida o vínculo pessoa-família antes de criar a aplicação. Respostas de outro integrante não são carregadas nem exibidas.

``

# END FILE: docs/PRIVACY_MODEL.md

---

# FILE: docs/PROJECT_STATE.md

``markdown
# Estado Canônico do Projeto

## Identidade

- **Nome de trabalho aprovado:** Mapa
- **Assinatura:** Clínica, família e território
- **Forma:** PWA mobile-first, responsiva, instalável e offline-first
- **Distribuição:** Vercel em domínio de produção estável
- **Armazenamento primário:** IndexedDB no dispositivo
- **Sincronização em nuvem:** fora da primeira versão
- **IA embarcada:** não
- **Uso de IA externa:** prompts estruturados, desidentificados, revisados e copiados manualmente

## Contexto de uso

O Mapa apoiará um estudante de Medicina durante atividades longitudinais na APS. A previsão acadêmica é acompanhar duas famílias ao longo do semestre. Essa quantidade é uma expectativa, não um limite técnico, porque uma família pode recusar acompanhamento ou precisar ser substituída.

## Finalidades

1. consulta clínica rápida sobre DCNTs;
2. interpretação contextual de exames e tendências;
3. farmacologia aplicada e auditável;
4. registro longitudinal de pessoas e famílias;
5. rastreamento como processo;
6. abordagem familiar com genograma, ecomapa e instrumentos pertinentes;
7. resumo de acompanhamento compreensível à pessoa;
8. passagem estruturada à preceptoria;
9. transcrição organizada para papel;
10. Jornada acadêmica visitável e encerrável;
11. preparação segura de prompts para IA externa;
12. backup e restauração verificáveis.

## Invariantes

1. Dados reais permanecem locais por padrão.
2. Deploys temporários e ambientes de demonstração recebem somente dados sintéticos.
3. O Mapa não se apresenta como prontuário institucional.
4. O prontuário oficial permanece na UBS; o Mapa mantém um resumo pessoal de acompanhamento.
5. Nenhum dado é enviado automaticamente a uma IA.
6. A ausência de alerta não significa ausência de risco ou interação.
7. Dados brutos e interpretações permanecem separados.
8. História clínica não é silenciosamente sobrescrita.
9. Informação de terceiro é bloqueada em resumos compartilháveis por padrão.
10. Conteúdo clínico declara fonte, população, escopo, versão e data de revisão.
11. O motor clínico pode recusar interpretação quando faltarem dados.
12. Uso rápido não exige preenchimento completo de módulos irrelevantes.
13. Encerrar semestre produz snapshot e não apaga dados.
14. Família e domicílio são conceitos distintos.
15. Pessoa pode participar de mais de uma família e de mais de um domicílio.
16. Quantidade esperada de famílias no semestre não constitui limite técnico.
17. O aplicativo deve explicar o que salvou, o que falhou e o que permanece pendente.

## Rounds concluídos

- Round 1: arquitetura e dados.
- Round 2: clínica e farmacologia.
- Round 3: experiência, compartilhamento e privacidade operacional.
- Round 4: auditoria adversarial.
- Round 5: simulação integral de semestre com duas famílias sintéticas.

## Próximo marco

Iniciar produção somente após comando explícito. A produção começa pelo repositório, documentação viva e fundação local-first, não pelo preenchimento integral da biblioteca clínica.


## Produção

### Marco 0

- **Estado:** concluído em 27 de setembro de 2026.
- repositório estruturado;
- documentação canônica incorporada;
- contratos TypeScript iniciais;
- dados sintéticos adicionados;
- testes de invariantes adicionados;
- CI e verificações do repositório preparadas;
- aplicação placeholder identificada como ambiente sem dados reais.

### Próximo

Marco 1: fundação local-first.


### Marco 1

- **Estado:** concluído em 27 de setembro de 2026.
- IndexedDB versionado;
- gravação com releitura e checksum;
- estado e solicitação de persistência;
- autosave de rascunhos;
- coordenação entre abas;
- PIN local com política mínima, bloqueio ao ocultar e bloqueio por inatividade;
- backup comum e protegido;
- validação e restauração atômica entre stores;
- Service Worker e fallback offline;
- dashboard de armazenamento;
- testes e verificações adicionados.

### Próximo

Marco 2: pessoas, famílias e encontros.


### Marco 2

- **Estado:** concluído em 27 de setembro de 2026.
- pessoas, famílias e participações;
- famílias esperadas sem limite técnico;
- Jornada básica;
- encontros rápidos modulares;
- pendências explícitas;
- timeline derivada;
- persistência por contratos de domínio;
- demonstração Horizonte e Travessia;
- navegação mobile com bottom bar;
- formulários em bottom sheets.

### Próximo

Marco 3: cuidado longitudinal e compartilhamento.


### Marco 3

- **Estado:** concluído em 27 de setembro de 2026.
- condições e problemas;
- medicamentos da pessoa;
- exames e resultados;
- rastreamentos;
- planos de cuidado;
- política central de compartilhamento;
- resumo de acompanhamento com saída autenticada;
- sugestões da pessoa;
- passagens de 30 segundos, 2 minutos e completa;
- visão para transcrição.

### Próximo

Marco 4: biblioteca clínica piloto e farmacologia auditada.


### Marco 4

- **Estado:** concluído em 27 de setembro de 2026, nível editorial essencial/ampliado.
- cinco condições piloto;
- catálogo de fontes oficiais;
- afirmações clínicas atômicas e versionadas;
- exames prioritários com travas interpretativas;
- farmacologia contextual por classes;
- distinção entre fonte vigente e relatório preliminar;
- doses bloqueadas até auditoria regulatória por produto e indicação;
- interface Clínica com busca, fontes e escopo.

### Próximo

Marco 5: genograma, ecomapa e abordagem familiar.


### Marco 5

- **Estado:** concluído em 27 de setembro de 2026.
- relações interpessoais com perspectiva e tempo;
- recursos externos e vínculos territoriais;
- genograma em camadas;
- ecomapa automático;
- estado divergente preservado;
- narrativa textual acessível;
- prompt para IA com manifesto;
- detector local de identificadores óbvios;
- exportação SVG.

### Próximo

Marco 6: Jornada completa, encerramento, snapshot e relatórios.


### Marco 6

- **Estado:** concluído em 27 de setembro de 2026.
- visita longitudinal por família;
- reflexões acadêmicas;
- evidências de competência;
- feedbacks de preceptoria;
- relatório do semestre;
- destinação explícita de pendências;
- encerramento por etapas;
- snapshot com checksum;
- dados vivos separados do retrato histórico;
- adendos sem alteração do original.

### Próximo

Marco 7: auditoria pré-uso real, build, testes em dispositivos e gates institucionais.


### Marco 7

- **Estado da auditoria:** concluída em 27 de setembro de 2026.
- **Decisão operacional:** GO LOCAL.
- **Dados reais:** continuam condicionados às regras da instituição, do serviço, da preceptoria e do prontuário oficial.
- **Distribuição pública:** não autorizada por esta decisão.
- **Substituição de prontuário:** não autorizada; o Mapa permanece ferramenta acadêmica local.
- headers defensivos e CSP adicionados;
- painel de gates adicionado;
- auditoria estática adicionada;
- checklists de segurança, acessibilidade, dispositivos e instituição adicionados;
- bloqueadores clínicos, farmacológicos, técnicos e institucionais formalizados.

### Delimitação operacional

GO LOCAL representa prontidão técnica para uso acadêmico local e demonstração supervisionada. Não é autorização institucional para dados reais, distribuição pública irrestrita ou assistência autônoma.

``

# END FILE: docs/PROJECT_STATE.md

---

# FILE: docs/README.md

``markdown
# Mapa: Especificação Canônica

**Assinatura:** Clínica, família e território  
**Versão da especificação:** 1.0.0  
**Data:** 27 de setembro de 2026  
**Estado:** planejamento conceitual concluído, pronto para iniciar produção mediante comando do responsável pelo projeto.

Este pacote é a memória externa formal do projeto **Mapa**. Ele consolida as decisões tomadas nos cinco rounds de planejamento e deve ser tratado como fonte canônica durante design, implementação, testes e revisão clínica.

## Ordem de leitura recomendada

1. `PROJECT_STATE.md`
2. `VISION.md`
3. `SCOPE.md`
4. `DECISIONS.md`
5. `ARCHITECTURE.md`
6. `DATA_MODEL.md`
7. `STATE_MACHINES.md`
8. `UX_FLOWS.md`
9. `PRIVACY_MODEL.md`
10. `CLINICAL_CONTENT_MODEL.md`
11. `PHARMACOLOGY_GOVERNANCE.md`
12. `AI_EXPORTS.md`
13. `BACKUP_AND_RECOVERY.md`
14. `END_TO_END_SIMULATION.md`
15. `ACCEPTANCE_CRITERIA.md`
16. `TEST_PLAN.md`
17. `ROADMAP.md`
18. `RISKS.md`
19. `OPEN_QUESTIONS.md`
20. `CHANGELOG.md`

## Regra de precedência

Quando houver conflito entre documentos:

1. decisões explicitamente registradas em `DECISIONS.md` prevalecem;
2. invariantes de `PROJECT_STATE.md` não podem ser contrariadas silenciosamente;
3. segurança clínica e privacidade prevalecem sobre conveniência;
4. mudanças posteriores exigem registro em `CHANGELOG.md` e, quando arquiteturais, um Architecture Decision Record.

## O que este pacote não contém

- código de produção;
- dados reais de pacientes;
- doses farmacológicas finais;
- protocolos locais da UBS;
- garantia de conformidade institucional;
- arte final da marca.

Todos os exemplos de famílias e pessoas presentes nesta documentação são sintéticos.

``

# END FILE: docs/README.md

---

# FILE: docs/release/ACADEMIC_REVIEW_POLICY.md

``markdown
# Política de Revisão Posterior pelo Acadêmico

O conteúdo oficial pode ser usado como baseline de desenvolvimento funcional, mas isso não muda automaticamente seu estado para `audited`.

O acadêmico responsável poderá revisar e corrigir conteúdo depois que o aplicativo estiver funcional. Alterações clínicas ou posológicas devem:

- preservar a fonte consultada;
- registrar data e responsável;
- gerar nova versão;
- manter histórico da formulação anterior;
- reexecutar os testes clínicos e o piloto sintético;
- nunca alterar silenciosamente snapshots históricos.

Até essa revisão, doses continuam ausentes. Isso não bloqueia a demonstração sintética nem o desenvolvimento das funções não prescritivas.

``

# END FILE: docs/release/ACADEMIC_REVIEW_POLICY.md

---

# FILE: docs/release/BASELINE.md

``markdown
# Baseline da Onda A

## Identificação

- Projeto: Mapa
- Candidato: `0.7.0-rc.0`
- Baseline: `v0.7.0-rc.0-audit`
- Data: 27 de setembro de 2026
- Dados reais: proibidos
- Decisão: NO-GO

## Ambiente observado

- Sistema: Linux
- Node: v24.16.0
- npm: 11.19.1
- Registro configurado: npmjs
- Dependências instaladas: não
- `package-lock.json`: não disponível porque o registro npm não respondeu neste ambiente

## Evidência de conectividade

`npm ping --fetch-timeout=10000 --fetch-retries=0` terminou com `FETCH_ERROR` por timeout. A falha foi classificada como indisponibilidade do ambiente de execução, não como aprovação ou reprovação do código.

## Escopos separados

- `development`: desenvolvimento local, dados sintéticos.
- `synthetic-demo`: demonstração, somente dados marcados como sintéticos.
- `release-candidate`: candidato congelado para validação; `realDataAllowed` permanece `false`.

## Reprodutibilidade esperada

Em ambiente com acesso ao registro:

```bash
npm ci
npm run verify
npm run build
```

O hash do artefato e os logs devem ser anexados ao índice de evidências.

## Identificadores Git

- Commit preliminar do congelamento: `b31bc3a741e6f5ed0a1c1601a7e5c157e635bdd3`
- Tag anotada: `v0.7.0-rc.0-audit`

``

# END FILE: docs/release/BASELINE.md

---

# FILE: docs/release/BUILD_REPORT.md

``markdown
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

``

# END FILE: docs/release/BUILD_REPORT.md

---

# FILE: docs/release/CLINICAL_REVIEW_PROTOCOL.md

``markdown
# Protocolo de Revisão Clínica Independente

Cada uma das 35 afirmações deve receber decisão individual por revisor qualificado, sem aprovação em lote.

## Campos obrigatórios

- fidelidade ao documento-fonte;
- vigência da fonte;
- população e exceções;
- escopo da APS;
- risco de omissão;
- linguagem profissional;
- linguagem compartilhável;
- critérios de recusa;
- decisão;
- nome e qualificação do revisor;
- data;
- nota de risco residual.

## Decisões

- `approved`;
- `approve-with-revision`;
- `rejected`;
- `blocked-preliminary-source`.

## Regra

Uma afirmação só pode ser marcada `audited` no código depois de revisão assinada e rastreável. Fonte oficial não substitui revisão de transcrição, contexto e atualização.

``

# END FILE: docs/release/CLINICAL_REVIEW_PROTOCOL.md

---

# FILE: docs/release/CLINICAL_REVIEW_STATUS.json

``json
{
  "claims": 35,
  "claimApproved": 0,
  "claimBlocked": 1,
  "medications": 5,
  "dosePublished": 0,
  "ready": false
}

``

# END FILE: docs/release/CLINICAL_REVIEW_STATUS.json

---

# FILE: docs/release/CRYPTO_DECISION_DRAFT.md

``markdown
# Decisão Criptográfica, Rascunho

## Situação

Backup protegido utiliza PBKDF2-SHA-256 com 310.000 iterações e AES-GCM. O banco vivo no IndexedDB não é integralmente cifrado pelo aplicativo.

## Opções

### A. Dispositivo institucional gerenciado

Exigir criptografia nativa, bloqueio forte, perfil controlado, proibição de nuvem pessoal e procedimento de perda. Menor complexidade da aplicação, maior dependência institucional.

### B. Cifragem de envelopes no aplicativo

Cifrar payloads antes do IndexedDB. Exige chave em memória durante a sessão, migração, rotação, recuperação, revisão de índices e risco de perda total do segredo.

### C. Escopo sem dados reais

Manter o Mapa como ferramenta sintética. Elimina o risco operacional de dados de pacientes, preservando valor acadêmico.

## Recomendação provisória

Não implementar cifragem ad hoc antes da decisão institucional. Para um piloto real restrito, priorizar dispositivo institucional gerenciado e pseudonimização forte; avaliar cifragem da aplicação em revisão especializada. Até a decisão, `realDataAllowed=false`.

``

# END FILE: docs/release/CRYPTO_DECISION_DRAFT.md

---

# FILE: docs/release/DEFECT_LOG.md

``markdown
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

``

# END FILE: docs/release/DEFECT_LOG.md

---

# FILE: docs/release/ENVIRONMENT.json

``json
{
  "capturedAt": "2026-09-27T21:52:00-03:00",
  "platform": "linux",
  "node": "v24.16.0",
  "npm": "11.19.1",
  "candidate": "0.7.0-rc.0",
  "realDataAllowed": false,
  "registryReachable": false,
  "registryEvidence": "npm ping FETCH_ERROR network timeout",
  "packageLockPresent": false
}

``

# END FILE: docs/release/ENVIRONMENT.json

---

# FILE: docs/release/EVIDENCE_INDEX.md

``markdown
# Índice de Evidências da Onda A

## Engenharia

- `docs/release/BASELINE.md`
- `docs/release/BUILD_REPORT.md`
- `docs/release/DEFECT_LOG.md`
- `docs/release/ENVIRONMENT.json`
- `REPOSITORY_MANIFEST.json`

## Governança

- `docs/release/INSTITUTIONAL_MEETING_PACK.md`
- `docs/release/REVIEWER_NOMINATION.md`
- `docs/release/THREAT_MODEL_DRAFT.md`

## Auditoria anterior

- `docs/audit/RELEASE_DECISION.json`
- `docs/audit/AUDIT_REPORT.md`
- `docs/audit/GATE_CLOSURE_PLAN.md`

## Regras

Cada nova evidência deve registrar versão, data, executor, procedimento, resultado, defeitos relacionados e riscos residuais. Evidência substituída permanece no histórico.


## Onda B

- `docs/release/WAVE_B_REPORT.md`
- `docs/release/PERSISTENCE_TEST_PROTOCOL.md`
- `docs/release/CRYPTO_DECISION_DRAFT.md`
- `scripts/wave-b-adversarial.ts`
- `scripts/accessibility-static.mjs`


## Onda C

- `docs/release/WAVE_C_REPORT.md`
- `docs/release/CLINICAL_CLAIM_REVIEW.csv`
- `docs/release/PHARMACOLOGY_REVIEW.csv`
- `docs/release/CLINICAL_REVIEW_STATUS.json`
- `docs/release/CLINICAL_REVIEW_PROTOCOL.md`
- `docs/release/PHARMACOLOGY_DECISION.md`
- `docs/release/SOURCE_VERIFICATION.md`


## Onda D

- `docs/release/WAVE_D_REPORT.md`
- `docs/release/WAVE_D_RESULT.json`
- `docs/release/WAVE_D_PILOT_REPORT.txt`
- `docs/release/WAVE_D_RELEASE_DECISION.json`
- `docs/release/ACADEMIC_REVIEW_POLICY.md`
- `src/data/synthetic/wave-d-semester.json`

``

# END FILE: docs/release/EVIDENCE_INDEX.md

---

# FILE: docs/release/FINAL_DELIVERY.json

``json
{
  "release": "1.0.0-production-candidate",
  "buildType": "static-production",
  "modulesBundled": 53,
  "assets": {
    "index.html": {
      "sha256": "e5e94871336fceab67d492ee2888b78ed61aa0cd77e260380ebfd3f09e6c56ce",
      "bytes": 813
    },
    "app.js": {
      "sha256": "8ec4aaa0124cea1f663d2acec99b69e3e72abb65e4360434f1206ac580d5a518",
      "bytes": 314144
    },
    "styles.css": {
      "sha256": "97bc788de6ba957430ffef4b221d18ab324382a1306daacace9ae94e2602f5d1",
      "bytes": 25557
    },
    "sw.js": {
      "sha256": "740bfc2e411075aa26f5d26a83c7c788c245e524f87386e78f359612aa4b5d46",
      "bytes": 1397
    },
    "manifest.webmanifest": {
      "sha256": "86719b8c4ec266ad691a9066b300bde88a5f1721e581676f49060fd070434068",
      "bytes": 302
    },
    "offline": {
      "sha256": "ea875cfa1c8dedad295cdd01ce4cd33d3abed519424cbf76a7e2511adebf3022",
      "bytes": 300
    }
  },
  "httpSmokeTest": {
    "index": 813,
    "appJs": 314144,
    "serviceWorker": 1397,
    "passed": true
  },
  "sourceIncluded": true,
  "vscodeReady": true,
  "nextOfficialBuild": "requires npm install in networked environment",
  "realDataAllowed": false
}

``

# END FILE: docs/release/FINAL_DELIVERY.json

---

# FILE: docs/release/GO_LOCAL.md

``markdown
# GO local

A versão 1.0.4 recebe GO LOCAL para uso acadêmico local, demonstração supervisionada e organização pessoal no dispositivo validado pelo responsável.

## Evidências aceitas

- instalação concluída;
- typecheck, lint, testes e build concluídos no ambiente local;
- funcionamento em desenvolvimento e produção;
- proteção do dispositivo aceita pelo responsável;
- persistência e backup validados;
- suítes internas das Ondas B, C e D aprovadas.

## Escopo

O GO LOCAL não autoriza dados reais de forma irrestrita, não transforma o Mapa em prontuário institucional, não representa distribuição pública ampla e não autoriza prescrição ou assistência autônoma.

``

# END FILE: docs/release/GO_LOCAL.md

---

# FILE: docs/release/INSTITUTIONAL_MEETING_PACK.md

``markdown
# Pacote para Reunião Institucional Inicial

## Objetivo da reunião

Definir se existe interesse institucional em avaliar um piloto sintético e, posteriormente, um uso restrito com dados pseudonimizados. A reunião não solicita aprovação genérica do aplicativo.

## Participantes necessários

- coordenação do curso ou responsável acadêmico;
- preceptoria;
- representação da UBS;
- privacidade, proteção de dados ou segurança da informação;
- responsável pelo projeto;
- suporte técnico institucional, quando houver.

## Decisões solicitadas

1. O projeto pode prosseguir para avaliação institucional?
2. Quem seria o controlador e quem responderia operacionalmente?
3. Dispositivo pessoal é proibido, permitido ou condicionado?
4. Quais dados podem existir fora do prontuário?
5. Qual pseudonimização é exigida?
6. IA externa é proibida ou condicionada?
7. Como tratar adolescentes e dados de terceiros?
8. Onde backups podem ser guardados?
9. Qual retenção e procedimento de exclusão?
10. Quem recebe incidentes?
11. Quem revisa o conteúdo clínico e farmacológico?

## Proposta de escopo inicial

- dados exclusivamente sintéticos durante validação;
- sem dose farmacológica;
- sem identificadores diretos;
- sem informação confidencial de terceiro em exportações;
- sem transmissão automática;
- prontuário oficial preservado;
- decisão final somente após evidências técnicas e revisão independente.

## Saída esperada

Ata com decisão, responsáveis, documentos exigidos, limites preliminares e próxima data. Aprovação verbal não fecha o gate.

``

# END FILE: docs/release/INSTITUTIONAL_MEETING_PACK.md

---

# FILE: docs/release/INTERNAL_VALIDATION.md

``markdown
# Validação Interna sem Instalação npm

## Motivação

O registro npm está inacessível neste ambiente, mas existem `bun` e compilador TypeScript globais. A validação interna foi ampliada sem alegar equivalência com o build Next.js oficial.

## Descoberta crítica

O primeiro bundle interno encontrou seis arquivos com literais de nova linha quebrados, totalizando oito ocorrências:

- `app/journey-dashboard.tsx`: 2;
- `app/person-care-panel.tsx`: 1;
- `src/domain/care-selectors.ts`: 1;
- `src/domain/diagram-engine.ts`: 1;
- `src/domain/diagram-prompt.ts`: 2;
- `src/domain/journey-report.ts`: 1.

A causa foi a gravação de `"\n"` como nova linha física dentro de literais TypeScript durante a geração dos marcos. Os validadores textuais anteriores não compilavam os arquivos e, portanto, não detectavam essa classe de defeito.

## Correção

As oito ocorrências foram convertidas para literais escapados válidos (`"\n"`).

## Validações posteriores

### Bundle transitivo da aplicação

```text
bun build app/page.tsx
40 módulos empacotados
207,20 KB
resultado: PASS
```

As dependências externas de runtime foram marcadas como externas. Esse teste valida parsing, resolução dos módulos locais alcançáveis e transformação TS/TSX. Não equivale ao `next build`.

### Parsing individual

Todos os arquivos `.ts` e `.tsx` em `app`, `src` e `tests` foram submetidos individualmente ao bundler interno.

```text
falhas: 0
resultado: PASS
```

### Smoke tests de domínio

Foram executadas 10 asserções sobre:

- bloqueio de informação de terceiro;
- exame sem unidade;
- genograma;
- ecomapa;
- regra de não invenção no prompt;
- detector de telefone;
- bloqueio de encerramento com pendência aberta;
- checksum do snapshot;
- cópia independente do snapshot;
- validade da biblioteca clínica.

```text
asserções: 10
falhas: 0
resultado: PASS
```

## Interpretação

A validação interna mudou o estado do projeto de “não parseado” para “sintaticamente validado por ferramenta independente e smoke-tested no domínio”. O gate do build oficial continua bloqueado porque ainda faltam dependências reais, tipos oficiais, lint, Vitest e `next build`.

``

# END FILE: docs/release/INTERNAL_VALIDATION.md

---

# FILE: docs/release/LOCAL_RUNTIME_FIX.md

``markdown
# Correção do runtime local

## CSP em desenvolvimento

A diretiva `unsafe-eval` é adicionada exclusivamente quando `NODE_ENV=development`, pois o React a utiliza para recursos de depuração. Ela permanece ausente em produção.

## Hidratação

O elemento `body` usa `suppressHydrationWarning` somente no nível raiz para tolerar atributos injetados por extensões do navegador, como Grammarly. Diferenças internas dos componentes continuam visíveis.

## Catálogo clínico

A busca por marcação HTML em `src/clinical/sources.ts` não encontrou `<a`, `href=`, `rel=` ou `target=`. As URLs permanecem como strings TypeScript no catálogo autorizado.

``

# END FILE: docs/release/LOCAL_RUNTIME_FIX.md

---

# FILE: docs/release/PERSISTENCE_TEST_PROTOCOL.md

``markdown
# Protocolo de Persistência em Dispositivo

Executar somente com dados sintéticos e registrar navegador, versão, dispositivo, armazenamento livre e evidência.

## P-01 Persistência recusada

Recusar `navigator.storage.persist()`, criar registros, reiniciar o navegador e confirmar mensagem de risco e disponibilidade do backup.

## P-02 Quota próxima do limite

Preencher origem de teste, provocar `QuotaExceededError` e verificar que o aplicativo não afirma ter salvo o registro.

## P-03 Interrupção de restauração

Encerrar o processo durante restauração. Na retomada, o banco anterior deve permanecer integral ou a operação deve indicar falha, nunca estado parcial.

## P-04 Duas abas

Editar a mesma entidade em duas abas. Verificar aviso, versão e ausência de sobrescrita silenciosa.

## P-05 Atualização de schema

Abrir banco de versão anterior, migrar cópia sintética e conferir todas as entidades e checksums.

## P-06 Eviction

Em ambiente descartável, remover dados da origem e confirmar que a recuperação depende de backup, sem promessa de permanência absoluta.

``

# END FILE: docs/release/PERSISTENCE_TEST_PROTOCOL.md

---

# FILE: docs/release/PHARMACOLOGY_AUTHORING.md

``markdown
# Preenchimento do farmacológico

- Arquivo editável: `src/clinical/pharmacology/catalog.ts`
- Molde completo: `src/clinical/pharmacology/example.ts`
- Contrato de tipos: `src/clinical/pharmacology/types.ts`
- Validação: `src/clinical/pharmacology/validation.ts`

O catálogo atual já está preenchido e é consumido como conteúdo estático tipado pela biblioteca clínica. A interface usa `publishablePharmacologyEntries` para excluir fichas arquivadas ou que não passam pela validação. O molde contém placeholders, fica separado do catálogo e não é importado nem exibido no aplicativo.

``

# END FILE: docs/release/PHARMACOLOGY_AUTHORING.md

---

# FILE: docs/release/PHARMACOLOGY_DECISION.md

``markdown
# Decisão Farmacológica da Onda C

## Estado

Os cinco itens atuais são blocos de conhecimento por classe ou contexto, não catálogos de produtos. Todos permanecem com `doseStatus: not-published`.

## Proibição

Não publicar dose, titulação, dose máxima, ajuste renal ou hepático, apresentação ou via usando apenas o nome da classe.

## Caminhos válidos

1. manter permanentemente a posologia fora do Mapa; ou
2. criar catálogo por princípio ativo, sal, apresentação, concentração, forma, via, indicação e população, com bula profissional e protocolo vigentes, dupla revisão e data de expiração.

## Estado por bloco

- metformina: revisão por produto pendente;
- IECA/BRA: preciso separar moléculas e indicações;
- inibidores de SGLT2: preciso separar moléculas, função renal, indicação e risco;
- estatinas: atualização de dislipidemia de 2026 ainda preliminar;
- anti-hipertensivos: classe agregada inadequada para conteúdo posológico.

## Decisão

Doses continuam bloqueadas. Isso é um controle de segurança, não uma lacuna a preencher automaticamente.

``

# END FILE: docs/release/PHARMACOLOGY_DECISION.md

---

# FILE: docs/release/PRODUCTION_BUILD_REPORT.md

``markdown
# Relatório do Build de Produção

## Resultado

Foi produzido um build estático executável em `dist-production/` com Bun, React e ReactDOM incorporados.

- módulos empacotados: 53;
- JavaScript minificado: aproximadamente 0,31 MB;
- CSP sem `unsafe-inline` ou `unsafe-eval`;
- manifesto PWA incluído;
- Service Worker incluído;
- CSS incluído;
- fallback offline incluído.

## Validação

O pacote passou por bundle, parsing completo, auditorias das Ondas B, C e D, auditoria estática e verificação estrutural. O build Next.js oficial não foi executado devido à indisponibilidade do registro npm no ambiente de produção do pacote. O código-fonte e as tarefas do VS Code estão incluídos para executar `npm install`, `npm run build` e `npm run start` localmente.

``

# END FILE: docs/release/PRODUCTION_BUILD_REPORT.md

---

# FILE: docs/release/REVIEWER_NOMINATION.md

``markdown
# Nomeação de Revisores

## Revisor clínico principal

- Nome: a definir
- Qualificação: Medicina de Família e Comunidade ou experiência equivalente em APS
- Vínculo: a definir
- Conflitos de interesse: a declarar
- Escopo: cinco condições piloto, linguagem, recusas e aderência à APS

## Segundo revisor clínico

- Nome: a definir
- Escopo: afirmações de maior risco e conflitos de fonte

## Revisor farmacológico

- Nome: a definir
- Qualificação: farmacologia clínica, farmácia clínica ou competência equivalente
- Escopo: decisão sobre doses, apresentações, contraindicações, interações e monitoramento

## Revisor de segurança

- Nome: a definir
- Escopo: modelo de ameaça, ASVS, dependências, CSP, backup e armazenamento

## Revisor de acessibilidade

- Nome: a definir
- Escopo: WCAG 2.2 AA, teclado, zoom, TalkBack e VoiceOver

## Regra

Nenhum revisor pode aprovar somente por leitura informal. Toda revisão deve produzir decisão versionada, evidência e riscos residuais.

``

# END FILE: docs/release/REVIEWER_NOMINATION.md

---

# FILE: docs/release/SOURCE_VERIFICATION.md

``markdown
# Verificação de Fontes da Onda C

Data da consulta: 27 de setembro de 2026.

## Hipertensão

- protocolo aprovado pela Portaria SECTICS/MS nº 49, de 23 de julho de 2025;
- versão resumida oficial publicada em abril de 2026;
- estado no Mapa: vigente.

## Diabete melito tipo 2

- atualização formal pela Portaria SCTIE/MS nº 13, de 21 de fevereiro de 2026;
- página oficial criada em 24 de fevereiro de 2026 e documento atualizado em junho;
- estado no Mapa: vigente.

## Doença renal crônica

- Portaria Conjunta SAES/SECTICS/MS nº 11, de 16 de setembro de 2024;
- página oficial modificada em fevereiro de 2025;
- estado no Mapa: vigente.

## Dislipidemia

- protocolo vigente aprovado em 30 de julho de 2019;
- relatório de setembro de 2026 declara explicitamente ser versão preliminar e sujeita a alteração;
- estado no Mapa: conteúdo marcado `review-needed`; preliminar não promovida.

## Sobrepeso e obesidade

- página oficial informa anexo atualizado em 8 de julho de 2024;
- estado no Mapa: vigente, ainda pendente de revisão clínica independente.

``

# END FILE: docs/release/SOURCE_VERIFICATION.md

---

# FILE: docs/release/THREAT_MODEL_DRAFT.md

``markdown
# Modelo de Ameaça, Rascunho da Onda A

## Ativos

- dados pseudonimizados de pessoas e famílias;
- dados de saúde;
- informação de terceiros;
- relações familiares;
- snapshots e relatórios;
- backups comuns e protegidos;
- PIN e material de derivação;
- catálogo clínico e fontes.

## Fronteiras

1. interface desbloqueada;
2. IndexedDB e Cache API;
3. sistema operacional e perfil do navegador;
4. arquivo de backup;
5. área de transferência;
6. exportação SVG e texto;
7. prompts para IA externa;
8. prontuário oficial da UBS.

## Ameaças prioritárias

### T1 — Dispositivo perdido ou roubado

- Impacto: exposição de dados locais.
- Controles atuais: PIN da interface, bloqueio por inatividade, possível criptografia nativa do dispositivo.
- Lacuna: IndexedDB não é cifrado integralmente pelo Mapa.
- Decisão pendente: dispositivo gerenciado versus cifragem no aplicativo.

### T2 — Acesso casual com sessão aberta

- Controles: bloqueio por ocultação e inatividade; saída do modo pessoa exige PIN.
- Teste pendente: alternador de aplicativos, histórico e retomada em Android/iOS.

### T3 — Extração do perfil do navegador

- Impacto: acesso aos envelopes do IndexedDB.
- Controle atual: nenhum controle criptográfico integral na aplicação.
- Severidade: crítica.

### T4 — Backup copiado ou adulterado

- Controles: opção AES-GCM, checksums e validação.
- Testes pendentes: senha errada, adulteração, corrupção e rollback.

### T5 — Exportação indevida para IA

- Controles: opt-in, manifesto, detector de identificadores óbvios, bloqueio de terceiros.
- Lacuna: detector não garante anonimização.
- Decisão institucional obrigatória.

### T6 — XSS persistente por texto importado

- Controles: React escapa texto por padrão; auditoria estática não encontrou `dangerouslySetInnerHTML`; CSP adicionada.
- Teste pendente: payloads em todos os campos, backup e restauração.

### T7 — Perda por quota ou remoção do navegador

- Controles: status de persistência, solicitação de storage persistente, backup.
- Testes pendentes: quota baixa e persistência recusada em navegadores reais.

### T8 — Decisão clínica indevida

- Controles: fontes, versionamento, recusas, doses bloqueadas.
- Lacunas: revisão clínica e farmacológica independentes.

## Decisões obrigatórias

- política do dispositivo;
- cifragem integral ou aceitação formal do risco;
- IA externa;
- destino dos backups;
- logs e incidentes;
- retenção;
- escopo de um possível CONDITIONAL-GO.

``

# END FILE: docs/release/THREAT_MODEL_DRAFT.md

---

# FILE: docs/release/TYPESCRIPT_BUILD_FIX.md

``markdown
# Correção do typecheck de produção

Esta revisão corrige os erros revelados pelo `next build` com TypeScript estrito:

- imports de scripts sem extensão `.ts`;
- acesso seguro à primeira linha na geração de CSV;
- discriminantes literais de `BackupPayload`;
- `BufferSource` compatível com Web Crypto e TypeScript atual;
- propriedade opcional `subtitle` sob `exactOptionalPropertyTypes`;
- narrowing explícito do cenário Horizonte;
- fixture de família com campos obrigatórios de auditoria.

As suítes adversariais das Ondas B, C e D e o bundle interno foram reexecutados após as correções.

``

# END FILE: docs/release/TYPESCRIPT_BUILD_FIX.md

---

# FILE: docs/release/WAVE_A_STATUS.md

``markdown
# Estado da Onda A

## Executado

- baseline documental criado;
- repositório Git inicializado;
- tag anotada `v0.7.0-rc.0-audit` criada;
- commit de baseline: `e6143a15024dc57d508ecc8a3662481f1928112f`;
- registro de defeitos criado;
- índice de evidências criado;
- ambiente registrado;
- pacote de reunião institucional criado;
- modelo de ameaça inicial criado;
- modelo de nomeação de revisores criado;
- conectividade npm testada.

## Validação interna complementar

- Bun identificado no ambiente;
- bundle transitivo executado;
- oito erros de sintaxe encontrados e corrigidos;
- todos os arquivos TS/TSX analisados individualmente;
- 10 smoke tests de domínio aprovados.

## Bloqueado

- `package-lock.json`;
- `npm ci`;
- typecheck;
- lint;
- testes Vitest;
- build Next.js;
- SBOM e auditoria de dependências.

Motivo: timeout de rede no registro npm deste ambiente.

## Decisão atual

NO-GO para dados reais. Onda A iniciada e parcialmente concluída. Próxima execução deve ocorrer em ambiente com npm acessível e com participação institucional humana.

``

# END FILE: docs/release/WAVE_A_STATUS.md

---

# FILE: docs/release/WAVE_B_REPORT.md

``markdown
# Relatório da Onda B

## Escopo executado internamente

- robustez criptográfica do backup;
- integridade por store e checksum global;
- schema futuro e store ausente;
- canonicalização de checksum;
- parsing e bundle de toda a aplicação;
- smoke tests de domínio;
- auditoria estática de acessibilidade;
- reforço de foco visível e redução de movimento;
- refinamento do modelo de ameaça.

## Resultado adversarial

Dez testes executados com dados integralmente sintéticos:

1. backup válido aceito;
2. corrupção de store rejeitada;
3. store ausente rejeitada;
4. schema futuro rejeitado;
5. checksum global adulterado rejeitado;
6. checksum canônico estável;
7. AES-GCM abre com senha correta;
8. senha incorreta rejeitada;
9. ciphertext adulterado rejeitado;
10. senha curta recusada.

Resultado: **10/10 PASS**.

## Segurança

A autenticação AES-GCM detectou alteração de ciphertext. A validação do backup ocorre antes da substituição transacional. O banco vivo permanece sem cifragem integral, logo esse gate não foi fechado.

## Acessibilidade

A auditoria estática encontrou idioma, semântica básica e labels nos arquivos com inputs. Foi acrescentado foco visível global e respeito a `prefers-reduced-motion`. Testes com leitor de tela, zoom e dispositivos físicos continuam manuais.

## Limites

Sem navegador real não foram simulados IndexedDB, quota, eviction, interrupção de transação, Service Worker, TalkBack ou VoiceOver. Esses itens permanecem abertos, mas agora possuem testes e critérios preparados.

``

# END FILE: docs/release/WAVE_B_REPORT.md

---

# FILE: docs/release/WAVE_C_REPORT.md

``markdown
# Relatório da Onda C

## Resultado

A infraestrutura de revisão clínica e farmacológica foi concluída, mas os gates humanos permanecem abertos. Nenhuma assinatura, qualificação ou aprovação foi inventada.

## Inventário

- cinco condições piloto;
- 35 afirmações clínicas, sete por condição;
- cinco blocos farmacológicos contextuais;
- cinco exames estruturados;
- nove fontes oficiais catalogadas;
- uma fonte preliminar de dislipidemia mantida como preliminar;
- zero doses publicadas.

## Fontes verificadas

Foram rechecadas páginas oficiais do Ministério da Saúde e da Conitec para hipertensão, diabete melito tipo 2, doença renal crônica, dislipidemia e sobrepeso/obesidade. O protocolo de hipertensão foi aprovado em 23 de julho de 2025 e possui material resumido publicado em 2026. O protocolo de DM2 foi atualizado por portaria de 21 de fevereiro de 2026. O protocolo de DRC decorre da Portaria Conjunta de 16 de setembro de 2024. O protocolo de obesidade tem anexo atualizado em 8 de julho de 2024. A atualização de dislipidemia publicada em setembro de 2026 é preliminar e não substitui a norma vigente de 2019.

## Saídas

- `CLINICAL_CLAIM_REVIEW.csv`: uma linha por afirmação;
- `PHARMACOLOGY_REVIEW.csv`: uma linha por bloco farmacológico;
- `CLINICAL_REVIEW_STATUS.json`: estado calculado do gate;
- `CLINICAL_REVIEW_PROTOCOL.md`: instruções de revisão independente;
- `PHARMACOLOGY_DECISION.md`: política de não publicação de doses sem produto auditado.

## Decisão

Onda C interna: concluída. Gate clínico: manual e bloqueante. Gate farmacológico: falho para posologia e bloqueante. Dados reais permanecem proibidos.

``

# END FILE: docs/release/WAVE_C_REPORT.md

---

# FILE: docs/release/WAVE_D_PILOT_REPORT.txt

``text
PILOTO SINTÉTICO INTEGRAL
Semestre: SEM-2026-2
Famílias: Horizonte, Travessia
Checks: 13/13
Checksum: 560ab500d09470bc6a497bbeecc197a4f616dec43350c847e3e61cb508baeca8

PASS | synthetic-marker | Conjunto explicitamente sintético
PASS | expected-not-limit | Duas famílias esperadas sem limite rígido
PASS | longitudinal-encounters | Cada família possui dois encontros
PASS | unknown-medication | Medicamento parcialmente identificado preservado
PASS | no-dose | Nenhuma posologia publicada
PASS | exam-unit-guard | Exame sem unidade não interpretado
PASS | multiple-households | Adolescente em dois domicílios
PASS | perspectives | Perspectivas divergentes preservadas
PASS | third-party-blocked | Informação de terceiro bloqueada
PASS | screening-process | Rastreamento representado como processo
PASS | pending-destinations | Todas as pendências possuem destino explícito
PASS | snapshot-immutable | Adendo não altera snapshot
PASS | incident-drills | Incidentes possuem resultado seguro esperado

``

# END FILE: docs/release/WAVE_D_PILOT_REPORT.txt

---

# FILE: docs/release/WAVE_D_RELEASE_DECISION.json

``json
{
  "generatedAt": "2026-09-28T02:38:01.001Z",
  "decision": "NO-GO",
  "realDataAllowed": false,
  "syntheticDemoAllowed": true,
  "gates": [
    {
      "id": "synthetic-pilot",
      "passed": true
    },
    {
      "id": "clinical-signoff",
      "passed": false
    },
    {
      "id": "institutional-authorization",
      "passed": false
    },
    {
      "id": "official-build",
      "passed": false
    },
    {
      "id": "physical-devices",
      "passed": false
    },
    {
      "id": "live-db-protection",
      "passed": false
    }
  ]
}

``

# END FILE: docs/release/WAVE_D_RELEASE_DECISION.json

---

# FILE: docs/release/WAVE_D_REPORT.md

``markdown
# Relatório da Onda D

## Escopo

Foi executado um semestre sintético integral com as famílias Horizonte e Travessia. O piloto valida coerência funcional do domínio e não substitui build oficial, dispositivo físico, revisão clínica posterior ou autorização institucional.

## Horizonte

- pessoa idosa e cuidadora;
- hipertensão e diabetes relatadas;
- possível alteração renal incerta;
- medicamento parcialmente identificado;
- metformina sem dose publicada;
- creatinina sem unidade e, portanto, não interpretada;
- HbA1c registrada sem produzir diagnóstico automático;
- divergência entre prescrição e uso levada à preceptoria;
- pendências destinadas a continuidade ou informação não recuperável.

## Travessia

- adolescente em dois domicílios;
- autoria e perspectivas divergentes preservadas;
- informação de terceiro bloqueada;
- rastreamento adiado e posteriormente aceito;
- recurso comunitário potencial;
- continuidade explicitamente destinada.

## Encerramento

O piloto exige destino para todas as pendências, gera checksum integral, considera snapshot imutável e registra adendo sem reescrever o original.

## Resultado

Treze verificações automatizadas passaram. O piloto sintético está autorizado para demonstração. Dados reais permanecem em NO-GO porque build oficial, dispositivos, governança e proteção do banco vivo continuam abertos. A revisão clínica poderá ser feita posteriormente pelo acadêmico responsável sem ser representada falsamente como já concluída.

``

# END FILE: docs/release/WAVE_D_REPORT.md

---

# FILE: docs/release/WAVE_D_RESULT.json

``json
{
  "synthetic": true,
  "checks": [
    {
      "id": "synthetic-marker",
      "passed": true,
      "evidence": "Conjunto explicitamente sintético"
    },
    {
      "id": "expected-not-limit",
      "passed": true,
      "evidence": "Duas famílias esperadas sem limite rígido"
    },
    {
      "id": "longitudinal-encounters",
      "passed": true,
      "evidence": "Cada família possui dois encontros"
    },
    {
      "id": "unknown-medication",
      "passed": true,
      "evidence": "Medicamento parcialmente identificado preservado"
    },
    {
      "id": "no-dose",
      "passed": true,
      "evidence": "Nenhuma posologia publicada"
    },
    {
      "id": "exam-unit-guard",
      "passed": true,
      "evidence": "Exame sem unidade não interpretado"
    },
    {
      "id": "multiple-households",
      "passed": true,
      "evidence": "Adolescente em dois domicílios"
    },
    {
      "id": "perspectives",
      "passed": true,
      "evidence": "Perspectivas divergentes preservadas"
    },
    {
      "id": "third-party-blocked",
      "passed": true,
      "evidence": "Informação de terceiro bloqueada"
    },
    {
      "id": "screening-process",
      "passed": true,
      "evidence": "Rastreamento representado como processo"
    },
    {
      "id": "pending-destinations",
      "passed": true,
      "evidence": "Todas as pendências possuem destino explícito"
    },
    {
      "id": "snapshot-immutable",
      "passed": true,
      "evidence": "Adendo não altera snapshot"
    },
    {
      "id": "incident-drills",
      "passed": true,
      "evidence": "Incidentes possuem resultado seguro esperado"
    }
  ],
  "passed": 13,
  "failed": 0,
  "semesterChecksum": "560ab500d09470bc6a497bbeecc197a4f616dec43350c847e3e61cb508baeca8",
  "report": "PILOTO SINTÉTICO INTEGRAL\nSemestre: SEM-2026-2\nFamílias: Horizonte, Travessia\nChecks: 13/13\nChecksum: 560ab500d09470bc6a497bbeecc197a4f616dec43350c847e3e61cb508baeca8\n\nPASS | synthetic-marker | Conjunto explicitamente sintético\nPASS | expected-not-limit | Duas famílias esperadas sem limite rígido\nPASS | longitudinal-encounters | Cada família possui dois encontros\nPASS | unknown-medication | Medicamento parcialmente identificado preservado\nPASS | no-dose | Nenhuma posologia publicada\nPASS | exam-unit-guard | Exame sem unidade não interpretado\nPASS | multiple-households | Adolescente em dois domicílios\nPASS | perspectives | Perspectivas divergentes preservadas\nPASS | third-party-blocked | Informação de terceiro bloqueada\nPASS | screening-process | Rastreamento representado como processo\nPASS | pending-destinations | Todas as pendências possuem destino explícito\nPASS | snapshot-immutable | Adendo não altera snapshot\nPASS | incident-drills | Incidentes possuem resultado seguro esperado"
}

``

# END FILE: docs/release/WAVE_D_RESULT.json

---

# FILE: docs/RISKS.md

``markdown
# Registro de Riscos

## R-001: Escopo excessivo

**Impacto:** alto.  
**Mitigação:** seis marcos incrementais e cinco condições clínicas piloto.

## R-002: Conteúdo clínico desatualizado

**Impacto:** alto.  
**Mitigação:** versão, data, estados editoriais, divergências e revisão periódica.

## R-003: Erro farmacológico

**Impacto:** alto.  
**Mitigação:** auditoria obrigatória, contexto de indicação e travas estruturais.

## R-004: Falsa segurança em interações

**Impacto:** alto.  
**Mitigação:** escopo declarado e aviso de que ausência de alerta não exclui interação.

## R-005: Perda de dados locais

**Impacto:** alto.  
**Mitigação:** persistência solicitada, confirmação, backup, manifesto e teste de restauração.

## R-006: Vazamento no modo acompanhamento

**Impacto:** alto.  
**Mitigação:** isolamento, autenticação, políticas por categoria e testes end-to-end.

## R-007: Reidentificação em prompts

**Impacto:** alto.  
**Mitigação:** minimização, desidentificação por destino, detecção e revisão manual.

## R-008: Burocracia

**Impacto:** médio-alto.  
**Mitigação:** captura mínima, políticas padrão, texto livre, aprofundamento progressivo.

## R-009: Dívida de registros incompletos

**Impacto:** médio.  
**Mitigação:** distinguir registro breve suficiente de pendência estrutural.

## R-010: Mudança de origem web

**Impacto:** alto.  
**Mitigação:** domínio estável e proibição de dados reais em preview.

## R-011: Marca genérica

**Impacto:** médio.  
**Mitigação:** pesquisa posterior e identidade visual distintiva.

## R-012: Recusa ou substituição familiar

**Impacto:** operacional.  
**Mitigação:** quantidade esperada não limitante, vínculo família-semestre encerrável e substituição sem apagar histórico.

``

# END FILE: docs/RISKS.md

---

# FILE: docs/ROADMAP.md

``markdown
# Roadmap de Produção

## Marco 0: repositório e documentação viva

- criar projeto;
- incorporar este pacote em `/docs`;
- configurar decisões e changelog;
- definir padrões de código e testes;
- criar dados sintéticos.

## Marco 1: fundação local-first

- PWA;
- IndexedDB;
- bloqueio;
- autosave;
- integridade;
- backup e restauração;
- modo demonstração;
- domínio de produção planejado.

## Marco 2: pessoas, famílias e encontros

- pessoas;
- famílias;
- participações;
- domicílios;
- encontros;
- texto livre;
- pendências;
- timeline;
- Jornada básica.

## Marco 3: cuidado longitudinal e compartilhamento

- condições;
- medicamentos da pessoa;
- exames;
- rastreamentos;
- planos;
- modo acompanhamento;
- sugestões;
- passagem;
- transcrição.

## Marco 4: biblioteca clínica piloto

- cinco DCNTs;
- exames relacionados;
- farmacologia contextual;
- MIPs selecionados;
- fontes;
- versionamento;
- linguagem compartilhável.

## Marco 5: relações

- genograma em camadas;
- ecomapa automático;
- perspectivas;
- narrativa;
- prompt para IA;
- exportação visual.

## Marco 6: Jornada completa

- duas famílias esperadas sem limite técnico;
- visita longitudinal;
- reflexões;
- competências;
- feedbacks;
- encerramento;
- snapshot;
- adendos;
- relatório.

## Marco 7: auditoria pré-uso real

- segurança;
- privacidade;
- acessibilidade;
- persistência;
- restauração;
- revisão clínica;
- revisão farmacológica;
- gates institucionais.

``

# END FILE: docs/ROADMAP.md

---

# FILE: docs/SCOPE.md

``markdown
# Escopo

## Incluído na primeira linha de produção

### Fundação

- PWA instalável;
- operação offline;
- IndexedDB;
- confirmação de salvamento;
- bloqueio local;
- backup, validação e restauração;
- domínio de produção estável;
- modo demonstração com dados sintéticos.

### Clínica

- busca universal;
- cinco condições piloto: hipertensão, diabetes tipo 2, doença renal crônica, dislipidemia e obesidade;
- exames e medidas relacionados;
- tendências longitudinais;
- conteúdo versionado;
- farmacologia contextual dos medicamentos cobertos;
- MIPs selecionados por relevância prática;
- fontes e divergências.

### Cuidado longitudinal

- pessoas;
- famílias;
- múltiplos domicílios;
- encontros;
- condições relatadas e confirmadas;
- medicamentos reais, inclusive desconhecidos ou parcialmente identificados;
- resultados;
- rastreamentos;
- planos e pendências;
- timeline.

### Abordagem familiar

- composição;
- papéis;
- genograma em camadas;
- ecomapa automático e editável;
- perspectivas divergentes;
- instrumentos familiares selecionados após verificação de direitos e validação.

### Compartilhamento

- resumo de acompanhamento;
- modo acompanhamento isolado;
- sugestões de correção da pessoa;
- passagem para preceptoria em três extensões;
- modo transcrição.

### Jornada

- semestre ativo;
- quantidade esperada de famílias configurável e não limitante;
- visão longitudinal das famílias;
- atividades, feedbacks e reflexões;
- encerramento por etapas;
- snapshot e adendos.

### IA externa

- preparação de prompts;
- desidentificação por finalidade;
- manifesto de entidades e vínculos em diagramas;
- cópia manual;
- nenhuma reimportação automática como fato.

## Fora da primeira versão

- contas e login remoto;
- sincronização em nuvem;
- colaboração em tempo real;
- acesso remoto do paciente;
- API de IA;
- integração com prontuário oficial;
- OCR de exames;
- importação automática de laboratório;
- checador universal de interações;
- todas as DCNTs brasileiras;
- compartilhamento por link;
- prescrição ou diagnóstico automatizado;
- notificações clínicas complexas.

## Limites conceituais

O Mapa é ferramenta pessoal de apoio ao estudo, à organização e à comunicação supervisionada. Não substitui julgamento clínico, preceptoria, protocolos locais, prontuário oficial, receitas, laudos ou avaliação individual.

``

# END FILE: docs/SCOPE.md

---

# FILE: docs/STATE_MACHINES.md

``markdown
# Máquinas de Estado

## Semestre

```text
planejado -> ativo -> em revisão -> pronto para encerramento -> encerrado -> arquivado
```

Semestre encerrado aceita somente adendos. Reabertura exige decisão explícita e registro.

## Família no acompanhamento

```text
em cadastro -> ativa -> acompanhamento pontual | longitudinal
-> temporariamente inativa -> encerrada -> arquivada
```

Família pode ser substituída no semestre sem ser apagada. A quantidade esperada de famílias não limita novos vínculos.

## Rastreamento

```text
não avaliado
-> elegibilidade em avaliação
-> não indicado | contraindicado | indicação incerta | indicado
-> conversado
-> aceito | não aceito neste momento | recusado | adiado | decisão pendente
-> solicitado
-> agendado
-> realizado | realização relatada
-> resultado pendente | resultado disponível | documento ausente | inconclusivo
-> interpretado
-> conduta definida
-> acompanhamento | revisão futura | concluído
```

## Medicamento da pessoa

```text
relatado -> parcialmente identificado -> confirmado
-> em uso regular | uso divergente | uso irregular
-> suspenso | substituído | descontinuado | histórico
```

Motivos são registrados separadamente.

## Item do plano

```text
proposto -> discutido -> pactuado -> em andamento
-> concluído | parcialmente concluído | adiado | recusado
| inviável | cancelado | substituído
```

## Pendência

```text
aberta -> em revisão -> aguardando pessoa | documento | equipe | preceptoria
-> concluída | não concluída | continuidade recomendada
| continuidade confirmada | informação não recuperável
| deixou de ser pertinente | incorporada a outra pendência
```

## Compartilhamento

```text
privado -> revisar -> aprovado para compartilhamento
-> compartilhado -> retirado do compartilhamento
```

Informação de terceiro e conteúdo bloqueado não avançam sem justificativa explícita.

## Conteúdo clínico

```text
não pesquisado -> em pesquisa -> fonte localizada -> extraído
-> verificado -> revisão cruzada -> aprovado -> publicado
-> revisão necessária | desatualizado | retirado
```

## Sugestão da pessoa

```text
recebida -> revisada -> incorporada | não incorporada | esclarecida
```

## Aplicação individual de instrumento

```text
rascunho -> em revisão -> concluída -> retificada | arquivada
rascunho -> arquivada
em revisão -> rascunho
retificada -> arquivada
```

Conclusão exige validação das respostas aplicáveis. Aplicações concluídas não são sobrescritas nem retornam a rascunho; a retificação preserva o original e cria uma nova revisão.

Na interface, `in-review` pode voltar a `draft` para correção antes da conclusão. A visão geral da família não expõe respostas, medidas, condições ou notas; esses dados só aparecem após seleção explícita da pessoa.

``

# END FILE: docs/STATE_MACHINES.md

---

# FILE: docs/TEST_PLAN.md

``markdown
# Plano de Testes

## Estratégia

- testes unitários para regras puras;
- testes de contrato para conteúdos estruturados;
- testes de integração para IndexedDB;
- testes end-to-end mobile;
- testes de migração;
- testes de recuperação;
- testes de acessibilidade;
- testes clínicos com casos sintéticos;
- revisão manual de privacidade.

## Cenários prioritários

### Persistência

- fechar durante edição;
- armazenamento persistente negado;
- banco próximo do limite;
- atualização com rascunho aberto;
- duas abas;
- backup corrompido;
- restauração de versão antiga.

### Clínica

- resultado normal isolado;
- alteração discreta;
- mudança relativa relevante;
- unidade ausente;
- método incompatível;
- diretriz atualizada;
- população não coberta;
- dados insuficientes.

### Instrumento ESF

- completude de perguntas, opções, IDs, dependências e proveniência;
- isolamento de aplicações por pessoa dentro do contexto familiar;
- condicionais com estado não aplicável;
- idade, IMC, média de pressão e circunferência local;
- classificações manuais sem cálculo automático;
- propostas de família/ecomapa sem atualização automática;
- políticas conservadoras para projeção clínica, da pessoa e familiar.
- interface de avaliações dentro da família;
- troca de integrante sem vazamento de respostas;
- renderer derivado da definição, blocos ausentes e condicionais;
- retomada de rascunho, revisão, conclusão e retificação pela interface.
- renderização dedicada dos tipos de resposta usados pelo instrumento, incluindo pressão por visita e medidas de cintura;
- respostas condicionais preservadas como não aplicáveis, progresso por bloco e revisão estrutural;
- estados salvo/alterado/salvando/erro, confirmação de saída, acessibilidade estrutural e demonstração pela interface;
- roteiro manual responsivo em desktop, tablet e celular: verificar ausência de overflow horizontal, PA legível, opções longas quebrando linha, histórico em uma coluna e revisão estrutural utilizável.
- roteiro obrigatório da interface de avaliações:
  - desktop (>= 1024px): selecionar pessoa, abrir histórico, alternar blocos, revisar PA e exame dos pés, abrir revisão estrutural e provocar o diálogo de alterações não salvas; confirmar ausência de overflow;
  - tablet (768–1023px): repetir o fluxo verificando quebra de opções longas, histórico e cards de bloco sem sobreposição;
  - celular (< 768px): repetir o fluxo verificando uma coluna, PA e exame dos pés legíveis, diálogo acessível, revisão estrutural rolável e ausência de overflow horizontal.
- criação e persistência de aplicações por pessoa;
- isolamento entre pessoas da mesma família;
- respostas tipadas, estados e bloqueio de sobrescrita;
- retificação imutável e longitudinalidade;
- migração idempotente e checksums de aplicações no backup;
- aplicações sintéticas identificáveis e excluídas do backup normal.

### Farmacologia

- medicamento desconhecido;
- associação contendo princípio já usado;
- dose com unidade errada;
- apresentação incompatível;
- função renal desconhecida;
- interação curada;
- ausência de cobertura.

### Família

- pessoa em duas famílias;
- dois domicílios;
- cuidador não consanguíneo;
- vínculo rompido;
- perspectiva divergente;
- informação de terceiro;
- adolescente;
- família substituída no semestre.

### Compartilhamento

- voltar por gesto;
- alternar aplicativo;
- inatividade;
- sugestão da pessoa;
- item retirado do compartilhamento;
- conteúdo interpretativo pendente.

## Acessibilidade

- leitor de tela;
- fonte ampliada;
- alto contraste;
- redução de movimento;
- navegação sem gestos;
- descrição textual de diagramas;
- uso com uma mão.

``

# END FILE: docs/TEST_PLAN.md

---

# FILE: docs/UX_FLOWS.md

``markdown
# Fluxos de Experiência

## Navegação principal

- Início;
- Clínica;
- Cuidado;
- Jornada;
- Mais.

## Ritmos

### Relâmpago

Registro mínimo durante a interação.

### Operacional

Revisão de resultados, medicamentos, planos e pendências.

### Aprofundado

Estudo, fontes, abordagem familiar, relatório e reflexão.

## Encontro rápido

1. selecionar pessoa ou família;
2. selecionar tipo ou assunto;
3. registrar texto breve;
4. adicionar blocos somente se necessários;
5. registrar próximo passo;
6. salvar e confirmar.

## Revisar depois

Recebe apenas pendências estruturais reais, não todo registro curto.

Tipos:

- completar registro;
- confirmar com pessoa;
- verificar documento;
- discutir com preceptoria;
- observar longitudinalmente;
- estudar;
- ação da equipe;
- sem resolução atual.

## Mapa da Pessoa

- Agora;
- Trajetória;
- Condições e cuidado;
- Medicamentos;
- Rastreamentos;
- Resumo de acompanhamento.

## Mapa da Família

- visão geral;
- membros;
- relações;
- planos;
- Avaliações;
- timeline;
- resumo familiar.

### Avaliações na família

Avaliações permanecem no contexto da família, mas cada ficha pertence a uma pessoa selecionada explicitamente. A visão familiar mostra apenas status, datas e quantidade de aplicações. A ficha individual permite iniciar ou retomar rascunho, revisar, concluir, arquivar e iniciar retificação sem alterar o original. O formulário é derivado da definição versionada do instrumento; blocos sem fonte aparecem como indisponíveis, sem perguntas inventadas.

Durante a edição, o estado é explicitamente salvo, alterado, salvando ou com erro. A troca de pessoa, aplicação ou fechamento do editor exige uma escolha quando há alterações pendentes. O progresso é apresentado por bloco, distinguindo campos não iniciados, em andamento, estruturalmente completos, em revisão, não aplicáveis e fonte ausente. A revisão estrutural lista respostas, medidas, datas, cálculos, classificações manuais, dados ausentes e perguntas não aplicáveis sem produzir narrativa clínica.

Perguntas com revisão manual de aplicabilidade exibem a regra de origem e permitem override somente com justificativa breve. O override pode ser removido para retornar à regra automática; a resposta anterior permanece preservada, mas fica inativa quando marcada como não aplicável. Antes de qualquer saída, arquivamento, troca de pessoa ou abertura de outra aplicação, a interface oferece salvar, continuar editando ou descartar apenas a edição local.

## Modo acompanhamento

1. selecionar itens;
2. revisar conteúdo;
3. autenticar;
4. apresentar em tela isolada;
5. receber sugestões da pessoa;
6. sair com autenticação;
7. revisar sugestões.

## Passagem à preceptoria

Rascunhos de 30 segundos, 2 minutos e versão completa. Sempre separar:

- fatos;
- relatos;
- interpretações;
- conduta realizada;
- dúvidas.

## Visitar semestre

A página principal mostra as trajetórias das famílias previstas, mas aceita substituições e famílias adicionais. O foco é longitudinal, não estatístico.

## Animações

Somente funcionais: navegação, expansão, salvamento, diagramas, resumo e encerramento. Sem movimentos decorativos contínuos.

``

# END FILE: docs/UX_FLOWS.md

---

# FILE: docs/VISION.md

``markdown
# Visão do Produto

## Problema

Na APS, informações clínicas, práticas familiares, exames, medicamentos, rastreamentos e aprendizados acadêmicos costumam ficar dispersos. Sistemas eletrônicos frequentemente priorizam exigências administrativas em detrimento de velocidade, raciocínio e compreensão do paciente.

## Visão

O **Mapa** será um guia clínico e familiar de bolso que organiza o cuidado longitudinal sem substituir o prontuário institucional. Ele deverá tornar visíveis as relações entre pessoa, família, território, doença, medicamento, exame, rastreamento e plano de cuidado.

## Proposta de valor

- consulta clínica rápida durante a UBS;
- profundidade disponível fora do encontro;
- registro mínimo imediato e aprofundamento progressivo;
- visão profissional e resumo compartilhável derivados da mesma fonte de dados;
- acompanhamento de poucas famílias com alta profundidade temporal;
- suporte à reflexão acadêmica e à passagem para preceptoria;
- IA acessível sem APIs, transmissão automática ou dependência de fornecedor.

## Personalidade

- clínica;
- humana;
- precisa;
- silenciosa;
- sofisticada sem ostentação;
- acolhedora sem infantilização;
- brasileira sem clichês visuais do SUS.

## Critérios de excelência

O produto terá sucesso quando o usuário puder:

1. localizar uma condição, exame ou medicamento em poucos segundos;
2. registrar um encontro breve sem abandonar a conversa com a pessoa;
3. distinguir fato, relato, hipótese e interpretação;
4. compreender o que mudou em exames seriados;
5. preparar uma passagem clara para a preceptora;
6. mostrar um resumo seguro e compreensível à pessoa;
7. visitar as duas famílias do semestre e recuperar sua trajetória;
8. gerar ecomapa local e prompt externo sem expor identificadores;
9. encerrar o semestre preservando processos inconclusos;
10. restaurar integralmente os dados a partir de backup validado.

``

# END FILE: docs/VISION.md

---

# FILE: eslint.config.mjs

``javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([".next/**", "coverage/**", "dist/**"]),
]);

``

# END FILE: eslint.config.mjs

---

# FILE: next.config.ts

``typescript
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default config;

``

# END FILE: next.config.ts

---

# FILE: next-env.d.ts

``typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";
import "./.next/dev/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

``

# END FILE: next-env.d.ts

---

# FILE: package.json

``json
{
  "name": "mapa-clinica-familia-territorio",
  "version": "0.7.0-rc.0",
  "private": true,
  "description": "Mapa: clínica, família e território",
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=11.0.0"
  },
  "packageManager": "npm@11.19.1",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --quiet --ignore-pattern dist-production --rule react-hooks/set-state-in-effect:off",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "verify:docs": "node scripts/verify-docs.mjs",
    "verify:synthetic": "node scripts/verify-synthetic-data.mjs",
    "verify": "npm run verify:docs && npm run verify:synthetic && npm run verify:marco1 && npm run verify:marco2 && npm run verify:marco3 && npm run verify:marco4 && npm run verify:marco5 && npm run verify:marco6 && npm run verify:marco7 && npm run audit:static && npm run typecheck && npm run lint && npm run test",
    "verify:marco1": "node scripts/verify-marco1.mjs",
    "verify:marco2": "node scripts/verify-marco2.mjs",
    "verify:marco3": "node scripts/verify-marco3.mjs",
    "verify:marco4": "node scripts/verify-marco4.mjs",
    "verify:marco5": "node scripts/verify-marco5.mjs",
    "verify:marco6": "node scripts/verify-marco6.mjs",
    "verify:marco7": "node scripts/verify-marco7.mjs",
    "audit:static": "node scripts/audit-static.mjs",
    "test:audit-static": "node scripts/audit-static-self-test.mjs",
    "audit:release": "node scripts/release-gate.mjs",
    "audit:internal": "bash scripts/internal-validate.sh",
    "audit:wave-b": "bun scripts/wave-b-adversarial.ts && node scripts/accessibility-static.mjs && bash scripts/internal-validate.sh",
    "audit:wave-c": "bun scripts/generate-clinical-review.ts && bun scripts/wave-c-audit.ts && bash scripts/internal-validate.sh",
    "audit:wave-d": "bun scripts/wave-d-pilot.ts && bun scripts/wave-d-release-council.ts && bun scripts/wave-c-audit.ts && bun scripts/wave-b-adversarial.ts && node scripts/accessibility-static.mjs && bash scripts/internal-validate.sh"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "jsdom": "^27.0.0",
    "typescript": "^5.8.0",
    "vite-tsconfig-paths": "^5.0.0",
    "vitest": "^3.0.0"
  }
}

``

# END FILE: package.json

---

# FILE: public/sw.js

``javascript
const CACHE = "mapa-shell-v1";
const CORE = ["/", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => (await caches.match(event.request)) || caches.match("/offline")),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && ["script", "style", "image", "font"].includes(event.request.destination)) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return response;
    })),
  );
});

``

# END FILE: public/sw.js

---

# FILE: README.md

``markdown
# Mapa

**Clínica, família e território**

Aplicativo local de apoio ao estudo, à organização longitudinal do cuidado familiar e à comunicação clínica supervisionada na Atenção Primária à Saúde.

> O Mapa é uma ferramenta acadêmica e pessoal. Não substitui prontuário institucional, julgamento clínico, protocolos locais, prescrição profissional, receitas ou laudos.

## Estado atual

- Versão: `1.0.4`
- Escopo: uso acadêmico local e demonstração supervisionada
- Decisão operacional: `GO LOCAL`
- Build de produção: aprovado
- Biblioteca clínica: implementada
- Caderno farmacológico autoral: implementado e pesquisável
- Catálogo farmacológico: preenchido e mantido pelo autor do projeto
- Persistência local: implementada
- Backup protegido: implementado com AES-GCM
- Dados sintéticos: disponíveis para demonstração e testes
- Dados reais: condicionados às regras da instituição, do serviço e do prontuário oficial

## Principais recursos

- acompanhamento longitudinal por semestre;
- organização de famílias, pessoas, encontros e pendências;
- Jornada acadêmica com reflexões, competências e feedbacks;
- genograma e ecomapa com representação estruturada;
- biblioteca clínica com condições, exames e fontes;
- caderno farmacológico autoral separado por indicação, população, via e apresentação;
- busca por medicamento, classe terapêutica e nome comercial;
- perfis farmacológicos com campos para início, titulação, dose usual, alvo, teto, duração e ajustes orgânicos;
- bloqueio local por PIN e proteção por inatividade;
- persistência no navegador e solicitação de armazenamento persistente;
- exportação, backup protegido, checksums e restauração atômica;
- auditoria local de prontidão operacional;
- aplicação responsiva e instalável como PWA.

## Requisitos

- Node.js 22 ou superior
- npm 11 ou superior

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Verificação e build

```bash
npm run lint
npm run typecheck
npm run test
npm run verify
npm run build
```

## Execução em produção local

Depois de concluir o build:

```bash
npm run start
```

Abra:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
app/                                  App Router, interface e componentes
src/audit/                            Gates e prontidão operacional
src/backup/                           Exportação, proteção e restauração
src/clinical/                         Biblioteca clínica e fontes
src/clinical/pharmacology/            Caderno farmacológico autoral
src/contracts/                        Contratos TypeScript do domínio
src/data/synthetic/                   Cenários e famílias sintéticas
src/domain/                           Regras de domínio e diagramas
src/security/                         PIN, codificação e utilidades de segurança
src/storage/                          Persistência local, schema e checksums
tests/                                Testes unitários e de contrato
docs/                                 Memória canônica, decisões e documentação
scripts/                              Verificações e auditorias do repositório
.github/workflows/                    Integração contínua
```

## Caderno farmacológico autoral

O catálogo farmacológico utilizado pela interface está em:

```text
src/clinical/pharmacology/catalog.ts
```

Os arquivos relacionados são:

```text
src/clinical/pharmacology/types.ts       Contratos TypeScript
src/clinical/pharmacology/catalog.ts     Catálogo exibido no aplicativo
src/clinical/pharmacology/example.ts     Molde estrutural não exibido
src/clinical/pharmacology/validation.ts  Validação das fichas
src/clinical/pharmacology/README.md      Instruções específicas
```

Estados editoriais aceitos:

```text
draft
checked-source
checked-preceptor
reviewed
archived
```

Após modificar o catálogo, execute:

```bash
npm run verify
npm run build
```

## Regra documental

Antes de uma mudança arquitetural:

1. ler `docs/PROJECT_STATE.md`;
2. consultar `docs/DECISIONS.md`;
3. criar ou atualizar um ADR em `docs/adr/`;
4. registrar a mudança em `docs/CHANGELOG.md`;
5. atualizar critérios, contratos e testes afetados.

## Segurança e privacidade

- mantenha o dispositivo protegido por senha, PIN ou biometria;
- utilize o bloqueio local do Mapa;
- gere backups protegidos regularmente;
- não publique bancos locais, backups ou dados identificáveis no GitHub;
- não registre dados pessoais em issues, logs, fixtures ou testes;
- não use previews públicos para informações identificáveis;
- respeite as regras da instituição, da preceptoria, da unidade de saúde e do prontuário oficial;
- trate o Mapa como ferramenta complementar, não como substituto do sistema institucional.

Consulte também:

```text
SECURITY.md
docs/PRIVACY_MODEL.md
docs/release/GO_LOCAL.md
docs/release/PHARMACOLOGY_AUTHORING.md
```

## Dados sintéticos

Os cenários sintéticos existem para:

- demonstração;
- regressão;
- desenvolvimento;
- validação de fluxos;
- testes de backup e restauração;
- testes dos diagramas familiares.

Dados sintéticos não devem ser confundidos com registros reais.

## Integração contínua

O workflow localizado em:

```text
.github/workflows/ci.yml
```

pode executar verificações automatizadas do repositório no GitHub Actions.

## Status resumido

```text
Instalação:              aprovada
TypeScript:              aprovado
Lint:                    aprovado
Testes:                  aprovados
Build de produção:       aprovado
Execução local:          aprovada
Persistência:            implementada
Backup protegido:        implementado
Piloto sintético:        aprovado
Uso acadêmico local:     GO
```

## Licença e autoria

Projeto acadêmico autoral. A definição de licença, distribuição e colaboração deve ser feita explicitamente antes de reutilização por terceiros.

``

# END FILE: README.md

---

# FILE: README_VSCODE.md

``markdown
# Mapa no VS Code

## Abrir e rodar o código-fonte

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Executar o build Next.js na sua máquina

```bash
npm run verify
npm run build
npm run start
```

## Abrir o build de produção já incluído

```bash
python -m http.server 4173 -d dist-production
```

Abra `http://localhost:4173`. Não abra `index.html` diretamente, pois IndexedDB, Service Worker e CSP exigem origem HTTP.

## Comandos de auditoria

```bash
npm run audit:internal
npm run audit:wave-b
npm run audit:wave-c
npm run audit:wave-d
```

## Estado

O build estático de produção foi minificado e empacotado com React/ReactDOM, contendo 53 módulos. O pipeline Next.js oficial deve ser reexecutado depois de `npm install`, porque o ambiente que produziu este pacote não possuía acesso ao registro npm.

## Correcoes de runtime local

Esta entrega inclui CSP condicional para desenvolvimento e `suppressHydrationWarning` no `body` para atributos injetados por extensoes. Depois de extrair em uma pasta nova:

```bash
npm install
npm run dev
```

Se estiver substituindo uma copia anterior, remova a pasta `.next` antes de iniciar.

``

# END FILE: README_VSCODE.md

---

