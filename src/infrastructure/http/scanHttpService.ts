import type { ScanEntity } from "../../domain/scans/entities";
import type {
  ScanRepository,
  ScanQueryParams,
  ScanListResponse,
  RescanParams,
} from "../../domain/scans/repository";
import api from "../../core/api/axiosInstance";

export type DashboardScanStats = {
  totalScans: number;
  byStatus: { status: string; count: number }[];
};

export class ScanHttpService implements ScanRepository {
  async list(params?: ScanQueryParams): Promise<ScanListResponse> {
    const response = await api.get<{
      scanlist: ScanEntity[];
      totalCount: number;
    }>("/scan", {
      params: {
        search: params?.search?.trim() || undefined,
        offset: params?.offset,
        limit: params?.limit,
      },
      signal: params?.signal,
    });
    return response.data;
  }

  async getDashboardStats(): Promise<DashboardScanStats> {
    const response = await api.get<DashboardScanStats>("/dashboard/scan-stats");
    return response.data;
  }

  async create(
    scan: Omit<ScanEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<ScanEntity> {
    const response = await api.post<ScanEntity>("/scan", scan);
    return response.data;
  }

  async rescan(params: RescanParams): Promise<void> {
    const apiType = params.scanType.toLowerCase().includes("web")
      ? "web"
      : "port";
    await api.post(`/scan/${apiType}/${encodeURIComponent(params.domain)}`, {
      domain: params.domain,
      scanOptions: params.scanOptions || [],
    });
  }

  async retry(id: string): Promise<void> {
    await api.post(`/scan/retry/${id}`);
  }

  async getById(id: string): Promise<ScanEntity | null> {
    try {
      const response = await api.get<ScanEntity>(`/scan/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }
}
