import avaliacoesDemo from "@/src/data/synthetic/casos-avaliacoes.json";
import casosDemo from "@/src/data/synthetic/casos-completos.json";
import semesterDemo from "@/src/data/synthetic/semester-2026-2.json";
import { completeApplication, createAnswer, createApplication, createRectification, submitForReview, updateDraftApplication } from "@/src/clinical/assessments/application";
import { adultDcntEsfDefinition } from "@/src/clinical/assessments/instruments/adult-dcnt-esf/definition";
import type { InstrumentAnswer } from "@/src/clinical/assessments/types";
import type { Family, FamilyMembership, Person, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import type { CareFact } from "@/src/clinical/assessments/types";
import { auditFields } from "./entity";
import { createExternalLink, createRelationship, createResource, updateRelationship } from "./relation-factories";
import type { ConditionRecord, PersonMedicationRecord, ExamResultRecord, ScreeningEpisode, CarePlan } from "@/src/contracts/longitudinal";
import type { Encounter as EncounterEntity, PendingItem } from "@/src/contracts/care";
import type { ExternalLink, ExternalResource, InterpersonalRelationship } from "@/src/contracts/relations";
import { ENTITY_TYPES } from "./entity-types";
import { saveEntity } from "./repository";
import { getDemoSession } from "./demo-session";

type RespostaJson = [string, unknown];

/**
 * Semeia os casos de demonstracao pelo mesmo caminho que o app usa.
 *
 * Nada e escrito direto no armazenamento: pessoas, vinculos e avaliacoes passam pelas factories e
 * pelos casos de uso do dominio. Assim a demonstracao nao pode divergir do que o app real faz.
 */
export async function seedSyntheticSemester(): Promise<void> {
  if (semesterDemo.synthetic !== true || casosDemo.synthetic !== true || avaliacoesDemo.synthetic !== true) {
    throw new Error("O conjunto não é sintético.");
  }
  if (!(await getDemoSession())) throw new Error("Ative o modo de demonstração antes de carregar dados sintéticos.");

  const at = new Date().toISOString();
  const porCaso = casosDemo.cases;
  const ids = new Map<string, string>();

  const semester: Semester = { ...auditFields(semesterDemo.semester.id, at), code: semesterDemo.semester.code, label: semesterDemo.semester.label, state: "active", expectedFamilyCount: porCaso.length, startsAt: at };
  await saveEntity(ENTITY_TYPES.semester, semester);

  for (const caso of porCaso) {
    const family: Family = { ...auditFields(caso.familyId, at), code: caso.code, nickname: caso.nickname, focus: caso.focus, state: "active", openedAt: at };
    await saveEntity(ENTITY_TYPES.family, family);
    const link: SemesterFamilyLink = { ...auditFields(`link_${caso.familyId}`, at), semesterId: semester.id, familyId: family.id, state: "active", startedAt: at };
    await saveEntity(ENTITY_TYPES.semesterFamily, link);
    ids.set(caso.familyId, family.id);

    for (const bruto of [...caso.people, ...(caso.externalPeople ?? [])]) {
      const person: Person = { ...auditFields(bruto.id, at), code: bruto.code, displayName: bruto.displayName, ...(bruto.lifeStage ? { lifeStage: bruto.lifeStage as NonNullable<Person["lifeStage"]> } : {}), vitalStatus: "alive" };
      await saveEntity(ENTITY_TYPES.person, person);
      ids.set(bruto.id, person.id);
    }

    for (const bruto of caso.people) {
      const membership: FamilyMembership = {
        ...auditFields(`membership_${bruto.id}`, at),
        personId: ids.get(bruto.id)!,
        familyId: family.id,
        roleLabel: bruto.role,
        ...(bruto.careRole ? { careRole: bruto.careRole as NonNullable<FamilyMembership["careRole"]> } : {}),
        provenance: "self-reported",
        confirmation: "reported",
        sensitivity: "family",
        sharingState: "shared",
      };
      await saveEntity(ENTITY_TYPES.membership, membership);
    }

    await semearConteudo(caso, family.id, ids, at);
  }

  const criadas = new Map<string, string>();
  for (const item of avaliacoesDemo.assessments) {
    const personId = ids.get(item.person);
    if (!personId) throw new Error(`Pessoa sintética não encontrada: ${item.person}`);
    const familyId = ids.get(casoDaPessoa(porCaso, item.person));
    if (!familyId) throw new Error(`Família sintética não encontrada para ${item.person}.`);

    const retifica = item.rectifies ? criadas.get(item.rectifies) : undefined;
    const base = retifica
      ? await createRectification(retifica)
      : await createApplication({ familyId, personId, assessmentDate: item.date });

    const brutas = item.answers as unknown as Record<string, RespostaJson>;
    // Cada aferição precisa dos dois valores no mesmo answer: a validação exige sistólica e diastólica juntas.
    const porAfericao = new Map<string, { systolic?: number; diastolic?: number }>();
    for (const [questionId, [, value]] of Object.entries(brutas)) {
      const sistolica = questionId.endsWith(".systolic");
      const diastolica = questionId.endsWith(".diastolic");
      if (!questionId.startsWith("blood-pressure.") || (!sistolica && !diastolica)) continue;
      const visita = questionId.split(".").slice(0, 2).join(".");
      const atual = porAfericao.get(visita) ?? {};
      const numero = Number((value as Record<string, number> | undefined)?.[sistolica ? "systolic" : "diastolic"]);
      porAfericao.set(visita, { ...atual, [sistolica ? "systolic" : "diastolic"]: numero });
    }

    const answers: Record<string, InstrumentAnswer> = {};
    for (const [questionId, entrada] of Object.entries(brutas)) {
      const [answerType, value] = entrada;
      const ehPressao = answerType === "blood-pressure";
      const visita = ehPressao ? questionId.split(".").slice(0, 2).join(".") : "";
      const final = ehPressao ? porAfericao.get(visita)! : value;
      // A interface envia a unidade da pergunta; sem ela o fato derivado sai com unidade errada.
      const unidade = ehPressao ? "mmHg" : unidadesDe(questionId);
      answers[questionId] = createAnswer({ questionId, answerType, value: final, applicabilityState: "applicable", ...(unidade ? { unit: unidade } : {}) } as never) as InstrumentAnswer;
    }
    await updateDraftApplication(base.applicationId, { answers });
    await submitForReview(base.applicationId);
    const concluida = await completeApplication(base.applicationId);
    criadas.set(item.id, concluida.applicationId);
  }
}

function casoDaPessoa(casos: typeof casosDemo.cases, personId: string): string {
  for (const caso of casos) {
    const todos = [...caso.people, ...(caso.externalPeople ?? [])];
    if (todos.some((p) => p.id === personId)) return caso.familyId;
  }
  return "";
}

export type { CareFact };

type CasoJson = (typeof casosDemo.cases)[number];

function confianca(): ProvenancePadrao {
  return { provenance: "self-reported", confirmation: "reported", sensitivity: "family", sharingState: "shared" };
}

interface ProvenancePadrao {
  provenance: NonNullable<InterpersonalRelationship["provenance"]>;
  confirmation: NonNullable<InterpersonalRelationship["confirmation"]>;
  sensitivity: NonNullable<InterpersonalRelationship["sensitivity"]>;
  sharingState: NonNullable<InterpersonalRelationship["sharingState"]>;
}

/** Semeia o conteudo clinico e a rede de cada caso, tudo pelo mesmo caminho que o app usa. */
async function semearConteudo(caso: CasoJson, familyId: string, ids: Map<string, string>, at: string): Promise<void> {
  const base = confianca();

  for (const c of (caso.conditions ?? []) as Array<{ person: string; label: string; kind: string; state: string }>) {
    const registro: ConditionRecord = { ...auditFields(`cond_${c.person}_${registroContador("cond")}`, at), ...base, personId: ids.get(c.person)!, originalLabel: c.label, kind: c.kind as ConditionRecord["kind"], clinicalState: c.state as ConditionRecord["clinicalState"] };
    await saveEntity(ENTITY_TYPES.condition, registro);
  }

  for (const m of (caso.medications ?? []) as Array<{ person: string; name: string; use: string }>) {
    const registro: PersonMedicationRecord = { ...auditFields(`med_${m.person}_${registroContador("med")}`, at), ...base, personId: ids.get(m.person)!, reportedName: m.name, state: m.use as PersonMedicationRecord["state"] };
    await saveEntity(ENTITY_TYPES.medication, registro);
  }

  for (const e of (caso.exams ?? []) as Array<{ person: string; name: string; value: string; numeric?: number; unit?: string; reviewed?: boolean }>) {
    const registro: ExamResultRecord = { ...auditFields(`exam_${e.person}_${registroContador("exam")}`, at), ...base, personId: ids.get(e.person)!, examName: e.name, valueText: e.value, ...(e.numeric !== undefined ? { numericValue: e.numeric } : {}), ...(e.unit ? { unit: e.unit } : {}), documentAvailable: false, interpretationState: e.reviewed ? "reviewed" : "context-needed" };
    await saveEntity(ENTITY_TYPES.examResult, registro);
  }

  for (const s of (caso.screenings ?? []) as Array<{ person: string; title: string; state: string }>) {
    const registro: ScreeningEpisode = { ...auditFields(`scr_${s.person}_${registroContador("scr")}`, at), ...base, personId: ids.get(s.person)!, title: s.title, state: s.state as ScreeningEpisode["state"] };
    await saveEntity(ENTITY_TYPES.screening, registro);
  }

  for (const pl of caso.plans ?? []) {
    const registro: CarePlan = { ...auditFields(`plan_${pl.person}_${registroContador("plan")}`, at), ...base, personId: ids.get(pl.person)!, familyId, title: pl.title, objective: "Objetivo de demonstracao", target: pl.target as CarePlan["target"], state: pl.state as CarePlan["state"] };
    await saveEntity(ENTITY_TYPES.carePlan, registro);
  }

  const recursos = new Map<string, string>();
  for (const r of (caso.resources ?? []) as Array<{ id: string; name: string; type: string; state: string }>) {
    const recurso: ExternalResource = createResource({ familyId, name: r.name, type: r.type as ExternalResource["type"], state: r.state as ExternalResource["state"] });
    await saveEntity(ENTITY_TYPES.externalResource, recurso);
    recursos.set(r.id, recurso.id);
  }

  for (const rel of (caso.relationships ?? []) as Array<Record<string, never> & { from: string; to: string; formalType: string; quality: string; direction?: string; perspective: string; changeLog?: Array<{ at: string; action: "created" | "edited" | "deleted"; reason: string }>; sharingState?: string }>) {
    const criada = createRelationship({
      familyId,
      sourcePersonId: ids.get(rel.from)!,
      targetPersonId: ids.get(rel.to)!,
      formalType: rel.formalType,
      quality: rel.quality as InterpersonalRelationship["quality"],
      direction: (rel.direction ?? "reciprocal") as InterpersonalRelationship["direction"],
      perspectivePersonId: ids.get(rel.perspective)!,
      perspectiveLabel: ids.get(rel.perspective)!,
      ...(rel.careDirection ? {} : {}),
    });
    let vinculo: InterpersonalRelationship = criada;
    // O changeLog e escrito por updateRelationship, que exige motivo: e o mesmo caminho do app.
    for (const change of rel.changeLog ?? []) {
      vinculo = vinculo.changeLog ? vinculo : { ...vinculo, changeLog: [] };
      vinculo = { ...vinculo, changeLog: [...(vinculo.changeLog ?? []), { at: change.at, action: change.action, reason: change.reason }] };
    }
    // createRelationship usa "private" como padrão; o seed define o estado declarado no cenário.
    vinculo = { ...vinculo, sharingState: (rel.sharingState ?? "shared") as InterpersonalRelationship["sharingState"] };
    await saveEntity(ENTITY_TYPES.interpersonalRelationship, vinculo);
  }

  for (const link of caso.externalLinks ?? []) {
    const registro: ExternalLink = createExternalLink({
      familyId,
      resourceId: recursos.get(link.resource)!,
      personId: ids.get(link.person)!,
      quality: link.quality as ExternalLink["quality"],
      direction: (link.direction ?? "reciprocal") as ExternalLink["direction"],
      perspectivePersonId: ids.get(link.person)!,
      perspectiveLabel: ids.get(link.person)!,
    });
    await saveEntity(ENTITY_TYPES.externalLink, registro);
  }

  for (const e of (caso.encounters ?? []) as Array<{ kind: string; at: string; title: string; people: string[]; nextStep?: string; freeText?: string; topics?: string[] }>) {
    const registro: EncounterEntity = { ...auditFields(`enc_${registroContador("enc")}`, at), ...base, state: "saved" as EncounterEntity["state"], kind: e.kind as EncounterEntity["kind"], occurredAt: e.at, familyId, personIds: (e.people ?? []).map((id) => ids.get(id)!), title: e.title, freeText: e.freeText ?? "Registro sintético de demonstração.", topics: (e.topics ?? []) as string[], ...(e.nextStep ? { nextStep: e.nextStep } : {}) };
    await saveEntity(ENTITY_TYPES.encounter, registro);
  }

  for (const pend of (caso.pending ?? []) as Array<{ title: string; kind: string; priority: string; person: string }>) {
    const registro: PendingItem = { ...auditFields(`pend_${registroContador("pend")}`, at), ...base, title: pend.title, kind: pend.kind as PendingItem["kind"], priority: pend.priority as PendingItem["priority"], familyId, personId: ids.get(pend.person)!, destination: "open" };
    await saveEntity(ENTITY_TYPES.pending, registro);
  }
}

const contadores: Record<string, number> = {};
function registroContador(prefixo: string): string {
  contadores[prefixo] = (contadores[prefixo] ?? 0) + 1;
  return `${prefixo}_${contadores[prefixo]}`;
}

/** Unidade declarada pela própria ficha: repetir a tabela aqui já causou divergência uma vez. */
const unidadesDaFicha = new Map(adultDcntEsfDefinition.questions.map((q) => [q.id, q.unit]));
function unidadesDe(questionId: string): string | undefined {
  return unidadesDaFicha.get(questionId);
}
