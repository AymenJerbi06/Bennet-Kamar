'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { products as defaultProducts, type Product } from '@/lib/products';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

type ShowcaseVideo = {
  productId: string;
  slug: string;
};

const showcaseVideos: ShowcaseVideo[] = [
  { productId: 'hazelnut-butter', slug: 'hazelnut-butter' },
  { productId: 'pistachio-butter', slug: 'pistachio-butter' },
  { productId: 'healthy-nutella', slug: 'healthy-nutella' },
  { productId: 'granola', slug: 'granola' },
  { productId: 'zrir-hazelnut-almonds', slug: 'zrir-hazelnut-almonds' },
  { productId: 'zrir-pistachio', slug: 'zrir-pistachio' },
  { productId: 'harissa', slug: 'harissa' },
  { productId: 'chicken-meatballs', slug: 'chicken-meatballs' },
];

export default function WhatInsideSection() {
  const { copy } = useLanguage();
  const { addToCart } = useStore();
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(defaultProducts);
  const [reelElement, setReelElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/catalog')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.products)) setCatalogProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const items = useMemo(() => {
    return showcaseVideos
      .map(video => {
        const product = catalogProducts.find(item => item.id === video.productId);
        return product ? { ...video, product } : null;
      })
      .filter(Boolean) as Array<ShowcaseVideo & { product: Product }>;
  }, [catalogProducts]);

  if (!items.length) return null;

  const inspectProduct = (productId: string) => {
    window.dispatchEvent(new CustomEvent('bennet:inspect-product', { detail: { productId } }));
    window.setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const scrollReel = (direction: 'prev' | 'next') => {
    if (!reelElement) return;
    const card = reelElement.querySelector<HTMLElement>('.inside-card');
    const style = window.getComputedStyle(reelElement);
    const gap = Number.parseFloat(style.columnGap || style.gap || '18') || 18;
    const distance = (card?.offsetWidth || 340) + gap;
    reelElement.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section id="inside-the-box" className="inside-section" aria-labelledby="inside-title">
      <div className="container">
        <div className="inside-heading">
          <p>{copy.inside.eyebrow}</p>
          <h2 id="inside-title" className="section-title">{copy.inside.title}</h2>
          <span>{copy.inside.intro}</span>
        </div>

        <div className="inside-reel-shell">
          <button type="button" className="inside-reel-btn prev" onClick={() => scrollReel('prev')} aria-label={copy.inside.previous}>
            <ChevronLeft size={24} />
          </button>

          <div ref={setReelElement} className="inside-reel" aria-label={copy.inside.title}>
            {items.map(item => (
              <article key={item.slug} className="inside-card">
                <div className="inside-video-wrap">
                  <video
                    src={`/api/product-video/${item.slug}`}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="inside-watermark">
                    <span>{item.product.category === 'sweet' ? copy.inside.sweet : copy.inside.savory}</span>
                    <strong>{item.product.nameFr}</strong>
                  </div>
                </div>

                <div className="inside-card-copy">
                  <div>
                    <h3>{item.product.nameFr}</h3>
                    <p>{item.product.nameAr}</p>
                  </div>
                  <div className="inside-actions">
                    <button type="button" className="mini-media-btn compact" onClick={() => addToCart(item.product)}>
                      <ShoppingBag size={14} />
                      {copy.inside.addToCart}
                    </button>
                    <button type="button" className="mini-media-btn compact ghost" onClick={() => inspectProduct(item.product.id)}>
                      <Search size={14} />
                      {copy.inside.goInspect}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button type="button" className="inside-reel-btn next" onClick={() => scrollReel('next')} aria-label={copy.inside.next}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
