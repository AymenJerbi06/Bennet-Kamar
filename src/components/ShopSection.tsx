'use client';

import Image from 'next/image';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { Check, ChevronLeft, ChevronRight, Gift, ShoppingBag, Star, Timer, Truck, X } from 'lucide-react';
import type { TranslationSet } from '@/lib/i18n';
import { bundleToProduct, bundles, formatPrice, products, type Product } from '@/lib/products';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

type Filter = 'all' | Product['category'] | 'bundle' | 'hot' | 'favorite';
type ReviewStats = Record<string, { average: number; count: number }>;
type EngagementOffer = {
  kind: 'free-delivery' | 'hazelnut-pair';
  title: string;
  description: string;
  expiresAt: number;
};
type InterestEvent = {
  productId: string;
  name: string;
  at: number;
};

const ACTIVE_OFFER_KEY = 'bennet-kamar-active-offer';
const CHECKOUT_OFFER_KEY = 'bennet-kamar-checkout-offer';
const INTEREST_KEY = 'bennet-kamar-product-interest';
const OFFER_WINDOW = 10 * 60 * 1000;
const INTEREST_WINDOW = 2 * 60 * 1000;

export default function ShopSection() {
  const { copy } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(products);
  const [catalogBundles, setCatalogBundles] = useState(bundles);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({});
  const [engagementOffer, setEngagementOffer] = useState<EngagementOffer | null>(null);
  const [offerClock, setOfferClock] = useState(() => Date.now());
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: copy.shop.filters.all },
    { value: 'sweet', label: copy.shop.filters.sweet },
    { value: 'salty', label: copy.shop.filters.salty },
    { value: 'bundle', label: copy.shop.filters.bundle },
    { value: 'hot', label: copy.shop.filters.hot },
    { value: 'favorite', label: copy.shop.filters.favorite },
  ];

  const allProducts = [
    ...catalogProducts.map(product => ({ ...product, kind: product.kind || 'product' as const })),
    ...catalogBundles.map(bundleToProduct),
  ].map(product => {
    const stats = reviewStats[product.id];
    return stats ? { ...product, ratingAverage: stats.average, ratingCount: stats.count } : product;
  });

  const visibleProducts = allProducts.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'bundle') return product.kind === 'bundle';
    if (filter === 'hot') return product.hotThisWeek;
    if (filter === 'favorite') return product.customerFavorite;
    return product.category === filter && product.kind !== 'bundle';
  });

  useEffect(() => {
    if (!selectedProduct) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProduct(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProduct]);

  useEffect(() => {
    fetch('/api/catalog')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.products)) setCatalogProducts(data.products);
        if (Array.isArray(data.bundles)) setCatalogBundles(data.bundles);
        if (data.reviewStats) setReviewStats(data.reviewStats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onInspectProduct = (event: Event) => {
      const productId = (event as CustomEvent<{ productId?: string }>).detail?.productId;
      if (!productId) return;
      const product = allProducts.find(item => item.id === productId);
      if (product) openProduct(product);
    };

    window.addEventListener('bennet:inspect-product', onInspectProduct);
    return () => window.removeEventListener('bennet:inspect-product', onInspectProduct);
  }, [allProducts, engagementOffer, copy.shop]);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(ACTIVE_OFFER_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EngagementOffer;
      if (parsed.expiresAt > Date.now()) {
        setEngagementOffer(parsed);
      } else {
        window.sessionStorage.removeItem(ACTIVE_OFFER_KEY);
      }
    } catch {
      window.sessionStorage.removeItem(ACTIVE_OFFER_KEY);
    }
  }, []);

  useEffect(() => {
    if (!engagementOffer) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setOfferClock(now);
      if (engagementOffer.expiresAt <= now) {
        setEngagementOffer(null);
        window.sessionStorage.removeItem(ACTIVE_OFFER_KEY);
        window.sessionStorage.removeItem(CHECKOUT_OFFER_KEY);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [engagementOffer]);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    registerInterest(product, engagementOffer, setEngagementOffer, copy.shop);
  };

  const dismissOffer = () => {
    setEngagementOffer(null);
    window.sessionStorage.removeItem(ACTIVE_OFFER_KEY);
  };

  return (
    <section id="products" className="shop-section">
      <div className="container">
        <div className="shop-header">
          <h2 className="section-title">{copy.shop.title}</h2>
          <p>
            {copy.shop.intro}
          </p>

          <div className="filter-row">
            {filters.map(item => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`filter-pill ${filter === item.value ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visibleProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => openProduct(product)}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {engagementOffer && (
        <EngagementOfferCard
          offer={engagementOffer}
          remainingMs={Math.max(0, engagementOffer.expiresAt - offerClock)}
          products={allProducts}
          onDismiss={dismissOffer}
        />
      )}

      <div className="slope bottom blue" />
    </section>
  );
}

function registerInterest(
  product: Product,
  existingOffer: EngagementOffer | null,
  setOffer: (offer: EngagementOffer) => void,
  copy: TranslationSet['shop'],
) {
  if (existingOffer) return;

  const now = Date.now();
  let recent: InterestEvent[] = [];

  try {
    const raw = window.sessionStorage.getItem(INTEREST_KEY);
    recent = raw ? JSON.parse(raw) as InterestEvent[] : [];
  } catch {
    recent = [];
  }

  recent = recent.filter(event => now - event.at <= INTEREST_WINDOW);
  recent.push({ productId: product.id, name: product.nameFr, at: now });
  window.sessionStorage.setItem(INTEREST_KEY, JSON.stringify(recent));

  const hazelnutViews = recent.filter(event => {
    const normalized = `${event.productId} ${event.name}`.toLowerCase();
    return normalized.includes('hazelnut') || normalized.includes('noisette');
  }).length;

  const nextOffer = hazelnutViews >= 2
    ? {
        kind: 'hazelnut-pair' as const,
        title: copy.hazelnutTitle,
        description: copy.hazelnutDescription,
        expiresAt: now + OFFER_WINDOW,
      }
    : recent.length >= 3
      ? {
          kind: 'free-delivery' as const,
          title: copy.deliveryTitle,
          description: copy.deliveryDescription,
          expiresAt: now + OFFER_WINDOW,
        }
      : null;

  if (!nextOffer) return;

  window.sessionStorage.setItem(ACTIVE_OFFER_KEY, JSON.stringify(nextOffer));
  setOffer(nextOffer);
}

function EngagementOfferCard({
  offer,
  remainingMs,
  products,
  onDismiss,
}: {
  offer: EngagementOffer;
  remainingMs: number;
  products: Product[];
  onDismiss: () => void;
}) {
  const { copy } = useLanguage();
  const { addToCart } = useStore();
  const [claimed, setClaimed] = useState(false);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, '0');

  const claimOffer = () => {
    if (offer.kind === 'hazelnut-pair') {
      ['hazelnut-butter', 'zrir-hazelnut-almonds'].forEach(productId => {
        const item = products.find(product => product.id === productId);
        if (item) addToCart(item);
      });
    }

    window.sessionStorage.setItem(CHECKOUT_OFFER_KEY, JSON.stringify({
      code: 'FREEDELIVERY10',
      expiresAt: offer.expiresAt,
    }));
    setClaimed(true);
  };

  return (
    <aside className="engagement-offer" aria-live="polite">
      <div className="engagement-offer-head">
        <div>
          <p className="engagement-offer-kicker">
            {offer.kind === 'hazelnut-pair' ? <Gift size={14} /> : <Truck size={14} />}
            {copy.shop.smartOffer}
          </p>
          <h3>{offer.title}</h3>
        </div>
        <button className="engagement-offer-close" onClick={onDismiss} aria-label="Dismiss offer">
          <X size={18} />
        </button>
      </div>

      <p>{offer.description}</p>

      <div className="engagement-offer-meta">
        <Timer size={16} />
        <span>{minutes}:{seconds} {copy.shop.remaining}</span>
      </div>

      <div className="engagement-offer-actions">
        <button type="button" className="black-btn" onClick={claimOffer}>
          {claimed ? copy.shop.reserved : offer.kind === 'hazelnut-pair' ? copy.shop.addPairing : copy.shop.reserveOffer}
        </button>
      </div>
    </aside>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { copy } = useLanguage();
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className="product-card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKey}
      aria-label={`View ${product.nameFr}`}
    >
      <div className="product-circle">
        <Image
          src={product.image}
          alt={product.nameFr}
          fill
          sizes="(max-width: 760px) 82vw, (max-width: 1180px) 40vw, 23vw"
          loading="eager"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <h3 className="product-title">{product.nameFr}</h3>
      <p className="product-ar">{product.nameAr}</p>
      <p className="product-desc">
        {product.tagline}. {product.ingredients.slice(0, 2).join(' and ')}.
      </p>

      <div className="rating-line" aria-label={`${product.ratingAverage || 0} stars`}>
        <Star size={15} fill="currentColor" />
        <span>
          {product.ratingCount ? `${product.ratingAverage} (${product.ratingCount})` : copy.shop.ratingsSoon}
        </span>
      </div>

      <div className="product-meta">
        <span className="price">
          {product.originalPrice && product.originalPrice > product.price && (
            <del>{formatPrice(product.originalPrice)}</del>
          )}
          {formatPrice(product.price)}
        </span>
        <button
          onClick={event => {
            event.stopPropagation();
            handleAdd();
          }}
          className="black-btn"
          disabled={!product.inStock}
          aria-label={`Add ${product.nameFr} to cart`}
        >
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? copy.shop.added : copy.shop.add}
        </button>
      </div>
    </article>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { copy } = useLanguage();
  const { addToCart } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const activeImage = gallery[activeIndex] ?? product.image;

  useEffect(() => {
    setActiveIndex(0);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (gallery.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % gallery.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [gallery.length, product.id]);

  const goToImage = (direction: 'prev' | 'next') => {
    setActiveIndex(index => {
      if (direction === 'next') return (index + 1) % gallery.length;
      return (index - 1 + gallery.length) % gallery.length;
    });
  };

  const addProduct = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={event => event.stopPropagation()}
      >
        <button className="product-modal-close" onClick={onClose} aria-label="Close product details">
          <X size={24} />
        </button>

        <div className="product-gallery">
          <div className="product-gallery-main">
            <Image
              src={activeImage}
              alt={product.nameFr}
              fill
              sizes="(max-width: 900px) 90vw, 46vw"
              style={{ objectFit: 'cover' }}
            />

            {gallery.length > 1 && (
              <>
                <button
                  className="slider-btn prev"
                  onClick={() => goToImage('prev')}
                  aria-label="Previous product image"
                >
                  <ChevronLeft size={25} />
                </button>
                <button
                  className="slider-btn next"
                  onClick={() => goToImage('next')}
                  aria-label="Next product image"
                >
                  <ChevronRight size={25} />
                </button>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="product-slider-dots" aria-label={`${product.nameFr} image slider`}>
              {gallery.map((image, index) => (
                <button
                  key={image}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-modal-copy">
          <p className="modal-kicker">{product.categoryLabel}</p>
          <h3 id="product-modal-title">{product.nameFr}</h3>
          <p className="modal-ar">{product.nameAr}</p>

          <div className="modal-rating static">
            <div>
              <Star size={17} fill="currentColor" />
              <span>
                {product.ratingCount
                  ? `${product.ratingAverage} ${copy.shop.displayedRatings} ${product.ratingCount}`
                  : copy.shop.ratingsNote}
              </span>
            </div>
          </div>

          <p className="modal-desc">{product.description}</p>

          <ul className="modal-details">
            {product.details.map(detail => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>

          <div className="modal-tags">
            {product.ingredients.map(ingredient => (
              <span key={ingredient}>{ingredient}</span>
            ))}
          </div>

          <div className="modal-buy-row">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <del>{formatPrice(product.originalPrice)}</del>
              )}
              <strong>{formatPrice(product.price)}</strong>
              {product.weight && <span>{product.weight}</span>}
            </div>
            <button onClick={addProduct} className="black-btn" disabled={!product.inStock}>
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              {added ? copy.shop.added : copy.shop.addToCart}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
