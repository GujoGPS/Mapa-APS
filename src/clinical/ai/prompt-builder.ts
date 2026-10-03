import { adultDcntEsfDefinition } from "@/src/clinical/assessments/instruments/adult-dcnt-esf/definition";
import type { CareFact } from "@/src/clinical/assessments/types";
import type { Family, Person } from "@/src/contracts/family";

export type PromptKind = "caso" | "literatura" | "ecomapa" | "trauma";

export interface PromptMember {
  person: Person;
  roleLabel?: string | undefined;
}

export interface Exclusion {
  /** Identificador estavel do registro retirado: topic repete entre aplicacoes e nao serve de chave. */
  id: string;
  reason: string;
  detail: string;
}

/**
 * A retirada separa o que é da pessoa do que é do instrumento.
 *
 * "Dado de pessoa retirado por privacidade" e "lacuna de preenchimento" são coisas diferentes
 * para quem lê o aviso: a primeira é uma decisão sobre a pessoa, a segunda é apenas um campo que
 * a ficha não cobre. Juntar as duas transformava um aviso útil em lista de ruído.
 */
export interface PromptBuild {
  text: string;
  /** Dado da pessoa que não sai por privacidade ou restrição de exportação. */
  privacy: Exclusion[];
  /** Lacuna do instrumento ou campo não preenchido: não é decisão sobre a pessoa. */
  gaps: Exclusion[];
  /** Lacunas agrupadas por topico, com a repeticao contada: um bloco sem fonte aparece uma vez. */
  gapSummary: string[];
  excluded: Exclusion[];
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

const INSTRUCOES: Record<PromptKind, string> = {
  caso: "Preciso discutir este caso clínico com você: [descreva o que precisa — segunda opinião, abordagem terapêutica, dúvida específica]. Trate como discussão entre colegas de medicina, com rigor técnico completo, sem hedging desnecessário.",
  literatura: "Preciso de literatura médica atualizada sobre: [tema]. Para cada fonte que você trouxer, informe o ano de publicação, se é estudo isolado, revisão sistemática ou consenso de sociedade médica, e se o achado ainda é considerado válido hoje ou foi superado por evidência mais recente.",
  ecomapa: "Reorganize a rede abaixo em um texto corrido claro, organizado por força de vínculo (forte, fragilizado, rompido, conflituoso), adequado para apresentação a um preceptor.",
  trauma: "Quero que você avalie só a MINHA descrição — clareza, terminologia, sequência, achados ao exame. Não faça reconstrução pericial (causa, dinâmica do acidente, culpa, estimativa de tempo/velocidade). Aponte o que está faltando para um registro clínico completo, sem inventar dado que eu não dei.",
};

/** Perguntas cujo conteudo e identificador por definicao: nunca viram texto de prompt. */
const PERGUNTAS_IDENTIFICADOR = new Set(["header.cpf", "header.person-name"]);

/** Padroes de dado pessoal que podem aparecer colados em texto livre derivado. */
// Nao pode casar dentro de um decimal: 21.05 -> "21.055" casaria como CPF e corromperia dado clínico.
const PADRAO_CPF = /(?<![\d.,])\d{3}\.\d{3}\.\d{3}-\d{2}(?![\d])|(?<![\d.,])\d{11}(?![\d])/g;
const PADRAO_DATA_BR = /(?<![\d.])\d{2}\/\d{2}\/\d{4}(?![\d])/g;
const PADRAO_DATA_ISO = /(?<![\d.])\d{4}-\d{2}-\d{2}(?![\d.])/g;
const PADRAO_CEP = /(?<![\d.])\d{5}-?\d{3}(?![\d])/g;
const PADRAO_LOGRADOURO = /\b(rua|avenida|av\.|travessa|praça|rodovia|estrada|rua)\s+[^,;\n]{3,60}/gi;

function pseudonimo(person: Person): string {
  return person.code;
}

function formatar(valor: unknown): string {
  return valor !== null && typeof valor === "object" ? JSON.stringify(valor) : String(valor);
}

/** Remove identificadores colados em texto livre. Dado clínico legitimo permanece intacto. */
function higienizar(texto: string): string {
  return texto
    .replace(PADRAO_CPF, "[identificador removido]")
    .replace(PADRAO_DATA_BR, "[data removida]")
    .replace(PADRAO_DATA_ISO, "[data removida]")
    .replace(PADRAO_CEP, "[cep removido]")
    .replace(PADRAO_LOGRADOURO, "[endereço removida]");
}

function idadeDe(facts: CareFact[], personId: string): number | undefined {
  const fato = facts.find((item) => item.personId === personId && item.topic === "age-at-assessment" && typeof item.value === "number");
  return typeof fato?.value === "number" ? fato.value : undefined;
}

/**
 * Monta o prompt a partir de CareFacts ja derivados.
 *
 * Restricao nao bloqueia o prompt inteiro: o registro marcado como nao exportavel e retirado e o
 * resto segue. O que sai nunca chega ao texto — a exclusão acontece aqui, antes da montagem, e
 * e informada em `excluded`. Identificadores (CPF, nome, data de nascimento, endereco) passam
 * pelo higienizador, que e a única passagem de dado de saude para fora do app.
 */
const rotulosDeAmbiguidade = new Map(adultDcntEsfDefinition.ambiguities.map((a) => [a.id, a.location]));
const rotulosDePergunta = new Map(adultDcntEsfDefinition.questions.map((q) => [q.id, q.printedLabel]));
// Blocos inteiros sem implementação também aparecem como limitação da ficha.
const rotulosDeBloco = new Map(
  adultDcntEsfDefinition.sections
    .filter((s) => s.questions.length === 0 && s.title)
    .map((s) => [s.id, s.printedBlockNumber ? `Bloco ${s.printedBlockNumber} ainda não digitalizado` : s.title]),
);

/**
 * Rótulo legível de uma retirada.
 *
 * Os tópicos das CareFacts são identificadores internos (`tacs-acs`, `cervical-overlap`) e não
 * dizem nada para quem lê o aviso. Onde a ficha tem ambiguidade declarada, vale a localização;
 * onde o fato vem de uma pergunta, vale o rótulo impresso dela.
 */
function rotuloDe(fact: CareFact): string {
  const ambiguidade = rotulosDeAmbiguidade.get(fact.topic);
  if (ambiguidade) return ambiguidade;
  const bloco = rotulosDeBloco.get(fact.topic);
  if (bloco) return bloco;
  for (const questionId of fact.sourceQuestionIds ?? []) {
    const rotulo = rotulosDePergunta.get(questionId);
    if (rotulo) return rotulo;
  }
  if (fact.factType === "missing-information" || fact.category === "missing-data") return "Campo ainda não preenchido";
  return "Limite do próprio instrumento";
}

/** Lacuna do formulário ou limite da fonte: não é dado da pessoa. */
function ehLacunaDeInstrumento(fact: CareFact): boolean {
  return fact.factType === "source-limitation"
    || fact.factType === "missing-information"
    || fact.category === "source-limitation"
    || fact.category === "missing-data";
}

export function buildPrompt(input: PromptInput): PromptBuild {
  const privacy: Exclusion[] = [];
  const gaps: Exclusion[] = [];
  const lacunasPorId = new Map<string, CareFact>();
  const bloqueados = new Set(input.nonExportablePersonIds ?? []);

  for (const personId of bloqueados) {
    const pessoa = input.members.find((item) => item.person.id === personId)?.person ?? input.person;
    privacy.push({ id: `person:${personId}`, reason: "Registro marcado como não exportável", detail: pessoa ? pseudonimo(pessoa) : personId });
  }
  for (const label of input.nonExportableLinkLabels ?? []) {
    privacy.push({ id: `link:${label}`, reason: "Vínculo familiar marcado como não exportável", detail: label });
  }

  const membros = input.members.filter((m) => !bloqueados.has(m.person.id));
  const pessoasVisiveis = new Set(membros.map((m) => m.person.id));

  const fatos: CareFact[] = [];
  for (const fact of input.facts) {
    if (!pessoasVisiveis.has(fact.personId)) continue;
    if (fact.sourceQuestionIds?.some((id) => PERGUNTAS_IDENTIFICADOR.has(id))) {
      privacy.push({ id: fact.factId || `identifier:${fact.topic}`, reason: "Identificador", detail: rotuloDe(fact) });
      continue;
    }
    if (fact.familyVisibility === "hidden" || fact.clinicalVisibility === "hidden" || fact.clinicalVisibility === "private-note") {
      const alvo = ehLacunaDeInstrumento(fact) ? gaps : privacy;
      if (ehLacunaDeInstrumento(fact)) lacunasPorId.set(`gap:${fact.factId || `${fact.topic}:${fact.applicationId}`}`, fact);
      alvo.push({ id: fact.factId || `${fact.topic}:${fact.applicationId}`, reason: ehLacunaDeInstrumento(fact) ? "Lacuna do instrumento ou campo não preenchido" : "Dado marcado como não exportável", detail: rotuloDe(fact) });
      continue;
    }
    fatos.push(fact);
  }

  const linhas: string[] = [];
  linhas.push(`FAMÍLIA: ${input.family.code}`);

  for (const membro of membros) {
    const idade = idadeDe(fatos, membro.person.id);
    const partes = [pseudonimo(membro.person)];
    if (idade !== undefined) partes.push(`${idade} anos`);
    if (membro.roleLabel) partes.push(membro.roleLabel);
    linhas.push(`- ${partes.join(" · ")}`);
  }

  if (input.person && pessoasVisiveis.has(input.person.id)) {
    const idade = idadeDe(fatos, input.person.id);
    linhas.push(`Pessoa selecionada: ${pseudonimo(input.person)}${idade !== undefined ? ` · ${idade} anos` : ""}`);
  }

  const clinicos = fatos.filter((fact) => fact.subjectScope === "individual" && fact.topic !== "age-at-assessment" && fact.value !== undefined && fact.value !== null && fact.value !== "");
  if (clinicos.length) {
    linhas.push("");
    linhas.push("DADOS CLÍNICOS DERIVADOS (proveniência e revisão preservadas):");
    for (const fact of clinicos) {
      const dono = membros.find((m) => m.person.id === fact.personId)?.person;
      const unidade = fact.unit ? ` ${fact.unit}` : "";
      const valor = higienizar(formatar(fact.value));
      linhas.push(`- ${dono ? pseudonimo(dono) : "FATO"} · ${fact.topic}: ${valor}${unidade} [derivado-de: ${fact.derivationType}; revisão: ${fact.reviewStatus}]`);
    }
  }

  linhas.push("");
  linhas.push(INSTRUCOES[input.kind]);

  // O mesmo limite se repete a cada aplicacao; agrupar evita a lista parecer quebrada.
  const porRotulo = new Map<string, { rotulo: string; total: number }>();
  for (const lacuna of gaps) {
    const original = lacunasPorId.get(lacuna.id);
    const rotulo = original ? rotuloDe(original) : lacuna.detail;
    const atual = porRotulo.get(rotulo);
    porRotulo.set(rotulo, { rotulo, total: (atual?.total ?? 0) + 1 });
  }
  const gapSummary = [...porRotulo.values()].map((item) => (item.total > 1 ? `${item.rotulo} (${item.total} vezes)` : item.rotulo));

  return { text: higienizar(linhas.join("\n")), privacy, gaps, gapSummary, excluded: [...privacy, ...gaps] };
}
