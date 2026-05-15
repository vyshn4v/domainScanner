import type { PortScanData } from "../portScanData";

export default function RecommendationsTab({ data }: { data: PortScanData }) {
  const { recommendations } = data.ai_summary;
  return (
    <div className="dr-content">
      <p className="dr-section-comment">Security Recommendations</p>
      <div className="dr-rec-list">
        {recommendations.map((rec, i) => (
          <div key={i} className="dr-rec-item">
            <span className="dr-rec-number">{i + 1}</span>
            <span className="dr-rec-text">{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
