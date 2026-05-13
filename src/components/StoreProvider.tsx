'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/lib/products';

export type CartItem = { product: Product; quantity: number };

type StoreCtx = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  checkoutWhatsApp: () => void;
};

const StoreContext = createContext<StoreCtx | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkoutWhatsApp = useCallback(() => {
    if (cart.length === 0) return;
    const lines = cart.map(i => `• ${i.product.nameFr} (${i.product.nameAr}) x${i.quantity} — ${i.product.price * i.quantity} TND`);
    const total = `\nTotal: ${cartTotal} TND`;
    const msg = `Bonjour Feriel 🌟\n\nJe souhaite commander chez Bennet Kamar / بنة قمر :\n\n${lines.join('\n')}${total}\n\nMerci !`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/21658000000?text=${encoded}`, '_blank');
  }, [cart, cartTotal]);

  return (
    <StoreContext.Provider value={{
      cart, cartCount, cartTotal, isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart, removeFromCart, updateQuantity, clearCart, checkoutWhatsApp,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
