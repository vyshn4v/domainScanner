import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router";
import "./PortScanReport.css";
import api from "../../lib/api";
import DashboardTab from "./components/DashboardTab";
import OverviewTab from "./components/OverviewTab";
import PortsTab from "./components/PortsTab";
import AIAnalysisTab from "./components/AIAnalysisTab";
import RecommendationsTab from "./components/RecommendationsTab";
import type { PortScanData } from "./portScanData";

const TABS = [
  "Dashboard",
  "Overview",
  "Ports",
  "AI Analysis",
  "Recommendations",
];

export default function PortScanReport() {
  const params = useParams();
  console.log("PortScanReport params:", params);
  const [data, setData] = useState<PortScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      const cdata = await api.get("/scan/" + params?.id);
      setData(cdata?.data.resultData || null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const [activeTab, setActiveTab] = useState(0);
  const { domain } = useParams();
  const selectedDomain = domain
    ? decodeURIComponent(domain)
    : data?.scan.domain || "Loading...";

  if (loading) {
    return (
      <div className="dr-root">
        <main
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "1.5rem 1rem 4rem",
            textAlign: "center",
          }}
        >
          <p>Loading port scan report...</p>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dr-root">
        <main
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "1.5rem 1rem 4rem",
            textAlign: "center",
          }}
        >
          <div className="dr-banner dr-banner--error">
            <p>Failed to load port scan report. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dr-root">
      <main
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "1.5rem 1rem 4rem",
        }}
      >
        <header className="dr-hero">
          <div className="dr-hero-copy">
            <p className="dr-eyebrow">Portscan Report</p>
            <div className="dr-hero-title-row">
              <h1 className="dr-hero-title">{selectedDomain}</h1>
              <span className="dr-status-pill">
                {data.scan.status.toUpperCase()}
              </span>
            </div>
            <p className="dr-hero-sub">
              Detailed port and risk analysis for the selected target, including
              exposure charts, service distribution, and AI-driven
              recommendations.
            </p>
            <div className="dr-hero-links">
              {/* <Link className="dr-back-link" to="/recon/report-lists">
                ← Back to requests
              </Link> */}
              <Link className="dr-back-link" to="/scan/lists">
                View all scan requests
              </Link>
            </div>
          </div>

          <div className="dr-hero-actions">
            <div>
              <span>Open ports</span>
              <strong>{data.scan.ports.length}</strong>
            </div>
            <div>
              <span>Risk score</span>
              <strong>{data.ai_summary.risk_score}/100</strong>
            </div>
            <div>
              <span>Proxy</span>
              <strong>Cloudflare</strong>
            </div>
          </div>
        </header>

        <nav className="dr-nav">
          <span className="dr-nav-title">Report sections</span>
          <div className="dr-nav-tabs">
            {TABS.map((label, index) => (
              <button
                key={label}
                className={`dr-nav-tab ${activeTab === index ? "dr-nav-tab--active" : ""}`}
                onClick={() => setActiveTab(index)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {activeTab === 0 && <DashboardTab data={data} />}
        {activeTab === 1 && <OverviewTab data={data} />}
        {activeTab === 2 && <PortsTab data={data} />}
        {activeTab === 3 && <AIAnalysisTab data={data} />}
        {activeTab === 4 && <RecommendationsTab data={data} />}
      </main>
    </div>
  );
}
