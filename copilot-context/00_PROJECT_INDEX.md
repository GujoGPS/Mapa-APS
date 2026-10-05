# Mapa APS: indice integral do snapshot

## Decisao canonica obrigatoria

O instrumento adult-dcnt-esf esta completo.

A numeracao original e deliberadamente descontinua:

- Bloco 1
- Bloco 2
- Bloco 6
- Bloco 7
- Bloco 8

Nao existem Blocos 3, 4 ou 5 pendentes.

O Bloco 8 representa genograma, ecomapa e observacoes clinicas.

## Pacotes

- CONTEXT_01.md: 27 arquivos
- CONTEXT_02.md: 80 arquivos
- CONTEXT_03.md: 36 arquivos
- CONTEXT_04.md: 25 arquivos
- CONTEXT_05.md: 53 arquivos

## Arquivos por pacote

### CONTEXT_01.md

- .github/pull_request_template.md
- .github/workflows/ci.yml
- .vscode/extensions.json
- .vscode/tasks.json
- app/client-bootstrap.tsx
- app/clinical-library.tsx
- app/demo-mode-panel.tsx
- app/family-assessments.tsx
- app/family-relations.tsx
- app/journey-dashboard.tsx
- app/layout.tsx
- app/manifest.ts
- app/offline/page.tsx
- app/page.tsx
- app/person-care-panel.tsx
- app/release-audit.tsx
- app/security-gate.tsx
- app/storage-dashboard.tsx
- app/styles.css
- app/workspace.tsx
- CONTRIBUTING.md
- docs/ACCEPTANCE_CRITERIA.md
- docs/adr/0001-local-first-sem-nuvem-na-v1.md
- docs/adr/0002-familias-esperadas-nao-limitadas.md
- docs/adr/0003-indexeddb-nativo-no-marco-1.md
- docs/adr/0004-pin-bloqueio-backup-cifrado.md
- docs/adr/0005-service-worker-conservador.md

### CONTEXT_02.md

- docs/adr/0006-registros-genericos-com-contratos-de-dominio.md
- docs/adr/0007-encontro-modular-e-pendencia-explicita.md
- docs/adr/0008-politicas-de-compartilhamento-no-dado.md
- docs/adr/0009-resumo-derivado-nao-prontuario.md
- docs/adr/0010-biblioteca-clinica-versionada-em-codigo.md
- docs/adr/0011-doses-bloqueadas-ate-auditoria-de-produto.md
- docs/adr/0012-diagramas-derivados-de-semantica.md
- docs/adr/0013-perspectiva-obrigatoria-em-relacoes.md
- docs/adr/0014-prompt-de-diagrama-com-manifesto.md
- docs/adr/0015-snapshot-imutavel-e-adendos.md
- docs/adr/0016-inconclusao-com-destino-explicito.md
- docs/adr/0017-no-go-e-um-resultado-valido.md
- docs/adr/README.md
- docs/AI_EXPORTS.md
- docs/ARCHITECTURE.md
- docs/audit/ACCESSIBILITY_CHECKLIST.md
- docs/audit/AUDIT_REPORT.md
- docs/audit/DEVICE_TEST_MATRIX.md
- docs/audit/GATE_CLOSURE_PLAN.md
- docs/audit/INSTITUTIONAL_GATE.md
- docs/audit/RELEASE_DECISION.json
- docs/audit/SECURITY_CHECKLIST.md
- docs/BACKUP_AND_RECOVERY.md
- docs/CHANGELOG.md
- docs/CLINICAL_CONTENT_MODEL.md
- docs/CLINICAL_RESEARCH_LOG.md
- docs/CODING_STANDARDS.md
- docs/DATA_MODEL.md
- docs/DECISIONS.md
- docs/DEFINITION_OF_DONE.md
- docs/END_TO_END_SIMULATION.md
- docs/MANIFEST.json
- docs/OPEN_QUESTIONS.md
- docs/PHARMACOLOGY_GOVERNANCE.md
- docs/PRIVACY_MODEL.md
- docs/PROJECT_STATE.md
- docs/README.md
- docs/release/ACADEMIC_REVIEW_POLICY.md
- docs/release/BASELINE.md
- docs/release/BUILD_REPORT.md
- docs/release/CLINICAL_REVIEW_PROTOCOL.md
- docs/release/CLINICAL_REVIEW_STATUS.json
- docs/release/CRYPTO_DECISION_DRAFT.md
- docs/release/DEFECT_LOG.md
- docs/release/ENVIRONMENT.json
- docs/release/EVIDENCE_INDEX.md
- docs/release/FINAL_DELIVERY.json
- docs/release/GO_LOCAL.md
- docs/release/INSTITUTIONAL_MEETING_PACK.md
- docs/release/INTERNAL_VALIDATION.md
- docs/release/LOCAL_RUNTIME_FIX.md
- docs/release/PERSISTENCE_TEST_PROTOCOL.md
- docs/release/PHARMACOLOGY_AUTHORING.md
- docs/release/PHARMACOLOGY_DECISION.md
- docs/release/PRODUCTION_BUILD_REPORT.md
- docs/release/REVIEWER_NOMINATION.md
- docs/release/SOURCE_VERIFICATION.md
- docs/release/THREAT_MODEL_DRAFT.md
- docs/release/TYPESCRIPT_BUILD_FIX.md
- docs/release/WAVE_A_STATUS.md
- docs/release/WAVE_B_REPORT.md
- docs/release/WAVE_C_REPORT.md
- docs/release/WAVE_D_PILOT_REPORT.txt
- docs/release/WAVE_D_RELEASE_DECISION.json
- docs/release/WAVE_D_REPORT.md
- docs/release/WAVE_D_RESULT.json
- docs/RISKS.md
- docs/ROADMAP.md
- docs/SCOPE.md
- docs/STATE_MACHINES.md
- docs/TEST_PLAN.md
- docs/UX_FLOWS.md
- docs/VISION.md
- eslint.config.mjs
- next.config.ts
- next-env.d.ts
- package.json
- public/sw.js
- README.md
- README_VSCODE.md

