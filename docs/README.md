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
