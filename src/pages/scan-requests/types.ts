export type Status =
  | "scheduled"
  | "running"
  | "completed"
  | "failed"
  | "queued";
export type Severity = "critical" | "high" | "medium" | "low" | "none";

export interface ScanRequest {
  id: string;
  requestedFor: string;
  severity: Severity;
  status: Status;
  type: string;
}
