'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { PlanType, PlanInfo, PLANS } from '@/constants/plans';

interface PlanContextType {
  plan: PlanInfo | null;
  setPlan: (plan: PlanInfo) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export { PLANS, type PlanType };

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanInfo | null>(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    }
  }, []);

  return (
    <PlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
