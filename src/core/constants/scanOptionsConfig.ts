export interface ScanMode {
  value: string;
  label: string;
  description: string;
  badge?: string;
}

/**
 * SCAN MODE PRESETS
 * Friendly definitions shown to the user in the UI.
 * The actual nmap flags are resolved entirely on the backend consumer.
 */
export const SCAN_MODES: ScanMode[] = [
  {
    value: "quick",
    label: "Quick",
    description: "Top 100 ports only. Fastest option, good for a first look.",
  },
  {
    value: "standard",
    label: "Standard",
    description: "Top 1000 most common ports. Balanced speed and coverage.",
    badge: "Default",
  },
  {
    value: "full",
    label: "Full",
    description: "All 65,535 ports scanned. Thorough but slower.",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    description: "All ports + OS detection + version + scripts. Can take 10–30 min.",
    badge: "Slow",
  },
  {
    value: "vulnerability",
    label: "Vulnerability",
    description: "Runs NSE vulnerability scripts on all ports. Best for security audits.",
    badge: "Slow",
  },
];

export const SCAN_MODES_BY_TYPE: Record<string, ScanMode[]> = {
  "Vulnerability Scan": SCAN_MODES,
  "Web Audit": [],
};

export const DEFAULT_SCAN_MODE = "standard";
