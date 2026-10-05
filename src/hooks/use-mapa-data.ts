"use client";

import { useCallback, useEffect, useState } from "react";
import type { Encounter, PendingItem } from "@/src/contracts/care";
import type { Family, FamilyMembership, Person, Semester, SemesterFamilyLink } from "@/src/contracts/family";
import type { CarePlan, ConditionRecord, ExamResultRecord, PatientSuggestion, PersonMedicationRecord, ScreeningEpisode } from "@/src/contracts/longitudinal";
import type { ExternalLink, ExternalResource, InterpersonalRelationship } from "@/src/contracts/relations";
import type { Addendum, CompetencyEvidence, Reflection, SemesterSnapshot, SupervisorFeedback } from "@/src/contracts/journey";
import { ENTITY_TYPES } from "@/src/domain/entity-types";
import { listEntities } from "@/src/domain/repository";
import type { DemoSessionSnapshot } from "@/src/contracts/demo";
import { getDemoSession } from "@/src/domain/demo-session";
import type { InstrumentApplication } from "@/src/clinical/assessments";
import { APPLICATION_ENTITY_TYPE } from "@/src/clinical/assessments";
import { getAllValues } from "@/src/storage/idb";
import { STORES, type StoredEnvelope } from "@/src/storage/schema";

export interface MapaData {
  families: Family[];
  people: Person[];
  memberships: FamilyMembership[];
  encounters: Encounter[];
  pending: PendingItem[];
  semesters: Semester[];
  semesterLinks: SemesterFamilyLink[];
  conditions: ConditionRecord[];
  medications: PersonMedicationRecord[];
  examResults: ExamResultRecord[];
  screenings: ScreeningEpisode[];
  carePlans: CarePlan[];
  suggestions: PatientSuggestion[];
  relationships: InterpersonalRelationship[];
  resources: ExternalResource[];
  externalLinks: ExternalLink[];
  reflections: Reflection[];
  competencies: CompetencyEvidence[];
  feedbacks: SupervisorFeedback[];
  snapshots: SemesterSnapshot[];
  addenda: Addendum[];
  assessments: InstrumentApplication[];
}

const empty: MapaData = { families: [], people: [], memberships: [], encounters: [], pending: [], semesters: [], semesterLinks: [], conditions: [], medications: [], examResults: [], screenings: [], carePlans: [], suggestions: [], relationships: [], resources: [], externalLinks: [], reflections: [], competencies: [], feedbacks: [], snapshots: [], addenda: [], assessments: [] };

export function useMapaData() {
  const [data, setData] = useState<MapaData>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [demoSession, setDemoSession] = useState<DemoSessionSnapshot>();

  const refresh = useCallback(async () => {
    try {
      const [families, people, memberships, encounters, pending, semesters, semesterLinks, conditions, medications, examResults, screenings, carePlans, suggestions, relationships, resources, externalLinks, reflections, competencies, feedbacks, snapshots, addenda, records, activeDemo] = await Promise.all([
        listEntities<Family>(ENTITY_TYPES.family), listEntities<Person>(ENTITY_TYPES.person), listEntities<FamilyMembership>(ENTITY_TYPES.membership), listEntities<Encounter>(ENTITY_TYPES.encounter), listEntities<PendingItem>(ENTITY_TYPES.pending), listEntities<Semester>(ENTITY_TYPES.semester), listEntities<SemesterFamilyLink>(ENTITY_TYPES.semesterFamily), listEntities<ConditionRecord>(ENTITY_TYPES.condition), listEntities<PersonMedicationRecord>(ENTITY_TYPES.medication), listEntities<ExamResultRecord>(ENTITY_TYPES.examResult), listEntities<ScreeningEpisode>(ENTITY_TYPES.screening), listEntities<CarePlan>(ENTITY_TYPES.carePlan), listEntities<PatientSuggestion>(ENTITY_TYPES.patientSuggestion), listEntities<InterpersonalRelationship>(ENTITY_TYPES.interpersonalRelationship), listEntities<ExternalResource>(ENTITY_TYPES.externalResource), listEntities<ExternalLink>(ENTITY_TYPES.externalLink), listEntities<Reflection>(ENTITY_TYPES.reflection), listEntities<CompetencyEvidence>(ENTITY_TYPES.competencyEvidence), listEntities<SupervisorFeedback>(ENTITY_TYPES.supervisorFeedback), listEntities<SemesterSnapshot>(ENTITY_TYPES.semesterSnapshot), listEntities<Addendum>(ENTITY_TYPES.addendum), getAllValues<StoredEnvelope<InstrumentApplication>>(STORES.records), getDemoSession(),
      ]);
      setData({ families, people, memberships, encounters, pending, semesters, semesterLinks, conditions, medications, examResults, screenings, carePlans, suggestions, relationships, resources, externalLinks, reflections, competencies, feedbacks, snapshots, addenda, assessments: records.filter((record) => record.entityType === APPLICATION_ENTITY_TYPE).map((record) => record.payload) });
      setDemoSession(activeDemo);
      setError(undefined);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao carregar dados locais."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh, demoSession };
}
