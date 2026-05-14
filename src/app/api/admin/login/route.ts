import { NextRequest, NextResponse } from 'next/server';
import { adminCookie, createAdminSession, getAdminCredentials } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const credentials = getAdminCredentials();

  if (!credentials.email || !credentials.password) {
    return NextResponse.json({ error: 'Admin credentials are not configured.' }, { status: 503 });
  }

  if (body.email !== credentials.email || body.password !== credentials.password) {
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
  }

  const token = createAdminSession(credentials.email);
  return NextResponse.json(
    { ok: true, email: credentials.email },
    { headers: { 'Set-Cookie': adminCookie(token) } },
  );
}
