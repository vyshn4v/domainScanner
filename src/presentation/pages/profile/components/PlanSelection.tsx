import { useState, useEffect } from "react";
import { PlanHttpService } from "../../../../infrastructure/http/planHttpService";
import { SubscriptionHttpService } from "../../../../infrastructure/http/subscriptionHttpService";
import type { PlanEntity } from "../../../../domain/plans/entities";
import "./PlanSelection.css";

const planService = new PlanHttpService();
const subscriptionService = new SubscriptionHttpService();

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PlanSelection() {
  const [plans, setPlans] = useState<PlanEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedPlans = await planService.getPlans();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Failed to fetch plans data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectPlan = async (planId: number) => {
    setLoadingPlan(planId);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const orderData = await subscriptionService.createOrder(planId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DomainShield",
        description: "Plan Subscription",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await subscriptionService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.success) {
              alert("Payment successful! Your subscription is active.");
              planService.invalidateCache();
              loadData();
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Error verifying payment.");
          }
        },
        theme: { color: "#3b82f6" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate checkout.");
    } finally {
      setLoadingPlan(null);
    }
  };

  if (loading) {
    return <div className="ps-loading">Loading plans...</div>;
  }

  return (
    <section className="ps-root">
      <div className="ps-header">
        <h2 className="ps-title">Plan & Billing</h2>
        <p className="ps-subtitle">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="ps-grid">
        {plans.map((plan) => {
          const isPro = plan.planName.toLowerCase().includes("pro");
          const isCurrent = plan.isCurrentPlan;
          const period = plan.billingCycle === "yearly" ? "yr" : "mo";

          return (
            <div
              key={plan.id}
              className={`ps-card ${isPro ? "ps-card--pro" : ""}`}
            >
              {isPro && <span className="ps-badge">Most Popular</span>}

              <h3 className="ps-plan-name">{plan.planName}</h3>
              <div className="ps-plan-price">
                <span className="ps-plan-currency">₹</span>
                {plan.price}
                <span className="ps-plan-period">/{period}</span>
              </div>

              <ul className="ps-features">
                <li className="ps-feature">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {plan.requestPerPlan} requests per plan
                </li>
                <li className="ps-feature">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {plan.planValidityDays} days validity
                </li>
                {plan.isPermanentPlan && (
                  <li className="ps-feature">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Permanent Plan
                  </li>
                )}
              </ul>

              <button
                className={`ps-btn ${isPro ? "ps-btn--pro" : isCurrent ? "" : "ps-btn--primary"}`}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrent || loadingPlan === plan.id}
              >
                {loadingPlan === plan.id
                  ? "Processing..."
                  : isCurrent
                    ? "Current Plan"
                    : "Select Plan"}
              </button>
            </div>
          );
        })}

        {plans.length === 0 && (
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              textAlign: "center",
              gridColumn: "1/-1",
              padding: "2rem 0",
            }}
          >
            No plans available yet.
          </p>
        )}
      </div>
    </section>
  );
}
