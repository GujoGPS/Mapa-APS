import semesterDemo from "@/src/data/synthetic/semester-2026-2.json";
import type { Family, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import { auditFields } from "./entity";
import { ENTITY_TYPES } from "./entity-types";
import { saveEntity } from "./repository";
import { getDemoSession } from "./demo-session";

export async function seedSyntheticSemester(): Promise<void> {
  if (semesterDemo.synthetic !== true) throw new Error("O conjunto não é sintético.");
  if (!(await getDemoSession())) throw new Error("Ative o modo de demonstração antes de carregar dados sintéticos.");
  const at = new Date().toISOString();
  const semester: Semester = { ...auditFields(semesterDemo.semester.id, at), code: semesterDemo.semester.code, label: semesterDemo.semester.label, state: "active", expectedFamilyCount: semesterDemo.semester.expectedFamilyCount, startsAt: at };
  await saveEntity(ENTITY_TYPES.semester, semester);
  for (const item of semesterDemo.families) {
    const family: Family = { ...auditFields(item.id, at), code: item.code, nickname: item.nickname, focus: item.focus, state: "active", openedAt: at };
    await saveEntity(ENTITY_TYPES.family, family);
    const link: SemesterFamilyLink = { ...auditFields(`link_${item.id}`, at), semesterId: semester.id, familyId: family.id, state: "active", startedAt: at };
    await saveEntity(ENTITY_TYPES.semesterFamily, link);
  }
}
