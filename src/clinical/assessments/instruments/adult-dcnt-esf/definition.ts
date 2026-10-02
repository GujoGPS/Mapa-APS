import type {
  InstrumentAmbiguity,
  InstrumentDefinition,
  OptionDefinition,
  QuestionDefinition,
  SectionDefinition,
  VisibilityMetadata,
} from "../../types";

const printed: VisibilityMetadata = {
  scope: "individual",
  clinicalVisibility: "academic-private",
  personVisibility: "shareable-with-person",
  familyVisibility: "non-exportable",
  reviewRequired: true,
  projectionStrategy: "clinical-academic",
};
const familyContext: VisibilityMetadata = {
  scope: "family-context",
  clinicalVisibility: "academic-private",
  personVisibility: "shareable-with-person",
  familyVisibility: "shareable-with-family",
  reviewRequired: true,
  projectionStrategy: "operational-family-status",
};
const administrative: VisibilityMetadata = {
  scope: "individual",
  clinicalVisibility: "administrative",
  personVisibility: "shareable-with-person",
  familyVisibility: "administrative",
  reviewRequired: true,
  projectionStrategy: "operational-family-status",
};

function options(values: Array<[string, string, string?]>): OptionDefinition[] {
  return values.map(([id, label, academicLabel], order) => ({
    id,
    label,
    value: id,
    order,
    ...(academicLabel ? { academicLabel } : {}),
  }));
}

function question(
  id: string,
  sectionId: string,
  printedLabel: string,
  answerType: QuestionDefinition["answerType"],
  configuration: Partial<QuestionDefinition> = {},
): QuestionDefinition {
  return {
    id,
    sectionId,
    printedLabel,
    academicLabel: printedLabel,
    personFriendlyLabel: printedLabel,
    answerType,
    required: false,
    options: [],
    visibility: printed,
    sensitivity: "clinical",
    provenance: { origin: "printed-local-form", sourceNote: "Instrumento local da ESF da preceptora; página 28." },
    ...configuration,
  };
}

const yesNo = options([["yes", "Sim"], ["no", "Não"]]);
const yesNoNeverRemember = options([
  ["yes", "Sim"],
  ["no", "Não"],
  ["never", "Nunca fez"],
  ["does-not-remember", "Não recorda"],
]);
const derivedFromBirthAndAssessment = {
  id: "derive-adult-age-band-v1",
  version: "1",
  inputs: ["header.birth-date", "header.assessment-date"],
  resultType: "calculated-information" as const,
  sourceType: "automatic" as const,
  origin: "mathematical-derivation" as const,
  automaticCalculation: true,
  requiresClinicalReview: false,
};

const headerQuestions: QuestionDefinition[] = [
  question("header.person-name", "header", "Nome da pessoa", "short-text", {
    visibility: { ...printed, personVisibility: "shareable-with-person" },
    sensitivity: "personal",
    provenance: { origin: "digital-adaptation", sourceNote: "Preenchimento futuro a partir do cadastro canônico da pessoa." },
    notes: "Não duplicar silenciosamente o cadastro canônico.",
  }),
  question("header.cpf", "header", "CPF", "short-text", {
    visibility: { ...printed, personVisibility: "non-exportable", familyVisibility: "non-exportable" },
    sensitivity: "identifier",
    notes: "Opcional até confirmação do fluxo; não usar em fixtures reais nem validar externamente.",
  }),
  question("header.birth-date", "header", "Data de nascimento", "date", {
    sensitivity: "personal",
    provenance: { origin: "digital-adaptation", sourceNote: "Proveniente futuramente do cadastro da pessoa; usada para derivar idade." },
  }),
  question("header.health-unit", "header", "Unidade de Saúde, UBS", "short-text", {
    visibility: familyContext,
    sensitivity: "ordinary",
    provenance: { origin: "printed-local-form", sourceNote: "Referência de cuidado do formulário local." },
    notes: "Não criar vínculo ativo automaticamente.",
  }),
  question("header.community-health-worker", "header", "TACS/ACS", "short-text", {
    visibility: familyContext,
    sensitivity: "ordinary",
    provenance: { origin: "printed-local-form", sourceNote: "Sigla preservada exatamente como aparece na ficha." },
  }),
  question("header.assessment-date", "header", "Data da avaliação", "date", {
    sensitivity: "ordinary",
    visibility: administrative,
    provenance: { origin: "digital-adaptation", sourceNote: "Uma data por aplicação; o papel exibe primeira e segunda avaliação." },
    notes: "Aplicações futuras não ficam limitadas a duas.",
  }),
];

