import { useEffect, useState, useMemo } from "react";
import "./ScanStatsGrid.css";
import { ScanHttpService } from "../../../../infrastructure/http/scanHttpService";
import type { DashboardScanStats } from "../../../../infrastructure/http/scanHttpService";

const scanService = new ScanHttpService();

export function ScanStatsGrid({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const [data, setData] = useState<DashboardScanStats | null>(null);

  useEffect(() => {
    let mounted = true;
    scanService.getDashboardStats()
      .then(res => {
        if (mounted) setData(res);
      })
      .catch(err => console.error("Failed to load dashboard stats", err));
    return () => { mounted = false; };
  }, [refreshTrigger]);

  const stats = useMemo(() => {
    if (!data) return { total: 0, completed: 0, pending: 0, failed: 0 };
    
    let completed = 0;
    let pending = 0;
    let failed = 0;

    data.byStatus.forEach((s) => {
      const status = (s.status || "").toLowerCase();
      if (status === "completed" || status === "success" || status === "done") {
        completed += s.count;
      } else if (status === "failed" || status === "error") {
        failed += s.count;
      } else {
        pending += s.count;
      }
    });

    return {
      total: data.totalScans,
      completed,
      pending,
      failed,
    };
  }, [data]);

  return (
    <div className="scan-stats-grid">
      <div className="scan-stat-card scan-stat-card--total">
        <div className="scan-stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        <div className="scan-stat-content">
          <span className="scan-stat-label">Total Scans</span>
          <span className="scan-stat-value">{stats.total}</span>
        </div>
      </div>

      <div className="scan-stat-card scan-stat-card--completed">
        <div className="scan-stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="scan-stat-content">
          <span className="scan-stat-label">Completed</span>
          <span className="scan-stat-value">{stats.completed}</span>
        </div>
      </div>

      <div className="scan-stat-card scan-stat-card--pending">
        <div className="scan-stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="scan-stat-content">
          <span className="scan-stat-label">In Progress</span>
          <span className="scan-stat-value">{stats.pending}</span>
        </div>
      </div>

      <div className="scan-stat-card scan-stat-card--failed">
        <div className="scan-stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div className="scan-stat-content">
          <span className="scan-stat-label">Failed</span>
          <span className="scan-stat-value">{stats.failed}</span>
        </div>
      </div>
    </div>
  );
}
