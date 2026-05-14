'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Film,
  ImagePlus,
  LogOut,
  PackagePlus,
  PencilLine,
  Save,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react';
import type { Bundle, Product, Recipe } from '@/lib/products';
import type { PromoCodeRecord } from '@/lib/promos';
import { formatPrice } from '@/lib/products';

type Tab = 'products' | 'bundles' | 'recipes' | 'promos' | 'orders' | 'reviews';
type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'not-delivered' | 'cancelled';
type OrderRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoCode?: string;
  paymentMethod: 'cash';
  notes?: string;
};
type ReviewStats = Record<string, { average: number; count: number }>;
const emptyProduct = (): Product => ({
  id: `product-${Date.now()}`,
  slug: `product-${Date.now()}`,
  nameAr: '',
  nameFr: 'New Product',
  category: 'sweet',
  categoryLabel: 'Sweet',
  tagline: '',
  description: '',
  details: [],
  image: '/images/catalog/hazelnut-butter-1.jpg',
  gallery: ['/images/catalog/hazelnut-butter-1.jpg'],
  ingredients: [],
  price: 0,
  weight: '',
  inStock: true,
  kind: 'product',
});

const emptyBundle = (): Bundle => ({
  id: `bundle-${Date.now()}`,
  name: 'New Bundle',
  nameAr: '',
  slug: `bundle-${Date.now()}`,
  description: '',
  includes: [],
  productIds: [],
  image: '/images/catalog/hazelnut-butter-1.jpg',
  price: 0,
  originalPrice: 0,
});

const emptyRecipe = (): Recipe => ({
  id: `recipe-${Date.now()}`,
  slug: `recipe-${Date.now()}`,
  title: 'New Recipe',
  titleAr: '',
  category: 'sweet',
  relatedProduct: '',
  overview: '',
  image: '/images/recipes/pancakes.jpg',
  gallery: ['/images/recipes/pancakes.jpg'],
  videoUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  productsUsed: [],
  time: '20 min',
  difficulty: 'Facile',
  ingredients: [],
  steps: [],
});

const emptyPromo = (): PromoCodeRecord => ({
  id: `promo-${Date.now()}`,
  code: 'NEWCODE',
  label: 'New promo code',
  active: true,
  percentage: 0.1,
  appliesTo: 'subtotal',
  waivesDelivery: false,
  usageCount: 0,
  createdAt: new Date().toISOString(),
});

async function uploadAdminImage(file: File) {
  const body = new FormData();
  body.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body,
  });
  const data = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Image upload failed.');
  }

  return String(data.url);
}

