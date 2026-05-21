import type { DomainAttributes } from "../../../../core/types/domainReport";
import { dnsColorByType } from "../../../../core/utils/reportUtils";

export function DnsPanel({ attributes }: { attributes: DomainAttributes }) {
  return (
    <section className="dr-panel">
      <p className="dr-section-comment">DNS records</p>
      <div className="dr-ns-block">
        {attributes.rdap?.nameservers?.map((ns: any) => (
          <div className="dr-ns-row" key={ns.ldh_name}>
            <span />
            {ns.ldh_name}
          </div>
        ))}
      </div>
      <div className="dr-dns-block">
        <div className="dr-dns-header">
          <span>Type</span>
          <span>Value</span>
          <span>TTL</span>
        </div>
        {attributes.last_dns_records?.map((record: any, index: any) => (
          <div
            className="dr-dns-row"
            key={`${record.type}-${record.value}-${index}`}
          >
            <span
              className={`dr-dns-type dr-dns-type--${
                dnsColorByType[record.type] || "muted"
              }`}
            >
              {record.type}
            </span>
            <span className="dr-dns-value">{record.value}</span>
            <span className="dr-dns-ttl">{record.ttl}s</span>
          </div>
        ))}
      </div>
    </section>
  );
}
