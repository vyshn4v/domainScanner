const coverageItems = [
  {
    id: "01",
    title: "Threat verdict",
    description: "Vendor results grouped by harmless, undetected, and flagged status.",
  },
  {
    id: "02",
    title: "DNS records",
    description: "Nameservers and active DNS records from the latest scan response.",
  },
  {
    id: "03",
    title: "Certificate",
    description: "TLS issuer, validity, public key, and subject alternative names.",
  },
];

export function CoverageGrid() {
  return (
    <section className="sp-info-grid" aria-label="Report coverage">
      {coverageItems.map((item) => (
        <article key={item.id}>
          <span>{item.id}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}
