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
