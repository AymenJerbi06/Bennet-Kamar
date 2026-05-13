import type { Metadata } from 'next';
import { Amiri, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import CartDrawer from '@/components/CartDrawer';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import { StoreProvider } from '@/components/StoreProvider';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dm = DM_Sans({
  variable: '--font-dm',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'بنة قمر — Bennet Kamar | Homemade by Feriel',
  description: 'Commandez les produits artisanaux Bennet Kamar faits maison — beurres de noisette et pistache, confitures, zrir, harissa. Livraison partout en Tunisie.',
  keywords: 'بنة قمر, Bennet Kamar, beurre noisette, pistachio, zrir, harissa, homemade, artisanal, boutique, tunisie',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dm.variable} ${amiri.variable}`}>
      <body>
        <StoreProvider>
          <SiteNav />
          <CartDrawer />
          {children}
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
