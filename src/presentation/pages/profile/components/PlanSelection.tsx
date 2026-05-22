import { useState } from "react";
import "./PlanSelection.css";

const PLANS = [
  {
    id: "hobby",
    name: "Hobby",
    price: "0",
    features: [
      "Up to 5 basic web scans per month",
      "Standard vulnerability detection",
      "Community support",
      "7-day data retention"
    ],
    buttonText: "Current Plan",
    isCurrent: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "29",
    isPopular: true,
    features: [
      "Unlimited advanced web scans",
      "Deep AI risk analysis & trends",
      "Continuous background monitoring",
      "Priority queue & email support",
      "Export PDF/CSV reports"
    ],
    buttonText: "Upgrade to Pro",
    isCurrent: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "99",
    features: [
      "Everything in Pro",
      "Custom integrations & Webhooks",
      "White-labeled PDF reports",
      "Dedicated account manager",
      "SSO & advanced team roles"
    ],
    buttonText: "Contact Sales",
    isCurrent: false,
  }
];

export function PlanSelection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (planId === "hobby") return;
    setLoadingPlan(planId);
    
    // Simulate an API call / redirect to Stripe checkout
    setTimeout(() => {
      setLoadingPlan(null);
      if (planId === "enterprise") {
        window.location.href = "mailto:sales@domainscanner.com?subject=Enterprise Plan Inquiry";
      } else {
        alert("Redirecting to checkout for the Pro plan...");
      }
    }, 800);
  };

  return (
    <section className="ps-root">
      <div className="ps-header">
        <h2 className="ps-title">Plan & Billing</h2>
        <p className="ps-subtitle">Manage your subscription and billing details.</p>
      </div>

      <div className="ps-grid">
        {PLANS.map((plan) => {
          const isPro = plan.id === "pro";
          return (
            <div 
              key={plan.id} 
              className={`ps-card ${isPro ? "ps-card--pro" : ""}`}
            >
              {plan.isPopular && <span className="ps-badge">Most Popular</span>}
              
              <h3 className="ps-plan-name">{plan.name}</h3>
              <div className="ps-plan-price">
                <span className="ps-plan-currency">$</span>
                {plan.price}
                <span className="ps-plan-period">/mo</span>
              </div>
              
              <ul className="ps-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="ps-feature">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`ps-btn ${isPro ? "ps-btn--pro" : plan.isCurrent ? "" : "ps-btn--primary"}`}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={plan.isCurrent || loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? "Processing..." : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
