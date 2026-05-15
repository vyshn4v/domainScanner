import type { AnalysisStats } from "../../../types/domainReport";

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={`dr-stat-card dr-stat-card--${tone}`}>
      <span className="dr-stat-label">{label}</span>
      <strong className="dr-stat-value">{value}</strong>
    </div>
  );
}

export function StatGrid({ stats }: { stats: AnalysisStats }) {
  return (
    <section className="dr-stat-grid" aria-label="Analysis stats">
      <StatCard label="Malicious" value={stats.malicious} tone="danger" />
      <StatCard label="Suspicious" value={stats.suspicious} tone="warn" />
      <StatCard label="Harmless" value={stats.harmless} tone="safe" />
      <StatCard label="Undetected" value={stats.undetected} tone="muted" />
    </section>
  );
}
