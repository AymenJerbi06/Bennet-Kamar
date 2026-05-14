import { NextResponse } from 'next/server';
import { getPromoCodes } from '@/lib/commerceStore';

export const runtime = 'nodejs';

export async function GET() {
  const promos = await getPromoCodes();
  return NextResponse.json(promos.filter(promo => promo.active));
}
