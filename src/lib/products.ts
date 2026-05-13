export type Product = {
  id: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  category: 'sweet' | 'salty';
  categoryLabel: string;
  tagline: string;
  description: string;
  details: string[];
  image: string;
  hoverImage?: string;
  gallery: string[];
  ingredients: string[];
  price: number;
  originalPrice?: number;
  weight?: string;
  inStock: boolean;
  featured?: boolean;
};

export type Bundle = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  includes: string[];
  productIds: string[];
  image: string;
  video?: string;
  price: number;
  originalPrice: number;
  featured?: boolean;
};

const catalog = '/images/catalog';

export const products: Product[] = [
  {
    id: 'hazelnut-butter',
    slug: 'beurre-noisette',
    nameAr: 'زبدة البندق',
    nameFr: 'Beurre de Noisette',
    category: 'sweet',
    categoryLabel: 'Beurres',
    tagline: 'Onctueux · 100% naturel',
    description: 'Fait maison avec des noisettes fraîchement torréfiées. Sans sucre ajouté, sans huile de palme, sans conservateurs.',
    details: ['Best-seller de la maison', 'Texture lisse et généreuse', 'Parfait pour crêpes, tartines et desserts'],
    image: `${catalog}/hazelnut-butter-1.jpg`,
    hoverImage: `${catalog}/hazelnut-butter-2.jpg`,
    gallery: [
      `${catalog}/hazelnut-butter-1.jpg`,
      `${catalog}/hazelnut-butter-2.jpg`,
      `${catalog}/hazelnut-butter-3.jpg`,
      `${catalog}/hazelnut-butter-4.jpg`,
      `${catalog}/hazelnut-butter-5.jpg`,
    ],
    ingredients: ['Noisettes grillées', 'Sans sucre ajouté', 'Sans huile de palme'],
    price: 25,
    weight: '250g',
    inStock: true,
    featured: true,
  },
  {
    id: 'pistachio-butter',
    slug: 'beurre-pistache',
    nameAr: 'زبدة الفستق',
    nameFr: 'Beurre de Pistache',
    category: 'sweet',
    categoryLabel: 'Beurres',
    tagline: 'Gourmand · Couleur naturelle',
    description: "Un beurre de pistache maison d'une douceur incomparable, à la belle couleur verte naturelle.",
    details: ['Pistaches premium', 'Goût riche sans additifs', 'Délicieux sur pancakes, gâteaux et iced coffee'],
    image: `${catalog}/pistachio-butter-1.jpg`,
    hoverImage: `${catalog}/pistachio-butter-2.jpg`,
    gallery: [
      `${catalog}/pistachio-butter-1.jpg`,
      `${catalog}/pistachio-butter-2.jpg`,
      `${catalog}/pistachio-butter-3.jpg`,
      `${catalog}/pistachio-butter-4.jpg`,
    ],
    ingredients: ['Pistaches premium', 'Couleur naturelle', 'Zéro additif'],
    price: 35,
    weight: '250g',
    inStock: true,
    featured: true,
  },
  {
    id: 'cashew-butter',
    slug: 'beurre-cajou',
    nameAr: 'زبدة الكاجو',
    nameFr: 'Beurre de Cajou',
    category: 'sweet',
    categoryLabel: 'Beurres',
    tagline: 'Crémeux · Délicat',
    description: 'Le plus crémeux de nos beurres, avec une douceur subtile et une texture veloutée.',
    details: ['Texture douce et très lisse', 'Naturellement sucré', 'Idéal pour smoothies et pâtisseries'],
    image: `${catalog}/cashew-butter-1.jpg`,
    hoverImage: `${catalog}/cashew-butter-2.jpg`,
    gallery: [
      `${catalog}/cashew-butter-1.jpg`,
      `${catalog}/cashew-butter-2.jpg`,
      `${catalog}/cashew-butter-3.jpg`,
    ],
    ingredients: ['Noix de cajou', 'Texture veloutée', 'Naturellement sucré'],
    price: 30,
    weight: '250g',
    inStock: true,
  },
  {
    id: 'healthy-nutella',
    slug: 'nutella-naturel',
    nameAr: 'نوتيلا صحية',
    nameFr: 'Nutella Naturel',
    category: 'sweet',
    categoryLabel: 'Pâtes à tartiner',
    tagline: 'Le vrai goût · Sans sucre raffiné',
    description: 'Notre version maison du Nutella, chocolatée, noisettée, saine et délicieusement gourmande.',
    details: ['Cacao pur et noisettes', 'Sans conservateurs', 'Un classique pour le petit-déjeuner'],
    image: `${catalog}/healthy-nutella-1.jpg`,
    hoverImage: `${catalog}/healthy-nutella-2.jpg`,
    gallery: [`${catalog}/healthy-nutella-1.jpg`, `${catalog}/healthy-nutella-2.jpg`],
    ingredients: ['Noisettes', 'Cacao pur', 'Sucre de coco'],
    price: 22,
    weight: '250g',
    inStock: true,
    featured: true,
  },
  {
    id: 'white-choco-spread',
    slug: 'creme-choco-blanc',
    nameAr: 'كريمة الشوكولاتة البيضاء',
    nameFr: 'Crème Choco Blanc',
    category: 'sweet',
    categoryLabel: 'Pâtes à tartiner',
    tagline: 'Gourmandise · Légèreté',
    description: 'Une pâte à tartiner au chocolat blanc maison, douce et crémeuse comme un nuage.',
    details: ['Saveur douce et lactée', 'Préparée en petites quantités', 'Parfaite pour crêpes, gaufres et tartines'],
    image: `${catalog}/white-choco-spread-1.jpg`,
    hoverImage: `${catalog}/white-choco-spread-2.jpg`,
    gallery: [
      `${catalog}/white-choco-spread-1.jpg`,
      `${catalog}/white-choco-spread-2.jpg`,
      `${catalog}/white-choco-spread-3.jpg`,
    ],
    ingredients: ['Chocolat blanc', 'Noisettes', 'Sans conservateurs'],
    price: 24,
    weight: '250g',
    inStock: true,
  },
  {
    id: 'apricot-jam',
    slug: 'confiture-abricot',
    nameAr: 'مربى المشمش',
    nameFr: "Confiture d'Abricot",
    category: 'sweet',
    categoryLabel: 'Confitures',
    tagline: 'Fraîche · Parfumée',
    description: "Confiture artisanale préparée avec des abricots frais de saison, peu sucrée et pleine de saveur.",
    details: ['Fruits de saison', 'Goût lumineux et parfumé', 'Très bonne avec pain, yaourt ou gâteaux'],
    image: `${catalog}/apricot-jam-1.jpg`,
    hoverImage: `${catalog}/apricot-jam-2.jpg`,
    gallery: [`${catalog}/apricot-jam-1.jpg`, `${catalog}/apricot-jam-2.jpg`, `${catalog}/apricot-jam-3.jpg`],
    ingredients: ['Abricots frais', 'Peu sucrée', 'Sans pectine ajoutée'],
    price: 18,
    weight: '300g',
    inStock: true,
  },
  {
    id: 'strawberry-jam',
    slug: 'confiture-fraise',
    nameAr: 'مربى الفريز',
    nameFr: 'Confiture de Fraise',
    category: 'sweet',
    categoryLabel: 'Confitures',
    tagline: 'Rouge · Généreuse',
    description: 'Une confiture de fraise maison généreuse, aux morceaux de fruits, au goût authentique.',
    details: ['Avec morceaux de fruits', 'Recette artisanale', 'Classique, simple et réconfortant'],
    image: `${catalog}/strawberry-jam-1.jpg`,
    hoverImage: `${catalog}/strawberry-jam-2.jpg`,
    gallery: [`${catalog}/strawberry-jam-1.jpg`, `${catalog}/strawberry-jam-2.jpg`],
    ingredients: ['Fraises fraîches', 'Avec morceaux', 'Recette artisanale'],
    price: 18,
    weight: '300g',
    inStock: true,
  },
  {
    id: 'zrir-hazelnut-almonds',
    slug: 'zrir-noisette-amandes',
    nameAr: 'زرير بالبندق واللوز',
    nameFr: 'Zrir Noisette & Amandes',
    category: 'sweet',
    categoryLabel: 'Zrir',
    tagline: 'Traditionnel · Généreux',
    description: "Le zrir tunisien comme à la maison, avec noisettes, amandes, épices et toute l'âme d'une recette familiale.",
    details: ['Préparé pour les fêtes et cadeaux', 'Riche en fruits secs', 'Goût traditionnel tunisien'],
    image: `${catalog}/zrir-hazelnut-almonds-1.jpg`,
    hoverImage: `${catalog}/zrir-hazelnut-almonds-2.jpg`,
    gallery: [
      `${catalog}/zrir-hazelnut-almonds-1.jpg`,
      `${catalog}/zrir-hazelnut-almonds-2.jpg`,
      `${catalog}/zrir-hazelnut-almonds-3.jpg`,
    ],
    ingredients: ['Noisettes', 'Amandes', 'Épices tunisiennes'],
    price: 28,
    weight: '300g',
    inStock: true,
    featured: true,
  },
  {
    id: 'zrir-pistachio',
    slug: 'zrir-pistache',
    nameAr: 'زرير الفستق',
    nameFr: 'Zrir à la Pistache',
    category: 'sweet',
    categoryLabel: 'Zrir',
    tagline: 'Délicat · Festif',
    description: 'Notre zrir signature à la pistache, une touche élégante pour les grandes occasions et le quotidien.',
    details: ['Pistache généreuse', 'Parfait pour cadeaux', 'Texture riche et fondante'],
    image: `${catalog}/zrir-pistachio-1.jpg`,
    hoverImage: `${catalog}/zrir-pistachio-2.jpg`,
    gallery: [`${catalog}/zrir-pistachio-1.jpg`, `${catalog}/zrir-pistachio-2.jpg`],
    ingredients: ['Pistaches', 'Sésame grillé', 'Miel naturel'],
    price: 32,
    weight: '300g',
    inStock: true,
  },
  {
    id: 'granola',
    slug: 'granola-maison',
    nameAr: 'الغرنولا المنزلية',
    nameFr: 'Granola Maison',
    category: 'sweet',
    categoryLabel: 'Petit-déjeuner',
    tagline: 'Croustillant · Équilibré',
    description: 'Granola fait maison, croustillant et doré, parfait pour un petit-déjeuner sain et savoureux.',
    details: ['Céréales dorées et croustillantes', 'Avec fruits secs', 'Très bon avec yaourt, lait ou fruits'],
    image: `${catalog}/granola-1.webp`,
    gallery: [`${catalog}/granola-1.webp`],
    ingredients: ["Flocons d'avoine", 'Miel', 'Fruits secs'],
    price: 20,
    weight: '350g',
    inStock: true,
  },
  {
    id: 'harissa',
    slug: 'harissa-maison',
    nameAr: 'الهريسة المنزلية',
    nameFr: 'Harissa Maison',
    category: 'salty',
    categoryLabel: 'Salés',
    tagline: 'Authentique · Parfumée',
    description: "La vraie harissa tunisienne, préparée à l'ancienne avec des piments rouges séchés et un mélange d'épices familial.",
    details: ['Recette tunisienne maison', 'Piments rouges et épices', "À servir avec sandwichs, pâtes, œufs ou grillades"],
    image: `${catalog}/harissa-1.jpg`,
    hoverImage: `${catalog}/harissa-2.jpg`,
    gallery: [`${catalog}/harissa-1.jpg`, `${catalog}/harissa-2.jpg`, `${catalog}/harissa-3.jpg`, `${catalog}/harissa-4.jpg`],
    ingredients: ['Piments rouges', 'Épices maison', "Huile d'olive"],
    price: 15,
    weight: '200g',
    inStock: true,
    featured: true,
  },
  {
    id: 'chicken-meatballs',
    slug: 'boulettes-poulet',
    nameAr: 'كرات الدجاج بزيت الزيتون',
    nameFr: 'Boulettes de Poulet',
    category: 'salty',
    categoryLabel: 'Salés',
    tagline: "Savoureux · Prêt à l'emploi",
    description: "Boulettes de poulet maison conservées dans l'huile d'olive extra vierge, prêtes à sublimer vos repas.",
    details: ['Prêtes à servir', "Conservées dans l'huile d'olive", 'Goût familial et généreux'],
    image: `${catalog}/chicken-meatballs-1.jpg`,
    hoverImage: `${catalog}/chicken-meatballs-2.jpg`,
    gallery: [`${catalog}/chicken-meatballs-1.jpg`, `${catalog}/chicken-meatballs-2.jpg`],
    ingredients: ['Poulet fermier', "Huile d'olive", 'Épices artisanales'],
    price: 25,
    weight: '250g',
    inStock: true,
  },
];

