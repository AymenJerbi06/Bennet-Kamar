'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, Menu, ShoppingBag, X } from 'lucide-react';
import { useStore } from './StoreProvider';

const BRAND_INSTAGRAM = 'https://www.instagram.com/bennet_kamar/';
const BRAND_FACEBOOK = 'https://www.facebook.com/profile.php?id=100089209781312';
const DESIGNER_URL = 'https://aymen.info';

const links = [
  { label: 'Home', href: '/#home' },
  { label: 'Products', href: '/#products' },
  { label: 'Gift Gallery', href: '/#products' },
  { label: 'Our Story', href: '/#story' },
  { label: 'Contact', href: '/#contact' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, openCart } = useStore();
  const solidNav = pathname === '/checkout';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openCartAndCloseMenu = () => {
    openCart();
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`valley-nav ${scrolled || solidNav ? 'is-scrolled' : ''}`}>
        <a
          href={DESIGNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-credit"
        >
          Created and designed by <span>Aymen</span>
        </a>

        <div className="container valley-nav-inner">
          <Link href="/#home" className="valley-brand">
            Bennet Kamar
          </Link>

          <div className="valley-links" aria-label="Primary navigation">
            {links.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`valley-link ${link.href === '/#home' ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="valley-actions">
            <a
              href={BRAND_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon"
              aria-label="Bennet Kamar Instagram"
            >
              <Instagram size={30} strokeWidth={2.3} />
            </a>

            <a
              href={BRAND_FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon"
              aria-label="Bennet Kamar Facebook"
            >
              <Facebook size={30} strokeWidth={2.3} />
            </a>

            <button onClick={openCart} className="nav-icon" aria-label="Open cart">
              <ShoppingBag size={30} strokeWidth={2.3} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <a
              href={BRAND_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-social-icon"
              aria-label="Bennet Kamar Instagram"
            >
              <Instagram size={24} strokeWidth={2.3} />
            </a>

            <a
              href={BRAND_FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-social-icon"
              aria-label="Bennet Kamar Facebook"
            >
              <Facebook size={24} strokeWidth={2.3} />
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="mobile-burger"
              aria-label="Open menu"
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`mobile-panel ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="valley-brand" style={{ color: 'var(--ink)', textShadow: 'none' }}>
            Bennet Kamar
          </span>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '18px' }}>
          {links.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="valley-link"
              style={{ textShadow: 'none', fontSize: 24 }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button onClick={openCartAndCloseMenu} className="black-btn" style={{ marginTop: 'auto' }}>
          <ShoppingBag size={20} />
          Cart ({cartCount})
        </button>
      </aside>
    </>
  );
}
