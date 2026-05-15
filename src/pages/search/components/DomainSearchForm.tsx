import type { FormEvent } from "react";

type DomainSearchFormProps = {
  domain: string;
  error: string;
  normalizedDomain: string;
  onDomainChange: (domain: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function DomainSearchForm({
  domain,
  error,
  normalizedDomain,
  onDomainChange,
  onSubmit,
}: DomainSearchFormProps) {
  return (
    <section className="sp-search-panel">
      <div className="sp-copy">
        <h2>Search a domain</h2>
        <p>
          Run a reputation scan and review DNS, certificate, registration, and
          vendor verdict data from the backend scanner.
        </p>
      </div>

      <form className="sp-search" onSubmit={onSubmit}>
        <label htmlFor="domain-search">Domain</label>
        <div className="sp-control">
          <input
            id="domain-search"
            type="text"
            value={domain}
            onChange={(event) => onDomainChange(event.target.value)}
            placeholder="vyshnavpc.com"
            autoComplete="url"
            autoFocus
          />
          <button type="submit">Search</button>
        </div>
        <div className="sp-form-meta">
          <span>
            {normalizedDomain
              ? `Report URL: /domain-report/${normalizedDomain}`
              : "Enter a root domain or full URL"}
          </span>
        </div>
        {error && <p className="sp-error">{error}</p>}
      </form>
    </section>
  );
}
