import type { ScanRequest } from "../types";
import { ScanRequestRow } from "./ScanRequestRow";

type ScanRequestsTableProps = {
  scans: ScanRequest[];
  onRescan: (id: string) => void;
  onView: (scanType: string, id: string) => void;
};

export function ScanRequestsTable({
  scans,
  onRescan,
  onView,
}: ScanRequestsTableProps) {
  console.log("Rendering ScanRequestsTable with scans:", scans);
  return (
    <div className="sr-table">
      <div className="sr-table__head">
        <span>Scan ID</span>
        <span>Requested For</span>
        <span>Type</span>
        <span>Created At</span>
        <span>Updated At</span>
        {/* <span>Severity</span> */}
        <span>Status</span>
        <span>Actions</span>
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
