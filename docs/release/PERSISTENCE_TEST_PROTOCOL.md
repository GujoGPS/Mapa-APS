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
