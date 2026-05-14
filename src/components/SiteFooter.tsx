'use client';

import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, ShoppingBag } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const BRAND_INSTAGRAM = 'https://www.instagram.com/bennet_kamar/';
const BRAND_FACEBOOK = 'https://www.facebook.com/profile.php?id=100089209781312';
const DESIGNER_URL = 'https://aymen.info';

export default function SiteFooter() {
  const { copy } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Bennet Kamar</h3>
          <p style={{ marginTop: 14, maxWidth: 370 }}>
            {copy.footer.body}
          </p>
        </div>

        <div>
          <h4>{copy.footer.products}</h4>
          <ul className="footer-list">
            {[copy.footer.nutButters, 'Zrir', copy.footer.jams, 'Granola', 'Harissa'].map(item => (
              <li key={item}><Link href="/#products">{item}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{copy.footer.site}</h4>
          <ul className="footer-list">
            <li><Link href="/#home">{copy.footer.home}</Link></li>
            <li><Link href="/#story">{copy.footer.story}</Link></li>
            <li><Link href="/#products">{copy.footer.products}</Link></li>
            <li><Link href="/#contact">{copy.footer.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4>{copy.footer.contact}</h4>
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
                {copy.footer.shop}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          {copy.footer.copyright}{' '}
          <Link href="/admin" className="footer-admin-link">
            Feriel
          </Link>
          .
        </p>
        <p>
          {copy.footer.designer}{' '}
          <a href={DESIGNER_URL} target="_blank" rel="noopener noreferrer">
            Aymen
          </a>
        </p>
      </div>
    </footer>
  );
}
