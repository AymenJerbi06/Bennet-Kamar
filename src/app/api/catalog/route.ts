import { NextResponse } from 'next/server';
import { getCatalog, getReviews, getReviewStats } from '@/lib/commerceStore';

export const runtime = 'nodejs';

export async function GET() {
  const [catalog, reviews] = await Promise.all([getCatalog(), getReviews()]);
  return NextResponse.json({
    ...catalog,
    reviewStats: getReviewStats(reviews),
  });
}
