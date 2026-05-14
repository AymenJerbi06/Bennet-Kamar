'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Facebook, Instagram, Play, Search, ShoppingBag, X } from 'lucide-react';
import { products as defaultProducts, recipes as defaultRecipes, type Product, type Recipe } from '@/lib/products';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

type RecipeMedia = {
  type: 'image' | 'video';
  src: string;
};

export default function RecipesSection() {
  const { copy } = useLanguage();
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetch('/api/catalog')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.recipes)) setRecipes(data.recipes);
        if (Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedRecipe) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedRecipe(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedRecipe]);

  if (!recipes.length) return null;

  return (
    <section id="recipes" className="recipes-section">
      <div className="container">
        <div className="recipes-heading">
          <p>{copy.recipes.eyebrow}</p>
          <h2 className="section-title">{copy.recipes.title}</h2>
          <span>{copy.recipes.intro}</span>
        </div>

        <div className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onOpen={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          products={products}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </section>
  );
}

function RecipeCard({ recipe, onOpen }: { recipe: Recipe; onOpen: () => void }) {
  const { copy } = useLanguage();

  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className="recipe-card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKey}
      aria-label={`View ${recipe.title}`}
    >
      <div className="recipe-media">
        <Image
          src={recipe.image || '/logo.jpg'}
          alt={recipe.title}
          fill
          sizes="(max-width: 760px) 90vw, (max-width: 1180px) 44vw, 24vw"
          style={{ objectFit: 'cover' }}
        />
        <span>{recipe.category === 'sweet' ? 'Sweet' : 'Savory'}</span>
      </div>
      <div className="recipe-card-copy">
        <p>{recipe.time} - {recipe.difficulty}</p>
        <h3>{recipe.title}</h3>
        {recipe.titleAr && <span className="recipe-ar">{recipe.titleAr}</span>}
        <small>{copy.recipes.usedProduct} {recipe.relatedProduct}</small>
      </div>
    </article>
  );
}

