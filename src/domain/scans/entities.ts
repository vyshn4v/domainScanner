export type ScanStatus =
  | "scheduled"
  | "running"
  | "completed"
  | "failed"
  | "queued";

export type ScanSeverity = "critical" | "high" | "medium" | "low" | "none";

export interface ScanEntity {
  id: string;
  domain: string;
  requestedFor?: string;
  severity: ScanSeverity;
  status: ScanStatus;
  type: string;
  scanType?: string;
  createdAt?: string;
  updatedAt?: string;
  scanOptions?: string[];
}
