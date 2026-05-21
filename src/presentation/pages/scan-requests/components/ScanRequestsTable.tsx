import type { ScanRequest } from "../types";
import { ScanRequestRow } from "./ScanRequestRow";

type ScanRequestsTableProps = {
  scans: ScanRequest[];
  onRescan: (id: string) => void;
  onView: (scanType: string, id: string) => void;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
};

export function ScanRequestsTable({
  scans,
  onRescan,
  onView,
  sortField,
  sortDirection,
  onSort,
}: ScanRequestsTableProps) {

  const renderHeader = (field: string, label: string) => {
    const isActive = sortField === field;
    return (
      <span
        className={`sr-sortable-header ${isActive ? "sr-sortable-header--active" : ""}`}
        onClick={() => onSort(field)}
        title={`Sort by ${label}`}
      >
        {label}
        <span className="sr-sort-icon-wrapper">
          {isActive ? (
            sortDirection === "asc" ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sr-sort-icon-muted">
              <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
            </svg>
          )}
        </span>
      </span>
    );
  };

  return (
    <div className="sr-table">
      <div className="sr-table__head">
        {renderHeader("id", "Scan ID")}
        {renderHeader("domain", "Requested For")}
        {renderHeader("type", "Type")}
        {renderHeader("createdAt", "Created At")}
        {renderHeader("updatedAt", "Updated At")}
        {/* <span>Severity</span> */}
        <div className="sr-head-trailing">
          {renderHeader("status", "Status")}
          <span>Actions</span>
        </div>
      </div>

      {scans?.length === 0 ? (
        <p className="sr-empty">No scan requests yet.</p>
      ) : (
        scans?.map((scan) => (
          <ScanRequestRow
            key={scan.id}
            request={scan}
            onRescan={onRescan}
            onView={onView}
          />
        ))
      )}
    </div>
  );
}
