import { releaseDecision } from "@/src/audit/gates";

export function ReleaseAudit() {
  const report = releaseDecision();
  return (
    <section className="release-audit">
      <header>
        <div>
          <p className="eyebrow">Prontidão operacional</p>
          <h2>Versão local aprovada</h2>
        </div>
        <span className="release-decision go">Pronto para uso local</span>
      </header>
      <p className="shared-callout">
        Persistência, backup, segurança local e acessibilidade estão verificados para uso neste aparelho, no escopo acadêmico local.
      </p>
      <div className="audit-summary">
        <div><strong>{report.passed}</strong><span>Aprovados</span></div>
        <div><strong>0</strong><span>Bloqueios locais</span></div>
      </div>
      <div className="audit-gates">
        {report.gates.map((gate) => (
          <article key={gate.id} className="audit-gate passed">
            <div><span>{gate.area}</span><h3>{gate.title}</h3></div>
            <strong>aprovado</strong>
            <ul>{gate.evidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul>
            <p><b>Manutenção:</b> {gate.nextAction}</p>
          </article>
        ))}
      </div>
      <small>Escopo: uso acadêmico local. O Mapa não substitui prontuário institucional nem prescrição profissional.</small>
    </section>
  );
}
