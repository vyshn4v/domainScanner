import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "../../components/ui/Button";
import { NewScanModal } from "./components/NewScanModal";
import { ScanRequestsTable } from "./components/ScanRequestsTable";
import { ScanStatsGrid } from "./components/ScanStatsGrid";
import type { ScanRequest } from "./types";
import "./ScanRequests.css";
import { ScanHttpService } from "../../../infrastructure/http/scanHttpService";
import { useTheme } from "../../../core/hooks/useTheme";

const scanService = new ScanHttpService();

export default function ScanRequests() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scans, setScans] = useState<ScanRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshStatsKey, setRefreshStatsKey] = useState(0);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const abortControllerRef = useRef<AbortController | null>(null);

  const dismissBanner = () => {
    localStorage.setItem("sr_failedBannerDismissed", "1");
    setShowBanner(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300); // 300ms delay to wait until user stops typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (location.search.includes("new=1")) {
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const sortedScans = useMemo(() => {
    if (!sortField) return scans;
    const sorted = [...scans];
    sorted.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortField === "id") {
        valA = Number(a.id) || 0;
        valB = Number(b.id) || 0;
      } else if (sortField === "domain") {
        valA = a.domain ?? a.requestedFor ?? "";
        valB = b.domain ?? b.requestedFor ?? "";
      } else if (sortField === "type") {
        valA = a.scanType ?? a.type ?? "";
        valB = b.scanType ?? b.type ?? "";
      } else if (sortField === "createdAt" || sortField === "updatedAt") {
        valA = a[sortField as "createdAt" | "updatedAt"] ? new Date(a[sortField as "createdAt" | "updatedAt"]!).getTime() : 0;
        valB = b[sortField as "createdAt" | "updatedAt"] ? new Date(b[sortField as "createdAt" | "updatedAt"]!).getTime() : 0;
      } else if (sortField === "status") {
        valA = a.status ?? "";
        valB = b.status ?? "";
      } else {
        valA = (a[sortField as keyof ScanRequest] || "").toString();
        valB = (b[sortField as keyof ScanRequest] || "").toString();
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      const strA = valA.toString().toLowerCase();
      const strB = valB.toString().toLowerCase();
      if (strA < strB) return sortDirection === "asc" ? -1 : 1;
      if (strA > strB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [scans, sortField, sortDirection]);

  const filteredScans = useMemo(() => {
    if (statusFilter === "all") return sortedScans;
    return sortedScans.filter(
      (scan) => (scan.status ?? "").toLowerCase() === statusFilter.toLowerCase(),
    );
  }, [sortedScans, statusFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [totalCount, pageSize],
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const fetchScans = (
    queryVal = debouncedSearchQuery,
    pageVal = currentPage,
    sizeVal = pageSize,
    statusVal = statusFilter
  ) => {
    setIsRefreshing(true);
    setRefreshStatsKey(prev => prev + 1);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const offset = (pageVal - 1) * sizeVal;

    let apiSearch = queryVal;
    if (statusVal !== "all" && !queryVal.trim()) {
      apiSearch = statusVal;
    }

    scanService.list({
      search: apiSearch.trim() || undefined,
      offset,
      limit: sizeVal,
      signal: controller.signal
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        setScans(data.scanlist || []);
        setTotalCount(data.totalCount || 0);
      })
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return;
        }
        if (controller.signal.aborted) return;
        console.error("Failed to fetch scans:", err);
        setScans([]);
        setTotalCount(0);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchScans(debouncedSearchQuery, currentPage, pageSize, statusFilter);
  }, [debouncedSearchQuery, currentPage, pageSize, statusFilter]);



  const handleNewRequest = () => {
    fetchScans(debouncedSearchQuery, 1, pageSize);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    localStorage.setItem("scanRequests_pageSize", String(newSize));
    setCurrentPage(1);
  };

  const handleRescan = async (id: string) => {
    const scanObj = scans.find((s) => String(s.id) === String(id));
    if (!scanObj) return;
    const target = scanObj.domain ?? scanObj.requestedFor ?? "";
    const rawType = scanObj.scanType ?? scanObj.type ?? "";

    try {
      setScans((current) =>
        current.map((request) =>
          String(request.id) === String(id) ? { ...request, status: "queued" } : request,
        ),
      );

      await scanService.rescan({
        domain: target.trim(),
        scanType: rawType,
        scanOptions: scanObj.scanOptions || [],
      });

      fetchScans(debouncedSearchQuery, currentPage, pageSize);
    } catch (err) {
      console.error("Failed to trigger rescan:", err);
      fetchScans(debouncedSearchQuery, currentPage, pageSize);
    }
  };

  const handleView = (_scanType: string, id: string) => {
    navigate(`/scan/result/${id}`);
  };

  return (
    <div className={`sr-root ${theme === "light" ? "light" : "dark"}`}>
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
              onClick={() => fetchScans()}
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

        <ScanStatsGrid refreshTrigger={refreshStatsKey} />

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

        <div className="sr-toolbar">
          <div className="sr-search-container">
            <svg
              className="sr-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="sr-search-input"
              placeholder="Search by Scan ID, domain, type or status..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            {searchQuery && (
              <button
                className="sr-search-clear"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearchQuery("");
                  setCurrentPage(1);
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sr-filter-container">
            <label htmlFor="statusFilterSelect" className="sr-filter-label">
              Status:
            </label>
            <select
              id="statusFilterSelect"
              className="sr-filter-dropdown"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        <ScanRequestsTable
          scans={filteredScans}
          onRescan={handleRescan}
          onView={handleView}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <div className="sr-pagination">
          <p className="sr-pagination-info">
            Showing {filteredScans?.length} of {totalCount} results
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

        <p className="sr-footer-count">
          {searchQuery || statusFilter !== "all" ? `${totalCount} found` : `${totalCount} total requests`}
        </p>
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
