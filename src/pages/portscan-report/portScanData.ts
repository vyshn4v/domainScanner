export const defaultData = {
  success: true,
  scan: {
    domain: "vyshnavpc.com",
    ip: "104.21.92.34",
    status: "up",
    ports: [
      {
        port: 80,
        protocol: "tcp",
        state: "open",
        service: "http",
        product: "Cloudflare http proxy",
      },
      {
        port: 443,
        protocol: "tcp",
        state: "open",
        service: "http",
        product: "Cloudflare http proxy",
      },
      {
        port: 8080,
        protocol: "tcp",
        state: "open",
        service: "http",
        product: "Cloudflare http proxy",
      },
      {
        port: 8443,
        protocol: "tcp",
        state: "open",
        service: "http",
        product: "Cloudflare http proxy",
      },
    ],
  },
  ai_summary: {
    executive_summary:
      "The domain vyshnavpc.com is actively using Cloudflare as a reverse proxy, with web services exposed on standard HTTP (80), HTTPS (443), and non-standard HTTP ports (8080, 8443). While Cloudflare provides a protective layer, the presence of multiple proxied web ports expands the attack surface for potential web application vulnerabilities behind the proxy.",
    risk_assessment:
      "The overall security posture, based purely on this network scan, presents a moderate risk. The direct IP exposure is mitigated by Cloudflare, preventing many direct network-level attacks. However, the reliance on Cloudflare shifts the focus of risk to the security of the web applications and services running on the origin server. Multiple open HTTP/HTTPS ports, particularly 8080 and 8443, could indicate distinct web applications or configurations, each representing a potential entry point if not properly secured, patched, and configured. The primary risk lies within the application layer vulnerabilities rather than direct infrastructure exposure.",
    exposed_services: [
      "HTTP (Port 80) proxied by Cloudflare",
      "HTTPS (Port 443) proxied by Cloudflare",
      "HTTP (Port 8080) proxied by Cloudflare",
      "HTTP (Port 8443) proxied by Cloudflare",
    ],
    recommendations: [
      "Ensure all web applications and services behind Cloudflare are regularly patched, updated, and free of known vulnerabilities.",
      "Utilize Cloudflare's Web Application Firewall (WAF) and other security features to their full potential to protect against common web exploits.",
      "Review the necessity of exposing web services on non-standard ports (8080, 8443). If not critical, consider restricting access or consolidating services.",
      "Implement robust logging and monitoring for all web applications to detect and respond to suspicious activity promptly.",
      "Conduct regular application security testing (SAST/DAST) on all web properties to identify and remediate vulnerabilities.",
    ],
    risk_score: 45,
  },
  graph_data: {
    severity_breakdown: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 2,
    },
    port_state_chart: [
      { name: "Open", value: 4 },
      { name: "Closed", value: 0 },
      { name: "Filtered", value: 0 },
    ],
    service_chart: [{ service: "http", count: 4 }],
    service_risk_chart: [
      { service: "http", risk_score: 68, count: 4 },
      { service: "ssh", risk_score: 90, count: 1 },
      { service: "database", risk_score: 72, count: 2 },
    ],
    risk_heatmap: [
      { port: 80, service: "http", risk: 30 },
      { port: 443, service: "http", risk: 30 },
      { port: 8080, service: "http", risk: 35 },
      { port: 8443, service: "http", risk: 35 },
    ],
    radar_data: [
      { category: "Network Exposure", score: 4 },
      { category: "Application Security", score: 7 },
      { category: "Configuration", score: 6 },
      { category: "Vulnerability Management", score: 7 },
      { category: "Access Control", score: 5 },
    ],
    vulnerability_timeline: [
      { date: "2024-05-01", vulnerabilities: 2, risk_score: 45 },
      { date: "2024-05-08", vulnerabilities: 3, risk_score: 55 },
      { date: "2024-05-15", vulnerabilities: 4, risk_score: 65 },
    ],
    protocol_distribution: [
      { protocol: "TCP", count: 4 },
      { protocol: "UDP", count: 0 },
    ],
    port_range_distribution: [
      { range: "Well-known (1-1023)", count: 4 },
      { range: "Registered (1024-49151)", count: 0 },
      { range: "Dynamic (49152-65535)", count: 0 },
    ],
    service_version_chart: [
      { service: "http", version: "Cloudflare http proxy", count: 4 },
    ],
    risk_trend: [
      { time: "00:00", risk_level: 45 },
      { time: "06:00", risk_level: 50 },
      { time: "12:00", risk_level: 55 },
      { time: "18:00", risk_level: 60 },
    ],
    attack_surface: {
      total_ports: 4,
      open_ports: 4,
      closed_ports: 0,
      filtered_ports: 0,
      risky_ports: 4,
    },
  },
};

export type PortScanData = typeof defaultData;
