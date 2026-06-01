import type { PlanEntity } from "../../domain/plans/entities";
import type {
  PlanRepository,
  CreatePlanDto,
  UpdatePlanDto,
} from "../../domain/plans/repository";
import api from "../../core/api/axiosInstance";

const CACHE_TTL_MS = 30_000; // 30 seconds

let planCache: { data: PlanEntity[]; expiresAt: number } | null = null;

export class PlanHttpService implements PlanRepository {
  async getPlans(): Promise<PlanEntity[]> {
    const now = Date.now();
    if (planCache && now < planCache.expiresAt) {
      return planCache.data;
    }
    const response = await api.get<PlanEntity[]>("/plan");
    planCache = { data: response.data, expiresAt: now + CACHE_TTL_MS };
    return response.data;
  }

  invalidateCache() {
    planCache = null;
  }

  async createPlan(data: CreatePlanDto): Promise<PlanEntity> {
    const response = await api.post<PlanEntity>("/plan", data);
    return response.data;
  }

  async updatePlan(id: number, data: UpdatePlanDto): Promise<PlanEntity> {
    const response = await api.put<PlanEntity>(`/plan/${id}`, data);
    return response.data;
  }

  async deletePlan(id: number): Promise<void> {
    await api.delete(`/plan/${id}`);
  }
}