function RecipeModal({
  recipe,
  products,
  onClose,
}: {
  recipe: Recipe;
  products: Product[];
  onClose: () => void;
}) {
  const { copy } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVideo, setFullscreenVideo] = useState(false);
  const media = useMemo<RecipeMedia[]>(() => {
    const images = (recipe.gallery?.length ? recipe.gallery : [recipe.image]).filter(Boolean);
    return [
      ...images.map(src => ({ type: 'image' as const, src })),
      ...(recipe.videoUrl ? [{ type: 'video' as const, src: recipe.videoUrl }] : []),
    ];
  }, [recipe]);
  const activeMedia = media[activeIndex] || { type: 'image', src: recipe.image };

  const goToMedia = (direction: 'prev' | 'next') => {
    setActiveIndex(index => {
      if (direction === 'next') return (index + 1) % media.length;
      return (index - 1 + media.length) % media.length;
    });
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal recipe-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        onClick={event => event.stopPropagation()}
      >
        <button className="product-modal-close" onClick={onClose} aria-label={copy.recipes.close}>
          <X size={24} />
        </button>

        <div className="recipe-gallery">
          <button
            type="button"
            className={`recipe-modal-media ${activeMedia.type === 'video' ? 'is-video' : ''}`}
            onClick={() => activeMedia.type === 'video' && setFullscreenVideo(true)}
            aria-label={activeMedia.type === 'video' ? copy.recipes.watch : recipe.title}
          >
            {activeMedia.type === 'image' ? (
              <Image
                src={activeMedia.src || '/logo.jpg'}
                alt={recipe.title}
                fill
                sizes="(max-width: 900px) 90vw, 46vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <>
                <Image
                  src={recipe.image || '/logo.jpg'}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 900px) 90vw, 46vw"
                  style={{ objectFit: 'cover' }}
                />
                <div className="recipe-video-cover">
                  <Play size={34} fill="currentColor" />
                  <span>{copy.recipes.watch}</span>
                </div>
              </>
            )}

            {media.length > 1 && (
              <>
                <span
                  className="slider-btn prev"
                  onClick={event => {
                    event.stopPropagation();
                    goToMedia('prev');
                  }}
                >
                  <ChevronLeft size={25} />
                </span>
                <span
                  className="slider-btn next"
                  onClick={event => {
                    event.stopPropagation();
                    goToMedia('next');
                  }}
                >
                  <ChevronRight size={25} />
                </span>
              </>
            )}
          </button>

          {media.length > 1 && (
            <div className="product-slider-dots" aria-label={`${recipe.title} media slider`}>
              {media.map((item, index) => (
                <button
                  key={`${item.type}-${item.src}`}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show media ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="recipe-play-panel">
            {recipe.videoUrl && (
              <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer" className="mini-media-btn">
                <ExternalLink size={15} />
                {copy.recipes.openVideo}
              </a>
            )}
            <SocialLink href={recipe.instagramUrl} label={copy.recipes.instagram} icon="instagram" />
            <SocialLink href={recipe.facebookUrl} label={copy.recipes.facebook} icon="facebook" />
          </div>
        </div>

        <div className="product-modal-copy">
          <p className="modal-kicker">{copy.recipes.eyebrow}</p>
          <h3 id="recipe-modal-title">{recipe.title}</h3>
          {recipe.titleAr && <p className="modal-ar">{recipe.titleAr}</p>}
          <ProductsUsed recipe={recipe} products={products} onClose={onClose} />
          <p className="modal-desc">{recipe.overview}</p>

          <div className="recipe-facts">
            <span>{recipe.time}</span>
            <span>{recipe.difficulty}</span>
            <span>{copy.recipes.usedProduct} {recipe.relatedProduct}</span>
          </div>

          <h4>{copy.recipes.ingredients}</h4>
          <ul className="modal-details">
            {recipe.ingredients.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h4>{copy.recipes.steps}</h4>
          <ol className="modal-details recipe-steps">
            {recipe.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {fullscreenVideo && recipe.videoUrl && (
        <div className="recipe-video-fullscreen" onClick={() => setFullscreenVideo(false)}>
          <button type="button" onClick={() => setFullscreenVideo(false)} aria-label="Close video">
            <X size={24} />
          </button>
          <video src={recipe.videoUrl} controls autoPlay playsInline onClick={event => event.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function SocialLink({ href, label, icon }: { href?: string; label: string; icon: 'instagram' | 'facebook' }) {
  const Icon = icon === 'instagram' ? Instagram : Facebook;
  if (!href) {
    return (
      <span className="mini-media-btn disabled">
        <Icon size={15} />
        {label}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mini-media-btn">
      <Icon size={15} />
      {label}
    </a>
  );
}

function ProductsUsed({
  recipe,
  products,
  onClose,
}: {
  recipe: Recipe;
  products: Product[];
  onClose: () => void;
}) {
  const { copy } = useLanguage();
  const { addToCart } = useStore();
  const used = recipe.productsUsed || [];

  if (!used.length) return null;

  const inspectProduct = (productId: string) => {
    window.dispatchEvent(new CustomEvent('bennet:inspect-product', { detail: { productId } }));
    onClose();
    window.setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="recipe-products-used">
      <h4>{copy.recipes.productsUsed}</h4>
      <div>
        {used.map(entry => {
          const product = products.find(item => item.id === entry.productId);
          if (!product) return null;

          return (
            <article key={entry.productId} className="recipe-used-product">
              <div>
                <strong>{product.nameFr}</strong>
                <span>{product.nameAr}</span>
              </div>
              <div className="recipe-product-actions">
                <button
                  type="button"
                  className="mini-media-btn compact"
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingBag size={14} />
                  {copy.recipes.addProduct}
                </button>
                <button type="button" className="mini-media-btn compact ghost" onClick={() => inspectProduct(product.id)}>
                  <Search size={14} />
                  {copy.recipes.inspect}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