async function uploadAdminVideo(file: File) {
  const body = new FormData();
  body.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body,
  });
  const data = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Video upload failed.');
  }

  return String(data.url);
}

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [promos, setPromos] = useState<PromoCodeRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({});
  const [reviewsCount, setReviewsCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/session')
      .then(response => response.json())
      .then(data => {
        setAuthenticated(Boolean(data.authenticated));
        if (data.authenticated) void loadAdminData();
      })
      .finally(() => setChecking(false));
  }, []);

  const loadAdminData = async () => {
    const [catalogRes, ordersRes, reviewsRes, promosRes] = await Promise.all([
      fetch('/api/admin/catalog'),
      fetch('/api/admin/orders'),
      fetch('/api/admin/reviews'),
      fetch('/api/admin/promos'),
    ]);
    if (catalogRes.ok) {
      const catalog = await catalogRes.json();
      setProducts(catalog.products || []);
      setBundles(catalog.bundles || []);
      setRecipes(catalog.recipes || []);
    }
    if (ordersRes.ok) setOrders(await ordersRes.json());
    if (reviewsRes.ok) {
      const data = await reviewsRes.json();
      setReviewStats(data.stats || {});
      setReviewsCount(data.reviews?.length || 0);
    }
    if (promosRes.ok) setPromos(await promosRes.json());
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setLoginError(data.error || 'Login failed.');
      return;
    }
    setAuthenticated(true);
    await loadAdminData();
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const saveCatalog = async () => {
    setSaveMessage('');
    const response = await fetch('/api/admin/catalog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products, bundles, recipes }),
    });
    setSaveMessage(response.ok ? 'Catalog saved.' : 'Catalog could not be saved.');
  };

  const savePromos = async () => {
    setSaveMessage('');
    const response = await fetch('/api/admin/promos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promos }),
    });
    setSaveMessage(response.ok ? 'Promo codes saved.' : 'Promo codes could not be saved.');
    if (response.ok) setPromos(await response.json());
  };

  const updateProduct = <K extends keyof Product>(id: string, key: K, value: Product[K]) => {
    setProducts(prev => prev.map(product => product.id === id ? { ...product, [key]: value } : product));
  };

  const updateBundle = <K extends keyof Bundle>(id: string, key: K, value: Bundle[K]) => {
    setBundles(prev => prev.map(bundle => bundle.id === id ? { ...bundle, [key]: value } : bundle));
  };

  const updateRecipe = <K extends keyof Recipe>(id: string, key: K, value: Recipe[K]) => {
    setRecipes(prev => prev.map(recipe => recipe.id === id ? { ...recipe, [key]: value } : recipe));
  };

  const updatePromo = <K extends keyof PromoCodeRecord>(id: string, key: K, value: PromoCodeRecord[K]) => {
    setPromos(prev => prev.map(promo => promo.id === id ? { ...promo, [key]: value } : promo));
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    const response = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) await loadAdminData();
  };

  if (checking) {
    return <div className="admin-shell"><p>Checking admin session...</p></div>;
  }

  if (!authenticated) {
    return (
      <section className="admin-login">
        <form onSubmit={login} className="admin-login-card">
          <ShieldCheck size={30} />
          <h1>Admin Access</h1>
          <p>Hidden owner dashboard for Bennet Kamar catalog and orders.</p>
          <label>
            Email
            <input value={email} onChange={event => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={event => setPassword(event.target.value)} type="password" required />
          </label>
          {loginError && <div className="admin-error">{loginError}</div>}
          <button className="black-btn" type="submit">Log in</button>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p>Owner dashboard</p>
          <h1>Bennet Kamar Admin</h1>
        </div>
        <button onClick={logout} className="admin-ghost-btn">
          <LogOut size={17} />
          Log out
        </button>
      </div>

      <div className="admin-tabs">
        {(['products', 'bundles', 'recipes', 'promos', 'orders', 'reviews'] as Tab[]).map(item => (
          <button key={item} onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>
            {item}
          </button>
        ))}
      </div>

      {(tab === 'products' || tab === 'bundles' || tab === 'recipes') && (
        <div className="admin-actions">
          <button onClick={saveCatalog} className="black-btn">
            <Save size={17} />
            Save Catalog
          </button>
          {saveMessage && <span>{saveMessage}</span>}
        </div>
      )}

      {tab === 'promos' && (
        <div className="admin-actions">
          <button onClick={savePromos} className="black-btn">
            <Save size={17} />
            Save Promo Codes
          </button>
          {saveMessage && <span>{saveMessage}</span>}
        </div>
      )}

      {tab === 'products' && (
        <div className="admin-list">
          <button onClick={() => setProducts(prev => [emptyProduct(), ...prev])} className="admin-add-btn">
            <PackagePlus size={18} />
            Add Product
          </button>
          {products.map(product => (
            <ProductEditor
              key={product.id}
              product={product}
              onChange={updateProduct}
              onRemove={() => setProducts(prev => prev.filter(item => item.id !== product.id))}
            />
          ))}
        </div>
      )}

      {tab === 'bundles' && (
        <div className="admin-list">
          <button onClick={() => setBundles(prev => [emptyBundle(), ...prev])} className="admin-add-btn">
            <PackagePlus size={18} />
            Add Bundle
          </button>
          {bundles.map(bundle => (
            <BundleEditor
              key={bundle.id}
              bundle={bundle}
              onChange={updateBundle}
              onRemove={() => setBundles(prev => prev.filter(item => item.id !== bundle.id))}
            />
          ))}
        </div>
      )}

      {tab === 'recipes' && (
        <div className="admin-list">
          <button onClick={() => setRecipes(prev => [emptyRecipe(), ...prev])} className="admin-add-btn">
            <PackagePlus size={18} />
            Add Recipe
          </button>
          {recipes.map(recipe => (
            <RecipeEditor
              key={recipe.id}
              recipe={recipe}
              onChange={updateRecipe}
              onRemove={() => setRecipes(prev => prev.filter(item => item.id !== recipe.id))}
            />
          ))}
        </div>
      )}

      {tab === 'promos' && (
        <div className="admin-list">
          <button onClick={() => setPromos(prev => [emptyPromo(), ...prev])} className="admin-add-btn">
            <PackagePlus size={18} />
            Add Promo Code
          </button>

          <div className="admin-promo-group">
            <h2>Active promo codes</h2>
            {promos.filter(promo => promo.active).map(promo => (
              <PromoEditor
                key={promo.id}
                promo={promo}
                onChange={updatePromo}
                onRemove={() => setPromos(prev => prev.filter(item => item.id !== promo.id))}
              />
            ))}
          </div>

          <div className="admin-promo-group">
            <h2>Previous promo codes</h2>
            {promos.filter(promo => !promo.active).map(promo => (
              <PromoEditor
                key={promo.id}
                promo={promo}
                onChange={updatePromo}
                onRemove={() => setPromos(prev => prev.filter(item => item.id !== promo.id))}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-list">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map(order => (
            <article key={order.id} className="admin-order">
              <div>
                <h3>{order.id}</h3>
                <p>{new Date(order.createdAt).toLocaleString()} · {order.customer.firstName} {order.customer.lastName}</p>
                <p>{order.customer.phone} · {order.customer.address}, {order.customer.city}</p>
                <p>{order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</p>
                <p>Delivery: {formatPrice(order.deliveryFee || 0)} · Discount: {formatPrice(order.discount || 0)}</p>
              </div>
              <div>
                <strong>{formatPrice(order.total)}</strong>
                <select value={order.status} onChange={event => updateOrderStatus(order.id, event.target.value as OrderStatus)}>
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="delivered">delivered</option>
                  <option value="not-delivered">not delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="admin-list">
          <div className="admin-review-summary">
            <Star size={20} fill="currentColor" />
            {reviewsCount} display-only ratings currently stored. Public submission is disabled.
          </div>
          {Object.entries(reviewStats).map(([productId, stats]) => (
            <article key={productId} className="admin-order">
              <div>
                <h3>{products.find(product => product.id === productId)?.nameFr || productId}</h3>
                <p>{stats.count} ratings</p>
              </div>
              <strong>{stats.average} / 5</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ProductEditor({
  product,
  onChange,
  onRemove,
}: {
  product: Product;
  onChange: <K extends keyof Product>(id: string, key: K, value: Product[K]) => void;
  onRemove: () => void;
}) {
  return (
    <article className="admin-editor">
      <AdminImage src={product.image} alt={product.nameFr} />
      <div className="admin-editor-grid">
        <AdminInput label="Name" value={product.nameFr} onChange={value => onChange(product.id, 'nameFr', value)} />
        <AdminInput label="Arabic name" value={product.nameAr} onChange={value => onChange(product.id, 'nameAr', value)} />
        <AdminInput label="Price" type="number" value={product.price} onChange={value => onChange(product.id, 'price', Number(value))} />
        <AdminInput label="Original price" type="number" value={product.originalPrice || ''} onChange={value => onChange(product.id, 'originalPrice', Number(value) || undefined)} />
        <AdminInput label="Inventory" type="number" value={product.inventory || 0} onChange={value => onChange(product.id, 'inventory', Math.max(0, Number(value) || 0))} />
        <AdminInput label="Sold so far" type="number" value={product.soldCount || 0} onChange={value => onChange(product.id, 'soldCount', Math.max(0, Number(value) || 0))} />
        <label>
          Category
          <select value={product.category} onChange={event => onChange(product.id, 'category', event.target.value as Product['category'])}>
            <option value="sweet">Sweet</option>
            <option value="salty">Savory</option>
          </select>
        </label>
        <label className="wide">
          Description
          <textarea value={product.description} onChange={event => onChange(product.id, 'description', event.target.value)} />
        </label>
        <AdminInput label="Tagline" value={product.tagline} onChange={value => onChange(product.id, 'tagline', value)} />
        <AdminInput label="Weight" value={product.weight || ''} onChange={value => onChange(product.id, 'weight', value)} />
        <GalleryEditor
          label="Product photos"
          images={product.gallery.length ? product.gallery : [product.image]}
          onChange={images => {
            onChange(product.id, 'gallery', images);
            onChange(product.id, 'image', images[0] || '/logo.jpg');
          }}
        />
        <label className="wide">
          Ingredients, one per line
          <textarea value={product.ingredients.join('\n')} onChange={event => onChange(product.id, 'ingredients', event.target.value.split('\n').filter(Boolean))} />
        </label>
        <label className="wide">
          Details, one per line
          <textarea value={product.details.join('\n')} onChange={event => onChange(product.id, 'details', event.target.value.split('\n').filter(Boolean))} />
        </label>
        <label><input type="checkbox" checked={product.inStock} onChange={event => onChange(product.id, 'inStock', event.target.checked)} /> In stock</label>
        <label><input type="checkbox" checked={Boolean(product.hotThisWeek)} onChange={event => onChange(product.id, 'hotThisWeek', event.target.checked)} /> Hot this week</label>
        <label><input type="checkbox" checked={Boolean(product.customerFavorite)} onChange={event => onChange(product.id, 'customerFavorite', event.target.checked)} /> Favored by customers</label>
      </div>
      <button onClick={onRemove} className="admin-delete" aria-label={`Delete ${product.nameFr}`}>
        <Trash2 size={18} />
      </button>
    </article>
  );
}

function BundleEditor({
  bundle,
  onChange,
  onRemove,
}: {
  bundle: Bundle;
  onChange: <K extends keyof Bundle>(id: string, key: K, value: Bundle[K]) => void;
  onRemove: () => void;
}) {
  return (
    <article className="admin-editor">
      <AdminImage src={bundle.image} alt={bundle.name} />
      <div className="admin-editor-grid">
        <AdminInput label="Name" value={bundle.name} onChange={value => onChange(bundle.id, 'name', value)} />
        <AdminInput label="Arabic name" value={bundle.nameAr} onChange={value => onChange(bundle.id, 'nameAr', value)} />
        <AdminInput label="Discounted price" type="number" value={bundle.price} onChange={value => onChange(bundle.id, 'price', Number(value))} />
        <AdminInput label="Original price" type="number" value={bundle.originalPrice} onChange={value => onChange(bundle.id, 'originalPrice', Number(value))} />
        <AdminInput label="Video path" value={bundle.video || ''} onChange={value => onChange(bundle.id, 'video', value || undefined)} />
        <SingleImageEditor
          label="Bundle cover image"
          image={bundle.image}
          onChange={value => onChange(bundle.id, 'image', value)}
        />
        <label className="wide">
          Description
          <textarea value={bundle.description} onChange={event => onChange(bundle.id, 'description', event.target.value)} />
        </label>
        <label className="wide">
          Included items, one per line
          <textarea value={bundle.includes.join('\n')} onChange={event => onChange(bundle.id, 'includes', event.target.value.split('\n').filter(Boolean))} />
        </label>
        <label><input type="checkbox" checked={Boolean(bundle.hotThisWeek)} onChange={event => onChange(bundle.id, 'hotThisWeek', event.target.checked)} /> Hot this week</label>
        <label><input type="checkbox" checked={Boolean(bundle.customerFavorite)} onChange={event => onChange(bundle.id, 'customerFavorite', event.target.checked)} /> Favored by customers</label>
      </div>
      <button onClick={onRemove} className="admin-delete" aria-label={`Delete ${bundle.name}`}>
        <Trash2 size={18} />
      </button>
    </article>
  );
}

function RecipeEditor({
  recipe,
  onChange,
  onRemove,
}: {
  recipe: Recipe;
  onChange: <K extends keyof Recipe>(id: string, key: K, value: Recipe[K]) => void;
  onRemove: () => void;
}) {
  return (
    <article className="admin-editor">
      <AdminImage src={recipe.image} alt={recipe.title} />
      <div className="admin-editor-grid">
        <AdminInput label="Title" value={recipe.title} onChange={value => onChange(recipe.id, 'title', value)} />
        <AdminInput label="Arabic title" value={recipe.titleAr || ''} onChange={value => onChange(recipe.id, 'titleAr', value)} />
        <AdminInput label="Slug" value={recipe.slug} onChange={value => onChange(recipe.id, 'slug', value)} />
        <label>
          Category
          <select value={recipe.category} onChange={event => onChange(recipe.id, 'category', event.target.value as Recipe['category'])}>
            <option value="sweet">Sweet</option>
            <option value="salty">Savory</option>
          </select>
        </label>
        <AdminInput label="Related product" value={recipe.relatedProduct} onChange={value => onChange(recipe.id, 'relatedProduct', value)} />
        <AdminInput label="Time" value={recipe.time} onChange={value => onChange(recipe.id, 'time', value)} />
        <AdminInput label="Difficulty" value={recipe.difficulty} onChange={value => onChange(recipe.id, 'difficulty', value)} />
        <SingleVideoEditor
          label="Recipe video"
          video={recipe.videoUrl || ''}
          onChange={value => onChange(recipe.id, 'videoUrl', value || undefined)}
        />
        <AdminInput label="Instagram URL" value={recipe.instagramUrl || ''} onChange={value => onChange(recipe.id, 'instagramUrl', value || undefined)} />
        <AdminInput label="Facebook URL" value={recipe.facebookUrl || ''} onChange={value => onChange(recipe.id, 'facebookUrl', value || undefined)} />
        <GalleryEditor
          label="Recipe photos"
          images={recipe.gallery?.length ? recipe.gallery : [recipe.image]}
          onChange={images => {
            onChange(recipe.id, 'gallery', images);
            onChange(recipe.id, 'image', images[0] || '/logo.jpg');
          }}
        />
        <label className="wide">
          Overview
          <textarea value={recipe.overview} onChange={event => onChange(recipe.id, 'overview', event.target.value)} />
        </label>
        <label className="wide">
          Products used, one per line as product-id:quantity
          <textarea
            value={(recipe.productsUsed || []).map(item => `${item.productId}:${item.quantity}`).join('\n')}
            onChange={event => onChange(recipe.id, 'productsUsed', event.target.value.split('\n').map(line => {
              const [productId, quantity] = line.split(':');
              return { productId: productId.trim(), quantity: Math.max(1, Number(quantity) || 1) };
            }).filter(item => item.productId))}
          />
        </label>
        <label className="wide">
          Ingredients, one per line
          <textarea value={recipe.ingredients.join('\n')} onChange={event => onChange(recipe.id, 'ingredients', event.target.value.split('\n').filter(Boolean))} />
        </label>
        <label className="wide">
          Steps, one per line
          <textarea value={recipe.steps.join('\n')} onChange={event => onChange(recipe.id, 'steps', event.target.value.split('\n').filter(Boolean))} />
        </label>
      </div>
      <button onClick={onRemove} className="admin-delete" aria-label={`Delete ${recipe.title}`}>
        <Trash2 size={18} />
      </button>
    </article>
  );
}

function PromoEditor({
  promo,
  onChange,
  onRemove,
}: {
  promo: PromoCodeRecord;
  onChange: <K extends keyof PromoCodeRecord>(id: string, key: K, value: PromoCodeRecord[K]) => void;
  onRemove: () => void;
}) {
  const percent = Math.round((promo.percentage || 0) * 100);

  return (
    <article className="admin-editor admin-promo-editor">
      <div className="admin-promo-stat">
        <strong>{promo.usageCount || 0}</strong>
        <span>uses</span>
      </div>
      <div className="admin-editor-grid">
        <AdminInput label="Code" value={promo.code} onChange={value => onChange(promo.id, 'code', value.toUpperCase())} />
        <AdminInput label="Label" value={promo.label} onChange={value => onChange(promo.id, 'label', value)} />
        <label>
          Applies to
          <select value={promo.appliesTo} onChange={event => onChange(promo.id, 'appliesTo', event.target.value as PromoCodeRecord['appliesTo'])}>
            <option value="subtotal">Products only</option>
            <option value="total">Products + delivery</option>
          </select>
        </label>
        <label className="wide">
          Discount percentage: {percent}%
          <input
            type="range"
            min="0"
            max="100"
            value={percent}
            onChange={event => onChange(promo.id, 'percentage', Number(event.target.value) / 100)}
          />
        </label>
        <label><input type="checkbox" checked={promo.active} onChange={event => onChange(promo.id, 'active', event.target.checked)} /> Active</label>
        <label><input type="checkbox" checked={promo.waivesDelivery} onChange={event => onChange(promo.id, 'waivesDelivery', event.target.checked)} /> Remove delivery fee</label>
      </div>
      <button onClick={onRemove} className="admin-delete" aria-label={`Delete ${promo.code}`}>
        <Trash2 size={18} />
      </button>
    </article>
  );
}

function GalleryEditor({
  label,
  images,
  onChange,
}: {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [status, setStatus] = useState('');

  const replaceImage = async (index: number, file?: File) => {
    if (!file) return;
    try {
      setStatus('Uploading image...');
      const url = await uploadAdminImage(file);
      onChange(images.map((image, imageIndex) => imageIndex === index ? url : image));
      setStatus('Image updated.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const addImage = async (file?: File) => {
    if (!file) return;
    try {
      setStatus('Uploading image...');
      const url = await uploadAdminImage(file);
      onChange([...images, url]);
      setStatus('Image added.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const next = [...images];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, imageIndex) => imageIndex !== index);
    onChange(next.length ? next : ['/logo.jpg']);
  };

  return (
    <div className="admin-media-editor">
      <div className="admin-media-head">
        <strong>{label}</strong>
        <span>The first photo is the storefront cover.</span>
      </div>

      <div className="admin-media-stack">
        {images.map((image, index) => (
          <div className="admin-media-card" key={`${image}-${index}`}>
            {index === 0 && <span className="admin-media-badge">Cover</span>}
            <AdminImage src={image} alt={`${label} ${index + 1}`} />
            <div className="admin-media-actions">
              <label className="admin-upload-label" aria-label={`Replace image ${index + 1}`}>
                <PencilLine size={15} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={event => replaceImage(index, event.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                onClick={() => moveImage(index, 'left')}
                disabled={index === 0}
                aria-label={`Move image ${index + 1} left`}
              >
                <ArrowLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => moveImage(index, 'right')}
                disabled={index === images.length - 1}
                aria-label={`Move image ${index + 1} right`}
              >
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label={`Remove image ${index + 1}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        <label className="admin-upload-card">
          <ImagePlus size={24} />
          <span>Add image</span>
          <input type="file" accept="image/*" onChange={event => addImage(event.target.files?.[0])} />
        </label>
      </div>

      {status && <span className="admin-media-note">{status}</span>}
    </div>
  );
}

function SingleImageEditor({
  label,
  image,
  onChange,
}: {
  label: string;
  image: string;
  onChange: (value: string) => void;
}) {
  const [status, setStatus] = useState('');

  const replaceImage = async (file?: File) => {
    if (!file) return;
    try {
      setStatus('Uploading image...');
      const url = await uploadAdminImage(file);
      onChange(url);
      setStatus('Image updated.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  return (
    <div className="admin-media-editor">
      <div className="admin-media-head">
        <strong>{label}</strong>
      </div>
      <div className="admin-single-media">
        <AdminImage src={image} alt={label} />
        <label className="admin-single-media-edit">
          <PencilLine size={16} />
          Replace image
          <input type="file" accept="image/*" onChange={event => replaceImage(event.target.files?.[0])} />
        </label>
      </div>
      {status && <span className="admin-media-note">{status}</span>}
    </div>
  );
}

function SingleVideoEditor({
  label,
  video,
  onChange,
}: {
  label: string;
  video: string;
  onChange: (value: string) => void;
}) {
  const [status, setStatus] = useState('');

  const replaceVideo = async (file?: File) => {
    if (!file) return;
    try {
      setStatus('Uploading video...');
      const url = await uploadAdminVideo(file);
      onChange(url);
      setStatus('Video updated.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Video upload failed.');
    }
  };

  return (
    <div className="admin-media-editor wide">
      <div className="admin-media-head">
        <strong>{label}</strong>
        <span>Upload the recipe video used in the recipe media slider.</span>
      </div>
      <div className="admin-single-media">
        {video ? (
          <div className="admin-video-preview">
            <video src={video} controls muted playsInline />
          </div>
        ) : (
          <div className="admin-video-empty">
            <Film size={26} />
            <span>No video attached</span>
          </div>
        )}
        <label className="admin-single-media-edit">
          <PencilLine size={16} />
          {video ? 'Replace video' : 'Add video'}
          <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={event => replaceVideo(event.target.files?.[0])} />
        </label>
        {video && (
          <button type="button" className="admin-remove-media" onClick={() => onChange('')}>
            <Trash2 size={16} />
            Remove video
          </button>
        )}
      </div>
      {status && <span className="admin-media-note">{status}</span>}
    </div>
  );
}

function AdminInput({
  label,
  value,
  type = 'text',
  onChange,
}: {
  label: string;
  value: string | number;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={event => onChange(event.target.value)} />
    </label>
  );
}

function AdminImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="admin-thumb">
      <Image src={src || '/logo.jpg'} alt={alt || 'Product'} fill sizes="120px" style={{ objectFit: 'cover' }} />
    </div>
  );
}
