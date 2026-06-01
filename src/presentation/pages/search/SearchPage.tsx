import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { CoverageGrid } from "./components/CoverageGrid";
import { DomainSearchForm } from "./components/DomainSearchForm";
import { EndpointFooter } from "./components/EndpointFooter";
import { SearchHeader } from "./components/SearchHeader";
import { normalizeDomain } from "../../../core/utils/searchUtils";
import "./SearchPage.css";

export default function SearchPage() {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const normalizedDomain = normalizeDomain(domain);
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedDomain || !normalizedDomain.includes(".")) {
      setError("Enter a valid domain, for example vyshnavpc.com");
      return;
    }

    setError("");
    navigate(`/scan/domain/${encodeURIComponent(normalizedDomain)}`);
  }

  function handleDomainChange(nextDomain: string) {
    setDomain(nextDomain);
    setError("");
  }

  return (
    <main className="sp-root">
      <section className="sp-layout">
        <SearchHeader />
        
        <div className="sp-privacy-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p>
            <strong>Privacy First:</strong> Your domain lookup queries and results are completely anonymous and are <strong>not stored</strong> in our database. Scan responses are securely sourced in association with <strong>VirusTotal</strong>.
          </p>
        </div>

        <DomainSearchForm
          domain={domain}
          error={error}
          normalizedDomain={normalizedDomain}
          onDomainChange={handleDomainChange}
          onSubmit={handleSubmit}
        />
        <CoverageGrid />
        <EndpointFooter />
      </section>
    </main>
  );
}
