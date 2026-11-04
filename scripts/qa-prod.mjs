import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333' });
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
const failures = [];
page.on('requestfailed', (r) => failures.push(`${r.url()} — ${r.failure()?.errorText}`));
page.on('response', (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});
page.on('pageerror', (e) => failures.push(`pageerror: ${e.message}`));
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 800));
const info = await page.evaluate(() => ({
  title: document.title,
  heading: document.querySelector('h1')?.innerText.replace(/\s+/g, ' '),
  images: [...document.images].map((img) => ({ src: img.currentSrc, ok: img.complete && img.naturalWidth > 0 })),
  fonts: [...document.fonts].map((f) => f.family),
}));
console.log(JSON.stringify(info, null, 2));
console.log('failures:', failures.length ? failures : 'none');
await page.screenshot({ path: 'shots/qa/prod-intro.png' });
await browser.disconnect();
