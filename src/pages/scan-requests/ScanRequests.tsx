import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { NewScanModal } from "./components/NewScanModal";
import { ScanRequestsTable } from "./components/ScanRequestsTable";
import type { ScanRequest } from "./types";
import "./ScanRequests.css";
import api from "../../lib/api";

const PAGE_SIZE = 5;

// const MOCK: ScanRequest[] = [
//   {
//     id: "SCN-1042",
//     requestedFor: "api.prod.internal",
//     severity: "critical",
//     status: "running",
//     type: "Vulnerability",
//   },
//   {
//     id: "SCN-1041",
//     requestedFor: "app.company.com",
//     severity: "high",
//     status: "running",
//     type: "OWASP",
//   },
//   {
//     id: "SCN-1040",
//     requestedFor: "payments-cluster.internal",
//     severity: "critical",
//     status: "queued",
//     type: "Compliance",
//   },
//   {
//     id: "SCN-1039",
//     requestedFor: "db.internal",
//     severity: "medium",
//     status: "queued",
//     type: "Network",
//   },
//   {
//     id: "SCN-1038",
//     requestedFor: "staging-k8s-nodes",
//     severity: "none",
//     status: "completed",
//     type: "Malware",
//   },
//   {
//     id: "SCN-1037",
//     requestedFor: "github.com/org/frontend",
//     severity: "high",
//     status: "completed",
//     type: "SAST",
//   },
//   {
//     id: "SCN-1036",
//     requestedFor: "10.0.0.0/16",
//     severity: "low",
//     status: "completed",
//     type: "Network",
//   },
//   {
//     id: "SCN-1035",
//     requestedFor: "all-prod-services",
//     severity: "high",
//     status: "failed",
//     type: "Compliance",
//   },
//   {
//     id: "SCN-1034",
//     requestedFor: "registry.internal/app:v3",
//     severity: "none",
//     status: "completed",
//     type: "Container",
//   },
//   {
//     id: "SCN-1033",
//     requestedFor: "auth.internal",
//     severity: "critical",
//     status: "scheduled",
//     type: "Pentest",
//   },
// ];

export default function ScanRequests({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentScans, setCurrentScans] = useState<ScanRequest[]>([]);

  const getScanList = async () => {
    try {
      const response = await api.get<ScanRequest[]>("/scan");
      const nextScans = response.data || [];
      console.log("Scans state updated:", nextScans);
      const nextTotalPages = Math.max(
        1,
        Math.ceil(nextScans.length / PAGE_SIZE),
      );
      const nextCurrentScans = nextScans.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      );
      console.log("Current scans for page:", nextCurrentScans);
      setScans(nextScans);
      setTotalPages(nextTotalPages);
      setCurrentScans(nextCurrentScans);
      return response.data;
    } catch (error) {
      console.error("Error fetching scan list:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!scans?.length) {
      console.log("No scans found, fetching scan list...");
      getScanList();
    }
  }, [currentPage, scans.length]);
  const handleNewRequest = (scan: ScanRequest) => {
    setScans((current) => [scan, ...current]);
    setCurrentPage(1);
    setCurrentScans((current) => [scan, ...current].slice(0, PAGE_SIZE));
    setTotalPages((currentTotal) =>
      Math.max(currentTotal, Math.ceil((scans.length + 1) / PAGE_SIZE)),
    );
  };

  const handleRescan = (id: string) => {
    setScans((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "queued" } : request,
      ),
    );
  };

  const handleView = (_scanType: string, id: string) => {
    navigate(`/scan/result/${id}`);
  };

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
            Showing {currentScans?.length} of {scans?.length} results
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

        <p className="sr-footer-count">{scans?.length} total requests</p>
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
