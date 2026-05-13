'use client';

import Image from 'next/image';
import { useReveal } from './useReveal';

const categories = [
  {
    label: 'Beurres Artisanaux',
    labelAr: 'الزبدات',
    desc: 'Noisette, pistache, cajou — pur, naturel, onctueux.',
    image: '/images/products/hazelnut-butter.jpg',
    href: '#boutique',
  },
  {
    label: 'Confitures & Zrir',
    labelAr: 'المربى والزرير',
    desc: 'Confitures maison et zrir tunisien traditionnel.',
    image: '/images/products/zrir-hazelnut-almonds.jpg',
    href: '#boutique',
  },
  {
    label: 'Pâtes à Tartiner',
    labelAr: 'كريمة الشوكولاتة',
    desc: 'Nutella naturel et crème choco blanc maison.',
    image: '/images/products/healthy-nutella.jpg',
    href: '#boutique',
  },
  {
    label: 'Préparations Salées',
    labelAr: 'الأكلات المالحة',
    desc: 'Harissa authentique et boulettes de poulet.',
    image: '/images/products/harissa.jpg',
    href: '#boutique',
  },
];

export default function CategorySection() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section style={{ background: 'var(--teal)', padding: '96px 0' }}>
      <div className="container">
        {/* Header */}
        <div ref={headRef} style={{
          textAlign: 'center', marginBottom: '64px',
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 500,
            color: 'var(--wood)',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}>
            Nos Catégories
          </h2>
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '20px',
            fontStyle: 'italic',
            color: 'var(--wood-mid)',
          }}>
            Fait à la main, avec cœur.
          </p>
        </div>

        {/* Valley Bakery–style circular grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '48px',
          alignItems: 'start',
        }} className="category-grid">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.label} cat={cat} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .category-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; } }
        @media (max-width: 480px) { .category-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; } }
      `}</style>
    </section>
  );
}

function CategoryCard({ cat, index }: { cat: typeof categories[0]; index: number }) {
  const { ref, visible } = useReveal<HTMLAnchorElement>(0.1);

  return (
    <a
      href={cat.href}
      ref={ref}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
      }}
    >
      {/* Circular photo — Valley Bakery signature */}
      <div style={{
        width: '180px', height: '180px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid rgba(107, 58, 31, 0.3)',
        boxShadow: '0 8px 32px rgba(61,32,16,0.15)',
        marginBottom: '20px',
        position: 'relative',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(61,32,16,0.28)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(61,32,16,0.15)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}>
        <Image
          src={cat.image}
          alt={cat.label}
          fill
          sizes="180px"
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="cat-img"
        />
      </div>

      {/* Arabic label */}
      <p style={{
        fontFamily: 'var(--font-amiri)',
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--wood)',
        direction: 'rtl',
        lineHeight: 1.1,
        marginBottom: '4px',
      }}>
        {cat.labelAr}
      </p>

      {/* French label — Cormorant style */}
      <h3 style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '20px',
        fontWeight: 500,
        color: 'var(--wood)',
        marginBottom: '8px',
        lineHeight: 1.2,
      }}>
        {cat.label}
      </h3>

      <p style={{
        fontFamily: 'var(--font-dm)',
        fontSize: '13px',
        color: 'var(--teal-dark)',
        lineHeight: 1.5,
        fontWeight: 300,
      }}>
        {cat.desc}
      </p>

      <style>{`
        a:hover .cat-img { transform: scale(1.07); }
      `}</style>
    </a>
  );
}