### CONTEXT_03.md

- REPOSITORY_MANIFEST.json
- scripts/accessibility-static.mjs
- scripts/audit-static.mjs
- scripts/audit-static-paths.mjs
- scripts/audit-static-self-test.mjs
- scripts/generate-clinical-review.ts
- scripts/internal-validate.sh
- scripts/marco7-policy.mjs
- scripts/release-gate.mjs
- scripts/verify-docs.mjs
- scripts/verify-marco1.mjs
- scripts/verify-marco2.mjs
- scripts/verify-marco3.mjs
- scripts/verify-marco4.mjs
- scripts/verify-marco5.mjs
- scripts/verify-marco6.mjs
- scripts/verify-marco7.mjs
- scripts/verify-synthetic-data.mjs
- scripts/wave-b-adversarial.ts
- scripts/wave-c-audit.ts
- scripts/wave-d-pilot.ts
- scripts/wave-d-release-council.ts
- SECURITY.md
- src/audit/gates.ts
- src/audit/types.ts
- src/backup/adversarial.ts
- src/backup/crypto.ts
- src/backup/service.ts
- src/backup/types.ts
- src/clinical/assessments/application.ts
- src/clinical/assessments/calculations.ts
- src/clinical/assessments/facts.ts
- src/clinical/assessments/index.ts
- src/clinical/assessments/instruments/adult-dcnt-esf/definition.ts
- src/clinical/assessments/migration.ts
- src/clinical/assessments/README.md

### CONTEXT_04.md

- src/clinical/assessments/types.ts
- src/clinical/assessments/validation.ts
- src/clinical/content.ts
- src/clinical/pharmacology/catalog.ts
- src/clinical/pharmacology/example.ts
- src/clinical/pharmacology/README.md
- src/clinical/pharmacology/types.ts
- src/clinical/pharmacology/validation.ts
- src/clinical/review.ts
- src/clinical/sources.ts
- src/clinical/types.ts
- src/clinical/validation.ts
- src/contracts/care.ts
- src/contracts/clinical.ts
- src/contracts/core.ts
- src/contracts/demo.ts
- src/contracts/family.ts
- src/contracts/journey.ts
- src/contracts/longitudinal.ts
- src/contracts/relations.ts
- src/contracts/sharing.ts
- src/data/synthetic/README.md
- src/data/synthetic/semester-2026-2.json
- src/data/synthetic/wave-d-semester.json
- src/domain/care-selectors.ts

### CONTEXT_05.md

- src/domain/demo-mode.ts
- src/domain/demo-seed.ts
- src/domain/demo-session.ts
- src/domain/diagram-engine.ts
- src/domain/diagram-prompt.ts
- src/domain/entity.ts
- src/domain/entity-types.ts
- src/domain/factories.ts
- src/domain/journey-factories.ts
- src/domain/journey-report.ts
- src/domain/longitudinal-factories.ts
- src/domain/relation-factories.ts
- src/domain/repository.ts
- src/domain/selectors.ts
- src/domain/semester-close.ts
- src/domain/sharing-policy.ts
- src/domain/wave-d-simulation.ts
- src/hooks/use-mapa-data.ts
- src/lib/project-state.ts
- src/pwa/register.ts
- src/security/encoding.ts
- src/security/pin.ts
- src/storage/autosave.ts
- src/storage/hash.ts
- src/storage/idb.ts
- src/storage/multi-tab.ts
- src/storage/repository.ts
- src/storage/schema.ts
- src/storage/status.ts
- tests/adult-dcnt-esf-calculations.test.ts
- tests/adult-dcnt-esf-definition.test.ts
- tests/assessment-application.test.ts
- tests/backup-crypto.test.ts
- tests/demo-mode.test.ts
- tests/family-assessments.test.tsx
- tests/family-assessments-demo.test.tsx
- tests/hash.test.ts
- tests/marco2-factories.test.ts
- tests/marco2-selectors.test.ts
- tests/marco3-handoff.test.ts
- tests/marco3-sharing.test.ts
- tests/marco4-clinical.test.ts
- tests/marco5-diagrams.test.ts
- tests/marco6-journey.test.ts
- tests/marco7-gate.test.ts
- tests/pharmacology-catalog.test.ts
- tests/pin-policy.test.ts
- tests/project-state.test.ts
- tests/security-gate.test.tsx
- tests/setup.ts
- tests/synthetic-contract.test.ts
- tsconfig.json
- vitest.config.ts


