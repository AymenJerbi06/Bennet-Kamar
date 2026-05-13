import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BRAVE = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const OUT   = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: BRAVE,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function shootPage(width, height, label) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.goto('http://localhost:3030', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Scroll slowly so IntersectionObserver fires for every section
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    const step = 300;
    for (let y = 0; y < totalHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  // Hero
  await page.screenshot({ path: `${OUT}/${label}-hero.png` });

  // Scroll to each section
  const sections = ['#produits', '#recettes', '#histoire', '#commander'];
  for (const id of sections) {
    try {
      await page.evaluate(sel => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'instant' });
      }, id);
      await page.waitForTimeout(600);
      const name = id.replace('#', '');
      await page.screenshot({ path: `${OUT}/${label}-${name}.png` });
    } catch {}
  }

  // Full page
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${label}-full.png`, fullPage: true });
  await page.close();
  console.log(`✓ ${label} done`);
}

await shootPage(1440, 900, 'desktop');
await shootPage(390, 844, 'mobile');

await browser.close();
console.log('All screenshots saved to', OUT);