const profileQuestions: QuestionDefinition[] = [
  question("sociodemographic.age", "sociodemographic-profile", "Idade", "calculated-information", {
    options: options([
      ["age-18-29", "18 a 29 anos"],
      ["age-30-44", "30 a 44 anos"],
      ["age-45-59", "45 a 59 anos"],
      ["age-60-79", "60 a 79 anos"],
      ["age-80-plus", "80 anos ou mais"],
    ]),
    derivation: derivedFromBirthAndAssessment,
    provenance: { origin: "mathematical-derivation", sourceNote: "Derivada da data de nascimento e da data da avaliação." },
    notes: "Abaixo de 18 anos retorna fora da população; não limita idades superiores.",
  }),
  question("sociodemographic.self-declared-race", "sociodemographic-profile", "Cor/Raça Autodeclarada", "single-choice", {
    options: options([
      ["white", "Branca"], ["black", "Preta"], ["brown", "Parda"], ["yellow", "Amarela"], ["indigenous", "Indígena"],
    ]),
    provenance: { origin: "printed-local-form", sourceNote: "Autodeclaração conforme formulário local." },
    sensitivity: "sensitive-personal",
  }),
  question("sociodemographic.marital-status", "sociodemographic-profile", "Estado Civil Atual", "single-choice", {
    options: options([
      ["single", "Solteiro(a)"], ["married-or-stable-union", "Casado(a) / União Estável"], ["divorced", "Divorciado(a)"],
      ["separated", "Separado(a)"], ["widowed", "Viúvo(a)"],
    ]),
    sensitivity: "personal",
  }),
  question("sociodemographic.education", "sociodemographic-profile", "Escolaridade", "single-choice", {
    options: options([
      ["illiterate", "Analfabeto"], ["elementary-incomplete", "Fundamental incompleto"], ["elementary-complete", "Fundamental completo"],
      ["secondary-incomplete", "Médio incompleto"], ["secondary-complete", "Médio completo"], ["higher-incomplete", "Superior incompleto"],
      ["higher-complete", "Superior completo"],
    ]),
    sensitivity: "personal",
  }),
  question("sociodemographic.current-occupation", "sociodemographic-profile", "Ocupação Atual", "multiple-choice", {
    options: options([
      ["retired", "Aposentado(a)"], ["unemployed", "Desempregado(a)"], ["self-employed", "Autônomo(a)"], ["student", "Estudante"],
      ["formally-employed", "Trabalhador com carteira"], ["informal-worker", "Informal"], ["homemaker", "Dono(a) de casa"], ["public-servant", "Servidor público"],
    ]),
    sensitivity: "personal",
    provenance: { origin: "pending-preceptor-validation", sourceNote: "Caixas de seleção da ficha; modelado provisoriamente como múltipla escolha." },
  }),
  question("sociodemographic.family-income-per-capita", "sociodemographic-profile", "Renda Familiar Per Capita", "single-choice", {
    options: options([
      ["below-quarter-minimum-wage", "Abaixo de 1/4 SM"], ["quarter-to-half-minimum-wage", "Entre 1/4 e 1/2 SM"],
      ["half-to-one-minimum-wage", "Entre 1/2 e 1 SM"], ["one-to-two-minimum-wages", "Entre 1 e 2 SM"],
      ["two-to-three-minimum-wages", "Entre 2 e 3 SM"], ["above-three-minimum-wages", "Acima de 3 SM"],
      ["prefers-not-to-answer", "Prefere não responder"],
    ]),
    visibility: familyContext,
    sensitivity: "sensitive-personal",
    provenance: { origin: "printed-local-form", sourceNote: "Ficha local; referência relativa ao salário mínimo de 2026." },
    notes: "Referência: BRL 1.621,00, ano 2026. Guardar ano e valor na aplicação futura; não calcular nesta fundação.",
  }),
];

