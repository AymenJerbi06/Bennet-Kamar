import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

const BRAVE = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const OUT_IMG = 'docs/design-references/valley';
const OUT_RES = 'docs/research/valley';
mkdirSync(OUT_IMG, { recursive: true });
mkdirSync(OUT_RES, { recursive: true });

const browser = await chromium.launch({ executablePath: BRAVE, headless: true, args: ['--no-sandbox'] });

const desk = await browser.newPage();
await desk.setViewportSize({ width: 1440, height: 900 });
await desk.goto('https://www.valleybakery.com/', { waitUntil: 'networkidle', timeout: 30000 });
await desk.waitForTimeout(2500);

// Hero screenshot
await desk.screenshot({ path: `${OUT_IMG}/desktop-hero.png` });

// Scroll through sections
for (const y of [600, 1200, 1800, 2400, 3000, 3600, 4200, 5000]) {
  await desk.evaluate(y => window.scrollTo(0, y), y);
  await desk.waitForTimeout(700);
  await desk.screenshot({ path: `${OUT_IMG}/desktop-y${y}.png` });
}

await desk.evaluate(() => window.scrollTo(0, 0));
await desk.waitForTimeout(500);
await desk.screenshot({ path: `${OUT_IMG}/desktop-full.png`, fullPage: true });

// ─── Extract tokens ───────────────────────────────────────────
const tokens = await desk.evaluate(() => {
  const cs = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, backgroundColor: s.backgroundColor, letterSpacing: s.letterSpacing, lineHeight: s.lineHeight, textTransform: s.textTransform };
  };
  const allFonts = new Set();
  const allColors = new Set();
  document.querySelectorAll('h1,h2,h3,p,a,button,nav').forEach(el => {
    const s = getComputedStyle(el);
    if (s.fontFamily) allFonts.add(s.fontFamily);
    if (s.color && s.color !== 'rgba(0, 0, 0, 0)') allColors.add(s.color);
    if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') allColors.add(s.backgroundColor);
  });
  return {
    body: cs('body'),
    h1: cs('h1'),
    h2: cs('h2'),
    h3: cs('h3'),
    nav: cs('nav') || cs('header'),
    a: cs('a'),
    button: cs('button'),
    fonts: [...allFonts].slice(0, 10),
    colors: [...allColors].slice(0, 25),
    googleFonts: [...document.querySelectorAll('link[href*="fonts.googleapis"]')].map(l => l.href),
    navLinks: [...document.querySelectorAll('nav a, header a')].map(a => ({ text: a.textContent?.trim(), href: a.href })),
  };
});
writeFileSync(`${OUT_RES}/tokens.json`, JSON.stringify(tokens, null, 2));

// ─── Content ──────────────────────────────────────────────────
const content = await desk.evaluate(() => ({
  title: document.title,
  h1s: [...document.querySelectorAll('h1')].map(e => e.textContent?.trim()).filter(Boolean),
  h2s: [...document.querySelectorAll('h2')].map(e => e.textContent?.trim()).filter(Boolean),
  h3s: [...document.querySelectorAll('h3')].map(e => e.textContent?.trim()).filter(Boolean),
  paragraphs: [...document.querySelectorAll('p')].slice(0, 20).map(e => e.textContent?.trim()).filter(Boolean),
  buttons: [...document.querySelectorAll('button, a')].map(e => e.textContent?.trim()).filter(t => t && t.length < 40).slice(0, 30),
  imgs: [...document.querySelectorAll('img')].slice(0, 20).map(i => ({ src: i.src, alt: i.alt })),
  sections: [...document.querySelectorAll('section, [class*="section"], main > div, main > section')].slice(0, 15).map(s => {
    const cl = typeof s.className === 'string' ? s.className.slice(0, 80) : '';
    return { tag: s.tagName, id: s.id, className: cl, bgColor: getComputedStyle(s).backgroundColor, height: s.offsetHeight };
  }),
}));
writeFileSync(`${OUT_RES}/content.json`, JSON.stringify(content, null, 2));

// Mobile
const mob = await browser.newPage();
await mob.setViewportSize({ width: 390, height: 844 });
await mob.goto('https://www.valleybakery.com/', { waitUntil: 'networkidle', timeout: 30000 });
await mob.waitForTimeout(2000);
await mob.screenshot({ path: `${OUT_IMG}/mobile-hero.png` });
for (const y of [400, 800, 1200, 1800, 2400]) {
  await mob.evaluate(y => window.scrollTo(0, y), y);
  await mob.waitForTimeout(400);
}
await mob.evaluate(() => window.scrollTo(0, 0));
await mob.screenshot({ path: `${OUT_IMG}/mobile-full.png`, fullPage: true });

await browser.close();
console.log('Done. Fonts:', tokens.googleFonts);
console.log('H1s:', content.h1s);
console.log('H2s:', content.h2s.slice(0, 6));
