import type { AnalysisStats, RdapEntity } from "../types/domainReport";

export const scannerUrl = import.meta.env.VITE_SCANNER_URL ?? "/api";

export const reportTabs = [
  "overview",
  "dns",
  "certificate",
  "engines",
] as const;

export type ReportTab = (typeof reportTabs)[number];

export const emptyStats: AnalysisStats = {
  malicious: 0,
  suspicious: 0,
  undetected: 0,
  harmless: 0,
  timeout: 0,
};

export const dnsColorByType: Record<string, string> = {
  A: "green",
  AAAA: "blue",
  NS: "yellow",
  SOA: "purple",
};

export const formatUnixDate = (seconds?: number) => {
  if (!seconds) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(seconds * 1000));
};

export const formatIsoDate = (value?: string) => {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export function getVcardValue(entity: RdapEntity | undefined, key: string) {
  return entity?.vcard_array?.find((item) => item.name === key)?.values?.[0];
}
