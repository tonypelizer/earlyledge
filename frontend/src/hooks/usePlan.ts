import { useCallback, useEffect, useState } from "react";

import { api } from "../api";
import type { PlanInfo } from "../types";

const DEFAULT_PLAN: PlanInfo = {
  plan: "free",
  is_plus: false,
  max_children: 1,
  visibility_days: 90,
  personalized_suggestions: false,
  printable_reports: false,
  long_term_trends: false,
  started_at: null,
  ends_at: null,
  upgrade_url: "/pricing",
};

export function usePlan() {
  const [plan, setPlan] = useState<PlanInfo>(DEFAULT_PLAN);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    try {
      const response = await api.get("/me/plan/");
      setPlan(response.data);
    } catch {
      // If the endpoint fails, assume Free plan defaults
      setPlan(DEFAULT_PLAN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    plan,
    loading,
    refetchPlan: fetchPlan,
    // Convenience aliases
    planName: plan.plan,
    isPlus: plan.is_plus,
    maxChildren: plan.max_children,
    visibilityDays: plan.visibility_days,
    upgradeUrl: plan.upgrade_url,
  };
}