const healthQuestions: QuestionDefinition[] = [
  question("health.diagnosed-chronic-conditions", "current-health-and-screenings", "Doenças Crônicas Diagnosticadas", "multiple-choice", {
    options: options([
      ["hypertension", "Hipertensão Arterial"], ["diabetes-mellitus", "Diabetes Mellitus"], ["thyroid-disease", "Doença da Tireoide"],
      ["psychiatric-disorders", "Doenças Psiquiátricas"], ["chronic-kidney-disease", "Doença Renal Crônica"], ["cancer", "Câncer"],
      ["heart-disease", "Doença Cardíaca (ex.: Insuficiência Cardíaca)"], ["asthma-or-chronic-pulmonary-disease", "Asma ou Doença Pulmonar Crônica (ex.: DPOC)"],
      ["neurological-or-neurodegenerative-disease", "Doenças Neurológicas/Neurodegenerativas"], ["traumatic-or-musculoskeletal-condition", "Traumatológicas (ex.: Artrose e Discopatia)"],
      ["rheumatic-or-autoimmune-disease", "Doença Reumática/Autoimune"], ["other", "Outra"],
    ]),
    notes: "Efeito futuro: proposal-only; não criar condição permanente automaticamente.",
  }),
  question("health.other-chronic-condition-description", "current-health-and-screenings", "Descrição de outra doença crônica", "long-text", {
    applicability: { condition: "health.diagnosed-chronic-conditions contains other", dependencies: ["health.diagnosed-chronic-conditions"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
    visibility: { ...printed, familyVisibility: "non-exportable" },
    provenance: { origin: "digital-adaptation", sourceNote: "Complemento digital necessário para a opção Outra." },
    notes: "Efeito futuro: proposal-only.",
  }),
  question("health.chronic-disease-follow-up-exams", "current-health-and-screenings", "Realizou exames de acompanhamento da doença crônica no último ano?", "yes-no", {
    options: yesNo,
    applicability: { condition: "health.diagnosed-chronic-conditions contains at least one option", dependencies: ["health.diagnosed-chronic-conditions"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
  }),
  question("health.hypertension-blood-pressure-follow-up", "current-health-and-screenings", "Se Hipertenso: teve a pressão arterial aferida nos últimos 6 meses?", "yes-no", {
    options: yesNo,
    applicability: { condition: "health.diagnosed-chronic-conditions contains hypertension", dependencies: ["health.diagnosed-chronic-conditions"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
  }),
  question("screening.cervical-preventive", "current-health-and-screenings", "MULHER 25-64 ANOS, Preventivo Colo do Útero", "yes-no-never-did-does-not-remember", {
    options: options([["less-than-one-year", "menos de 1 ano"], ["less-than-three-years", "há menos de 3 anos"], ["more-than-three-years", "mais de 3 anos"], ["never", "nunca fez"], ["does-not-remember", "não recorda"]]),
    applicability: { condition: "local suggestion: woman, 25-64 years; anatomy is not inferred automatically", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Regra de aplicabilidade local; não é recomendação universal." },
  }),
  question("screening.mammography", "current-health-and-screenings", "MULHER 40-69 ANOS, Mamografia", "yes-no-never-did-does-not-remember", {
    options: options([["less-than-one-year", "menos de 1 ano"], ["less-than-two-years", "há menos de 2 anos"], ["more-than-five-years", "mais de 5 anos"], ["never", "nunca fez"], ["does-not-remember", "não recorda"]]),
    applicability: { condition: "local suggestion: woman, 40-69 years; anatomy is not inferred automatically", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Regra de aplicabilidade local; não é recomendação universal." },
  }),
  question("screening.bone-densitometry", "current-health-and-screenings", "MULHER > 65 ANOS, Densitometria Óssea", "single-choice", {
    options: yesNoNeverRemember,
    applicability: { condition: "local suggestion: woman, over 65 years; anatomy is not inferred automatically", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Regra de aplicabilidade local; não é recomendação universal." },
  }),
  question("screening.colorectal-cancer", "current-health-and-screenings", "POPULAÇÃO > 50 ANOS, Câncer Colorretal, Fezes Ocultas / Colonoscopia", "single-choice", {
    options: yesNoNeverRemember,
    applicability: { condition: "local suggestion: population over 50 years", dependencies: [], whenNotApplicable: "manual-review", manualReviewAllowed: true },
    provenance: { origin: "printed-local-form", sourceNote: "Item reúne pesquisa de sangue oculto nas fezes e colonoscopia." },
    notes: "Não é diagnóstico; o método realizado permanece não especificado.",
  }),
];

const physicalQuestions: QuestionDefinition[] = [
  question("physical.weight", "physical-exam-and-clinical-parameters", "Peso", "measurement", { unit: "kg", validation: { rule: "finite and greater than zero", unit: "kg", finite: true, greaterThan: 0 } }),
  question("physical.height", "physical-exam-and-clinical-parameters", "Altura", "measurement", { unit: "m", validation: { rule: "finite and greater than zero", unit: "m", finite: true, greaterThan: 0 } }),
  question("physical.bmi", "physical-exam-and-clinical-parameters", "IMC", "calculated-information", {
    unit: "kg/m²",
    derivation: { id: "calculate-bmi-v1", version: "1", inputs: ["physical.weight", "physical.height"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false, algorithm: "weightKg / heightM²" },
    options: options([["underweight", "Magreza"], ["normal", "Normal"], ["overweight", "Sobrepeso"], ["obesity-i", "Obesidade I"], ["obesity-ii", "Obesidade II"], ["obesity-iii", "Obesidade III"]]),
  }),
  question("physical.waist-circumference", "physical-exam-and-clinical-parameters", "Circunferência Abdominal", "measurement", { unit: "cm", validation: { rule: "finite and greater than zero", unit: "cm", finite: true, greaterThan: 0 } }),
  question("physical.waist-classification", "physical-exam-and-clinical-parameters", "Classificação da circunferência abdominal", "calculated-information", {
    derivation: { id: "classify-waist-local-rule-v1", version: "1", inputs: ["physical.waist-circumference"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: true, algorithm: "criterion explicitly selected: male-local-rule or female-local-rule" },
    notes: "Sem critério selecionado, não classificar.",
  }),
  question("laboratory.hba1c.value", "physical-exam-and-clinical-parameters", "Diabetes Mellitus, Hemoglobina Glicada, HbA1c", "laboratory-result", { unit: "%", validation: { rule: "finite and greater than or equal to zero", unit: "%", finite: true, greaterThanOrEqual: 0 }, notes: "Sem interpretação, meta ou classificação automática." }),
  question("laboratory.hba1c.date", "physical-exam-and-clinical-parameters", "Data da HbA1c", "date", { provenance: { origin: "digital-adaptation", sourceNote: "Data necessária para tendência longitudinal futura; evitar duplicação com resultados existentes." } }),
  question("blood-pressure.visit-1.systolic", "physical-exam-and-clinical-parameters", "PA visita 1 — sistólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-1.diastolic", "physical-exam-and-clinical-parameters", "PA visita 1 — diastólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-1.date", "physical-exam-and-clinical-parameters", "PA visita 1 — data", "date"),
  question("blood-pressure.visit-2.systolic", "physical-exam-and-clinical-parameters", "PA visita 2 — sistólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-2.diastolic", "physical-exam-and-clinical-parameters", "PA visita 2 — diastólica", "blood-pressure", { unit: "mmHg", validation: { rule: "finite and greater than zero", unit: "mmHg", finite: true, greaterThan: 0 } }),
  question("blood-pressure.visit-2.date", "physical-exam-and-clinical-parameters", "PA visita 2 — data", "date"),
  question("blood-pressure.mean", "physical-exam-and-clinical-parameters", "Média das aferições de PA", "calculated-information", {
    unit: "mmHg",
    derivation: { id: "calculate-blood-pressure-mean-v1", version: "1", inputs: ["blood-pressure.visit-1.systolic", "blood-pressure.visit-1.diastolic", "blood-pressure.visit-2.systolic", "blood-pressure.visit-2.diastolic"], resultType: "calculated-information", sourceType: "automatic", origin: "mathematical-derivation", automaticCalculation: true, requiresClinicalReview: false },
    notes: "Indisponível sem as duas visitas completas; média interna não é arredondada.",
  }),
  question("blood-pressure.control", "physical-exam-and-clinical-parameters", "Controle da Pressão", "manual-classification", {
    options: options([["controlled", "PA Controlada"], ["uncontrolled", "PA Não Controlada"]]),
    provenance: { origin: "printed-local-form", sourceNote: "Classificação manual informada; limiar ausente na fonte." },
    notes: "sourceType: manual; automaticRuleAvailable: false; requiresClinicalReview: true.",
  }),
  question("cardiovascular-risk", "physical-exam-and-clinical-parameters", "Risco Cardiovascular", "manual-classification", {
    options: options([["low", "Baixo Risco CV"], ["intermediate", "Risco CV Intermediário"], ["high", "Alto Risco CV"], ["very-high", "Muito Alto Risco CV"]]),
    provenance: { origin: "printed-local-form", sourceNote: "Categorias informadas na ficha; algoritmo ausente." },
    notes: "Manual; automaticCalculation: false; requiresSourceBeforeAutomation: true.",
  }),
  question("foot.skin-and-deformity-findings", "foot-assessment", "Pele e Deformidades", "multiple-choice", {
    options: options([
      ["dry-skin-or-cracks", "Pele seca / rachaduras"], ["ingrown-or-improperly-cut-nails", "Unhas encravadas / mal cortadas"],
      ["interdigital-maceration-or-mycosis", "Maceração interdigital / micose"], ["warm-skin-erythema-or-edema", "Pele quente / Eritema / Edema"],
      ["cold-skin-cyanosis-or-pallor", "Pele fria / Cianose / Palidez"], ["calluses", "Calosidades"], ["claw-toes", "Dedos em garra"],
      ["bunion", "Joanete"], ["overlapping-toes", "Dedos cavalgados"], ["active-ulceration", "Ulceração ativa"],
    ]),
    notes: "Achados registrados, não diagnósticos derivados.",
  }),
  question("foot.neuropathy-screening", "foot-assessment", "Rastreio de Neuropatia", "single-choice", {
    options: options([["sensitive-throughout", "Sensível em toda a área"], ["one-or-more-insensitive-areas", "Uma ou mais áreas insensíveis"]]),
    notes: "Estados digitais adicionais: não avaliado e avaliação incompleta.",
  }),
  question("foot.right.dorsalis-pedis-pulse", "foot-assessment", "Pé direito — pulso pedioso", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
  question("foot.right.posterior-tibial-pulse", "foot-assessment", "Pé direito — pulso tibial posterior", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
  question("foot.left.dorsalis-pedis-pulse", "foot-assessment", "Pé esquerdo — pulso pedioso", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
  question("foot.left.posterior-tibial-pulse", "foot-assessment", "Pé esquerdo — pulso tibial posterior", "laterality-group", { options: options([["palpable", "palpável"], ["not-palpable", "não palpável"], ["not-assessed", "não avaliado"]]) }),
];

const summaryQuestions: QuestionDefinition[] = [
  question("summary.services", "global-summary-and-referrals", "Serviços relacionados ou encaminhamentos", "multiple-choice", {
    options: options([
      ["social-assistance-cras-creas", "Assistente Social, CRAS/CREAS"], ["psychology-or-mental-health", "Psicologia / Saúde Mental"],
      ["caps-psychosocial-care", "CAPS, Atenção Psicossocial"], ["physiotherapy-or-rehabilitation", "Fisioterapia / Reabilitação"],
      ["nutrition-or-food-care", "Nutrição / Alimentação"], ["focal-medical-specialist", "Médico Especialista Focal"],
      ["other-service", "Outro serviço"],
    ]),
    notes: "Cada opção é proposta de rede/encaminhamento, não vínculo ativo; não criar ecomapa automaticamente.",
  }),
  question("summary.other-service-description", "global-summary-and-referrals", "Descrição de outro serviço", "short-text", {
    applicability: { condition: "summary.services contains other-service", dependencies: ["summary.services"], whenNotApplicable: "not-applicable", manualReviewAllowed: true },
    provenance: { origin: "digital-adaptation", sourceNote: "Complemento para serviço não listado na fonte." },
  }),
  question("summary.ciap-2", "global-summary-and-referrals", "CIAP-2", "clinical-code", {
    visibility: { ...printed, personVisibility: "non-exportable", familyVisibility: "non-exportable" },
    provenance: { origin: "printed-local-form", sourceNote: "Código textual sem autocomplete, validação ou inferência nesta etapa." },
    notes: "Não é diagnóstico automático.",
  }),
];

const availableSections: SectionDefinition[] = [
  {
    id: "header",
    printedBlockNumber: 0,
    title: "Cabeçalho",
    order: 0,
    status: "available",
    questions: headerQuestions,
    provenance: { origin: "digital-adaptation", sourceNote: "Campos de identificação e contexto do cabeçalho da ficha." },
    implementable: true,
  },
  {
    id: "sociodemographic-profile",
    printedBlockNumber: 1,
    title: "Perfil Sociodemográfico",
    order: 1,
    status: "available",
    questions: profileQuestions,
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 1 da página 28." },
    implementable: true,
  },
  {
    id: "current-health-and-screenings",
    printedBlockNumber: 2,
    title: "Condição de Saúde Atual e Rastreamentos",
    order: 2,
    status: "available",
    questions: healthQuestions.map((current) => current.id === "health.diagnosed-chronic-conditions"
      ? {
        ...current,
        options: current.options.map((option) => option.id === "other" ? { ...option, domainEffect: "proposal-only" as const } : option),
      }
      : current),
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 2 da página 28." },
    implementable: true,
  },
  ...[3, 4, 5].map((block): SectionDefinition => ({
    id: `source-missing-block-${block}`,
    printedBlockNumber: block,
    title: `Bloco ${block}`,
    order: block,
    status: "source-missing",
    questions: [],
    provenance: { origin: "pending-clinical-source", sourceNote: "Fonte da página não fornecida." },
    missingReason: "page-not-provided",
    implementable: false,
  })),
  {
    id: "physical-exam-and-clinical-parameters",
    printedBlockNumber: 6,
    title: "Exame Físico e Avaliação Paramétrica Clínica",
    order: 6,
    status: "available",
    questions: physicalQuestions.slice(0, 16),
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 6 da página 28." },
    implementable: true,
  },
  {
    id: "foot-assessment",
    printedBlockNumber: 6,
    title: "Avaliação Clínica dos Pés",
    description: "Pele, neuropatia, deformidades e pulsos.",
    order: 6.1,
    status: "available",
    questions: physicalQuestions.slice(16),
    provenance: { origin: "printed-local-form", sourceNote: "Subseção legível do Bloco 6 da página 28." },
    implementable: true,
  },
  {
    id: "global-summary-and-referrals",
    printedBlockNumber: 7,
    title: "Síntese da Condição Global e Encaminhamentos, CIAP-2",
    order: 7,
    status: "available",
    questions: summaryQuestions.map((current) => current.id === "summary.services"
      ? { ...current, options: current.options.map((option) => ({ ...option, domainEffect: "proposed-network-or-referral-change" as const })) }
      : current),
    provenance: { origin: "printed-local-form", sourceNote: "Bloco 7 da página 28." },
    implementable: true,
  },
  {
    id: "family-diagrams-and-clinical-observations",
    printedBlockNumber: 8,
    title: "Elaboração do Genograma e Ecomapa / Observações Clínicas",
    order: 8,
    status: "title-only-in-source",
    questions: [],
    provenance: { origin: "printed-local-form", sourceNote: "Somente o título do Bloco 8 está visível na fonte." },
    missingReason: "requires-additional-source",
    implementable: false,
    declarativeCapabilities: [
      "link-existing-genogram-version", "mark-genogram-absent", "propose-genogram-update",
      "link-existing-ecomap-version", "mark-ecomap-absent", "propose-ecomap-update",
      "record-academic-observation", "record-family-observation", "record-shareable-text",
      "record-private-information", "record-supervision-question", "record-next-encounter-question",
    ],
  },
];

const ambiguities: InstrumentAmbiguity[] = [
  { id: "occupation-selection-mode", location: "Bloco 1 · Ocupação Atual", description: "Caixas de seleção não esclarecem seleção única ou múltipla.", effect: "Pode alterar a cardinalidade da resposta.", status: "provisional-decision", decisionNeeded: "Validar com a preceptora; implementação digital provisória é múltipla.", conservativeImplementationPossible: true },
  { id: "cervical-overlap", location: "Bloco 2 · Preventivo do Colo do Útero", description: "Menos de 1 ano está contido em menos de 3 anos.", effect: "Opções não são mutuamente exclusivas matematicamente.", status: "provisional-decision", decisionNeeded: "Preservar a impressão até validação.", conservativeImplementationPossible: true },
  { id: "mammography-overlap-gap", location: "Bloco 2 · Mamografia", description: "Menos de 1 ano está contido em menos de 2 anos e não há categoria visível entre 2 e 5 anos.", effect: "Não cobre todo o espaço temporal de forma exclusiva.", status: "provisional-decision", decisionNeeded: "Preservar opções; não criar intervalo ausente.", conservativeImplementationPossible: true },
  { id: "bone-densitometry-overlap", location: "Bloco 2 · Densitometria Óssea", description: "Não e Nunca fez podem se sobrepor semanticamente.", effect: "A resposta pode ser ambígua.", status: "provisional-decision", decisionNeeded: "Preservar ambas.", conservativeImplementationPossible: true },
  { id: "colorectal-method", location: "Bloco 2 · Câncer Colorretal", description: "Fezes ocultas e colonoscopia aparecem no mesmo item.", effect: "A resposta não identifica o método realizado.", status: "open", decisionNeeded: "Detalhar método em fonte futura sem converter em diagnóstico.", conservativeImplementationPossible: true },
  { id: "tacs-acs", location: "Cabeçalho · TACS/ACS", description: "A ficha apresenta TACS e ACS no mesmo campo.", effect: "A natureza local da referência profissional não está definida.", status: "open", decisionNeeded: "Confirmar se são conceitos distintos no serviço.", conservativeImplementationPossible: true },
  { id: "blood-pressure-control-threshold", location: "Bloco 6 · Controle da Pressão", description: "Não há limiar para PA controlada ou não controlada.", effect: "Não é seguro calcular automaticamente.", status: "provisional-decision", decisionNeeded: "Classificação manual.", conservativeImplementationPossible: true },
  { id: "cardiovascular-risk-algorithm", location: "Bloco 6 · Risco Cardiovascular", description: "Não há algoritmo de risco na fonte.", effect: "Não é seguro calcular automaticamente.", status: "provisional-decision", decisionNeeded: "Classificação manual até fonte autorizada.", conservativeImplementationPossible: true },
  { id: "block-8-title-only", location: "Bloco 8", description: "Somente o título está visível.", effect: "Não permite inventar perguntas internas.", status: "provisional-decision", decisionNeeded: "Obter fonte adicional.", conservativeImplementationPossible: true },
  { id: "missing-blocks", location: "Blocos 3, 4 e 5", description: "As páginas não foram fornecidas.", effect: "Não permite completar o instrumento.", status: "provisional-decision", decisionNeeded: "Incorporar nova versão quando as páginas forem recebidas.", conservativeImplementationPossible: true },
];

const questions = availableSections.flatMap((section) => section.questions);

export const adultDcntEsfDefinition: InstrumentDefinition = {
  id: "adult-dcnt-esf",
  version: "local-esf-2026-page-28-v1",
  title: "AVALIAÇÃO DE SAÚDE E DCNT DO ADULTO",
  subtitle: "ATENÇÃO PRIMÁRIA À SAÚDE / MFC — INSTRUMENTO DE ENTREVISTA E AVALIAÇÃO CLÍNICA DE DOENÇAS CRÔNICAS NÃO TRANSMISSÍVEIS",
  purpose: "Representar de forma estruturada e versionada a página 28 do instrumento local da ESF, preservando perguntas, opções, limitações e revisão humana.",
  origin: "Instrumento local utilizado pela ESF da preceptora do projeto.",
  sourcePage: 28,
  referenceYear: 2026,
  editorialStatus: "draft-local",
  availableSections: [1, 2, 6, 7, 8],
  missingSections: [3, 4, 5],
  sections: availableSections,
  questions,
  ambiguities,
  limitations: [
    "Esta definição não é validação nacional, diretriz universal, prontuário ou algoritmo diagnóstico.",
    "Não implementa persistência, migração, interface, narrativas, encaminhamento automático ou atualização de genograma/ecomapa.",
    "Blocos 3, 4 e 5 estão ausentes; Bloco 8 contém somente título na fonte.",
    "Classificações de PA, risco cardiovascular, HbA1c e CIAP-2 permanecem manuais ou sem interpretação.",
  ],
  futureServiceStates: [
    "current-network", "suggested", "discussed", "accepted", "referred", "scheduled", "accessed",
    "in-follow-up", "completed", "declined", "unavailable", "not-applicable",
  ],
};
