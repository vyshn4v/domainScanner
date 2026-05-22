export interface PlanEntity {
  id: number;
  planName: string;
  requestPerPlan: number;
  isPermanentPlan: boolean;
  expiryDate: string | null;
  planValidityDays: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionEntity {
  id: number;
  userId: number;
  planId: number;
  planExpiryDate: string | null;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
}
