import { useState, useEffect } from "react";
import { PlanHttpService } from "../../../../infrastructure/http/planHttpService";
import type { PlanEntity } from "../../../../domain/plans/entities";
import "./PlanSelection.css";

const planService = new PlanHttpService();

export function PlanSelection() {
  const [plans, setPlans] = useState<PlanEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<number | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const fetchedPlans = await planService.getPlans();
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleSelectPlan = (planId: number) => {
    // If it's the free/hobby plan (id usually 1 or 0), handle differently if needed
    setLoadingPlan(planId);
    
    // Simulate an API call / redirect to Stripe checkout
    setTimeout(() => {
      setLoadingPlan(null);
      alert("Redirecting to checkout...");
    }, 800);
  };

  if (loading) {
    return <div className="ps-loading">Loading plans...</div>;
  }

  return (
    <section className="ps-root">
      <div className="ps-header">
        <h2 className="ps-title">Plan & Billing</h2>
        <p className="ps-subtitle">Manage your subscription and billing details.</p>
      </div>

      <div className="ps-grid">
        {plans.map((plan) => {
          const isPro = plan.planName.toLowerCase().includes("pro");
          const isCurrent = false; // TODO: Implement current plan logic based on user subscription
          
          return (
            <div 
              key={plan.id} 
              className={`ps-card ${isPro ? "ps-card--pro" : ""}`}
            >
              {isPro && <span className="ps-badge">Most Popular</span>}
              
              <h3 className="ps-plan-name">{plan.planName}</h3>
              <div className="ps-plan-price">
                <span className="ps-plan-currency">$</span>
                {plan.price}
                <span className="ps-plan-period">/mo</span>
              </div>
              
              <ul className="ps-features">
                  <li className="ps-feature">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {plan.requestPerPlan} requests per plan
                  </li>
                  <li className="ps-feature">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {plan.planValidityDays} days validity
                  </li>
                  {plan.isPermanentPlan && (
                    <li className="ps-feature">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                {loadingPlan === plan.id ? "Processing..." : isCurrent ? "Current Plan" : "Select Plan"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
