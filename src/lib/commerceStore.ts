import 'server-only';

import { bundles, products, recipes, type Bundle, type Product, type Recipe } from './products';
import { defaultPromoCodes, type PromoCodeRecord } from './promos';
import { readJson, writeJson } from './fileStore';

export type Catalog = {
  products: Product[];
  bundles: Bundle[];
  recipes: Recipe[];
};

export type Review = {
  id: string;
  productId: string;
  rating: number;
  createdAt: string;
  source?: 'legacy-display' | 'verified-code';
  rewardPoints?: number;
};

export type ReviewStats = Record<string, { average: number; count: number }>;

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'not-delivered' | 'cancelled';

export type OrderRecord = {
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
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoCode?: string;
  paymentMethod: 'cash';
  notes?: string;
};

const defaultCatalog: Catalog = { products, bundles, recipes };

export async function getCatalog() {
  const catalog = await readJson<Partial<Catalog>>('catalog.json', defaultCatalog);
  return {
    products: Array.isArray(catalog.products) ? catalog.products : products,
    bundles: Array.isArray(catalog.bundles) ? catalog.bundles : bundles,
    recipes: Array.isArray(catalog.recipes) ? catalog.recipes : recipes,
  };
}

export async function saveCatalog(catalog: Catalog) {
  await writeJson('catalog.json', catalog);
  return catalog;
}

export async function getPromoCodes() {
  return readJson<PromoCodeRecord[]>('promo-codes.json', defaultPromoCodes);
}

export async function savePromoCodes(promos: PromoCodeRecord[]) {
  await writeJson('promo-codes.json', promos);
  return promos;
}

export async function recordPromoUsage(code?: string) {
  if (!code) return;
  const normalized = code.trim().toUpperCase();
  if (!normalized) return;
  const promos = await getPromoCodes();
  const next = promos.map(promo => (
    promo.code.trim().toUpperCase() === normalized
      ? { ...promo, usageCount: (promo.usageCount || 0) + 1 }
      : promo
  ));
  await savePromoCodes(next);
}

export async function adjustInventoryForOrder(order: OrderRecord, direction: 1 | -1) {
  const catalog = await getCatalog();
  const nextProducts = catalog.products.map(product => ({ ...product }));

  const adjustProduct = (productId: string, quantity: number) => {
    const index = nextProducts.findIndex(product => product.id === productId);
    if (index === -1) return;
    const product = nextProducts[index];
    const currentInventory = Number(product.inventory || 0);
    const currentSold = Number(product.soldCount || 0);
    nextProducts[index] = {
      ...product,
      inventory: Math.max(0, currentInventory - direction * quantity),
      soldCount: Math.max(0, currentSold + direction * quantity),
    };
  };

  for (const item of order.items) {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (item.productId.startsWith('bundle-')) {
      const bundleId = item.productId.replace(/^bundle-/, '');
      const bundle = catalog.bundles.find(entry => entry.id === bundleId);
      bundle?.productIds.forEach(productId => adjustProduct(productId, quantity));
    } else {
      adjustProduct(item.productId, quantity);
    }
  }

  await saveCatalog({ ...catalog, products: nextProducts });
}

export async function getReviews() {
  return readJson<Review[]>('reviews.json', []);
}

export function getReviewStats(reviews: Review[]) {
  return reviews.reduce<ReviewStats>((acc, review) => {
    const current = acc[review.productId] || { average: 0, count: 0 };
    const total = current.average * current.count + review.rating;
    const count = current.count + 1;
    acc[review.productId] = {
      average: Math.round((total / count) * 10) / 10,
      count,
    };
    return acc;
  }, {});
}

export async function getOrders() {
  return readJson<OrderRecord[]>('orders.json', []);
}

export async function saveOrders(orders: OrderRecord[]) {
  await writeJson('orders.json', orders);
  return orders;
}

export function orderId() {
  return `BK-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
