import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://localhost:5173/';

const browser = await puppeteer.connect({
  browserURL: 'http://127.0.0.1:9333',
  defaultViewport: { width: 390, height: 844, deviceScaleFactor: 1 },
});

const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') console.log('[console]', m.type(), m.text());
});
page.on('pageerror', (e) => console.log('[pageerror]', e.message));

await page.goto(URL, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 700));

const measure = async (label) =>
  page.evaluate((label) => {
    const info = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        right: Math.round(r.right),
        w: Math.round(r.width),
        h: Math.round(r.height),
        font: cs.fontSize,
        display: cs.display,
      };
    };
    return {
      label,
      inner: [window.innerWidth, window.innerHeight],
      docScroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
      bodyScroll: [document.body.scrollWidth, document.body.scrollHeight],
      copy: info('.invite-copy'),
      lede: info('.invite-copy .lede'),
      content: info('.invite-content'),
      scene: info('.scene--invitation'),
      topbar: info('.topbar'),
      music: info('.music-toggle'),
      actions: info('.invite-actions'),
    };
  }, label);

console.log(JSON.stringify(await measure('390x844'), null, 2));
await page.screenshot({ path: 'shots/qa-intro-390.png' });

await page.setViewport({ width: 525, height: 553, deviceScaleFactor: 1 });
console.log(JSON.stringify(await measure('525x553'), null, 2));

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await new Promise((r) => setTimeout(r, 400));
console.log(JSON.stringify(await measure('1440x900'), null, 2));

await browser.close();
