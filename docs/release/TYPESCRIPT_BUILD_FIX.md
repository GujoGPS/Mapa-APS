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
