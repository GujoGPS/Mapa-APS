"use client";
import {Sheet} from "./sheet";
import {type FormEvent,type RefObject,useEffect,useMemo,useRef,useState} from "react";
import type {Family,FamilyMembership,Person} from "@/src/contracts/family";
import type {ExternalLink,ExternalResource,InterpersonalRelationship,RelationshipDirection,RelationshipQuality} from "@/src/contracts/relations";
import {toSvg} from "html-to-image";
import {buildEcomap,buildGenogram,relationshipNarrative,type DiagramModel} from "@/src/domain/diagram-engine";
import {FamilyDiagramFlow,useFlowExport} from "./family-relations-flow";
import {clearPositions,loadPositions,savePositions} from "@/src/domain/diagram-layout-store";
import {hasMovedPositions,type PositionMap} from "@/src/domain/diagram-layout";
import {resourceStateLabels,resourceTypeLabels,translateFlowError} from "@/src/domain/diagram-labels";
import {diagramPrompt,possibleIdentifiers} from "@/src/domain/diagram-prompt";
import {createExternalLink,createRelationship,createResource,isRelationshipOpen,removedRelationship,updateRelationship} from "@/src/domain/relation-factories";
import {ENTITY_TYPES} from "@/src/domain/entity-types";import {removeEntity,saveEntity} from "@/src/domain/repository";
import {getApplication,type EcomapLink,type EcomapLinkProposal} from "@/src/clinical/assessments";
import {decideProposal,ecomapLinkFromProposal,listEcomapLinksForFamily,listProposalsForFamily,persistEcomapLink,persistProposal} from "@/src/clinical/assessments/proposals";
interface Props{family:Family;people:Person[];memberships:FamilyMembership[];relationships:InterpersonalRelationship[];resources:ExternalResource[];links:ExternalLink[];onSaved:()=>Promise<void>;onSelectPerson?:(personId:string)=>void}
type View="diagram"|"links"|"narrative"|"prompt";
type Composer="relationship"|"resource"|"external-link"|null;
type Editing={kind:"relationship"|"external-link";id:string}|null;
type PendingRemoval={kind:"relationship"|"external-link";id:string;label:string}|null;
export function FamilyRelations(p:Props){
  const[selectedNode,setSelectedNode]=useState("");
  const[savedLayout,setSavedLayout]=useState<PositionMap|undefined>(undefined);
  const flowExport=useFlowExport();const[view,setView]=useState<View>("diagram");
  const[editing,setEditing]=useState<Editing>(null);
  const[removal,setRemoval]=useState<PendingRemoval>(null);const[layer,setLayer]=useState<"structural"|"household"|"clinical"|"functional">("structural");const[perspective,setPerspective]=useState("");const[composer,setComposer]=useState<Composer>(null);const[message,setMessage]=useState("");const[diagramKind,setDiagramKind]=useState<"genogram"|"ecomap">("genogram");const model=useMemo(()=>diagramKind==="ecomap"?buildEcomap({family:p.family,people:p.people,resources:p.resources,links:p.links,...(perspective?{perspectivePersonId:perspective}:{})}):buildGenogram({family:p.family,people:p.people,memberships:p.memberships,relationships:p.relationships,layer,...(perspective?{perspectivePersonId:perspective}:{})}),[diagramKind,layer,perspective,p]);const prompt=diagramPrompt(model);const ids=possibleIdentifiers(prompt);

  async function submitEdit(event:FormEvent<HTMLFormElement>){event.preventDefault();const target=editing;const f=new FormData(event.currentTarget);const reason=String(f.get("reason")||"").trim();if(!target){setMessage("Nada em edicao.");return}if(target.kind==="relationship"){const current=p.relationships.find((item)=>item.id===target.id);if(!current)return;const edited=updateRelationship(current,{formalType:String(f.get("formalType")),quality:String(f.get("quality")) as RelationshipQuality,direction:String(f.get("direction")) as RelationshipDirection,perspectiveLabel:String(f.get("perspectiveLabel")),...(String(f.get("perspectivePersonId"))?{perspectivePersonId:String(f.get("perspectivePersonId"))}:{}),...(String(f.get("notes"))?{notes:String(f.get("notes"))}:{}),thirdParty:f.get("thirdParty")==="on"},reason);await saveEntity(ENTITY_TYPES.interpersonalRelationship,edited);setMessage("Vinculo atualizado; o motivo ficou registrado no historico.");}else{const current=p.links.find((item)=>item.id===target.id);if(!current)return;await saveEntity(ENTITY_TYPES.externalLink,{...current,resourceId:String(f.get("resourceId")),...(String(f.get("personId"))?{personId:String(f.get("personId"))}:{}),quality:String(f.get("quality")) as RelationshipQuality,direction:String(f.get("direction")) as RelationshipDirection,perspectiveLabel:String(f.get("perspectiveLabel")),...(String(f.get("perspectivePersonId"))?{perspectivePersonId:String(f.get("perspectivePersonId"))}:{})});setMessage("Vinculo com recurso atualizado.");}await p.onSaved();setEditing(null);}

  async function confirmRemoval(event:FormEvent<HTMLFormElement>){event.preventDefault();const target=removal;if(!target)return;const reason=String(new FormData(event.currentTarget).get("reason")||"").trim();if(!reason){setMessage("Informe o motivo.");return}if(target.kind==="relationship"){const current=p.relationships.find((item)=>item.id===target.id);if(current)await saveEntity(ENTITY_TYPES.interpersonalRelationship,removedRelationship(current,reason));}else{const current=p.links.find((item)=>item.id===target.id);if(current)await removeEntity(current.id);}await p.onSaved();setRemoval(null);setMessage("Vinculo encerrado; o registro do motivo foi preservado.");}

async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);if(composer==="relationship")await saveEntity(ENTITY_TYPES.interpersonalRelationship,createRelationship({familyId:p.family.id,sourcePersonId:String(f.get("source")),targetPersonId:String(f.get("target")),formalType:String(f.get("formalType")),quality:String(f.get("quality")) as RelationshipQuality,perspectiveLabel:String(f.get("perspectiveLabel")),...(String(f.get("perspectivePersonId"))?{perspectivePersonId:String(f.get("perspectivePersonId"))}:{}),thirdParty:f.get("thirdParty")==="on"}));if(composer==="resource"){const resource=createResource({familyId:p.family.id,name:String(f.get("name")),type:String(f.get("type")) as ExternalResource["type"],state:String(f.get("state")) as ExternalResource["state"]});await saveEntity(ENTITY_TYPES.externalResource,resource)}if(composer==="external-link")await saveEntity(ENTITY_TYPES.externalLink,createExternalLink({familyId:p.family.id,resourceId:String(f.get("resourceId")),...(String(f.get("personId"))?{personId:String(f.get("personId"))}:{}),quality:String(f.get("quality")) as RelationshipQuality,perspectiveLabel:String(f.get("perspectiveLabel")),...(String(f.get("perspectivePersonId"))?{perspectivePersonId:String(f.get("perspectivePersonId"))}:{}),thirdParty:f.get("thirdParty")==="on"}));await p.onSaved();setComposer(null);setMessage("Relação salva com perspectiva e temporalidade.")}
async function exportSvg(){const dataUrl=await flowExport?.exportAllNodes();if(!dataUrl){setMessage("Nada para exportar nesta visao.");return}const a=document.createElement("a");a.href=dataUrl;a.download=`mapa-${view}-${p.family.code}.svg`;a.click();setMessage("Diagrama SVG exportado com todos os nos.");}
return <section className="relations-panel" aria-label="Relações familiares">
  <div className="relations-head">
    <div><p className="eyebrow">Relações</p><h2>Família, vínculos e território</h2></div>
    <button onClick={()=>setComposer(diagramKind==="ecomap"?"resource":"relationship")}>Adicionar</button>
  </div>
  <p role="status" className="system-message" aria-live="polite">{message}</p>

  <div className="relations-tabs" role="tablist">
    {([{id:"diagram",label:"Diagrama"},{id:"links",label:`Vínculos e recursos (${p.relationships.filter(isRelationshipOpen).length+p.resources.length})`},{id:"narrative",label:"Narrativa"},{id:"prompt",label:"Prompt IA"}] as {id:View;label:string}[]).map((item)=><button key={item.id} role="tab" aria-selected={view===item.id} className={view===item.id?"active":""} onClick={()=>setView(item.id)}>{item.label}</button>)}
  </div>

  {view==="diagram"&&<>
    <div className="diagram-kind-switch" role="group" aria-label="Tipo de diagrama">
      <button className={diagramKind==="genogram"?"active":""} onClick={()=>setDiagramKind("genogram")}>Genograma</button>
      <button className={diagramKind==="ecomap"?"active":""} onClick={()=>setDiagramKind("ecomap")}>Ecomapa</button>
    </div>
    <div className="diagram-controls">
      <label>Perspectiva<select value={perspective} onChange={(event)=>setPerspective(event.target.value)}><option value="">Consolidada</option>{p.people.map((person)=><option key={person.id} value={person.id}>{person.displayName||person.code}</option>)}</select></label>
      {diagramKind==="genogram"&&<label>Camada<select value={layer} onChange={(event)=>setLayer(event.target.value as typeof layer)}><option value="structural">Estrutural</option><option value="household">Domiciliar</option><option value="clinical">Clínica</option><option value="functional">Funcional</option></select></label>}
      <button onClick={exportSvg}>Exportar SVG</button>
      <button className="diagram-primary" onClick={()=>setComposer("relationship")}>+ Vínculo familiar</button>
      {diagramKind==="ecomap"&&<button onClick={()=>setComposer("external-link")} disabled={!p.resources.length}>Vincular recurso</button>}
    </div>
    <FamilyDiagramFlow model={model} showLegend scope={{familyId:p.family.id,kind:diagramKind,...(perspective?{perspectivePersonId:perspective}:{}),...(diagramKind==="genogram"?{layer}:{})}} hasSavedLayout={Boolean(savedLayout)} onResetLayout={async()=>{await clearPositions({familyId:p.family.id,kind:diagramKind,...(perspective?{perspectivePersonId:perspective}:{}),...(diagramKind==="genogram"?{layer}:{})});setSavedLayout(undefined);setMessage("Desenho voltou ao posicionamento calculado pelo Mapa.");}} onPositionsChange={async(positions)=>{await savePositions({familyId:p.family.id,kind:diagramKind,...(perspective?{perspectivePersonId:perspective}:{}),...(diagramKind==="genogram"?{layer}:{})},positions,model.periodLabel);setSavedLayout(positions);}} selectedNodeId={selectedNode} onSelectNode={(id)=>{setSelectedNode(id);if(p.people.some((person)=>person.id===id))p.onSelectPerson?.(id);}} onFlowError={(code,message)=>{console.warn(`[diagrama] ${code}: ${message}`);setMessage(translateFlowError(code,message));}}/>
    <DiagramDescription model={model}/>
  </>}

  {view==="links"&&<RelationshipList relationships={p.relationships} resources={p.resources} links={p.links} people={p.people} onEdit={(kind,id)=>setEditing({kind,id})} onRemove={(kind,id,label)=>setRemoval({kind,id,label})} onAddResource={()=>setComposer("resource")}/>}

  {view==="narrative"&&<pre className="diagram-text">{relationshipNarrative(model)}</pre>}

  {view==="prompt"&&<section className="prompt-panel"><p className={ids.length?"safety-callout":"shared-callout"}>{ids.length?`Possíveis identificadores encontrados: ${ids.length}. Revise antes de copiar.`:"Nenhum identificador direto óbvio detectado. A revisão manual continua obrigatória."}</p><textarea readOnly value={prompt}/><button onClick={async()=>{await navigator.clipboard.writeText(prompt);setMessage("Prompt copiado para a área de transferência.");}}>Copiar prompt estruturado</button></section>}

  <ProposalReview familyId={p.family.id} onChanged={p.onSaved}/>

  {composer&&<Sheet open onClose={()=>setComposer(null)} label={composer==="relationship"?"Novo vínculo familiar":composer==="resource"?"Novo recurso externo":"Novo vínculo com recurso"}><RelationForm kind={composer} people={p.people} resources={p.resources} onSubmit={submit}/></Sheet>}

  {editing&&<EditRelationshipDialog editing={editing} relationships={p.relationships} links={p.links} people={p.people} resources={p.resources} onSubmit={submitEdit} onClose={()=>setEditing(null)}/>}

  {removal&&<RemovalDialog removal={removal} onSubmit={confirmRemoval} onClose={()=>setRemoval(null)}/>}
