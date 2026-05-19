import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { CertificatePanel } from "./components/CertificatePanel";
import { DnsPanel } from "./components/DnsPanel";
import { EnginesPanel } from "./components/EnginesPanel";
import { OverviewPanel } from "./components/OverviewPanel";
import { ReportHeader } from "./components/ReportHeader";
import { ReportTabs } from "./components/ReportTabs";
import { StatGrid } from "./components/StatGrid";
import { StatusMessage } from "./components/StatusMessage";
import type {
  AnalysisStats,
  DomainAttributes,
  ScannerResponse,
} from "../../types/domainReport";
import {
  emptyStats,
  getVcardValue,
  type ReportTab,
} from "./utils/reportUtils";
import "./DomainReport.css";

export default function DomainReport() {
  const { domain } = useParams();
  const [response, setResponse] = useState<ScannerResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [visibleTab, setVisibleTab] = useState<ReportTab>("overview");
  const [isChangingTab, setIsChangingTab] = useState(false);
  const [showAllEngines, setShowAllEngines] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRescanning, setIsRescanning] = useState(false);

  const loadReport = async (controller: AbortController) => {
    if (!domain) {
      setResponse(null);
      setError("No domain was provided in the report URL.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setResponse(null);

      const result = await api.get<ScannerResponse>(
        `/scan/domain/${encodeURIComponent(domain)}`,
        { signal: controller.signal },
      );

      setResponse(result.data);
    } catch (requestError) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load scanner data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescan = async () => {
    if (!domain) return;

    setIsRescanning(true);
    try {
      await api.post(`/scan/domain/${encodeURIComponent(domain)}`);
      toast.success("Rescan request sent — please check again later.");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send rescan request.",
      );
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to initiate rescan",
      );
    } finally {
      setIsRescanning(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    startTransition(() => {
      void loadReport(controller);
    });

    return () => controller.abort();
  }, [domain]);

  useLayoutEffect(() => {
    if (activeTab === visibleTab) return;

    startTransition(() => setIsChangingTab(true));
    const swapTimer = window.setTimeout(() => {
      setVisibleTab(activeTab);
      window.requestAnimationFrame(() => setIsChangingTab(false));
    }, 140);

    return () => window.clearTimeout(swapTimer);
  }, [activeTab, visibleTab]);

  const report = response?.data?.data;
  const attributes: DomainAttributes = report?.attributes ?? {};
  const stats: AnalysisStats = {
    ...emptyStats,
    ...attributes.last_analysis_stats,
  };
  const engines = useMemo(
    () => Object.values(attributes.last_analysis_results ?? {}),
    [attributes.last_analysis_results],
  );
  const totalEngines = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0,
  );
  const cleanPercent = Math.round(
    (stats.harmless / Math.max(totalEngines, 1)) * 100,
  );
  const flaggedEngines = engines.filter(
    (engine) =>
      engine.category === "malicious" || engine.category === "suspicious",
  );
  const harmlessEngines = engines.filter(
    (engine) => engine.category === "harmless",
  );
  const undetectedEngines = engines.filter(
    (engine) => engine.category === "undetected",
  );
  const registrar = attributes.rdap?.entities?.find((entity) =>
    entity.roles?.includes("registrar"),
  );
  const abuse = registrar?.entities?.find((entity) =>
    entity.roles?.includes("abuse"),
  );
  const registrationDate = attributes.rdap?.events?.find(
    (event) => event.event_action === "registration",
  )?.event_date;
  const expirationDate = attributes.rdap?.events?.find(
    (event) => event.event_action === "expiration",
  )?.event_date;
  const verdict =
    stats.malicious || stats.suspicious ? "Review needed" : "Clean";

  if (isLoading) {
    return <StatusMessage message="Loading scanner data from backend..." />;
  }

  if (error || !report) {
    return (
      <StatusMessage
        message={
          error || "Scanner response did not include domain report data."
        }
        tone="error"
        showBackLink
      />
    );
  }

  return (
    <main className="dr-root">
      <section className="dr-main">
        <ReportHeader
          report={report}
          attributes={attributes}
          verdict={verdict}
          onRescan={handleRescan}
          isRescanning={isRescanning}
        />
        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <StatGrid stats={stats} />

        <section
          className={`dr-content ${isChangingTab ? "dr-content--exiting" : ""}`}
        >
          {visibleTab === "overview" && (
            <OverviewPanel
              attributes={attributes}
              stats={stats}
              cleanPercent={cleanPercent}
              totalEngines={totalEngines}
              flaggedCount={flaggedEngines.length}
              registrarName={getVcardValue(registrar, "fn") ?? "Unknown"}
              abuseEmail={getVcardValue(abuse, "email") ?? "Unknown"}
              registrationDate={registrationDate}
              expirationDate={expirationDate}
            />
          )}
          {visibleTab === "dns" && <DnsPanel attributes={attributes} />}
          {visibleTab === "certificate" && (
            <CertificatePanel certificate={attributes.last_https_certificate} />
          )}
          {visibleTab === "engines" && (
            <EnginesPanel
              engines={engines}
              harmlessCount={harmlessEngines.length}
              undetectedCount={undetectedEngines.length}
              flaggedCount={flaggedEngines.length}
              showAllEngines={showAllEngines}
              onToggleShowAll={() => setShowAllEngines((value) => !value)}
            />
          )}
        </section>
      </section>

      <footer className="dr-footer">
        <span>Data sourced from VirusTotal</span>
        {report.links?.self && (
          <>
            <span className="dr-footer-sep">/</span>
            <a href={report.links.self} target="_blank" rel="noreferrer">
              API source
            </a>
          </>
        )}
      </footer>
    </main>
  );
}
