export type PromoAppliesTo = 'subtotal' | 'total';

export type PromoCodeRecord = {
  id: string;
  code: string;
  label: string;
  active: boolean;
  percentage: number;
  appliesTo: PromoAppliesTo;
  waivesDelivery: boolean;
  usageCount: number;
  createdAt: string;
};

export const defaultPromoCodes: PromoCodeRecord[] = [
  {
    id: 'promo-kamar10',
    code: 'KAMAR10',
    label: '10% off products',
    active: true,
    percentage: 0.1,
    appliesTo: 'subtotal',
    waivesDelivery: false,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'promo-kamar-el-sem7a',
    code: 'KAMARELSEM7A',
    label: '10% off total including delivery',
    active: true,
    percentage: 0.1,
    appliesTo: 'total',
    waivesDelivery: false,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'promo-free-delivery-10',
    code: 'FREEDELIVERY10',
    label: 'Free delivery reserved',
    active: true,
    percentage: 0,
    appliesTo: 'subtotal',
    waivesDelivery: true,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];
