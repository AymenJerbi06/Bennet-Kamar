'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClipboardList, CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useStore } from './StoreProvider';

export default function VideoSection() {
  const router = useRouter();
  const { cartCount, cartTotal, openCart } = useStore();
  const hasCart = cartCount > 0;

  const goToCheckout = () => {
    router.push('/checkout', { scroll: true });
  };

  return (
    <section className="blue-band">
      <div className="slope top black" />
      <div className="container order-split">
        <div className="showcase-media">
          <Image
            src="/images/other/photo1.jpg"
            alt="Bennet Kamar breakfast jars"
            fill
            sizes="(max-width: 1180px) 100vw, 58vw"
            loading="eager"
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="order-panel">
          <h2>Order Online</h2>

          <div className="order-steps">
            <div className="order-step">
              <h3><ShoppingBag size={18} /> Inspect the product</h3>
              <p>Open any product to see its gallery, description, ingredients, and details.</p>
            </div>
            <div className="order-step">
              <h3><ClipboardList size={18} /> Add and review</h3>
              <p>Add jars or bundles to the cart, adjust quantities, then move to checkout details.</p>
            </div>
            <div className="order-step">
              <h3><MapPin size={18} /> Delivery details</h3>
              <p>Enter your name, phone number, email, and delivery address.</p>
            </div>
            <div className="order-step">
              <h3><CreditCard size={18} /> Payment choice</h3>
              <p>Choose cash on delivery with a confirmation call, or card payment before delivery.</p>
            </div>
          </div>

          <p className="cart-note">
            {hasCart
              ? `${cartCount} item${cartCount > 1 ? 's' : ''} in cart - ${formatPrice(cartTotal)}`
              : 'Your cart is ready for your first jar.'}
          </p>

          <div className="order-actions">
            <button onClick={openCart} className="black-btn">
              <ShoppingBag size={20} />
              Review Cart
            </button>
            <button
              onClick={goToCheckout}
              className="black-btn"
              disabled={!hasCart}
              style={{ opacity: hasCart ? 1 : 0.5 }}
            >
              <ClipboardList size={20} />
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
