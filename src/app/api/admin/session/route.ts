import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  return NextResponse.json({ authenticated: Boolean(admin), admin });
}
