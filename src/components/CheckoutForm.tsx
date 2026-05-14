'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { HandCoins, MessageCircle, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { defaultPromoCodes, type PromoCodeRecord } from '@/lib/promos';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
};

const CHECKOUT_OFFER_KEY = 'bennet-kamar-checkout-offer';
const DELIVERY_FEE = 8;

export default function CheckoutForm() {
  const { copy, language } = useLanguage();
  const { cart, cartTotal, clearCart } = useStore();
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [promoCodes, setPromoCodes] = useState<PromoCodeRecord[]>(defaultPromoCodes);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeRecord | null>(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState('');
  const [orderError, setOrderError] = useState('');

  const promo = appliedPromo;
  const deliveryFee = cart.length > 0 && !promo?.waivesDelivery ? DELIVERY_FEE : 0;
  const discountBase = promo?.appliesTo === 'total' ? cartTotal + deliveryFee : cartTotal;
  const discount = promo ? Math.round(discountBase * promo.percentage * 100) / 100 : 0;
  const orderTotal = Math.max(0, cartTotal + deliveryFee - discount);
  const regularTotal = cart.length > 0 ? cartTotal + DELIVERY_FEE : 0;
  const showAdjustedTotal = Boolean(appliedPromo) && regularTotal !== orderTotal;
  const optionalLabel = language === 'fr' ? '(optionnel)' : language === 'ar' ? '(اختياري)' : '(optional)';
  const afterPromoLabel = language === 'fr' ? 'Après promo' : language === 'ar' ? 'بعد العرض' : 'After promo';
  const phoneHint = language === 'fr' ? '8 chiffres' : language === 'ar' ? '8 أرقام' : '8 digits';
  const phoneError = language === 'fr'
    ? 'Le téléphone doit contenir exactement 8 chiffres.'
    : language === 'ar'
      ? 'يجب أن يتكون رقم الهاتف من 8 أرقام فقط.'
      : 'Phone number must contain exactly 8 digits.';
  const promoLabel = (promoRecord: PromoCodeRecord) => (
    promoRecord.waivesDelivery
      ? `${copy.checkout.delivery}: ${copy.checkout.free}`
      : promoRecord.label
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    fetch('/api/promos')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) setPromoCodes(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(CHECKOUT_OFFER_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { code?: string; expiresAt?: number };
      const code = parsed.code?.trim().toUpperCase();
      const match = promoCodes.find(item => item.active && item.code.trim().toUpperCase() === code);
      if (!code || !match || !parsed.expiresAt || parsed.expiresAt <= Date.now()) {
        window.sessionStorage.removeItem(CHECKOUT_OFFER_KEY);
        return;
      }
      setPromoCode(code);
      setAppliedPromo(match);
      setPromoMessage(`${code} ${copy.checkout.promoApplied}: ${promoLabel(match)}.`);
    } catch {
      window.sessionStorage.removeItem(CHECKOUT_OFFER_KEY);
    }
  }, [copy.checkout.delivery, copy.checkout.free, copy.checkout.promoApplied, promoCodes]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updatePhone = (value: string) => {
    update('phone', value.replace(/\D/g, '').slice(0, 8));
  };

  const applyPromo = () => {
    const normalized = promoCode.trim().toUpperCase();
    const match = promoCodes.find(item => item.active && item.code.trim().toUpperCase() === normalized);

    if (!promoCode.trim()) {
      setAppliedPromo(null);
      setPromoMessage(copy.checkout.promoEmpty);
      return;
    }

    if (!match) {
      setAppliedPromo(null);
      setPromoMessage(copy.checkout.promoInvalid);
      return;
    }

    setAppliedPromo(match);
    setPromoMessage(`${normalized} ${copy.checkout.promoApplied}: ${promoLabel(match)}.`);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setOrderError('');
    setOrderResult('');

    if (!/^\d{8}$/.test(form.phone)) {
      setSubmitting(false);
      setOrderError(phoneError);
      return;
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email.trim(),
          phone: form.phone,
          address: form.address,
          city: form.city,
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.nameFr,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal: cartTotal,
        discount,
        deliveryFee,
        total: orderTotal,
        promoCode: appliedPromo?.code || undefined,
        paymentMethod: 'cash',
        notes: form.notes,
      }),
    });

    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setOrderError(data.error || copy.checkout.submitError);
      return;
    }

    setOrderResult(`${copy.checkout.submitSuccessPrefix} ${data.order.id} ${copy.checkout.submitSuccessSuffix}`);
    clearCart();
  };

  return (
    <section className="checkout-section">
      <div className="checkout-shell">
        <div className="checkout-head">
          <p>{copy.checkout.eyebrow}</p>
          <h1>{copy.checkout.title}</h1>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-panel">
            {orderResult && <div className="order-result success">{orderResult}</div>}
            {orderError && <div className="order-result error">{orderError}</div>}

            <form id="checkout-form" className="contact-form checkout-details-form" onSubmit={submit}>
              <div className="form-grid two">
                <label className="field">
                  <span className="field-label">{copy.checkout.firstName} <em>{copy.checkout.required}</em></span>
                  <input
                    value={form.firstName}
                    onChange={event => update('firstName', event.target.value)}
                    dir="auto"
                    required
                  />
                </label>

                <label className="field">
                  <span className="field-label">{copy.checkout.lastName} <em>{copy.checkout.required}</em></span>
                  <input
                    value={form.lastName}
                    onChange={event => update('lastName', event.target.value)}
                    dir="auto"
                    required
                  />
                </label>
              </div>

              <div className="form-grid two">
                <label className="field">
                  <span className="field-label">{copy.checkout.email} <em>{optionalLabel}</em></span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={event => update('email', event.target.value)}
                    dir="ltr"
                  />
                </label>

                <label className="field">
                  <span className="field-label">{copy.checkout.phone} <em>{copy.checkout.required}</em></span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    title={phoneError}
                    value={form.phone}
                    onChange={event => updatePhone(event.target.value)}
                    placeholder={phoneHint}
                    dir="ltr"
                    required
                  />
                </label>
              </div>

              <label className="field">
                <span className="field-label">{copy.checkout.address} <em>{copy.checkout.required}</em></span>
                <input
                  value={form.address}
                  onChange={event => update('address', event.target.value)}
                  dir="auto"
                  required
                />
              </label>

              <label className="field">
                <span className="field-label">{copy.checkout.city} <em>{copy.checkout.required}</em></span>
                <input
                  value={form.city}
                  onChange={event => update('city', event.target.value)}
                  dir="auto"
                  required
                />
              </label>

              <div className="payment-grid cash-only" aria-label={copy.checkout.cash}>
                <div className="payment-card active">
                  <HandCoins size={24} />
                  <span>{copy.checkout.cash}</span>
                  <small>{copy.checkout.cashBody}</small>
                </div>
              </div>

              <label className="field">
                <span className="field-label">{copy.checkout.notes}</span>
                <textarea
                  value={form.notes}
                  onChange={event => update('notes', event.target.value)}
                  placeholder={copy.checkout.notesPlaceholder}
                  dir="auto"
                />
              </label>

              <div className="checkout-process-note">
                <HandCoins size={22} />
                <div>
                  <strong>{copy.checkout.processTitle}</strong>
                  <p>{copy.checkout.processBody}</p>
                </div>
              </div>
            </form>
          </div>

          <aside className="checkout-sidebar">
            <div className="checkout-summary">
              <div>
                <span>{copy.checkout.orderTotal}</span>
                <div className="checkout-total-price">
                  {showAdjustedTotal && <del>{formatPrice(regularTotal)}</del>}
                  <strong>{formatPrice(orderTotal)}</strong>
                  {showAdjustedTotal && <small>{afterPromoLabel}</small>}
                </div>
              </div>
              <p>
                {cart.length > 0
                  ? `${cart.length} ${cart.length > 1 ? copy.checkout.itemLinesPlural : copy.checkout.itemLines} ${copy.checkout.ready}${promo ? promo.percentage > 0 ? ` ${promo.code} ${copy.checkout.promoSaves} ${formatPrice(discount)}.` : ` ${promo.code} ${copy.checkout.promoDelivery} ${formatPrice(DELIVERY_FEE)} ${copy.checkout.deliveryFee}.` : ''}`
                  : copy.checkout.emptyMessage}
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="empty-checkout">
                <ShoppingBag size={22} />
                <span>{copy.checkout.emptyCart}</span>
                <Link href="/#products">{copy.checkout.browseProducts}</Link>
              </div>
            ) : (
              <>
                <div className="checkout-items">
                  {cart.map(item => (
                    <div key={item.product.id} className="checkout-line-item">
                      <div>
                        <strong>{item.product.nameFr}</strong>
                        <span>{item.product.nameAr}</span>
                      </div>
                      <b>x{item.quantity}</b>
                      <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div className="checkout-breakdown">
                  <div>
                    <span>{copy.checkout.products}</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  <div>
                    <span>{copy.checkout.delivery}</span>
                    <strong>{deliveryFee === 0 ? copy.checkout.free : formatPrice(deliveryFee)}</strong>
                  </div>
                  {discount > 0 && (
                    <div>
                      <span>{copy.checkout.discount}</span>
                      <strong>-{formatPrice(discount)}</strong>
                    </div>
                  )}
                </div>

                <div className="promo-panel">
                  <label className="field promo-field">
                    <span className="field-label">{copy.checkout.promo}</span>
                    <div className="promo-row">
                      <input
                        value={promoCode}
                        onChange={event => setPromoCode(event.target.value)}
                        placeholder={copy.checkout.promoPlaceholder}
                      />
                      <button type="button" className="black-btn" onClick={applyPromo}>
                        {copy.checkout.apply}
                      </button>
                    </div>
                  </label>

                  {promoMessage && (
                    <p className={`promo-message ${promo ? 'success' : 'error'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  className="black-btn checkout-submit checkout-sidebar-submit"
                  disabled={submitting}
                >
                  <MessageCircle size={20} />
                  {submitting ? copy.checkout.submitting : copy.checkout.checkout}
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