</section>;
}
const qualityLabels: Record<string, string> = { strong: "Forte", adequate: "Adequado", weak: "Fraco", conflict: "Conflitivo", ruptured: "Rompido", divergent: "Divergente", unknown: "Desconhecido" };
const directionLabels: Record<string, string> = { mutual: "de ambos", "from-source": "da origem", "to-source": "para a origem", none: "sem direção" };

function RelationshipList({ relationships, resources, links, people, onEdit, onRemove, onAddResource }: { relationships: InterpersonalRelationship[]; resources: ExternalResource[]; links: ExternalLink[]; people: Person[]; onEdit: (kind: "relationship" | "external-link", id: string) => void; onRemove: (kind: "relationship" | "external-link", id: string, label: string) => void; onAddResource: () => void }) {
  const name = (personId: string) => { const person = people.find((item) => item.id === personId); return person ? person.displayName || person.code : personId; };
  const open = relationships.filter(isRelationshipOpen);
  const closed = relationships.filter((item) => !isRelationshipOpen(item));
  return <div className="link-registry">
    <section className="link-group"><div className="section-head"><h4>Vínculos entre pessoas</h4><button onClick={() => onEdit("relationship", "")}>+ Novo vínculo</button></div>
      {open.length ? open.map((item) => <article className="link-row" key={item.id}><div><strong>{name(item.sourcePersonId)} → {name(item.targetPersonId)}</strong><span>{item.formalType} · {qualityLabels[item.quality] ?? item.quality} · {directionLabels[item.direction] ?? item.direction}</span><small>Perspectiva: {item.perspectiveLabel}{item.changeLog?.length ? ` · última alteração: ${item.changeLog.at(-1)?.reason}` : ""}</small></div><div className="action-row"><button onClick={() => onEdit("relationship", item.id)}>Editar</button><button className="secondary" onClick={() => onRemove("relationship", item.id, `${name(item.sourcePersonId)} → ${name(item.targetPersonId)}`)}>Excluir</button></div></article>) : <p className="fine-print">Nenhum vínculo registrado entre pessoas.</p>}
    </section>
    <section className="link-group"><div className="section-head"><h4>Recursos e serviços</h4><button onClick={onAddResource}>+ Novo recurso</button></div>
      {resources.length ? resources.map((resource) => <article className="link-row" key={resource.id}><div><strong>{resource.name}</strong><span>{resourceTypeLabels[resource.type] ?? resource.type} · {resourceStateLabels[resource.state] ?? resource.state}</span><small>{links.filter((link) => link.resourceId === resource.id).length} vínculo(s) com pessoas</small></div></article>) : <p className="fine-print">Nenhum recurso externo registrado.</p>}
    </section>
    {closed.length ? <details className="link-closed"><summary>Vínculos encerrados ({closed.length})</summary>{closed.map((item) => <p className="fine-print" key={item.id}>{name(item.sourcePersonId)} → {name(item.targetPersonId)} · encerrado{item.changeLog?.at(-1)?.reason ? `: ${item.changeLog.at(-1)?.reason}` : ""}</p>)}</details> : null}
  </div>;
}

