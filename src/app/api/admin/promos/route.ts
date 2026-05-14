import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';
import { getPromoCodes, savePromoCodes } from '@/lib/commerceStore';
import type { PromoCodeRecord } from '@/lib/promos';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();
  return NextResponse.json(await getPromoCodes());
}

export async function PUT(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();
  const body = await request.json() as { promos?: PromoCodeRecord[] };

  if (!Array.isArray(body.promos)) {
    return NextResponse.json({ error: 'Promo codes array is required.' }, { status: 400 });
  }

  const promos: PromoCodeRecord[] = body.promos.map(promo => ({
    ...promo,
    code: String(promo.code || '').trim().toUpperCase(),
    percentage: Math.max(0, Math.min(1, Number(promo.percentage) || 0)),
    usageCount: Math.max(0, Number(promo.usageCount) || 0),
    active: Boolean(promo.active),
    waivesDelivery: Boolean(promo.waivesDelivery),
    appliesTo: promo.appliesTo === 'total' ? 'total' as const : 'subtotal' as const,
  }));

  return NextResponse.json(await savePromoCodes(promos));
}
