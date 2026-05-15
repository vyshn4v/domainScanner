import { reportTabs, type ReportTab } from "../utils/reportUtils";

type ReportTabsProps = {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
};

export function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  return (
    <nav className="dr-nav" aria-label="Domain report navigation">
      <div className="dr-nav-title">
        <span>Report sections</span>
      </div>
      <div className="dr-nav-tabs" role="tablist" aria-label="Report sections">
        {reportTabs.map((tab) => (
          <button
            key={tab}
            className={`dr-nav-tab ${activeTab === tab ? "dr-nav-tab--active" : ""}`}
            onClick={() => onTabChange(tab)}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
          >
            {tab === "dns" ? "DNS" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </nav>
  );
}
