import type { EntityId } from "./core";

export type ShareDestination = "person-summary" | "family-summary" | "supervision" | "transcription" | "journey" | "ai-export";
export interface ShareDecision {
  entityId: EntityId;
  destination: ShareDestination;
  allowed: boolean;
  requiresReview: boolean;
  reasons: string[];
}

export interface SharedCard {
  id: EntityId;
  sourceType: "condition" | "medication" | "exam" | "screening" | "plan";
  title: string;
  body: string;
  stateLabel: string;
  selected: boolean;
  blocked: boolean;
  blockReason?: string;
}

export interface HandoffDraft {
  duration: "30s" | "2min" | "full";
  identification: string;
  facts: string[];
  interpretations: string[];
  actions: string[];
  questions: string[];
}
