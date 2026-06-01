import type { ScanEntity, ScanStatus } from "./entities";

export interface ScanQueryParams {
  search?: string;
  offset?: number;
  limit?: number;
  status?: ScanStatus | "all";
  signal?: AbortSignal;
}

export interface ScanListResponse {
  scanlist: ScanEntity[];
  totalCount: number;
}

export interface RescanParams {
  domain: string;
  scanType: string;
  scanOptions?: string[];
}

export interface ScanRepository {
  list(params?: ScanQueryParams): Promise<ScanListResponse>;
  create(
    scan: Omit<ScanEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<ScanEntity>;
  rescan(params: RescanParams): Promise<void>;
  retry(id: string): Promise<void>;
  getById(id: string): Promise<ScanEntity | null>;
}
