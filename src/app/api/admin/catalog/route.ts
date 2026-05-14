import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';
import { getCatalog, saveCatalog, type Catalog } from '@/lib/commerceStore';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();
  return NextResponse.json(await getCatalog());
}

export async function PUT(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();
  const body = await request.json() as Catalog;
  if (!Array.isArray(body.products) || !Array.isArray(body.bundles) || !Array.isArray(body.recipes)) {
    return NextResponse.json({ error: 'Products, bundles, and recipes arrays are required.' }, { status: 400 });
  }
  return NextResponse.json(await saveCatalog(body));
}
