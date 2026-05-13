import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, ShoppingBag } from 'lucide-react';

const BRAND_INSTAGRAM = 'https://www.instagram.com/bennet_kamar/';
const BRAND_FACEBOOK = 'https://www.facebook.com/profile.php?id=100089209781312';
const DESIGNER_URL = 'https://aymen.info';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Bennet Kamar</h3>
          <p style={{ marginTop: 14, maxWidth: 370 }}>
            Homemade by Feriel. Natural spreads, zrir, jams, granola, and
            savory jars prepared in small batches for orders across Tunisia.
          </p>
        </div>

        <div>
          <h4>Products</h4>
          <ul className="footer-list">
            {['Nut Butters', 'Zrir', 'Jams', 'Granola', 'Harissa'].map(item => (
              <li key={item}><Link href="/#products">{item}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Site</h4>
          <ul className="footer-list">
            <li><Link href="/#home">Home</Link></li>
            <li><Link href="/#story">Our Story</Link></li>
            <li><Link href="/#products">Products</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-list">
            <li>
              <a href={BRAND_INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <Instagram size={16} style={{ display: 'inline', marginRight: 7, verticalAlign: '-3px' }} />
                Instagram
              </a>
            </li>
            <li>
              <a href={BRAND_FACEBOOK} target="_blank" rel="noopener noreferrer">
                <Facebook size={16} style={{ display: 'inline', marginRight: 7, verticalAlign: '-3px' }} />
                Facebook
              </a>
            </li>
            <li>
              <a href="https://wa.me/21658000000">
                <MessageCircle size={16} style={{ display: 'inline', marginRight: 7, verticalAlign: '-3px' }} />
                WhatsApp
              </a>
            </li>
            <li>
              <Link href="/#products">
                <ShoppingBag size={16} style={{ display: 'inline', marginRight: 7, verticalAlign: '-3px' }} />
                Shop online
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          Copyright 2026 Bennet Kamar. Homemade by Feriel.
        </p>
        <p>
          Created and designed by{' '}
          <a href={DESIGNER_URL} target="_blank" rel="noopener noreferrer">
            Aymen
          </a>
        </p>
      </div>
    </footer>
  );
}
