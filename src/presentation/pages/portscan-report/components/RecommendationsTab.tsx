import type { PortScanData } from "../../../../core/types/portScanData";

export default function RecommendationsTab({ data }: { data: PortScanData }) {
  return (
    <div className="dr-content">
      <p className="dr-section-comment">Security Recommendations</p>
      <div className="dr-rec-list">
        {data.ai_summary.recommendations.map((rec: string, i: number) => (
          <div key={i} className="dr-rec-item">
            <span className="dr-rec-number">{i + 1}</span>
            <span className="dr-rec-text">{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