export const bundles: Bundle[] = [
  {
    id: 'ramadan-pack',
    name: 'Pack Ramadan',
    nameAr: 'باك رمضان',
    slug: 'pack-ramadan',
    description: 'A generous festive bundle built for family tables, gifting, and sharing.',
    includes: ['Zrir Noisette & Amandes', 'Zrir à la Pistache', 'Confiture', 'Pâte à tartiner'],
    productIds: ['zrir-hazelnut-almonds', 'zrir-pistachio', 'apricot-jam', 'healthy-nutella'],
    image: `${catalog}/zrir-hazelnut-almonds-1.jpg`,
    video: '/videos/bundles/pack-ramdhan.mp4',
    price: 95,
    originalPrice: 112,
    featured: true,
  },
  {
    id: 'hazelnut-lovers',
    name: 'Hazelnut Lovers',
    nameAr: 'عشاق البندق',
    slug: 'hazelnut-lovers',
    description: 'All the hazelnut comfort: butter, Nutella naturel, and traditional zrir.',
    includes: ['Beurre de Noisette', 'Nutella Naturel', 'Zrir Noisette & Amandes'],
    productIds: ['hazelnut-butter', 'healthy-nutella', 'zrir-hazelnut-almonds'],
    image: `${catalog}/hazelnut-butter-3.jpg`,
    price: 68,
    originalPrice: 75,
  },
  {
    id: 'pistachio-moments',
    name: 'Pistachio Moments',
    nameAr: 'لحظات الفستق',
    slug: 'pistachio-moments',
    description: 'A polished gift set for pistachio fans, with a soft white chocolate finish.',
    includes: ['Beurre de Pistache', 'Zrir à la Pistache', 'Crème Choco Blanc'],
    productIds: ['pistachio-butter', 'zrir-pistachio', 'white-choco-spread'],
    image: `${catalog}/pistachio-butter-3.jpg`,
    price: 84,
    originalPrice: 91,
  },
  {
    id: 'breakfast-table',
    name: 'Breakfast Table',
    nameAr: 'فطور الدار',
    slug: 'breakfast-table',
    description: 'A complete morning set: nut butter, two jams, and crunchy granola.',
    includes: ['Beurre de Noisette', "Confiture d'Abricot", 'Confiture de Fraise', 'Granola Maison'],
    productIds: ['hazelnut-butter', 'apricot-jam', 'strawberry-jam', 'granola'],
    image: `${catalog}/apricot-jam-2.jpg`,
    price: 72,
    originalPrice: 81,
  },
  {
    id: 'savory-duo',
    name: 'Savory Duo',
    nameAr: 'الثنائي المالح',
    slug: 'savory-duo',
    description: 'A quick savory table upgrade with homemade harissa and chicken meatballs.',
    includes: ['Harissa Maison', 'Boulettes de Poulet'],
    productIds: ['harissa', 'chicken-meatballs'],
    image: `${catalog}/harissa-3.jpg`,
    price: 36,
    originalPrice: 40,
  },
];

export const sweetProducts = products.filter(p => p.category === 'sweet');
export const saltyProducts = products.filter(p => p.category === 'salty');
export const featuredProducts = products.filter(p => p.featured);

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug);
}

export function bundleToProduct(bundle: Bundle): Product {
  return {
    id: `bundle-${bundle.id}`,
    slug: bundle.slug,
    nameAr: bundle.nameAr,
    nameFr: bundle.name,
    category: 'sweet',
    categoryLabel: 'Bundle',
    tagline: 'Pack promotionnel',
    description: bundle.description,
    details: bundle.includes,
    image: bundle.image,
    gallery: [bundle.image],
    ingredients: bundle.includes,
    price: bundle.price,
    originalPrice: bundle.originalPrice,
    weight: 'Bundle',
    inStock: true,
    featured: bundle.featured,
  };
}

export function formatPrice(price: number) {
  return `${price} TND`;
}
