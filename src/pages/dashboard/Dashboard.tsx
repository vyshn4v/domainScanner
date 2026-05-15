import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import { Neo4jGraph } from "../../components/Neo4jGraph";

type DashboardResult = {
  id: string;
  title: string;
  summary: string;
  type: string;
  severity: string;
  status: string;
};

type DashboardScan = {
  id: string;
  title: string;
  target: string;
  status: string;
  severity: string;
  results: DashboardResult[];
};

type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
};

type DashboardData = {
  user: DashboardUser;
  scans: DashboardScan[];
};

type SelectedNode =
  | { type: "user"; item: DashboardUser }
  | { type: "scan"; item: DashboardScan }
  | { type: "result"; item: DashboardResult; scan: DashboardScan };

const MOCK_DASHBOARD_DATA: DashboardData = {
  user: {
    id: "USR-1001",
    name: "Aditi Sharma",
    email: "aditi.sharma@company.com",
    role: "Security Analyst",
    team: "Threat Response",
  },
  scans: [
    {
      id: "SCN-1042",
      title: "API perimeter audit",
      target: "api.prod.internal",
      status: "running",
      severity: "critical",
      results: [
        {
          id: "RES-4321",
          title: "Open admin port",
          summary: "Port 8080 is exposed with admin access available.",
          type: "Port Exposure",
          severity: "critical",
          status: "active",
        },
        {
          id: "RES-4318",
          title: "Weak TLS cipher",
          summary: "TLS configuration allows outdated cipher suites.",
          type: "Configuration",
          severity: "high",
          status: "active",
        },
      ],
    },
    {
      id: "SCN-1041",
      title: "Frontend app scan",
      target: "app.company.com",
      status: "running",
      severity: "high",
      results: [
        {
          id: "RES-4279",
          title: "Missing CSP header",
          summary: "Content Security Policy header is not configured.",
          type: "Web Security",
          severity: "high",
          status: "active",
        },
      ],
    },
    {
      id: "SCN-1038",
      title: "Staging cluster check",
      target: "staging-k8s-nodes",
      status: "completed",
      severity: "medium",
      results: [
        {
          id: "RES-4200",
          title: "Excessive permissions",
          summary: "A staging service role has overly broad privileges.",
          type: "IAM",
          severity: "medium",
          status: "closed",
        },
        {
          id: "RES-4207",
          title: "Unused open port",
          summary: "Port 3000 is open without active service traffic.",
          type: "Network",
          severity: "low",
          status: "closed",
        },
      ],
    },
  ],
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA);
      setSelectedNode({ type: "user", item: MOCK_DASHBOARD_DATA.user });
      setLoading(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  const severityCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0, none: 0 };
    dashboardData?.scans.forEach((scan) => {
      if (counts[scan.severity as keyof typeof counts] !== undefined) {
        counts[scan.severity as keyof typeof counts] += 1;
      }
    });
    return counts;
  }, [dashboardData]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dashboardData?.scans.forEach((scan) => {
      counts[scan.status] = (counts[scan.status] || 0) + 1;
    });
    return counts;
  }, [dashboardData]);

  const selectedOverview = useMemo(() => {
    if (!selectedNode) {
      return null;
    }

    switch (selectedNode.type) {
      case "user":
        return (
          <>
            <div className="overview-row">
              <span>Type</span>
              <strong>User</strong>
            </div>
            <div className="overview-row">
              <span>Name</span>
              <strong>{selectedNode.item.name}</strong>
            </div>
            <div className="overview-row">
              <span>Email</span>
              <strong>{selectedNode.item.email}</strong>
            </div>
            <div className="overview-row">
              <span>Role</span>
              <strong>{selectedNode.item.role}</strong>
            </div>
            <div className="overview-row">
              <span>Team</span>
              <strong>{selectedNode.item.team}</strong>
            </div>
          </>
        );
      case "scan":
        return (
          <>
            <div className="overview-row">
              <span>Type</span>
              <strong>Scan</strong>
            </div>
            <div className="overview-row">
              <span>Scan ID</span>
              <strong>{selectedNode.item.id}</strong>
            </div>
            <div className="overview-row">
              <span>Target</span>
              <strong>{selectedNode.item.target}</strong>
            </div>
            <div className="overview-row">
              <span>Status</span>
              <strong>{selectedNode.item.status}</strong>
            </div>
            <div className="overview-row">
              <span>Severity</span>
              <strong>{selectedNode.item.severity}</strong>
            </div>
            <div className="overview-row">
              <span>Findings</span>
              <strong>{selectedNode.item.results.length}</strong>
            </div>
          </>
        );
      case "result":
        return (
          <>
            <div className="overview-row">
              <span>Type</span>
              <strong>Result</strong>
            </div>
            <div className="overview-row">
              <span>Result ID</span>
              <strong>{selectedNode.item.id}</strong>
            </div>
            <div className="overview-row">
              <span>Title</span>
              <strong>{selectedNode.item.title}</strong>
            </div>
            <div className="overview-row">
              <span>Severity</span>
              <strong>{selectedNode.item.severity}</strong>
            </div>
            <div className="overview-row">
              <span>Status</span>
              <strong>{selectedNode.item.status}</strong>
            </div>
            <div className="overview-row">
              <span>Summary</span>
              <strong>{selectedNode.item.summary}</strong>
            </div>
          </>
        );
      default:
        return null;
    }
  }, [selectedNode]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Loading dashboard snapshot…</p>
          </header>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Mock dashboard data for user scans and result overview.
            </p>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="dashboard-section">
            <h2 className="section-title">Scan Summary</h2>
            <div className="summary-grid">
              <div className="summary-card summary-card--total">
                <div className="summary-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="summary-content">
                  <span className="summary-label">Total Scans</span>
                  <strong className="summary-value">
                    {dashboardData?.scans.length}
                  </strong>
                </div>
              </div>

              <div className="summary-card summary-card--active">
                <div className="summary-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10,8 16,12 10,16 10,8" />
                  </svg>
                </div>
                <div className="summary-content">
                  <span className="summary-label">Active</span>
                  <strong className="summary-value">
                    {statusCounts.running ?? 0}
                  </strong>
                </div>
              </div>

              <div className="summary-card summary-card--completed">
                <div className="summary-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>
                <div className="summary-content">
                  <span className="summary-label">Completed</span>
                  <strong className="summary-value">
                    {statusCounts.completed ?? 0}
                  </strong>
                </div>
              </div>

              <div className="summary-card summary-card--failed">
                <div className="summary-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="summary-content">
                  <span className="summary-label">Failed</span>
                  <strong className="summary-value">
                    {statusCounts.failed ?? 0}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section dashboard-section--wide">
            <h2 className="section-title">Scan Graph</h2>
            <p className="dashboard-copy">
              Click any node to see the overview for that user, scan, or result.
            </p>

            <div className="graph-layout">
              <div className="graph-panel">
                <Neo4jGraph
                  dashboardData={dashboardData}
                  selectedNode={selectedNode}
                  setSelectedNode={setSelectedNode}
                />
              </div>

              <aside className="graph-overview">
                <div className="overview-card">
                  <h3 className="overview-title">Node Overview</h3>
                  {selectedOverview}
                </div>
              </aside>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-title">Severity Distribution</h2>
            <div className="severity-chart">
              {Object.entries(severityCounts)
                .filter(([, count]) => count > 0)
                .map(([severity, count]) => (
                  <div
                    key={severity}
                    className={`severity-bar severity-${severity}`}
                  >
                    <div className="severity-label">
                      <span
                        className={`severity-dot severity-dot--${severity}`}
                      ></span>
                      <span className="severity-name">
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </span>
                    </div>
                    <div className="severity-value">{count}</div>
                    <div className="severity-fill-container">
                      <div
                        className="severity-fill"
                        style={{
                          width: `${(count / (dashboardData?.scans.length ?? 1)) * 100}%`,
                          backgroundColor: `var(--${severity === "critical" ? "red" : severity === "high" ? "yellow" : severity === "medium" ? "blue" : severity === "low" ? "green" : "faint"})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="dashboard-section dashboard-section--wide">
            <h2 className="section-title">Recent Scans</h2>
            <div className="recent-scans">
              {dashboardData.scans.map((scan) => (
                <div key={scan.id} className="recent-scan-item">
                  <div className="scan-info">
                    <span className="scan-id">{scan.id}</span>
                    <span className="scan-target">{scan.target}</span>
                  </div>
                  <div className="scan-meta">
                    <span
                      className={`scan-severity scan-severity--${scan.severity}`}
                    >
                      {scan.severity}
                    </span>
                    <span className={`scan-status scan-status--${scan.status}`}>
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
