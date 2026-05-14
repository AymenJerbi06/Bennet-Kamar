import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';
import { getReviews, getReviewStats } from '@/lib/commerceStore';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();

  const reviews = await getReviews();
  return NextResponse.json({
    reviews,
    stats: getReviewStats(reviews),
  });
}
