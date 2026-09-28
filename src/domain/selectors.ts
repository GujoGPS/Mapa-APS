import type { Encounter, PendingItem, TimelineItem } from "@/src/contracts/care";
import type { Family, FamilyMembership, Person, SemesterFamilyLink } from "@/src/contracts/family";

export function peopleInFamily(people: Person[], memberships: FamilyMembership[], familyId: string): Person[] {
  const ids = new Set(memberships.filter((link) => link.familyId === familyId && !link.validTo).map((link) => link.personId));
  return people.filter((person) => ids.has(person.id));
}

export function activeFamiliesForSemester(families: Family[], links: SemesterFamilyLink[], semesterId: string): Family[] {
  const ids = new Set(links.filter((link) => link.semesterId === semesterId && link.state === "active").map((link) => link.familyId));
  return families.filter((family) => ids.has(family.id));
}

export function buildTimeline(encounters: Encounter[], pending: PendingItem[], familyId?: string, personId?: string): TimelineItem[] {
  const encounterItems: TimelineItem[] = encounters
    .filter((item) => (!familyId || item.familyId === familyId) && (!personId || item.personIds.includes(personId)))
    .map((item) => ({ id: item.id, at: item.occurredAt, type: "encounter", title: item.title, ...(item.nextStep ? { subtitle: `Próximo: ${item.nextStep}` } : {}), ...(item.familyId ? { familyId: item.familyId } : {}), personIds: item.personIds }));
  const pendingItems: TimelineItem[] = pending
    .filter((item) => item.destination === "open" && (!familyId || item.familyId === familyId) && (!personId || item.personId === personId))
    .map((item) => ({ id: item.id, at: item.createdAt, type: "pending", title: item.title, subtitle: "Pendência aberta", ...(item.familyId ? { familyId: item.familyId } : {}), personIds: item.personId ? [item.personId] : [] }));
  return [...encounterItems, ...pendingItems].sort((a, b) => b.at.localeCompare(a.at));
}

export function nextFamilyCode(families: Family[]): string {
  const max = families.reduce((current, family) => {
    const match = /^F-(\d+)$/.exec(family.code);
    return match ? Math.max(current, Number(match[1])) : current;
  }, 0);
  return `F-${String(max + 1).padStart(3, "0")}`;
}

export function nextPersonCode(people: Person[], familyCode: string): string {
  const prefix = familyCode.replace(/^F-/, "P-");
  const used = new Set(people.map((person) => person.code));
  for (let index = 0; index < 26; index += 1) {
    const code = `${prefix}-${String.fromCharCode(65 + index)}`;
    if (!used.has(code)) return code;
  }
  return `${prefix}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}
