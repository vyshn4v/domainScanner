import { ScoreRing } from "../../../components/ui/ScoreRing";
import type { PortScanData } from "../portScanData";

function AttackSurfaceGrid({ data }: { data: PortScanData }) {
  const attack = data.graph_data.attack_surface;
  return (
    <div className="dr-stat-grid dr-attack-grid">
      <div className="dr-stat-card">
        <span className="dr-stat-label">Total Ports</span>
        <strong className="dr-stat-value">{attack.total_ports}</strong>
      </div>
      <div className="dr-stat-card dr-stat-card--safe">
        <span className="dr-stat-label">Open Ports</span>
        <strong className="dr-stat-value">{attack.open_ports}</strong>
      </div>
      <div className="dr-stat-card dr-stat-card--warn">
        <span className="dr-stat-label">Filtered</span>
        <strong className="dr-stat-value">{attack.filtered_ports}</strong>
      </div>
      <div className="dr-stat-card dr-stat-card--danger">
        <span className="dr-stat-label">Risky Ports</span>
        <strong className="dr-stat-value">{attack.risky_ports}</strong>
      </div>
    </div>
  );
}

export default function OverviewTab({ data }: { data: PortScanData }) {
  const { scan, ai_summary } = data;
  const score = ai_summary.risk_score;
  const scoreLabel =
    score < 40 ? "low risk" : score < 70 ? "moderate" : "high risk";

  return (
    <div className="dr-content">
      <div className="dr-two-column">
        <section className="dr-panel dr-score-panel">
          <p className="dr-section-comment">Risk Score</p>
          <ScoreRing score={score} label="risk" />
          <div className="dr-score-copy">
            <h2>
              {scoreLabel.charAt(0).toUpperCase() + scoreLabel.slice(1)} —{" "}
              {score}/100
            </h2>
            <p>{ai_summary.executive_summary}</p>
          </div>
        </section>

        <section className="dr-panel">
          <p className="dr-section-comment">Scan Info</p>
          <dl className="dr-kv-block">
            <div className="dr-kv-row">
              <dt>Domain</dt>
              <dd>{scan.domain}</dd>
            </div>
            <div className="dr-kv-row">
              <dt>IP Address</dt>
              <dd>{scan.ip}</dd>
            </div>
            <div className="dr-kv-row">
              <dt>Status</dt>
              <dd className="status-up">● {scan.status.toUpperCase()}</dd>
            </div>
            <div className="dr-kv-row">
              <dt>Open Ports</dt>
              <dd>{scan.ports.length}</dd>
            </div>
            <div className="dr-kv-row">
              <dt>Proxy</dt>
              <dd>Cloudflare</dd>
            </div>
          </dl>
        </section>

        <section className="dr-panel dr-panel-wide">
          <p className="dr-section-comment">Executive Summary</p>
          <p className="dr-summary-text">{ai_summary.executive_summary}</p>
        </section>
      </div>

      <section className="dr-panel dr-panel-wide">
        <p className="dr-section-comment">Attack Surface</p>
        <AttackSurfaceGrid data={data} />
      </section>
    </div>
  );
}
