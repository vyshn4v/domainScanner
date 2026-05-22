import type { PlanEntity } from "../../domain/plans/entities";
import type {
  PlanRepository,
  CreatePlanDto,
  UpdatePlanDto,
} from "../../domain/plans/repository";
import api from "../../core/api/axiosInstance";

export class PlanHttpService implements PlanRepository {
  async getPlans(): Promise<PlanEntity[]> {
    const response = await api.get<PlanEntity[]>("/plan");
    return response.data;
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
