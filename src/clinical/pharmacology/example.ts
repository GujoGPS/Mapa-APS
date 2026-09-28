import type { PharmacologyEntry } from "./types";

/** Molde estrutural. Este objeto NÃO é importado pelo aplicativo. */
export const EXAMPLE_PHARMACOLOGY_ENTRY: PharmacologyEntry = {
  id: "medicamento-exemplo",
  genericName: "NOME_GENERICO_A_PREENCHER",
  brandNames: ["NOME_COMERCIAL_OPCIONAL"],
  therapeuticClass: "CLASSE_A_PREENCHER",
  mechanism: "MECANISMO_A_PREENCHER",
  presentations: ["APRESENTACAO_E_CONCENTRACAO_A_PREENCHER"],
  doseProfiles: [
    {
      population: "POPULACAO_A_PREENCHER",
      indication: "INDICACAO_A_PREENCHER",
      route: "VIA_A_PREENCHER",
      presentation: "APRESENTACAO_A_PREENCHER",
      initial: "DOSE_INICIAL_A_PREENCHER",
      titration: "TITULACAO_A_PREENCHER",
      usual: "DOSE_USUAL_A_PREENCHER",
      interval: "INTERVALO_A_PREENCHER",
      target: "DOSE_ALVO_A_PREENCHER",
      maximum: "DOSE_MAXIMA_A_PREENCHER",
      duration: "DURACAO_A_PREENCHER",
      renalAdjustment: "AJUSTE_RENAL_A_PREENCHER",
      hepaticAdjustment: "AJUSTE_HEPATICO_A_PREENCHER",
      notes: "OBSERVACOES_A_PREENCHER",
    },
  ],
  contraindications: ["CONTRAINDICACAO_A_PREENCHER"],
  warnings: ["ALERTA_A_PREENCHER"],
  interactions: ["INTERACAO_A_PREENCHER"],
  monitoring: ["MONITORAMENTO_A_PREENCHER"],
  sources: [{ title: "FONTE_A_PREENCHER", organization: "ORGANIZACAO_A_PREENCHER" }],
  reviewStatus: "draft",
  notes: "ANOTACAO_PESSOAL_A_PREENCHER",
};
