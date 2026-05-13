'use client';

import Image from 'next/image';
import { useReveal } from './useReveal';

const photos = [
  { src: '/images/lifestyle/family-1.jpg', span: 'tall', alt: 'Moment en famille avec بنة قمر' },
  { src: '/images/lifestyle/family-2.jpg', span: 'normal', alt: 'Produits artisanaux بنة قمر' },
  { src: '/images/lifestyle/family-3.jpg', span: 'normal', alt: 'Sourires et saveurs' },
  { src: '/images/lifestyle/family-4.jpg', span: 'wide', alt: 'La famille بنة قمر' },
  { src: '/images/lifestyle/family-5.jpg', span: 'normal', alt: 'Moments de bonheur' },
  { src: '/images/other/photo1.jpg', span: 'normal', alt: 'Lifestyle بنة قمر' },
  { src: '/images/other/photo2.jpg', span: 'tall', alt: 'Authenticité بنة قمر' },
  { src: '/images/other/photo3.jpg', span: 'normal', alt: 'Produits frais بنة قمر' },
];

export default function GallerySection() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      id="histoire"
      style={{
        background: 'var(--dark)',
        padding: '100px 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: 'min(100%, 1280px)', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div
          ref={headRef}
          style={{
            textAlign: 'center',
            marginBottom: '56px',
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
              color: 'var(--gold)',
              marginBottom: '16px',
              fontFamily: 'var(--font-dm)',
            }}
          >
            Notre univers
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(34px, 5vw, 56px)',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Des moments vrais,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>des saveurs sincères.</em>
          </h2>
          <p
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-dm)',
              fontWeight: 300,
            }}
          >
            Chaque photo raconte une histoire — des mains qui pétrissent, des sourires qui goûtent,
            et des moments familiaux qui donnent tout son sens à بنة قمر.
          </p>
        </div>

        {/* Masonry-style gallery */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '240px',
            gap: '12px',
          }}
          className="gallery-grid"
        >
          {photos.map((photo, i) => (
            <GalleryItem key={photo.src} photo={photo} index={i} />
          ))}
        </div>

        {/* Instagram CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a
            href="https://www.instagram.com/bennet_kamar/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '1.5px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '16px 36px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-dm)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            📷 Suivre sur Instagram
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 200px !important;
          }
        }
        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 160px !important;
          }
        }
      `}</style>
    </section>
  );
}

function GalleryItem({ photo, index }: { photo: typeof photos[0]; index: number }) {
  const { ref, visible } = useReveal(0.05);

  const gridStyle =
    photo.span === 'tall'
      ? { gridRow: 'span 2' }
      : photo.span === 'wide'
      ? { gridColumn: 'span 2' }
      : {};

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transition: `opacity 0.6s ease ${index * 0.06}s, transform 0.6s ease ${index * 0.06}s`,
        ...gridStyle,
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        style={{
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
        }}
        sizes="(max-width: 768px) 50vw, 25vw"
        className="gallery-img"
      />
      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(196,145,90,0)',
          transition: 'background 0.4s ease',
        }}
        className="gallery-overlay"
      />

      <style>{`
        div:hover > .gallery-img {
          transform: scale(1.06);
        }
        div:hover > .gallery-overlay {
          background: rgba(196,145,90,0.12) !important;
        }
      `}</style>
    </div>
  );
}
