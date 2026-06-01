import type {
  AnalysisCategory,
  AnalysisStats,
  DomainAttributes,
} from "../../../../core/types/domainReport";
import { formatIsoDate, formatUnixDate } from "../../../../core/utils/reportUtils";
import { ScoreRing } from "../../../components/ui/ScoreRing";

type OverviewPanelProps = {
  attributes: DomainAttributes;
  stats: AnalysisStats;
  cleanPercent: number;
  totalEngines: number;
  flaggedCount: number;
  registrarName: string;
  abuseEmail: string;
  registrationDate?: string;
  expirationDate?: string;
};

export function OverviewPanel({
  attributes,
  stats,
  cleanPercent,
  totalEngines,
  flaggedCount,
  registrarName,
  abuseEmail,
  registrationDate,
  expirationDate,
}: OverviewPanelProps) {
  return (
    <div className="dr-two-column">
      <section className="dr-panel dr-score-panel">
        <p className="dr-section-comment">Score</p>
        <ScoreRing score={cleanPercent} label="clean" />
        <div className="dr-score-copy">
          <h2>{stats.harmless} engines marked this domain clean</h2>
          <p>
            {stats.undetected} engines were unrated and {flaggedCount} vendors
            flagged this domain.
          </p>
        </div>
      </section>

      <section className="dr-panel">
        <p className="dr-section-comment">Registration</p>
        <dl className="dr-kv-block">
          <div className="dr-kv-row">
            <dt>Registrar</dt>
            <dd>{registrarName}</dd>
          </div>
          <div className="dr-kv-row">
            <dt>Created</dt>
            <dd>
              {registrationDate
                ? formatIsoDate(registrationDate)
                : formatUnixDate(attributes.creation_date)}
            </dd>
          </div>
          <div className="dr-kv-row">
            <dt>Expires</dt>
            <dd>{formatIsoDate(expirationDate)}</dd>
          </div>
          <div className="dr-kv-row">
            <dt>Last update</dt>
            <dd>{formatUnixDate(attributes.last_update_date)}</dd>
          </div>
          <div className="dr-kv-row">
            <dt>Abuse email</dt>
            <dd>{abuseEmail}</dd>
          </div>
        </dl>
      </section>

      <section className="dr-panel dr-panel-wide">
        <p className="dr-section-comment">Analysis distribution</p>
        <div className="dr-bar-block">
          {(Object.entries(stats) as Array<[AnalysisCategory, number]>).map(
            ([label, value]) => (
              <div className="dr-bar-row" key={label}>
                <span className="dr-bar-label">{label}</span>
                <span className="dr-bar-track">
                  <span
                    className={`dr-bar-fill dr-bar-fill--${label}`}
                    style={{
                      width: `${(value / Math.max(totalEngines, 1)) * 100}%`,
                    }}
                  />
                </span>
                <span className="dr-bar-count">{value}</span>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
