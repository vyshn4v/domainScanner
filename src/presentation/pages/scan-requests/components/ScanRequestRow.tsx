import type { ScanRequest } from "../types";
import { SCAN_MODES } from "../../../../core/constants/scanOptionsConfig";
import { useState } from "react";

type ScanRequestRowProps = {
  request: ScanRequest;
  onRescan: (id: string) => void;
  onView: (type: string, id: string) => void;
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

export const SEV_CFG: Record<
  ScanRequest["severity"],
  { label: string; cls: string }
> = {
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
  const [showOptions, setShowOptions] = useState(false);
  const [toast, setToast] = useState("");

  const handleViewClick = () => {
    if (request.status === "completed") {
      onView(scanType, request.scanId || String(request.id));
    } else {
      setToast("Report not available — scan is not yet completed");
      setTimeout(() => setToast(""), 3000);
    }
  };
  const status = STATUS_CFG[request.status] ?? STATUS_CFG.queued;
  let scanType = request.scanType ?? request.type ?? "Vulnerability Scan";
  if (scanType.toLowerCase() === "port") {
    scanType = "Vulnerability Scan";
  } else if (scanType.toLowerCase() === "web") {
    scanType = "Web Audit";
  }
  const target = request.domain ?? request.requestedFor ?? "";
  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString("en-GB")
    : "-";
  // scanOptions now stores the scanMode as a single-element array e.g. ["aggressive"]
  const scanMode = (request.scanOptions ?? [])[0] ?? null;
  const scanModeInfo = SCAN_MODES.find((m) => m.value === scanMode);

  return (
    <>
      <div className="sr-table__row">
        <span className="sr-cell-id" title={request.scanId || "SCN-" + request.id}>{request.scanId || "SCN-" + request.id}</span>
        <span className="sr-cell-target" title={target}>
          {target}
        </span>
        <span className="sr-cell-type">{scanType}</span>
        <span className="sr-cell-date">{formattedDate}</span>
        <span className="sr-cell-date">
          {request.updatedAt
            ? new Date(request.updatedAt).toLocaleDateString("en-GB")
            : "-"}
        </span>
        {/* <span className={`sr-sev ${SEV_CFG[request.severity].cls}`}>
          {SEV_CFG[request.severity].label}
        </span> */}
        <div className="sr-cell-trailing">
          <span className={`sr-badge ${status.badgeCls}`}>
            {status?.dot && <span className={`sr-dot ${status.dot}`} />}
            {status?.label}
          </span>
          <div className="sr-actions">
            <button
              className="sr-icon-btn"
              title={
                request.status === "completed"
                  ? "View report"
                  : "Not yet available"
              }
              onClick={handleViewClick}
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
            {scanMode && (
              <button
                className="sr-icon-btn"
                title="View scan mode"
                onClick={() => setShowOptions(true)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            )}
            <button
              className="sr-icon-btn sr-icon-btn--rescan"
              title="Rescan"
              onClick={() => onRescan(request.scanId || String(request.id))}
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
      </div>

      {showOptions && scanModeInfo && (
        <div className="sr-overlay" onClick={() => setShowOptions(false)}>
          <div className="sr-opt-popup" onClick={(e) => e.stopPropagation()}>
            <div className="sr-opt-popup__header">
              <span className="sr-label">Scan Mode</span>
              <button
                className="sr-modal__close"
                onClick={() => setShowOptions(false)}
              >
                ✕
              </button>
            </div>
            <div className="sr-opt-popup__body">
              <div className="sr-opt-popup__row">
                <span className="sr-opt-popup__flag">{scanModeInfo.label}</span>
                <span className="sr-opt-popup__desc">{scanModeInfo.description}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="sr-toast">{toast}</div>}
    </>
  );
}
