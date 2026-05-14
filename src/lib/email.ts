import 'server-only';

import type { OrderRecord } from './commerceStore';

export async function sendOrderEmail(order: OrderRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  const to = process.env.ORDER_EMAIL_TO;

  if (!apiKey || !from || !to) {
    return { sent: false, reason: 'Resend environment variables are not configured.' };
  }

  const lines = order.items
    .map(item => `${item.name} x${item.quantity}: ${item.price * item.quantity} TND`)
    .join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New Bennet Kamar order ${order.id}`,
      text: [
        `Order ${order.id}`,
        `Status: ${order.status}`,
        '',
        'Customer',
        `${order.customer.firstName} ${order.customer.lastName}`,
        order.customer.email,
        order.customer.phone,
        `${order.customer.address}, ${order.customer.city}`,
        '',
        'Items',
        lines,
        '',
        `Subtotal: ${order.subtotal} TND`,
        `Discount: ${order.discount} TND`,
        `Delivery: ${order.deliveryFee} TND`,
        `Total: ${order.total} TND`,
        `Payment: ${order.paymentMethod}`,
        order.promoCode ? `Promo: ${order.promoCode}` : '',
        order.notes ? `Notes: ${order.notes}` : '',
      ].filter(Boolean).join('\n'),
    }),
  });

  if (!response.ok) {
    return { sent: false, reason: await response.text() };
  }

  return { sent: true };
}
