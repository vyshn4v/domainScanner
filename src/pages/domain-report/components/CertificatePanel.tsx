import type { Certificate } from "../../../types/domainReport";

export function CertificatePanel({
  certificate,
}: {
  certificate?: Certificate;
}) {
  return (
    <div className="dr-two-column">
      <section className="dr-panel">
        <p className="dr-section-comment">HTTPS certificate</p>
        <dl className="dr-kv-block">
          <div className="dr-kv-row">
            <dt>Issuer</dt>
            <dd>
              {certificate?.issuer?.O ?? "Unknown"} /{" "}
              {certificate?.issuer?.CN ?? "Unknown"}
            </dd>
          </div>
          <div className="dr-kv-row">
            <dt>Subject</dt>
            <dd>{certificate?.subject?.CN ?? "Unknown"}</dd>
          </div>
          <div className="dr-kv-row">
            <dt>Valid from</dt>
            <dd>{certificate?.validity?.not_before ?? "Unknown"}</dd>
          </div>
          <div className="dr-kv-row">
            <dt>Valid to</dt>
            <dd>{certificate?.validity?.not_after ?? "Unknown"}</dd>
          </div>
          <div className="dr-kv-row">
            <dt>Public key</dt>
            <dd>
              {certificate?.public_key?.algorithm ?? "Unknown"} /{" "}
              {certificate?.public_key?.ec?.oid ?? "Unknown"}
            </dd>
          </div>
        </dl>
      </section>
      <section className="dr-panel">
        <p className="dr-section-comment">Subject alternative names</p>
        <div className="dr-chip-list">
          {certificate?.extensions?.subject_alternative_name?.map((name) => (
            <span className="dr-chip" key={name}>
              {name}
            </span>
          ))}
        </div>
        <p className="dr-hash-label">SHA256 thumbprint</p>
        <p className="dr-hash">{certificate?.thumbprint_sha256 ?? "Unknown"}</p>
      </section>
    </div>
  );
}
