'use client';

import Image from 'next/image';
import { useReveal } from './useReveal';

const recipes = [
  { title: 'Japanese Cake بنة قمر', product: 'Nutella Naturel', time: '45 min', image: '/images/recipes/japanese-cake.jpg', difficulty: 'Facile' },
  { title: 'Mini Donuts Beurre de Noisette', product: 'Beurre de Noisette', time: '30 min', image: '/images/recipes/donuts.jpg', difficulty: 'Facile' },
  { title: 'Pancakes Pistache', product: 'Beurre de Pistache', time: '20 min', image: '/images/recipes/pancakes.jpg', difficulty: 'Très facile' },
  { title: 'Iced Coffee Pistache', product: 'Beurre de Pistache', time: '10 min', image: '/images/recipes/iced-coffee.jpg', difficulty: 'Très facile' },
];

export default function RecipesSection() {
  const { ref, visible } = useReveal();
  return (
    <section id="recettes" style={{ background: 'var(--cream-light)', padding: '96px 0' }}>
      <div className="container">
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '56px', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 500, color: 'var(--wood)', marginBottom: '10px' }}>
            Recettes &amp; Inspirations
          </h2>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            Créez avec nos produits artisanaux.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="recipes-grid">
          {recipes.map((r, i) => <RecipeCard key={r.title} recipe={r} index={i} />)}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .recipes-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .recipes-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function RecipeCard({ recipe, index }: { recipe: typeof recipes[0]; index: number }) {
  const { ref, visible } = useReveal(0.08);
  return (
    <article ref={ref} style={{ background: 'var(--cream)', overflow: 'hidden', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s` }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--biscuit)' }}>
        <Image src={recipe.image} alt={recipe.title} fill sizes="(max-width: 900px) 50vw, 25vw"
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} className="recipe-img" />
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(15,8,5,0.75)', color: 'rgba(234,198,152,0.9)', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-dm)' }}>
          {recipe.product}
        </div>
      </div>
      <div style={{ padding: '18px 16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-dm)' }}>⏱ {recipe.time}</span>
          <span style={{ fontSize: '10px', color: 'var(--teal-dark)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-dm)' }}>✨ {recipe.difficulty}</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px', fontWeight: 500, color: 'var(--wood)', lineHeight: 1.3 }}>{recipe.title}</h3>
      </div>
      <style>{`article:hover .recipe-img { transform: scale(1.06); }`}</style>
    </article>
  );
}
