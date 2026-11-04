import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const OUT = 'shots/qa';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333' });
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function toFinale() {
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await wait(300);
  const click = async (sel) => {
    await page.waitForSelector(sel, { visible: true });
    await page.$eval(sel, (el) => el.click());
    await wait(160);
  };
  await click('.invite-actions .btn--primary');
  await click('.invite-actions .btn--primary');
  for (let i = 0; i < 4; i++) await click('.bouquet-button');
  await click('.flowers-closing .btn--primary');
  for (let i = 0; i < 5; i++) {
    await page.evaluate((idx) => document.querySelectorAll('.hotspot')[idx].click(), i);
    await wait(180);
    await click('.memory-modal__footer .btn');
  }
  await click('.world-complete .btn--primary');
  for (let i = 0; i < 3; i++) {
    await page.evaluate((idx) => document.querySelectorAll('.heart-spot')[idx].click(), i);
    await wait(180);
  }
  await click('.distance-final-row .btn--primary');
  await click('.envelope');
  await click('.reply-form .text-link');
  await wait(500);
}

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await toFinale();
await page.screenshot({ path: `${OUT}/finale-desktop-v2.png` });
await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
await wait(400);
await page.screenshot({ path: `${OUT}/finale-1100-v2.png` });
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await wait(500);
await page.screenshot({ path: `${OUT}/finale-mobile-v2.png` });
await page.evaluate(() => document.querySelector('.finale-content').scrollIntoView({ block: 'start' }));
await wait(300);
await page.screenshot({ path: `${OUT}/finale-mobile-v2-scrolled.png` });

await browser.disconnect();