function EditRelationshipDialog({ editing, relationships, links, people, resources, onSubmit, onClose }: { editing: Editing; relationships: InterpersonalRelationship[]; links: ExternalLink[]; people: Person[]; resources: ExternalResource[]; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  if (!editing) return null;
  const target = editing;
  const current = target.kind === "relationship" ? relationships.find((item) => item.id === target.id) : links.find((item) => item.id === target.id);
  if (!current) return null;
  if (editing.kind === "external-link") {
    const link = current as ExternalLink;
    return <Sheet open onClose={onClose} label="Editar vínculo com recurso"><form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Edição</p><h3 id="composer-title">Editar vínculo com recurso</h3><label>Recurso<select name="resourceId" defaultValue={link.resourceId}>{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}</option>)}</select></label><label>Pessoa<select name="personId" defaultValue={link.personId ?? ""}><option value="">Toda a família</option>{people.map((person) => <option key={person.id} value={person.id}>{person.displayName || person.code}</option>)}</select></label><label>Qualidade<select name="quality" defaultValue={link.quality}><option value="strong">Forte</option><option value="adequate">Adequado</option><option value="weak">Fraco</option><option value="conflict">Conflitivo</option><option value="ruptured">Rompido</option><option value="divergent">Divergente</option></select></label><label>Direção<select name="direction" defaultValue={link.direction}><option value="mutual">De ambos</option><option value="from-source">Da origem</option><option value="to-source">Para a origem</option><option value="none">Sem direção</option></select></label><label>Perspectiva<select name="perspectivePersonId" defaultValue={link.perspectivePersonId ?? ""}><option value="">Não atribuída</option>{people.map((person) => <option key={person.id} value={person.id}>{person.displayName || person.code}</option>)}</select></label><label>Descrição da perspectiva<input name="perspectiveLabel" defaultValue={link.perspectiveLabel} /></label><div className="action-row"><button type="submit">Salvar alterações</button><button type="button" className="secondary" onClick={onClose}>Cancelar</button></div></form></Sheet>;
  }
  const relationship = current as InterpersonalRelationship;
  return <Sheet open onClose={onClose} label="Editar vínculo familiar"><form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Edição</p><h3 id="composer-title">Editar vínculo</h3><p className="fine-print">{people.find((item) => item.id === relationship.sourcePersonId)?.displayName ?? relationship.sourcePersonId} → {people.find((item) => item.id === relationship.targetPersonId)?.displayName ?? relationship.targetPersonId}</p><label>Tipo formal<input name="formalType" defaultValue={relationship.formalType} required /></label><label>Qualidade<select name="quality" defaultValue={relationship.quality}><option value="strong">Forte</option><option value="adequate">Adequado</option><option value="weak">Fraco</option><option value="conflict">Conflitivo</option><option value="ruptured">Rompido</option><option value="divergent">Divergente</option></select></label><label>Direção<select name="direction" defaultValue={relationship.direction}><option value="mutual">De ambos</option><option value="from-source">Da origem</option><option value="to-source">Para a origem</option><option value="none">Sem direção</option></select></label><label>Perspectiva<select name="perspectivePersonId" defaultValue={relationship.perspectivePersonId ?? ""}><option value="">Não atribuída</option>{people.map((person) => <option key={person.id} value={person.id}>{person.displayName || person.code}</option>)}</select></label><label>Descrição da perspectiva<input name="perspectiveLabel" defaultValue={relationship.perspectiveLabel} required /></label><label>Notas<input name="notes" defaultValue={relationship.notes ?? ""} /></label><label className="check-row"><input type="checkbox" name="thirdParty" defaultChecked={relationship.sensitivity === "third-party"} />Informação confidencial de terceiro</label><label>Motivo da alteração<input name="reason" required placeholder="Ex.: conversado com a família na visita de terça" /></label><div className="action-row"><button type="submit">Salvar alterações</button><button type="button" className="secondary" onClick={onClose}>Cancelar</button></div></form></Sheet>;
}

