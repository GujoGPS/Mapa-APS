import type { ConfirmationStatus, Provenance, Sensitivity, SharingState } from "@/src/contracts/core";
import type { Encounter, EncounterKind, PendingItem, PendingKind } from "@/src/contracts/care";
import type { Family, FamilyMembership, Person, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import { auditFields, newId, nowIso, updatedAudit } from "./entity";

const defaultTrust = {
  provenance: "self-reported" as Provenance,
  confirmation: "reported" as ConfirmationStatus,
  sensitivity: "health" as Sensitivity,
  sharingState: "review" as SharingState,
};

export function createFamily(input: { code: string; nickname?: string; focus?: string }): Family {
  return { ...auditFields(newId("family")), code: input.code.trim(), ...(input.nickname?.trim() ? { nickname: input.nickname.trim() } : {}), ...(input.focus?.trim() ? { focus: input.focus.trim() } : {}), state: "active", openedAt: nowIso() };
}

export function updateFamily(family: Family, input: { code: string; nickname?: string; focus?: string }): Family {
  const updated: Family = { ...family, code: input.code.trim(), ...updatedAudit(family) };
  const nickname = input.nickname?.trim();
  const focus = input.focus?.trim();
  if (nickname) updated.nickname = nickname;
  else delete updated.nickname;
  if (focus) updated.focus = focus;
  else delete updated.focus;
  return updated;
}

export function createPerson(input: { code: string; displayName?: string; lifeStage?: Person["lifeStage"] }): Person {
  return { ...auditFields(newId("person")), code: input.code.trim(), ...(input.displayName?.trim() ? { displayName: input.displayName.trim() } : {}), ...(input.lifeStage ? { lifeStage: input.lifeStage } : {}), vitalStatus: "alive" };
}

export function updatePerson(person: Person, input: { code: string; displayName?: string; lifeStage?: Person["lifeStage"] }): Person {
  const updated: Person = { ...person, code: input.code.trim(), ...updatedAudit(person) };
  const displayName = input.displayName?.trim();
  if (displayName) updated.displayName = displayName;
  else delete updated.displayName;
  if (input.lifeStage) updated.lifeStage = input.lifeStage;
  return updated;
}

export function createMembership(input: { personId: string; familyId: string; roleLabel: string; careRole?: FamilyMembership["careRole"] }): FamilyMembership {
  return { ...auditFields(newId("membership")), ...defaultTrust, sensitivity: "family", sharingState: "private", personId: input.personId, familyId: input.familyId, roleLabel: input.roleLabel.trim(), ...(input.careRole ? { careRole: input.careRole } : {}), validFrom: nowIso() };
}

export function createEncounter(input: { kind: EncounterKind; occurredAt?: string; familyId?: string; personIds?: string[]; title: string; freeText?: string; topics?: string[]; nextStep?: string; semesterId?: string }): Encounter {
  const at = input.occurredAt || nowIso();
  return { ...auditFields(newId("encounter")), ...defaultTrust, sensitivity: "health", sharingState: "private", kind: input.kind, occurredAt: at, ...(input.familyId ? { familyId: input.familyId } : {}), personIds: input.personIds ?? [], title: input.title.trim(), freeText: input.freeText?.trim() ?? "", topics: input.topics ?? [], ...(input.nextStep?.trim() ? { nextStep: input.nextStep.trim() } : {}), ...(input.semesterId ? { semesterId: input.semesterId } : {}), state: "saved" };
}

export function createPending(input: { title: string; kind?: PendingKind; familyId?: string; personId?: string; encounterId?: string; semesterId?: string; details?: string }): PendingItem {
  return { ...auditFields(newId("pending")), ...defaultTrust, sensitivity: "health", sharingState: "private", title: input.title.trim(), ...(input.details?.trim() ? { details: input.details.trim() } : {}), kind: input.kind ?? "complete-record", priority: "routine", ...(input.familyId ? { familyId: input.familyId } : {}), ...(input.personId ? { personId: input.personId } : {}), ...(input.encounterId ? { encounterId: input.encounterId } : {}), ...(input.semesterId ? { semesterId: input.semesterId } : {}), destination: "open" };
}

export function createSemester(input: { code: string; label: string; expectedFamilyCount?: number }): Semester {
  return { ...auditFields(newId("semester")), code: input.code.trim(), label: input.label.trim(), state: "active", expectedFamilyCount: input.expectedFamilyCount ?? 2, startsAt: nowIso() };
}

export function linkFamilyToSemester(input: { semesterId: string; familyId: string; state?: SemesterFamilyLink["state"]; reason?: string }): SemesterFamilyLink {
  return { ...auditFields(newId("semester-family")), semesterId: input.semesterId, familyId: input.familyId, state: input.state ?? "active", startedAt: nowIso(), ...(input.reason ? { reason: input.reason } : {}) };
}
