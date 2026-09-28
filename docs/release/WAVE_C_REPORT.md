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
