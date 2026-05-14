import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';
import { adjustInventoryForOrder, getOrders, saveOrders, type OrderStatus } from '@/lib/commerceStore';

export const runtime = 'nodejs';

const statuses: OrderStatus[] = ['pending', 'confirmed', 'delivered', 'not-delivered', 'cancelled'];

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();
  return NextResponse.json(await getOrders());
}

export async function PUT(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();
  const body = await request.json();
  const status = body.status as OrderStatus;

  if (!body.id || !statuses.includes(status)) {
    return NextResponse.json({ error: 'Order id and valid status are required.' }, { status: 400 });
  }

  const orders = await getOrders();
  const previous = orders.find(order => order.id === body.id);
  const updated = orders.map(order => order.id === body.id
    ? { ...order, status, updatedAt: new Date().toISOString() }
    : order);

  await saveOrders(updated);

  if (previous && previous.status !== status) {
    if (previous.status !== 'delivered' && status === 'delivered') {
      await adjustInventoryForOrder(previous, 1);
    }
    if (previous.status === 'delivered' && status !== 'delivered') {
      await adjustInventoryForOrder(previous, -1);
    }
  }

  return NextResponse.json(updated);
}
