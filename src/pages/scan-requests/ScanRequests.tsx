import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { NewScanModal } from "./components/NewScanModal";
import { ScanRequestsTable } from "./components/ScanRequestsTable";
import type { ScanRequest } from "./types";
import "./ScanRequests.css";
import api from "../../lib/api";

export default function ScanRequests({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(() => {
    const saved = localStorage.getItem("scanRequests_pageSize");
    return saved ? Number(saved) : 5;
  });
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBanner, setShowBanner] = useState(
    () => localStorage.getItem("sr_failedBannerDismissed") !== "1",
  );

  const dismissBanner = () => {
    localStorage.setItem("sr_failedBannerDismissed", "1");
    setShowBanner(false);
  };

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(scans.length / pageSize)),
    [scans.length, pageSize],
  );

  const currentScans = useMemo(
    () => scans.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [scans, currentPage, pageSize],
  );

  const fetchScans = () => {
    setIsRefreshing(true);
    api.get<ScanRequest[]>("/scan")
      .then((response) => {
        const data = response.data || [];
        setScans(data);
      })
      .catch((err) => {
        console.error("Failed to fetch scans:", err);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleNewRequest = () => {
    fetchScans();
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    localStorage.setItem("scanRequests_pageSize", String(newSize));
    setCurrentPage(1);
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
          <div className="sr-header-actions">
            <div className="sr-page-size-selector">
              <label htmlFor="pageSizeSelect">Rows per page:</label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="sr-page-size-dropdown"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchScans}
              disabled={isRefreshing}
              className="sr-refresh-btn"
              title="Refresh"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isRefreshing ? "sr-spin" : ""}
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              + New Request
            </Button>
          </div>
        </div>

        {showBanner && (
          <div className="sr-info-banner" role="status">
            <div className="sr-info-banner__icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div className="sr-info-banner__body">
              <span className="sr-info-banner__label">Auto-retry enabled</span>
              <p className="sr-info-banner__text">
                Failed scans are automatically re-queued every <strong>3 hours</strong>. You can also trigger a manual rescan anytime using the
                <span className="sr-info-banner__icon-ref">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
                  </svg>
                </span>
                icon in the Actions column.
              </p>
            </div>
            <button
              className="sr-info-banner__close"
              onClick={dismissBanner}
              title="Dismiss"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

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
