export type PlanType = 'basic' | 'premium';

export interface PlanInfo {
  type: PlanType;
  maxPhotos: number;
  duration: '1 ano' | 'vitalício';
  price: number;
}

export const PLANS: Record<PlanType, PlanInfo> = {
  basic: {
    type: 'basic',
    maxPhotos: 3,
    duration: '1 ano',
    price: 1.0,
  },
  premium: {
    type: 'premium',
    maxPhotos: 6,
    duration: 'vitalício',
    price: 29.9,
  },
} as const;
