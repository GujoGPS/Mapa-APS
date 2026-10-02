import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { checksumOf } from "@/src/storage/hash";
import { getAllValues, getValue, putValue } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";
import { validateEcomapLink, validateEcomapProposal } from "./validation";
import type { EcomapLink, EcomapLinkProposal, InstrumentApplication } from "./types";
import type { CareFact } from "./types";

export const PROPOSAL_ENTITY_TYPE = ENTITY_TYPES.proposedDomainChange;
export const ECOMAP_LINK_ENTITY_TYPE = ENTITY_TYPES.ecomapLink;

function now(): string {
  return new Date().toISOString();
}

/**
 * A ficha imprime servicos como roteiro de rede, nunca como vinculo ativo. Por isso cada opcao
 * marcada vira proposta pendente de revisao humana, e nao um vinculo no ecomapa.
 */
export function proposalFromFact(fact: CareFact, application: InstrumentApplication): EcomapLinkProposal | undefined {
  if (fact.factType !== "proposed-domain-change") return undefined;
  const value = fact.value as { service?: unknown; proposedScope?: unknown; relatedPersonIds?: unknown } | undefined;
  const service = typeof value?.service === "string" ? value.service : undefined;
  if (!service) return undefined;
  const relatedPersonIds = Array.isArray(value?.relatedPersonIds) ? (value.relatedPersonIds as string[]) : [application.personId];
  return {
    proposalId: `proposal_${fact.factId}`,
    familyId: application.familyId,
    subjectPersonId: application.personId,
    applicationId: application.applicationId,
    serviceOrNetworkId: service,
    proposedScope: value?.proposedScope === "family" ? "family" : "selected-members",
    relatedPersonIds,
    proposedStatus: "suggested",
    justificationPrivate: fact.provenance.sourceNote,
    visibility: application.visibility,
    decision: "pending-review",
  };
}

export function proposalsForApplication(facts: CareFact[], application: InstrumentApplication): EcomapLinkProposal[] {
  return facts.flatMap((fact) => {
    const proposal = proposalFromFact(fact, application);
    return proposal ? [proposal] : [];
  }).sort((left, right) => left.proposalId.localeCompare(right.proposalId));
}

/** Decisao humana explicita; nada vira vinculo ativo sem passar por aqui. */
export function decideProposal(proposal: EcomapLinkProposal, decision: EcomapLinkProposal["decision"], options: { shareableText?: string; justificationPrivate?: string } = {}): EcomapLinkProposal {
  const decided: EcomapLinkProposal = {
    ...proposal,
    decision,
    ...(options.shareableText?.trim() ? { shareableText: options.shareableText.trim() } : {}),
    ...(options.justificationPrivate?.trim() ? { justificationPrivate: options.justificationPrivate.trim() } : {}),
  };
  const validation = validateEcomapProposal(decided, decided.relatedPersonIds.length ? decided.relatedPersonIds : [decided.subjectPersonId]);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  return decided;
}

/** Converte uma proposta revisada no vinculo de ecomapa correspondente, preservando a origem. */
export function ecomapLinkFromProposal(proposal: EcomapLinkProposal, application: InstrumentApplication): EcomapLink | undefined {
  if (proposal.decision === "pending-review") return undefined;
  const status = proposal.decision === "rejected" ? "rejected" : proposal.decision === "confirmed" ? "active" : "suggested";
  const link: EcomapLink = {
    networkRelationshipId: `ecomap_${proposal.proposalId}`,
    familyId: proposal.familyId,
    scope: proposal.proposedScope,
    relatedPersonIds: proposal.proposedScope === "family" ? [] : proposal.relatedPersonIds,
    serviceOrNetworkId: proposal.serviceOrNetworkId,
    status,
    source: "printed-local-form",
    originApplicationId: proposal.applicationId,
    visibility: application.visibility,
    createdAt: now(),
    updatedAt: now(),
  };
  const validation = validateEcomapLink(link, proposal.relatedPersonIds.length ? proposal.relatedPersonIds : [proposal.subjectPersonId]);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  return link;
}

async function write(entityType: string, id: string, payload: unknown, timestamps: { createdAt: string; updatedAt: string }): Promise<void> {
  const envelope: StoredEnvelope<unknown> = { id, entityType, payload, createdAt: timestamps.createdAt, updatedAt: timestamps.updatedAt, recordVersion: 1, checksum: await checksumOf(payload) };
  await putValue(STORES.records, envelope);
  const readBack = await getValue<StoredEnvelope<unknown>>(STORES.records, id);
  if (!readBack || readBack.checksum !== envelope.checksum) throw new Error("A mudança de dominio nao passou pela verificacao de integridade.");
}

export async function persistProposal(proposal: EcomapLinkProposal): Promise<EcomapLinkProposal> {
  await write(PROPOSAL_ENTITY_TYPE, proposal.proposalId, proposal, { createdAt: now(), updatedAt: now() });
  return proposal;
}

export async function persistEcomapLink(link: EcomapLink): Promise<EcomapLink> {
  await write(ECOMAP_LINK_ENTITY_TYPE, link.networkRelationshipId, link, { createdAt: link.createdAt, updatedAt: link.updatedAt });
  return link;
}

export async function listProposalsForFamily(familyId: string): Promise<EcomapLinkProposal[]> {
  const records = await getAllValues(STORES.records);
  return records
    .filter((record): record is StoredEnvelope<EcomapLinkProposal> => (record as { entityType?: string }).entityType === PROPOSAL_ENTITY_TYPE)
    .map((record) => record.payload)
    .filter((proposal) => proposal.familyId === familyId)
    .sort((left, right) => left.proposalId.localeCompare(right.proposalId));
}

export async function listEcomapLinksForFamily(familyId: string): Promise<EcomapLink[]> {
  const records = await getAllValues(STORES.records);
  return records
    .filter((record): record is StoredEnvelope<EcomapLink> => (record as { entityType?: string }).entityType === ECOMAP_LINK_ENTITY_TYPE)
    .map((record) => record.payload)
    .filter((link) => link.familyId === familyId)
    .sort((left, right) => left.networkRelationshipId.localeCompare(right.networkRelationshipId));
}