function RemovalDialog({ removal, onSubmit, onClose }: { removal: PendingRemoval; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  if (!removal) return null;
  return <Sheet open onClose={onClose} role="alertdialog" label="Confirmar exclusão de vínculo"><form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Confirmação</p><h3 id="composer-title">Encerrar este vínculo?</h3><p className="safety-callout">O vínculo deixa de aparecer no diagrama, mas o registro e o motivo ficam guardados em Vínculos encerrados.</p><p><strong>{removal.label}</strong></p><label>Motivo<input name="reason" required placeholder="Ex.: vínculo registrado em duplicidade" /></label><div className="action-row"><button type="submit">Confirmar exclusão</button><button type="button" className="secondary" onClick={onClose}>Cancelar</button></div></form></Sheet>;
}

function ProposalReview({familyId,onChanged}:{familyId:string;onChanged:()=>Promise<void>}){
  const[proposals,setProposals]=useState<EcomapLinkProposal[]>([]);
  const[links,setLinks]=useState<EcomapLink[]>([]);
  const[drafts,setDrafts]=useState<Record<string,string>>({});
  const[message,setMessage]=useState("");
  useEffect(()=>{void Promise.all([listProposalsForFamily(familyId),listEcomapLinksForFamily(familyId)]).then(([nextProposals,nextLinks])=>{setProposals(nextProposals);setLinks(nextLinks);}).catch((error:unknown)=>setMessage(error instanceof Error?error.message:"Não foi possível ler as propostas."));},[familyId]);
  async function reload(){setProposals(await listProposalsForFamily(familyId));setLinks(await listEcomapLinksForFamily(familyId));}
  async function decide(proposal:EcomapLinkProposal,decision:"confirmed"|"rejected"){
    try{
      const shareableText=drafts[proposal.proposalId]??"";
      const decided=decideProposal(proposal,decision,shareableText.trim()?{shareableText}:{});
      await persistProposal(decided);
      const application=await getApplication(proposal.applicationId);
      if(application){const link=ecomapLinkFromProposal(decided,application);if(link)await persistEcomapLink(link);}
      await reload();await onChanged();
      setMessage(decision==="confirmed"?"Proposta confirmada e registrada no ecomapa com a origem da aplicação.":"Proposta rejeitada e mantida no histórico.");
    }catch(error){setMessage(error instanceof Error?error.message:"Não foi possível registrar a decisão.");}
  }
  const pending=proposals.filter((item)=>item.decision==="pending-review");
  return <section className="card proposal-review" aria-labelledby={`proposals-${familyId}`}>
    <div className="section-head"><div><p className="eyebrow">Revisão humana</p><h3 id={`proposals-${familyId}`}>Mudanças propostas pela ficha</h3></div></div>
    <p className="fine-print">Serviços marcados na avaliação são propostas. Nenhum vínculo do ecomapa nasce sem confirmação e texto compartilhável.</p>
    {pending.length?pending.map((proposal)=><article className="proposal-card" key={proposal.proposalId}>
      <div><strong>{proposal.serviceOrNetworkId.replace(/-/g," ")}</strong><span>Pessoa {proposal.subjectPersonId} · {proposal.proposedScope==="family"?"família inteira":"integrantes selecionados"}</span><small>{proposal.justificationPrivate}</small></div>
      <label>Texto para a pessoa<input value={drafts[proposal.proposalId]??""} onChange={(event)=>setDrafts((current)=>({...current,[proposal.proposalId]:event.target.value}))} placeholder="Ex.: encaminhamento à UBS, a combinar com a pessoa." /></label>
      <div className="action-row"><button onClick={()=>void decide(proposal,"confirmed")}>Confirmar e registrar no ecomapa</button><button className="secondary" onClick={()=>void decide(proposal,"rejected")}>Rejeitar</button></div>
    </article>):<p className="fine-print">Nenhuma proposta aguardando revisão.</p>}
    {links.length?<><h4>Vínculos originados por avaliação</h4><ul className="proposal-links">{links.map((link)=><li key={link.networkRelationshipId}>{link.serviceOrNetworkId.replace(/-/g," ")} · {link.status} · origem {link.originApplicationId??"manual"}</li>)}</ul></>:null}
    <p className="system-message" role="status" aria-live="polite">{message}</p>
  </section>;
}

function DiagramDescription({model}:{model:DiagramModel}){return <details className="diagram-description"><summary>Descrição textual acessível</summary><pre>{relationshipNarrative(model)}</pre></details>}
function RelationForm({kind,people,resources,onSubmit}:{kind:NonNullable<Composer>;people:Person[];resources:ExternalResource[];onSubmit:(e:FormEvent<HTMLFormElement>)=>void}){return <form className="form-stack" onSubmit={onSubmit}><p className="eyebrow">Abordagem familiar</p><h2>{kind==="relationship"?"Nova relação":kind==="resource"?"Novo recurso":"Vincular recurso"}</h2>{kind==="relationship"&&<><label>Origem<select name="source" required>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label><label>Destino<select name="target" required>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label><label>Relação formal<input name="formalType" placeholder="Ex.: mãe, companheira, cuidado" required/></label></>}{kind==="resource"&&<><label>Nome<input name="name" required/></label><label>Tipo<select name="type"><option value="health">Saúde</option><option value="education">Educação</option><option value="community">Comunidade</option><option value="extended-family">Família ampliada</option><option value="social-assistance">Assistência social</option><option value="work">Trabalho</option><option value="other">Outro</option></select></label><label>Estado<select name="state"><option value="active">Ativo</option><option value="potential">Potencial</option><option value="inactive">Inativo</option></select></label></>}{kind==="external-link"&&<><label>Recurso<select name="resourceId">{resources.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label><label>Pessoa específica (opcional)<select name="personId"><option value="">Família inteira</option>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label></>}{kind!=="resource"&&<><label>Qualidade<select name="quality"><option value="adequate">Adequado</option><option value="strong">Forte</option><option value="weak">Fraco</option><option value="conflict">Conflitivo</option><option value="ruptured">Rompido</option><option value="divergent">Divergente</option><option value="unknown">Desconhecido</option></select></label><label>Perspectiva<select name="perspectivePersonId"><option value="">Consolidada</option>{people.map(p=><option key={p.id} value={p.id}>{p.displayName||p.code}</option>)}</select></label><label>Descrição da perspectiva<input name="perspectiveLabel" defaultValue="Relato atual" required/></label><label className="check-row"><input type="checkbox" name="thirdParty"/>Informação confidencial de terceiro</label></>}<button type="submit">Salvar</button></form>}
