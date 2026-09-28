import type { ProvenancedRecord } from "@/src/contracts/core";
import type { ShareDecision, ShareDestination } from "@/src/contracts/sharing";

export function sharingDecision(entity: ProvenancedRecord & { id:string }, destination:ShareDestination):ShareDecision {
 const reasons:string[]=[];
 if (entity.sensitivity === "third-party") reasons.push("Informação fornecida por terceiro.");
 if (entity.sharingState === "blocked") reasons.push("Conteúdo bloqueado para compartilhamento.");
 if (entity.sharingState === "private") reasons.push("Conteúdo privado.");
 if (destination === "family-summary" && entity.sensitivity === "health") reasons.push("Informação individual de saúde não se torna familiar automaticamente.");
 if (destination === "ai-export" && ["third-party","high"].includes(entity.sensitivity)) reasons.push("Conteúdo sensível não pode entrar automaticamente em prompt.");
 const blocked = reasons.some((reason)=>reason.includes("terceiro")||reason.includes("bloqueado")) || (destination === "family-summary" && entity.sensitivity === "health") || (destination === "ai-export" && ["third-party","high"].includes(entity.sensitivity));
 const allowed = !blocked && !["private","withdrawn"].includes(entity.sharingState);
 return { entityId:entity.id, destination, allowed, requiresReview:allowed && entity.sharingState !== "shareable" && entity.sharingState !== "shared", reasons };
}
