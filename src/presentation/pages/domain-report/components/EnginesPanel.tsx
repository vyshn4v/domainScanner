import type { AnalysisResult } from "../../../../core/types/domainReport";

type EnginesPanelProps = {
  engines: AnalysisResult[];
  harmlessCount: number;
  undetectedCount: number;
  flaggedCount: number;
  showAllEngines: boolean;
  onToggleShowAll: () => void;
};

export function EnginesPanel({
  engines,
  harmlessCount,
  undetectedCount,
  flaggedCount,
  showAllEngines,
  onToggleShowAll,
}: EnginesPanelProps) {
  const visibleEngines = engines.slice(0, showAllEngines ? engines.length : 28);

  return (
    <section className="dr-panel">
      <div className="dr-engines-topline">
        <p className="dr-section-comment">Vendor engines</p>
        <button className="dr-link-button" type="button" onClick={onToggleShowAll}>
          {showAllEngines ? "Show less" : "Show all"}
        </button>
      </div>
      <div className="dr-engines-meta">
        <span className="dr-engines-green">{harmlessCount} harmless</span>
        <span className="dr-engines-sep">/</span>
        <span className="dr-engines-muted">{undetectedCount} undetected</span>
        <span className="dr-engines-sep">/</span>
        <span className="dr-engines-danger">{flaggedCount} flagged</span>
      </div>
      <div className="dr-engines-grid">
        {visibleEngines.map((engine) => (
          <div
            className={`dr-engine-row dr-engine-row--${engine.category}`}
            key={engine.engine_name}
          >
            <span className={`dr-engine-dot dr-engine-dot--${engine.category}`} />
            <span className="dr-engine-name">{engine.engine_name}</span>
            <span className="dr-engine-result">{engine.result}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
