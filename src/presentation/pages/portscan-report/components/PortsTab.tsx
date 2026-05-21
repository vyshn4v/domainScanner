import type { PortScanData } from "../../../../core/types/portScanData";

export default function PortsTab({ data }: { data: PortScanData }) {
  const { scan } = data;
  const stateColors: Record<string, string> = {
    open: "green",
    closed: "red",
    filtered: "yellow",
  };

  return (
    <div className="dr-content">
      <p className="dr-section-comment">
        Open Ports — {scan.ports.length} found
      </p>
      <div className="dr-dns-block">
        <div
          className="dr-dns-header"
          style={{ gridTemplateColumns: "70px 80px minmax(0,1fr) 1fr" }}
        >
          <span>Port</span>
          <span>Protocol</span>
          <span>Service</span>
          <span>Product</span>
        </div>
        {data.scan.ports.map((p: any) => (
          <div
            key={p.port}
            className="dr-dns-row"
            style={{ gridTemplateColumns: "70px 80px minmax(0,1fr) 1fr" }}
          >
            <span
              className={`dr-dns-type dr-dns-type--${stateColors[p.state] || "muted"}`}
            >
              {p.port}
            </span>
            <span className="dr-dns-value">{p.protocol.toUpperCase()}</span>
            <span className="dr-dns-value">{p.service}</span>
            <span className="dr-dns-value">{p.product}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <p className="dr-section-comment">Exposed Services</p>
        <div className="dr-chip-list">
          {data.ai_summary.exposed_services.map((svc: string, i: number) => (
            <span key={i} className="dr-chip">
              {svc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
