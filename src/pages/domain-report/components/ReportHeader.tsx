import { Link } from "react-router";
import type {
  DomainAttributes,
  DomainReportData,
} from "../../../types/domainReport";
import { formatUnixDate } from "../utils/reportUtils";

type ReportHeaderProps = {
  report: DomainReportData;
  attributes: DomainAttributes;
  verdict: string;
  onRescan?: () => void;
  isRescanning?: boolean;
};

export function ReportHeader({
  report,
  attributes,
  verdict,
  onRescan,
  isRescanning,
}: ReportHeaderProps) {
  return (
    <header className="dr-hero">
      <div className="dr-hero-copy">
        <p className="dr-eyebrow">Domain intelligence report</p>
        <div className="dr-hero-title-row">
          <h1 className="dr-hero-title">{report.id}</h1>
          <span className="dr-status-pill">
            <span />
            {verdict}
          </span>
          {attributes.tags?.map((tag) => (
            <span className="dr-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className="dr-hero-sub">
          VirusTotal analysis completed on{" "}
          {formatUnixDate(attributes.last_analysis_date)}
        </p>
        <div className="dr-hero-links">
          <Link className="dr-back-link" to="/">
            Search another domain
          </Link>
          {onRescan && (
            <button
              onClick={onRescan}
              disabled={isRescanning}
              className="dr-back-link"
            >
              {isRescanning ? "Rescanning..." : "Request Rescan"}
            </button>
          )}
        </div>
      </div>
      <div className="dr-hero-actions" aria-label="Report metadata">
        <div>
          <span>Type</span>
          <strong>{report.type}</strong>
        </div>
        <div>
          <span>TLD</span>
          <strong>.{attributes.tld ?? "Unknown"}</strong>
        </div>
        <div>
          <span>Reputation</span>
          <strong>{attributes.reputation ?? 0}</strong>
        </div>
      </div>
    </header>
  );
}
