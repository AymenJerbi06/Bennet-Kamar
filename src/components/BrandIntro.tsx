'use client';

import Image from 'next/image';
import { useReveal } from './useReveal';

export default function BrandIntro() {
  const { ref: imgRef, visible: imgVisible } = useReveal();
  const { ref: textRef, visible: textVisible } = useReveal();

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
        className="brand-intro-grid"
      >
        {/* Photo side */}
        <div
          ref={imgRef}
          style={{
            position: 'relative',
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? 'translateX(0)' : 'translateX(-32px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/images/lifestyle/family-1.jpg"
              alt="Feriel préparant ses produits maison"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Floating badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '-24px',
              right: '-24px',
              width: '120px',
              height: '120px',
              background: 'var(--honey)',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '16px',
              boxShadow: '0 12px 40px rgba(196,145,90,0.3)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-amiri)', fontSize: '22px', fontWeight: 700, color: '#fff', lineHeight: 1.1, direction: 'rtl' }}>
              بنة قمر
            </span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-dm)', marginTop: '4px' }}>
              Homemade
            </span>
          </div>
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
            Notre histoire
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 600,
              color: 'var(--dark)',
              lineHeight: 1.15,
              marginBottom: '28px',
              letterSpacing: '-0.01em',
            }}
          >
            Fait avec amour,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--caramel)' }}>par Feriel.</em>
          </h2>

          <div
            style={{
              width: '48px',
              height: '2px',
              background: 'var(--honey)',
              marginBottom: '28px',
            }}
          />

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
            Tout a commencé dans une cuisine familiale, avec des noisettes fraîches,
            un peu de patience, et beaucoup d'amour. Feriel a voulu partager ce qu'elle
            préparait pour ses proches — des produits sains, vrais, et délicieusement
            faits maison.
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
            Aujourd'hui, <strong style={{ fontWeight: 600, color: 'var(--dark)' }}>بنة قمر</strong> c'est
            une gamme de produits artisanaux préparés à la main, avec des ingrédients soigneusement
            sélectionnés — sans additifs, sans conservateurs, juste le vrai goût du fait maison.
          </p>

          {/* Feature tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
            {['100% Naturel', 'Fait maison', 'Sans conservateurs', 'Livraison fraîche'].map(tag => (
              <span
                key={tag}
                style={{
                  background: 'var(--sand)',
                  color: 'var(--caramel)',
                  padding: '6px 16px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-dm)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href="#histoire"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--honey)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-dm)',
              borderBottom: '1.5px solid var(--honey)',
              paddingBottom: '2px',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--caramel)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--caramel)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--honey)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--honey)';
            }}
          >
            En savoir plus →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .brand-intro-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 0 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
