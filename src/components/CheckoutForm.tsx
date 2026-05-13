'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, HandCoins, MessageCircle, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useStore } from './StoreProvider';

type PaymentMethod = 'cash' | 'card';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

const PROMO_CODES = {
  KAMAR10: {
    label: '10% off',
    percentage: 0.1,
  },
} as const;

type PromoCode = keyof typeof PROMO_CODES;

export default function CheckoutForm() {
  const { cart, cartTotal } = useStore();
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cash',
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState('');

  const promo = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discount = promo ? Math.round(cartTotal * promo.percentage * 100) / 100 : 0;
  const orderTotal = Math.max(0, cartTotal - discount);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const applyPromo = () => {
    const normalized = promoCode.trim().toUpperCase() as PromoCode;
    const match = PROMO_CODES[normalized];

    if (!promoCode.trim()) {
      setAppliedPromo(null);
      setPromoMessage('Enter a promo code first.');
      return;
    }

    if (!match) {
      setAppliedPromo(null);
      setPromoMessage('That promo code is not valid.');
      return;
    }

    setAppliedPromo(normalized);
    setPromoMessage(`${normalized} applied: ${match.label}.`);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cartLines = cart.map(
      item => `- ${item.product.nameFr} x${item.quantity}: ${formatPrice(item.product.price * item.quantity)}`
    );

    const paymentLine = form.paymentMethod === 'cash'
      ? 'Payment: Cash on delivery. Customer expects a confirmation call before the order is sent out.'
      : 'Payment: Card before delivery. Customer requested card payment and does not expect a confirmation call after payment is completed.';

    const message = [
      'New Bennet Kamar order',
      '',
      'Cart:',
      ...cartLines,
      `Subtotal: ${formatPrice(cartTotal)}`,
      promo ? `Promo code: ${appliedPromo} (${promo.label})` : '',
      promo ? `Discount: -${formatPrice(discount)}` : '',
      `Total: ${formatPrice(orderTotal)}`,
      '',
      'Customer:',
      `First name: ${form.firstName}`,
      `Last name: ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      `City / area: ${form.city}`,
      '',
      paymentLine,
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/21658000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="checkout-section">
      <div className="narrow">
        <div className="checkout-head">
          <p>Secure your order</p>
          <h1>Checkout Details</h1>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <div className="checkout-summary">
            <div>
              <span>Order total</span>
              <strong>{formatPrice(orderTotal)}</strong>
            </div>
            <p>
              {cart.length > 0
                ? `${cart.length} product line${cart.length > 1 ? 's' : ''} ready for checkout.${promo ? ` ${appliedPromo} saves ${formatPrice(discount)}.` : ''}`
                : 'Your cart is empty. Add products before sending an order.'}
            </p>
          </div>

          {cart.length === 0 && (
            <div className="empty-checkout">
              <ShoppingBag size={22} />
              <span>No products in the cart yet.</span>
              <Link href="/#products">Browse products</Link>
            </div>
          )}

          <div className="form-grid two">
            <label className="field">
              <span className="field-label">First name <em>(required)</em></span>
              <input
                value={form.firstName}
                onChange={event => update('firstName', event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Last name <em>(required)</em></span>
              <input
                value={form.lastName}
                onChange={event => update('lastName', event.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-grid two">
            <label className="field">
              <span className="field-label">Email <em>(required)</em></span>
              <input
                type="email"
                value={form.email}
                onChange={event => update('email', event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Phone <em>(required)</em></span>
              <input
                type="tel"
                value={form.phone}
                onChange={event => update('phone', event.target.value)}
                required
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Delivery address <em>(required)</em></span>
            <input
              value={form.address}
              onChange={event => update('address', event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field-label">City / area <em>(required)</em></span>
            <input
              value={form.city}
              onChange={event => update('city', event.target.value)}
              required
            />
          </label>

          <div className="promo-panel">
            <label className="field promo-field">
              <span className="field-label">Promo code</span>
              <div className="promo-row">
                <input
                  value={promoCode}
                  onChange={event => setPromoCode(event.target.value)}
                  placeholder="Enter promo code"
                />
                <button type="button" className="black-btn" onClick={applyPromo}>
                  Apply
                </button>
              </div>
            </label>

            {promoMessage && (
              <p className={`promo-message ${promo ? 'success' : 'error'}`}>
                {promoMessage}
              </p>
            )}
          </div>

          <div className="payment-grid" role="radiogroup" aria-label="Payment method">
            <label className={`payment-card ${form.paymentMethod === 'cash' ? 'active' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={form.paymentMethod === 'cash'}
                onChange={() => update('paymentMethod', 'cash')}
              />
              <HandCoins size={24} />
              <span>Pay by cash</span>
              <small>Pay the delivery driver after a confirmation call.</small>
            </label>

            <label className={`payment-card ${form.paymentMethod === 'card' ? 'active' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={form.paymentMethod === 'card'}
                onChange={() => update('paymentMethod', 'card')}
              />
              <CreditCard size={24} />
              <span>Pay by card</span>
              <small>Card payment is completed before delivery, so no confirmation call is expected.</small>
            </label>
          </div>

          <label className="field">
            <span className="field-label">Delivery notes</span>
            <textarea
              value={form.notes}
              onChange={event => update('notes', event.target.value)}
              placeholder="Apartment, preferred delivery time, gift note..."
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="black-btn checkout-submit" disabled={cart.length === 0}>
              <MessageCircle size={20} />
              Send Order
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
