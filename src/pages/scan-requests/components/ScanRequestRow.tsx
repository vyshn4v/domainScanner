import type { ScanRequest } from "../types";

type ScanRequestRowProps = {
  request: ScanRequest;
  onRescan: (id: string) => void;
  onView: (target: string) => void;
};

const STATUS_CFG: Record<
  ScanRequest["status"],
  { label: string; badgeCls: string; dot?: string }
> = {
  running: {
    label: "Running",
    badgeCls: "sr-badge--running",
    dot: "sr-dot--running",
  },
  queued: {
    label: "Queued",
    badgeCls: "sr-badge--queued",
    dot: "sr-dot--queued",
  },
  completed: { label: "Completed", badgeCls: "sr-badge--completed" },
  failed: { label: "Failed", badgeCls: "sr-badge--failed" },
  scheduled: { label: "Scheduled", badgeCls: "sr-badge--scheduled" },
};

const SEV_CFG: Record<ScanRequest["severity"], { label: string; cls: string }> =
  {
    critical: { label: "Critical", cls: "sr-sev--critical" },
    high: { label: "High", cls: "sr-sev--high" },
    medium: { label: "Medium", cls: "sr-sev--medium" },
    low: { label: "Low", cls: "sr-sev--low" },
    none: { label: "—", cls: "sr-sev--none" },
  };

export function ScanRequestRow({
  request,
  onRescan,
  onView,
}: ScanRequestRowProps) {
  const status = STATUS_CFG[request.status];
  const severity = SEV_CFG[request.severity];

  return (
    <div className="sr-table__row">
      <span className="sr-cell-id">{request.id}</span>
      <span className="sr-cell-target" title={request.requestedFor}>
        {request.requestedFor}
      </span>
      <span className="sr-cell-type">{request.type}</span>
      <span className={`sr-sev ${severity.cls}`}>{severity.label}</span>
      <span className={`sr-badge ${status.badgeCls}`}>
        {status.dot && <span className={`sr-dot ${status.dot}`} />}
        {status.label}
      </span>
      <div className="sr-actions">
        <button
          className="sr-icon-btn"
          title="View report"
          onClick={() => onView(request.requestedFor)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button
          className="sr-icon-btn sr-icon-btn--rescan"
          title="Rescan"
          onClick={() => onRescan(request.id)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
          </svg>
        </button>
      </div>
    </div>
  );
}
