'use client';

import Image from 'next/image';
import { useState } from 'react';
import { products, type Product } from '@/lib/products';
import { useReveal } from './useReveal';

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, visible } = useReveal(0.1);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${index * 0.07}s, transform 0.7s ease ${index * 0.07}s`,
      }}
    >
      <article
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: 'var(--cream-light)', overflow: 'hidden' }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            overflow: 'hidden',
            background: 'var(--sand)',
          }}
        >
          <Image
            src={product.image}
            alt={product.nameFr}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}
          />
          {product.hoverImage && hovered && (
            <Image
              src={product.hoverImage}
              alt={product.nameFr}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              style={{
                objectFit: 'cover',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}
          {/* Category badge */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: product.category === 'sweet' ? 'var(--gold)' : 'var(--olive)',
              color: '#fff',
              padding: '4px 10px',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-dm)',
            }}
          >
            {product.category === 'sweet' ? 'Sucré' : 'Salé'}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '20px 20px 24px' }}>
          {/* Arabic name */}
          <p
            style={{
              fontFamily: 'var(--font-amiri)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--dark)',
              direction: 'rtl',
              textAlign: 'right',
              marginBottom: '4px',
              lineHeight: 1.2,
            }}
          >
            {product.nameAr}
          </p>

          {/* French name */}
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--brown)',
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            {product.nameFr}
          </h3>

          {/* Tagline */}
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--honey)',
              marginBottom: '14px',
              fontFamily: 'var(--font-dm)',
            }}
          >
            {product.tagline}
          </p>

          {/* Ingredients */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {product.ingredients.map(ing => (
              <span
                key={ing}
                style={{
                  background: 'var(--sand)',
                  color: 'var(--caramel)',
                  padding: '3px 10px',
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-dm)',
                }}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ProductShowcase() {
  const [filter, setFilter] = useState<'all' | 'sweet' | 'salty'>('all');
  const { ref: headRef, visible: headVisible } = useReveal();

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  return (
    <section id="produits" style={{ background: 'var(--cream)', padding: '100px 0' }}>
      <div style={{ width: 'min(100%, 1280px)', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div
          ref={headRef}
          style={{
            textAlign: 'center',
            marginBottom: '64px',
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--honey)',
              marginBottom: '16px',
              fontFamily: 'var(--font-dm)',
            }}
          >
            Nos créations
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 600,
              color: 'var(--dark)',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Chaque produit,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--caramel)' }}>une histoire d'amour.</em>
          </h2>
          <p
            style={{
              maxWidth: '560px',
              margin: '0 auto 36px',
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--brown)',
              fontFamily: 'var(--font-dm)',
              fontWeight: 300,
            }}
          >
            Des produits artisanaux préparés à la main, avec des ingrédients soigneusement
            sélectionnés pour vous offrir le vrai goût du fait maison.
          </p>

          {/* Filter tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {(['all', 'sweet', 'salty'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '10px 24px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-dm)',
                  border: '1.5px solid',
                  borderColor: filter === cat ? 'var(--honey)' : 'var(--biscuit)',
                  background: filter === cat ? 'var(--honey)' : 'transparent',
                  color: filter === cat ? '#fff' : 'var(--caramel)',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat === 'all' ? 'Tous les produits' : cat === 'sweet' ? 'Sucrés 🍯' : 'Salés 🌶️'}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
          className="product-grid"
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <a
            href="#commander"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--dark)',
              color: 'var(--cream)',
              padding: '18px 44px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-dm)',
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--honey)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--dark)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Commander vos produits
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
