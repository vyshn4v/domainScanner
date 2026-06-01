import api from "../../core/api/axiosInstance";

export interface CreateOrderResponse {
  orderId: string | null;
  amount: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  warning: {
    hasActivePlan: boolean;
    message: string;
    remainingDays: number;
    proratedCredit: number;
    changeType: string;
  } | null;
  proratedCredit: number;
  remainingDays: number;
  noPaymentRequired?: boolean;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface CurrentSubscriptionResponse {
  id: number;
  userId: number;
  planId: number;
  status: string;
  planExpiryDate: string | null;
  plan: {
    id: number;
    planName: string;
  };
}

export class SubscriptionHttpService {
  async createOrder(planId: number): Promise<CreateOrderResponse> {
    const response = await api.post<CreateOrderResponse>(
      "/subscription/create-order",
      { planId },
    );
    return response.data;
  }

  async verifyPayment(
    payload: VerifyPaymentPayload,
  ): Promise<VerifyPaymentResponse> {
    const response = await api.post<VerifyPaymentResponse>(
      "/subscription/verify-payment",
      payload,
    );
    return response.data;
  }

  async getCurrentSubscription(): Promise<CurrentSubscriptionResponse | null> {
    try {
      const response = await api.get<CurrentSubscriptionResponse | null>(
        "/subscription/current",
      );
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
