'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClipboardList, HandCoins, MapPin, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

export default function VideoSection() {
  const router = useRouter();
  const { copy } = useLanguage();
  const { cartCount, cartTotal, openCart } = useStore();
  const hasCart = cartCount > 0;

  const goToCheckout = () => {
    router.push('/checkout', { scroll: true });
  };

  return (
    <section id="how-it-works" className="blue-band">
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
          <h2>{copy.video.title}</h2>

          <div className="order-steps">
            <div className="order-step">
              <h3><ShoppingBag size={18} /> {copy.video.inspectTitle}</h3>
              <p>{copy.video.inspectBody}</p>
            </div>
            <div className="order-step">
              <h3><ClipboardList size={18} /> {copy.video.addTitle}</h3>
              <p>{copy.video.addBody}</p>
            </div>
            <div className="order-step">
              <h3><MapPin size={18} /> {copy.video.deliveryTitle}</h3>
              <p>{copy.video.deliveryBody}</p>
            </div>
            <div className="order-step">
              <h3><HandCoins size={18} /> {copy.video.paymentTitle}</h3>
              <p>{copy.video.paymentBody}</p>
            </div>
          </div>

          <p className="cart-note">
            {hasCart
              ? `${cartCount} ${copy.video.inCart} - ${formatPrice(cartTotal)}`
              : copy.video.cartEmpty}
          </p>

          <div className="order-actions">
            <button onClick={openCart} className="black-btn">
              <ShoppingBag size={20} />
              {copy.video.reviewCart}
            </button>
            <button
              onClick={goToCheckout}
              className="black-btn"
              disabled={!hasCart}
              style={{ opacity: hasCart ? 1 : 0.5 }}
            >
              <ClipboardList size={20} />
              {copy.video.checkout}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
