import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const OUT = 'shots/qa';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333' });
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });
const click = async (sel) => {
  await page.waitForSelector(sel, { visible: true });
  await page.$eval(sel, (el) => el.click());
  await wait(220);
};
const clickReal = async (sel) => {
  await page.waitForSelector(sel, { visible: true });
  await page.click(sel);
  await wait(220);
};

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
await wait(500);

await click('.invite-actions .btn--primary');
await click('.invite-actions .btn--primary');
for (let i = 0; i < 4; i++) await click('.bouquet-button');
await wait(800);
const flowerScroll = await page.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  closingBottom: Math.round(document.querySelector('.flowers-closing').getBoundingClientRect().bottom),
  navTop: Math.round(document.querySelector('.chapter-nav').getBoundingClientRect().top),
}));
console.log('flowers completion scroll:', flowerScroll);
await shot('extra-flowers-complete-scrolled');

await click('.flowers-closing .btn--primary');
await click('.world-progress__hint');
const hintCount = await page.$$eval('.hotspot.is-hinting', (els) => els.length);
console.log('hinting hotspots:', hintCount);
await shot('extra-world-hint');

await clickReal('.hotspot');
const modalOpen = Boolean(await page.$('.memory-modal'));
await page.keyboard.press('Escape');
await wait(300);
const modalClosed = !(await page.$('.memory-modal'));
const focusBack = await page.evaluate(() => document.activeElement?.classList.contains('hotspot'));
console.log('modal open/escape/refocus:', modalOpen, modalClosed, focusBack);

await page.evaluate(() => document.querySelectorAll('.chapter-nav__item')[1].click());
await wait(600);
console.log('nav to flowers:', Boolean(await page.$('.scene--flowers')));
await click('.brand');
await wait(600);
console.log('brand returns invitation:', Boolean(await page.$('.scene--invitation')));

await click('.invite-actions .btn--primary');
const musicOn = await page.$eval('.music-toggle', (el) => el.getAttribute('aria-pressed'));
await click('.music-toggle');
await wait(250);
const musicOff = await page.$eval('.music-toggle', (el) => el.getAttribute('aria-pressed'));
const pref = await page.evaluate(() => localStorage.getItem('little-world-music'));
console.log('music on/off/pref:', musicOn, musicOff, pref);
await page.reload({ waitUntil: 'networkidle0' });
await wait(500);
const musicAfterReload = await page.$eval('.music-toggle', (el) => el.getAttribute('aria-pressed'));
console.log('music after reload:', musicAfterReload);

await page.setViewport({ width: 320, height: 700, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await wait(400);

const overflow = async (label) => {
  const v = await page.evaluate(() => ({
    inner: window.innerWidth,
    doc: document.documentElement.scrollWidth,
  }));
  console.log(`320 ${label}:`, v.inner, v.doc, v.doc <= v.inner + 1 ? 'ok' : 'OVERFLOW');
};
await overflow('intro');
await shot('m320-intro');
await click('.invite-actions .btn--primary');
await click('.invite-actions .btn--primary');
await overflow('flowers');
await shot('m320-flowers');
for (let i = 0; i < 4; i++) await click('.bouquet-button');
await click('.flowers-closing .btn--primary');
await overflow('world');
await shot('m320-world');
for (let i = 0; i < 5; i++) {
  await page.evaluate((idx) => document.querySelectorAll('.world-tray__item')[idx].click(), i);
  await wait(200);
  await click('.memory-modal__footer .btn');
}
await click('.world-complete .btn--primary');
await overflow('distance');
for (let i = 0; i < 3; i++) {
  await page.evaluate((idx) => document.querySelectorAll('.heart-spot')[idx].click(), i);
  await wait(250);
}
await wait(500);
await shot('m320-distance');
await overflow('distance complete');
await click('.distance-final-row .btn--primary');
await overflow('letter');
await click('.envelope');
await overflow('letter open');
await click('.reply-form .text-link');
await wait(500);
await overflow('finale');
await shot('m320-finale');

await browser.disconnect();
