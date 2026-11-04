import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const OUT = 'shots/qa';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333' });
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await wait(400);

const click = async (sel) => {
  await page.waitForSelector(sel, { visible: true });
  await page.$eval(sel, (el) => el.click());
  await wait(200);
};

await click('.invite-actions .btn--primary');
await click('.invite-actions .btn--primary');
await shot('m2-finale-flow-01-flowers-top');
await click('.bouquet-button');
await wait(300);
await shot('m2-flowers-one-tap');
await page.$eval('.flower-note', (el) => el.scrollIntoView({ block: 'center' }));
await wait(300);
await shot('m2-flowers-note');

for (let i = 0; i < 3; i++) await click('.bouquet-button');
await click('.flowers-closing .btn--primary');
for (let i = 0; i < 5; i++) {
  await page.evaluate((idx) => document.querySelectorAll('.hotspot')[idx].click(), i);
  await wait(200);
  await click('.memory-modal__footer .btn');
}
await click('.world-complete .btn--primary');
for (let i = 0; i < 3; i++) {
  await page.evaluate((idx) => document.querySelectorAll('.heart-spot')[idx].click(), i);
  await wait(250);
}
await wait(700);
await shot('m2-distance-complete-scrolled');
await click('.distance-final-row .btn--primary');
await click('.envelope');
await page.type('#reply', 'I would like that. The quiet days, the late calls, all of it. Yes.');
await click('.reply-form .btn--primary');
await wait(400);
await click('.reply-confirmation .btn--primary');
await wait(600);
await shot('m2-finale-top');
await page.$eval('.finale-content', (el) => el.scrollIntoView({ block: 'start' }));
await wait(300);
await shot('m2-finale-card');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await wait(300);
await shot('m2-finale-bottom');

await browser.disconnect();
