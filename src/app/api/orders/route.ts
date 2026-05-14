import { NextRequest, NextResponse } from 'next/server';
import { getOrders, orderId, recordPromoUsage, saveOrders, type OrderRecord } from '@/lib/commerceStore';
import { sendOrderEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer || {};

  if (!items.length) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
  }

  for (const key of ['firstName', 'lastName', 'phone', 'address', 'city']) {
    if (!String(customer[key] || '').trim()) {
      return NextResponse.json({ error: `${key} is required.` }, { status: 400 });
    }
  }

  const phone = String(customer.phone || '').replace(/\D/g, '');
  if (!/^\d{8}$/.test(phone)) {
    return NextResponse.json({ error: 'phone must be an 8-digit Tunisian number.' }, { status: 400 });
  }

  const subtotal = Number(body.subtotal) || 0;
  const discount = Number(body.discount) || 0;
  const deliveryFee = Number(body.deliveryFee) || 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const now = new Date().toISOString();
  const order: OrderRecord = {
    id: orderId(),
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    customer: {
      firstName: String(customer.firstName),
      lastName: String(customer.lastName),
      email: customer.email ? String(customer.email) : '',
      phone,
      address: String(customer.address),
      city: String(customer.city),
    },
    items: items.map((item: any) => ({
      productId: String(item.productId),
      name: String(item.name),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
    })),
    subtotal,
    discount,
    deliveryFee,
    total,
    promoCode: body.promoCode ? String(body.promoCode) : undefined,
    paymentMethod: 'cash',
    notes: body.notes ? String(body.notes) : undefined,
  };

  const orders = await getOrders();
  await saveOrders([order, ...orders]);
  await recordPromoUsage(order.promoCode);
  const email = await sendOrderEmail(order);

  return NextResponse.json({ order, email });
}
