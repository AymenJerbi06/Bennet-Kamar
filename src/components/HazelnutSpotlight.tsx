'use client';

import Image from 'next/image';
import { useReveal } from './useReveal';

export default function HazelnutSpotlight() {
  const { ref: textRef, visible: textVisible } = useReveal(0.15);
  const { ref: videoRef, visible: videoVisible } = useReveal(0.1);

  return (
    <section
      style={{
        background: 'var(--cream-light)',
        padding: '100px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 'min(100%, 1280px)',
          margin: '0 auto',
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
        className="spotlight-grid"
      >
        {/* Video side */}
        <div
          ref={videoRef}
          style={{
            position: 'relative',
            aspectRatio: '4/5',
            overflow: 'hidden',
            opacity: videoVisible ? 1 : 0,
            transform: videoVisible ? 'translateX(0)' : 'translateX(-32px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <video
            src="/videos/hazelnut.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Warm overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 60%, rgba(196,145,90,0.25) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Text side */}
        <div
          ref={textRef}
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateX(0)' : 'translateX(32px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--honey)',
              marginBottom: '20px',
              fontFamily: 'var(--font-dm)',
            }}
          >
            Notre signature
          </p>

          {/* Arabic product name */}
          <div
            style={{
              fontFamily: 'var(--font-amiri)',
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 700,
              color: 'var(--dark)',
              direction: 'rtl',
              textAlign: 'right',
              lineHeight: 1.1,
              marginBottom: '12px',
            }}
          >
            زبدة البندق
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 600,
              color: 'var(--brown)',
              lineHeight: 1.2,
              marginBottom: '24px',
              fontStyle: 'italic',
            }}
          >
            Le beurre de noisette<br />qui a tout changé.
          </h2>

          <div style={{ width: '48px', height: '2px', background: 'var(--honey)', marginBottom: '24px' }} />

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--brown)',
              marginBottom: '20px',
              fontFamily: 'var(--font-dm)',
              fontWeight: 300,
            }}
          >
            Notre beurre de noisette est né d'une obsession : créer quelque chose d'aussi
            pur que possible. Des noisettes torréfiées à la main, mixées lentement jusqu'à
            obtenir cette texture onctueuse unique.
          </p>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: 'var(--brown)',
              marginBottom: '36px',
              fontFamily: 'var(--font-dm)',
              fontWeight: 300,
            }}
          >
            Sans huile de palme. Sans sucre ajouté. Sans conservateurs.
            Juste la noisette dans toute sa richesse naturelle.
          </p>

          {/* Ingredient tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
            {['🌰 Noisettes grillées', '💯 100% naturel', '🚫 Sans huile de palme', '✨ Texture onctueuse'].map(tag => (
              <span
                key={tag}
                style={{
                  background: 'var(--sand)',
                  color: 'var(--dark)',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-dm)',
                  fontWeight: 500,
                  border: '1px solid var(--biscuit)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href="#commander"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--dark)',
              color: 'var(--cream)',
              padding: '16px 36px',
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
            Commander ce produit
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .spotlight-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 0 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
