'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClipboardList, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

export default function CartDrawer() {
  const router = useRouter();
  const { copy } = useLanguage();
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useStore();

  const goToCheckout = () => {
    closeCart();
    router.push('/checkout', { scroll: true });
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
      />

      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={28} />
            {copy.cart.title}
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <button onClick={closeCart} aria-label={copy.cart.close} style={{ color: 'var(--white)' }}>
            <X size={28} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '70px 18px' }}>
              <ShoppingBag size={58} style={{ margin: '0 auto 20px' }} />
              <p className="font-display" style={{ fontSize: 34, margin: '0 0 10px' }}>
                {copy.cart.emptyTitle}
              </p>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5 }}>
                {copy.cart.emptyBody}
              </p>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="cart-item">
                <div className="cart-item-image">
                  <Image src={product.image} alt={product.nameFr} fill sizes="84px" style={{ objectFit: 'cover' }} />
                </div>

                <div>
                  <h4>{product.nameFr}</h4>
                  <p>{product.nameAr}</p>

                  <div className="cart-row">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={copy.cart.decrease}>
                        <Minus size={16} />
                      </button>
                      <strong>{quantity}</strong>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={copy.cart.increase}>
                        <Plus size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <strong>{formatPrice(product.price * quantity)}</strong>
                      <button onClick={() => removeFromCart(product.id)} aria-label={`${copy.cart.remove} ${product.nameFr}`}>
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>{copy.cart.total}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button onClick={goToCheckout} className="black-btn" style={{ width: '100%' }}>
              <ClipboardList size={20} />
              {copy.cart.checkout}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
