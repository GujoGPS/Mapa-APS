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
