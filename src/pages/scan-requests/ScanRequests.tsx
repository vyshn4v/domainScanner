import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { NewScanModal } from "./components/NewScanModal";
import { ScanRequestsTable } from "./components/ScanRequestsTable";
import type { ScanRequest } from "./types";
import "./ScanRequests.css";

const PAGE_SIZE = 5;

const MOCK: ScanRequest[] = [
  {
    id: "SCN-1042",
    requestedFor: "api.prod.internal",
    severity: "critical",
    status: "running",
    type: "Vulnerability",
  },
  {
    id: "SCN-1041",
    requestedFor: "app.company.com",
    severity: "high",
    status: "running",
    type: "OWASP",
  },
  {
    id: "SCN-1040",
    requestedFor: "payments-cluster.internal",
    severity: "critical",
    status: "queued",
    type: "Compliance",
  },
  {
    id: "SCN-1039",
    requestedFor: "db.internal",
    severity: "medium",
    status: "queued",
    type: "Network",
  },
  {
    id: "SCN-1038",
    requestedFor: "staging-k8s-nodes",
    severity: "none",
    status: "completed",
    type: "Malware",
  },
  {
    id: "SCN-1037",
    requestedFor: "github.com/org/frontend",
    severity: "high",
    status: "completed",
    type: "SAST",
  },
  {
    id: "SCN-1036",
    requestedFor: "10.0.0.0/16",
    severity: "low",
    status: "completed",
    type: "Network",
  },
  {
    id: "SCN-1035",
    requestedFor: "all-prod-services",
    severity: "high",
    status: "failed",
    type: "Compliance",
  },
  {
    id: "SCN-1034",
    requestedFor: "registry.internal/app:v3",
    severity: "none",
    status: "completed",
    type: "Container",
  },
  {
    id: "SCN-1033",
    requestedFor: "auth.internal",
    severity: "critical",
    status: "scheduled",
    type: "Pentest",
  },
];

export default function ScanRequests({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanRequest[]>(MOCK);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleNewRequest = (scan: ScanRequest) => {
    setScans((current) => [scan, ...current]);
    setCurrentPage(1);
  };

  const handleRescan = (id: string) => {
    setScans((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "queued" } : request,
      ),
    );
  };

  const handleView = (target: string) => {
    navigate(`/recon/report/${encodeURIComponent(target)}`);
  };

  const totalPages = Math.max(1, Math.ceil(scans.length / PAGE_SIZE));
  const currentScans = scans.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className={`sr-root ${theme}`}>
      <div className="sr-page">
        <div className="sr-page-header">
          <div>
            <p className="sr-eyebrow">My Requests</p>
            <h1 className="sr-page-title">Scan Requests</h1>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + New Request
          </Button>
        </div>

        <ScanRequestsTable
          scans={currentScans}
          onRescan={handleRescan}
          onView={handleView}
        />

        <div className="sr-pagination">
          <p className="sr-pagination-info">
            Showing {currentScans.length} of {scans.length} results
          </p>
          <div className="sr-pagination-actions">
            <button
              className="sr-pagination-button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            >
              Previous
            </button>
            <span className="sr-pagination-page">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="sr-pagination-button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        </div>

        <p className="sr-footer-count">{scans.length} total requests</p>
      </div>

      {showModal && (
        <NewScanModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewRequest}
        />
      )}
    </div>
  );
}
