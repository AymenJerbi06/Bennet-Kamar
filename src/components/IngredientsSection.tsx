'use client';

import { useReveal } from './useReveal';

const values = [
  {
    icon: '🌿',
    title: 'Ingrédients Naturels',
    desc: 'Chaque produit est composé uniquement d\'ingrédients naturels et frais. Pas d\'arômes artificiels, pas de colorants, juste la nature à l\'état pur.',
  },
  {
    icon: '🏡',
    title: 'Préparation Artisanale',
    desc: 'Chaque pot est préparé à la main, avec soin et patience. Le processus artisanal garantit une qualité et une saveur que les machines ne peuvent pas reproduire.',
  },
  {
    icon: '🚫',
    title: 'Zéro Conservateurs',
    desc: 'Aucun additif, aucun conservateur artificiel. Nos produits sont purs et honnêtes — ce que vous voyez est exactement ce que vous mangez.',
  },
  {
    icon: '🌙',
    title: 'Livraison Fraîche',
    desc: 'Préparés à la commande et livrés frais. Chaque produit arrive chez vous dans son meilleur état, exactement comme il quitte notre cuisine.',
  },
];

export default function IngredientsSection() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      style={{
        background: 'var(--sand)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-amiri)',
          fontSize: '260px',
          color: 'rgba(196,145,90,0.06)',
          direction: 'rtl',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        طبيعي
      </div>

      <div style={{ width: 'min(100%, 1280px)', margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        {/* Header */}
        <div
          ref={headRef}
          style={{
            textAlign: 'center',
            marginBottom: '72px',
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
            Nos engagements
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(34px, 5vw, 56px)',
              fontWeight: 600,
              color: 'var(--dark)',
              lineHeight: 1.15,
            }}
          >
            La nature dans chaque pot.
          </h2>
        </div>

        {/* Values grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
          }}
          className="values-grid"
        >
          {values.map((v, i) => (
            <ValueCard key={v.title} value={v} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ValueCard({ value, index }: { value: typeof values[0]; index: number }) {
  const { ref, visible } = useReveal(0.1);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
        background: 'var(--cream-light)',
        padding: '40px 32px',
        borderTop: '3px solid var(--honey)',
      }}
    >
      <div
        style={{
          fontSize: '40px',
          marginBottom: '20px',
          display: 'block',
        }}
      >
        {value.icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--dark)',
          marginBottom: '14px',
          lineHeight: 1.2,
        }}
      >
        {value.title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.75,
          color: 'var(--brown)',
          fontFamily: 'var(--font-dm)',
          fontWeight: 300,
        }}
      >
        {value.desc}
      </p>
    </div>
  );
}
