'use client';

import { createContext, useContext, useState } from 'react';

export type PlanType = 'basic' | 'premium';

interface PlanInfo {
  type: PlanType;
  maxPhotos: number;
  duration: '1 ano' | 'vitalício';
  price: number;
}

interface PlanContextType {
  plan: PlanInfo | null;
  setPlan: (plan: PlanInfo) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const plans: Record<PlanType, PlanInfo> = {
  basic: {
    type: 'basic',
    maxPhotos: 3,
    duration: '1 ano',
    price: 19.9,
  },
  premium: {
    type: 'premium',
    maxPhotos: 6,
    duration: 'vitalício',
    price: 29.9,
  },
};

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanInfo | null>(null);

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
