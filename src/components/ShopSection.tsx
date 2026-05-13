'use client';

import Image from 'next/image';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { Check, ChevronLeft, ChevronRight, Images, ShoppingBag, Tag, X } from 'lucide-react';
import {
  bundleToProduct,
  bundles,
  formatPrice,
  products,
  type Bundle,
  type Product,
} from '@/lib/products';
import { useStore } from './StoreProvider';

type Filter = 'all' | Product['category'];

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'sweet', label: 'Sweet' },
  { value: 'salty', label: 'Savory' },
];

export default function ShopSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const visibleProducts = filter === 'all'
    ? products
    : products.filter(product => product.category === filter);

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

  return (
    <section id="products" className="shop-section">
      <div className="container">
        <div className="shop-header">
          <h2 className="section-title">Products</h2>
          <p>
            Choose your jars, inspect the details, add your favorites to the
            cart, then finish with delivery and payment details.
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
              onOpen={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        <BundleSection />
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <div className="slope bottom blue" />
    </section>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
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

      <div className="product-meta">
        <span className="price">{formatPrice(product.price)}</span>
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
          {added ? 'Added' : 'Add'}
        </button>
      </div>
    </article>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
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
              <strong>{formatPrice(product.price)}</strong>
              {product.weight && <span>{product.weight}</span>}
            </div>
            <button onClick={addProduct} className="black-btn" disabled={!product.inStock}>
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              {added ? 'Added' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BundleSection() {
  return (
    <div className="bundle-section">
      <div className="bundle-heading">
        <h3>Bundles</h3>
        <p>Promoted packs with grouped products and a discounted price.</p>
      </div>

      <div className="bundle-grid">
        {bundles.map(bundle => (
          <BundleCard key={bundle.id} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const discount = Math.max(0, bundle.originalPrice - bundle.price);

  const addBundle = () => {
    addToCart(bundleToProduct(bundle));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className={`bundle-card ${bundle.featured ? 'featured' : ''}`}>
      <div className="bundle-media">
        {bundle.video ? (
          <video src={bundle.video} autoPlay muted loop playsInline />
        ) : (
          <Image
            src={bundle.image}
            alt={bundle.name}
            fill
            sizes="(max-width: 760px) 90vw, (max-width: 1180px) 44vw, 28vw"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="bundle-copy">
        <div className="bundle-title-row">
          <div>
            <h4>{bundle.name}</h4>
            <p className="product-ar">{bundle.nameAr}</p>
          </div>
          <span className="bundle-discount">
            <Tag size={15} />
            Save {formatPrice(discount)}
          </span>
        </div>

        <p>{bundle.description}</p>

        <div className="bundle-includes">
          <Images size={16} />
          {bundle.includes.join(' · ')}
        </div>

        <div className="bundle-actions">
          <div className="bundle-price">
            <span>{formatPrice(bundle.price)}</span>
            <del>{formatPrice(bundle.originalPrice)}</del>
          </div>
          <button onClick={addBundle} className="black-btn">
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added ? 'Added' : 'Add bundle'}
          </button>
        </div>
      </div>
    </article>
  );
}
