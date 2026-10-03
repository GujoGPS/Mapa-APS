import type { CareFact } from "@/src/clinical/assessments/types";
import type { Family, Person } from "@/src/contracts/family";

export type PromptKind = "caso" | "literatura" | "ecomapa" | "trauma";

export interface PromptMember {
  person: Person;
  roleLabel?: string | undefined;
}

export interface PromptInput {
  kind: PromptKind;
  family: Family;
  person?: Person | undefined;
  members: PromptMember[];
  facts: CareFact[];
  nonExportablePersonIds?: string[] | undefined;
  nonExportableLinkLabels?: string[] | undefined;
}

export type PromptBuild =
  | { blocked: true; reasons: string[]; text: "" }
  | { blocked: false; reasons: string[]; text: string };

const INSTRUCOES: Record<PromptKind, string> = {
  caso: "Preciso discutir este caso clínico com você: [descreva o que precisa — segunda opinião, abordagem terapêutica, dúvida específica]. Trate como discussão entre colegas de medicina, com rigor técnico completo, sem hedging desnecessário.",
  literatura: "Preciso de literatura médica atualizada sobre: [tema]. Para cada fonte que você trouxer, informe o ano de publicação, se é estudo isolado, revisão sistemática ou consenso de sociedade médica, e se o achado ainda é considerado válido hoje ou foi superado por evidência mais recente.",
  ecomapa: "Reorganize a rede abaixo em um texto corrido claro, organizado por força de vínculo (forte, fragilizado, rompido, conflituoso), adequado para apresentação a um preceptor.",
  trauma: "Quero que você avalie só a MINHA descrição — clareza, terminologia, sequência, achados ao exame. Não faça reconstrução pericial (causa, dinâmica do acidente, culpa, estimativa de tempo/velocidade). Aponte o que está faltando para um registro clínico completo, sem inventar dado que eu não dei.",
};

/**
 * Rotulo sempre estrutural: o codigo que o proprio app gera (F-001, P-001-A).
 * Nome e qualquer texto livre jamais entram no prompt.
 */
function pseudonimo(person: Person): string {
  return person.code;
}

/**
 * Idade lida do CareFact "age", que ja vem derivado pelo proprio dominio.
 * A data de nascimento nunca e lida aqui: nao ha caminho por onde ela atravesse o prompt.
 */
function idadeDe(facts: CareFact[], personId: string): number | undefined {
  const fato = facts.find((item) => item.personId === personId && item.topic === "age" && typeof item.value === "number");
  return typeof fato?.value === "number" ? fato.value : undefined;
}

function formatar(valor: unknown): string {
  if (valor !== null && typeof valor === "object") return JSON.stringify(valor);
  return String(valor);
}

/**
 * Monta o prompt a partir de CareFacts ja derivados.
 *
 * O bloqueio e a regra, nao o aviso: qualquer registro marcado como nao exportavel impede a
 * geracao, em vez de gerar e confiar numa confirmacao posterior. O pseudonymizado acontece
 * aqui, e nao na tela: e o unico ponto por onde o dado de saude passa.
 */
export function buildPrompt(input: PromptInput): PromptBuild {
  const reasons: string[] = [];

  for (const personId of input.nonExportablePersonIds ?? []) {
    const pessoa = input.members.find((item) => item.person.id === personId)?.person ?? input.person;
    reasons.push(`${pessoa ? pseudonimo(pessoa) : personId} tem registro marcado como não exportável.`);
  }

  for (const label of input.nonExportableLinkLabels ?? []) {
    reasons.push(`O vínculo familiar marcado como não exportável impede o envio.`);
  }

  for (const fact of input.facts) {
    if (fact.familyVisibility === "hidden") reasons.push(`Há dado clínico marcado como não exportável (${fact.category}).`);
    else if (fact.clinicalVisibility === "private-note" || fact.clinicalVisibility === "hidden") reasons.push(`Há nota clínica privada que não pode ser exportada (${fact.category}).`);
  }

  if (reasons.length > 0) return { blocked: true, reasons, text: "" };

  const linhas: string[] = [];
  linhas.push(`FAMÍLIA: ${input.family.code}`);

  for (const membro of input.members) {
    const idade = idadeDe(input.facts, membro.person.id);
    const partes = [pseudonimo(membro.person)];
    if (idade !== undefined) partes.push(`${idade} anos`);
    if (membro.roleLabel) partes.push(membro.roleLabel);
    linhas.push(`- ${partes.join(" · ")}`);
  }

  if (input.person) {
    const idade = idadeDe(input.facts, input.person.id);
    linhas.push(`Pessoa selecionada: ${pseudonimo(input.person)}${idade !== undefined ? ` · ${idade} anos` : ""}`);
  }

  const clinicos = input.facts.filter((fact) => fact.subjectScope === "individual" && fact.topic !== "age" && fact.value !== undefined && fact.value !== null && fact.value !== "");
  if (clinicos.length) {
    linhas.push("");
    linhas.push("DADOS CLÍNICOS DERIVADOS (proveniência e revisão preservadas):");
    for (const fact of clinicos) {
      const dono = input.members.find((m) => m.person.id === fact.personId)?.person;
      const unidade = fact.unit ? ` ${fact.unit}` : "";
      linhas.push(`- ${dono ? pseudonimo(dono) : "FATO"} · ${fact.topic}: ${formatar(fact.value)}${unidade} [derivado-de: ${fact.derivationType}; revisão: ${fact.reviewStatus}]`);
    }
  }

  linhas.push("");
  linhas.push(INSTRUCOES[input.kind]);

  return { blocked: false, reasons: [], text: linhas.join("\n") };
}
