# Mapa: Especificação Canônica

**Assinatura:** Clínica, família e território  
**Versão do aplicativo:** `0.7.0-rc.0`
**Data:** 05 de outubro de 2026
**Estado:** aplicativo implementado e verificado — 308 testes, typecheck, lint, build e `verify` aprovados.

> **Aviso de defasagem.** Este pacote foi escrito na fase de planejamento (28/09) e **não foi
> reescrito desde então**. `PROJECT_STATE.md`, `DECISIONS.md`, `DATA_MODEL.md` e o `CHANGELOG`
> estão atualizados; `ARCHITECTURE.md`, `PRIVACY_MODEL.md`, `ROADMAP.md` e
> `PHARMACOLOGY_GOVERNANCE.md` **descrevem um app que não existe mais** — são anteriores à ficha
> ESF, ao calendário de vacinação, à aba UBS, à identidade visual e à revisão de texto.
>
> Ao seguir a ordem de leitura abaixo, trate esses quatro como **histórico**, não como
> descrição do código atual. Para o estado real, comece pelo `README.md` da raiz.

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
