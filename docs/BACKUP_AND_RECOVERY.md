# Backup e Recuperação

## Persistência operacional

O app informará:

- gravação confirmada;
- armazenamento persistente concedido ou não;
- data do último backup;
- integridade do banco;
- falhas de salvamento.

Não prometerá permanência absoluta.

## Escopo do backup e demonstração

- o backup normal exclui registros marcados como `synthetic-demo` e a sessão de demonstração;
- incluir dados sintéticos exige marcação explícita na interface;
- fatos derivados (`care-fact`) entram no backup normal quando a aplicação é normal, porque são
  parte do registro longitudinal da pessoa;
- fatos sem `dataOrigin` em backup antigo migram para `normal`; a migração não infere origem sintética;
- ao sair da demonstração, o snapshot do estado normal substitui o espaço ativo.

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
