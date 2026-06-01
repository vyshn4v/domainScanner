import type { PlanEntity } from "./entities";

export interface CreatePlanDto {
  planName: string;
  requestPerPlan: number;
  isPermanentPlan: boolean;
  expiryDate?: Date | string;
  planValidityDays: number;
  price: number;
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {}

export interface PlanRepository {
  getPlans(): Promise<PlanEntity[]>;
  createPlan(data: CreatePlanDto): Promise<PlanEntity>;
  updatePlan(id: number, data: UpdatePlanDto): Promise<PlanEntity>;
  deletePlan(id: number): Promise<void>;
}
