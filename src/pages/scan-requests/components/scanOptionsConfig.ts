export interface ScanOptionEntry {
  flag: string;
  description: string;
}

export const NMAP_OPTIONS: ScanOptionEntry[] = [
  { flag: "-v", description: "Verbose logging" },
  { flag: "-r", description: "Resolve DNS names" },
  { flag: "-o", description: "Output results to file" },
  { flag: "-f", description: "Fast scan mode" },
  { flag: "-sS", description: "SYN stealth scan" },
  { flag: "-sT", description: "TCP connect scan" },
  { flag: "-sU", description: "UDP scan" },
  { flag: "-sV", description: "Version detection" },
  { flag: "-O", description: "OS fingerprinting" },
  { flag: "-A", description: "Aggressive scan (OS + version + scripts)" },
  { flag: "-p-", description: "Scan all ports (1–65535)" },
  { flag: "--top-ports", description: "Scan only top N ports" },
  { flag: "--script", description: "Run NSE scripts" },
  { flag: "--traceroute", description: "Trace network path" },
  { flag: "--no-ping", description: "Skip host discovery" },
];

export const WEB_AUDIT_OPTIONS: ScanOptionEntry[] = [
  { flag: "--crawl", description: "Crawl web links and directories" },
  { flag: "--xss", description: "Detect Cross-Site Scripting (XSS)" },
  { flag: "--sql-injection", description: "Detect SQL Injection vulnerabilities" },
  { flag: "--headers", description: "Verify secure HTTP response headers" },
  { flag: "--ssl-ciphers", description: "Check SSL/TLS ciphers and protocols" },
];

export const SCAN_OPTIONS_BY_TYPE: Record<string, ScanOptionEntry[]> = {
  "Vulnerability Scan": NMAP_OPTIONS,
  "Web Audit": WEB_AUDIT_OPTIONS,
};

export const SCAN_OPTIONS_MAP: Record<string, ScanOptionEntry> = {};
[...NMAP_OPTIONS, ...WEB_AUDIT_OPTIONS].forEach((opt) => {
  SCAN_OPTIONS_MAP[opt.flag] = opt;
});

export function getScanOptionDescription(flag: string): string {
  return SCAN_OPTIONS_MAP[flag]?.description ?? flag;
}
