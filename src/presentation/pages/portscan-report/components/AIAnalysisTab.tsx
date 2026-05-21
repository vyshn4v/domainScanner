import type { PortScanData } from "../../../../core/types/portScanData";

const RISK_LABELS = {
  low: { color: "safe", text: "Low Risk" },
  moderate: { color: "warn", text: "Moderate Risk" },
  high: { color: "danger", text: "High Risk" },
};

export default function AIAnalysisTab({ data }: { data: PortScanData }) {
  const { ai_summary } = data;
  const score = ai_summary.risk_score;
  const level = score < 40 ? "low" : score < 70 ? "moderate" : "high";
  const { color, text } = RISK_LABELS[level];

  return (
    <div className="dr-content">
      <div className="dr-stat-grid" style={{ marginBottom: "1rem" }}>
        <div className={`dr-stat-card dr-stat-card--${color}`}>
          <span className="dr-stat-label">Risk Score</span>
          <strong className="dr-stat-value">{score}</strong>
        </div>
        <div className="dr-stat-card dr-stat-card--muted">
          <span className="dr-stat-label">Open Ports</span>
          <strong className="dr-stat-value">{data.scan.ports.length}</strong>
        </div>
        <div className="dr-stat-card dr-stat-card--safe">
          <span className="dr-stat-label">Proxy</span>
          <strong className="dr-stat-value" style={{ fontSize: "1.1rem" }}>
            CF
          </strong>
        </div>
        <div className={`dr-stat-card dr-stat-card--${color}`}>
          <span className="dr-stat-label">Level</span>
          <strong className="dr-stat-value" style={{ fontSize: "1rem" }}>
            {text}
          </strong>
        </div>
      </div>

      <section className="dr-panel" style={{ marginBottom: "1rem" }}>
        <p className="dr-section-comment">Risk Assessment</p>
        <p className="dr-summary-text">{ai_summary.risk_assessment}</p>
      </section>
    </div>
  );
}
