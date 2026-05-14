'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Facebook, Globe2, Instagram, Menu, ShoppingBag, X } from 'lucide-react';
import type { Language } from '@/lib/i18n';
import { useLanguage } from './LanguageProvider';
import { useStore } from './StoreProvider';

const BRAND_INSTAGRAM = 'https://www.instagram.com/bennet_kamar/';
const BRAND_FACEBOOK = 'https://www.facebook.com/profile.php?id=100089209781312';
const DESIGNER_URL = 'https://aymen.info';

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { language, setLanguage, copy, labels } = useLanguage();
  const { cartCount, openCart } = useStore();
  const solidNav = pathname === '/checkout' || pathname === '/admin';
  const links = [
    { label: copy.nav.home, href: '/#home' },
    { label: copy.nav.products, href: '/#products' },
    { label: copy.nav.recipes, href: '/#recipes' },
    { label: copy.nav.howItWorks, href: '/#how-it-works' },
    { label: copy.nav.insideBox, href: '/#inside-the-box' },
    { label: copy.nav.story, href: '/#story' },
    { label: copy.nav.contact, href: '/#contact' },
  ];

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

  const chooseLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setLanguageOpen(false);
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
          {copy.nav.designer} <span>Aymen</span>
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
            <div className="language-switcher">
              <button
                type="button"
                className="language-trigger"
                onClick={() => setLanguageOpen(open => !open)}
                aria-label={copy.nav.language}
                aria-expanded={languageOpen}
              >
                <Globe2 size={19} />
                <span>{labels[language]}</span>
              </button>
              {languageOpen && (
                <div className="language-menu" role="menu">
                  {(Object.entries(labels) as Array<[Language, string]>).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={value === language ? 'active' : ''}
                      onClick={() => chooseLanguage(value)}
                      role="menuitem"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

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

            <button onClick={openCart} className="nav-icon" aria-label={copy.nav.openCart}>
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
              aria-label={copy.nav.openMenu}
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
          <button onClick={() => setMobileOpen(false)} aria-label={copy.nav.closeMenu}>
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

        <div className="mobile-language-switcher">
          <span>{copy.nav.language}</span>
          <div className="mobile-language-options" aria-label={copy.nav.language}>
            {(Object.entries(labels) as Array<[Language, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={value === language ? 'active' : ''}
                onClick={() => chooseLanguage(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={openCartAndCloseMenu} className="black-btn" style={{ marginTop: 'auto' }}>
          <ShoppingBag size={20} />
          {copy.nav.cart} ({cartCount})
        </button>
      </aside>
    </>
  );
}
