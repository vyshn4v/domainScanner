import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { CoverageGrid } from "./components/CoverageGrid";
import { DomainSearchForm } from "./components/DomainSearchForm";
import { EndpointFooter } from "./components/EndpointFooter";
import { SearchHeader } from "./components/SearchHeader";
import { normalizeDomain } from "./utils/searchUtils";
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
