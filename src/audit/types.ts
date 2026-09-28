export type GateStatus="passed"|"failed"|"blocked"|"manual"|"not-applicable";
export interface AuditGate{id:string;area:"build"|"security"|"privacy"|"accessibility"|"persistence"|"clinical"|"pharmacology"|"institutional"|"device";title:string;status:GateStatus;severity:"critical"|"high"|"moderate"|"low";evidence:string[];blocking:boolean;owner:string;nextAction:string;}
export interface ReleaseDecision{generatedAt:string;candidate:string;realDataAllowed:boolean;decision:"NO-GO"|"CONDITIONAL-GO"|"GO";passed:number;blocked:number;failed:number;manual:number;gates:AuditGate[];}
