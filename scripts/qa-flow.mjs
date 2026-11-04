import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const URL = 'http://localhost:5173/';
const OUT = 'shots/qa';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333' });
const pages = await browser.pages();
const page = pages[0] ?? (await browser.newPage());

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  if (m.type() === 'warning') errors.push(`warn: ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

const log = (...a) => console.log(...a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

async function settle(ms = 900) {
  await wait(ms);
  await page.evaluate(() => document.fonts.ready);
}

async function click(sel, ms = 500) {
  await page.waitForSelector(sel, { visible: true, timeout: 5000 });
  await page.click(sel);
  await wait(ms);
}

async function text(sel) {
  try {
    return (await page.$eval(sel, (el) => el.innerText)).replace(/\s+/g, ' ').trim();
  } catch {
    return null;
  }
}

async function count(sel) {
  return page.$$eval(sel, (els) => els.length);
}

async function overflow(label) {
  const v = await page.evaluate(() => ({
    inner: window.innerWidth,
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    scrollY: window.scrollY,
  }));
  if (v.doc > v.inner + 1) log(`  !! horizontal overflow at ${label}: ${v.doc} > ${v.inner}`);
  return v;
}

async function assert(label, condition, detail = '') {
  if (!condition) {
    log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
    errors.push(`assert: ${label}${detail ? ` — ${detail}` : ''}`);
  } else {
    log(`  ok   ${label}`);
  }
}

async function fresh() {
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });
  await settle(700);
}

async function walk(label, mobile) {
  log(`\n===== ${label} =====`);
  await fresh();
  const vp = await overflow(`intro ${label}`);
  log('  viewport', vp.inner, 'doc', vp.doc);
  await shot(`${label}-00-intro`);

  await click('.invite-actions .btn--primary', 500);
  const h1a = await text('.invite-copy h1');
  await assert('invitation enters second beat', /Hi\./.test(h1a || ''), h1a);
  await assert('music started', await page.evaluate(() => document.querySelector('.music-toggle')?.getAttribute('aria-pressed') === 'true'));
  await shot(`${label}-01-invitation`);

  await click('.invite-actions .btn--primary', 950);
  await assert('flowers stage reached', Boolean(await page.$('.scene--flowers')));
  await overflow(`flowers ${label}`);
  await shot(`${label}-02-flowers-empty`);

  for (let i = 0; i < 4; i++) {
    await click('.bouquet-button', 420);
    const note = await text('.flower-note:last-child');
    log(`  flower ${i + 1}:`, note);
    await assert(`flower note ${i + 1} visible`, Boolean(note));
  }
  await assert('bouquet disabled after four', await page.$eval('.bouquet-button', (b) => b.disabled));
  await assert('flowers closing CTA appears', Boolean(await page.$('.flowers-closing .btn--primary')));
  await shot(`${label}-03-flowers-full`);

  await click('.flowers-closing .btn--primary', 950);
  await assert('world stage reached', Boolean(await page.$('.scene--world')));
  await overflow(`world ${label}`);
  await shot(`${label}-04-world-empty`);

  const hotspotCount = await count('.hotspot');
  log('  hotspots:', hotspotCount);
  await assert('five world hotspots', hotspotCount === 5);

  if (mobile) {
    const trayCount = await count('.world-tray__item');
    log('  tray items:', trayCount);
    await assert('five tray items', trayCount === 5);
    for (let i = 0; i < 5; i++) {
      await click(`.world-tray__item:nth-child(${i + 1})`, 450);
      const title = await text('.memory-modal__body h3');
      log(`  memory ${i + 1}:`, title);
      await assert(`memory ${i + 1} modal`, Boolean(title));
      if (i === 0) await shot(`${label}-05-world-modal`);
      await click('.memory-modal__footer .btn', 350);
      await assert(`modal ${i + 1} closed`, !(await page.$('.memory-modal')));
    }
  } else {
    for (let i = 0; i < 5; i++) {
      await page.evaluate((idx) => {
        document.querySelectorAll('.hotspot')[idx].click();
      }, i);
      await wait(450);
      const title = await text('.memory-modal__body h3');
      log(`  memory ${i + 1}:`, title);
      await assert(`memory ${i + 1} modal`, Boolean(title));
      if (i === 0) await shot(`${label}-05-world-modal`);
      await click('.memory-modal__footer .btn', 350);
      await assert(`modal ${i + 1} closed`, !(await page.$('.memory-modal')));
    }
  }
  const completeCard = await text('.world-complete');
  log('  completion:', completeCard);
  await assert('world completion card', Boolean(completeCard));
  await shot(`${label}-06-world-complete`);

  await click('.world-complete .btn--primary', 950);
  await assert('distance stage reached', Boolean(await page.$('.scene--distance')));
  await overflow(`distance ${label}`);
  await shot(`${label}-07-distance-empty`);

  for (let i = 0; i < 3; i++) {
    await page.evaluate((idx) => document.querySelectorAll('.heart-spot')[idx].click(), i);
    await wait(550);
    const t = await text('.distance-panel h3');
    log(`  distance note ${i + 1}:`, t);
    await assert(`distance note ${i + 1}`, Boolean(t));
  }
  const finalRow = await text('.distance-final-row');
  log('  distance completion:', finalRow);
  await assert('distance completion CTA', Boolean(await page.$('.distance-final-row .btn--primary')));
  await shot(`${label}-08-distance-complete`);

  await click('.distance-final-row .btn--primary', 950);
  await assert('letter stage reached', Boolean(await page.$('.scene--letter')));
  await overflow(`letter ${label}`);
  await assert('envelope present', Boolean(await page.$('.envelope')));
  await shot(`${label}-09-letter-closed`);

  await click('.envelope', 650);
  await assert('letter opened', Boolean(await page.$('.letter-opened')));
  const salutation = await text('.letter-paper__salutation');
  const paragraphs = await count('.letter-paper p');
  log('  salutation:', salutation, '| paragraphs:', paragraphs);
  await assert('letter salutation', /favorite person/i.test(salutation || ''), salutation);
  await overflow(`letter open ${label}`);
  await shot(`${label}-10-letter-open`);

  await click('.reply-form .btn--primary', 300);
  const err = await text('#reply-error');
  log('  empty reply error:', err);
  await assert('empty reply validation', Boolean(err));

  const reply = 'I would like that. The quiet days, the late calls, all of it. Yes.';
  await page.type('#reply', reply, { delay: 8 });
  await click('.reply-form .btn--primary', 600);
  const sealedHeading = await text('.reply-confirmation h3');
  const saved = await page.evaluate(() => localStorage.getItem('little-world-reply'));
  log('  sealed:', sealedHeading, '| stored:', saved);
  await assert('reply sealed confirmation', sealedHeading === 'Sealed.');
  await assert('reply stored locally', saved === reply, saved || '');
  await overflow(`reply sealed ${label}`);
  await shot(`${label}-11-letter-sealed`);

  await click('.reply-confirmation .btn--soft', 300);
  const copyStatus = await text('.reply-confirmation__status');
  log('  copy status:', copyStatus);
  await assert('copy feedback shown', Boolean(copyStatus));

  await click('.reply-confirmation .btn--primary', 950);
  await assert('finale reached', Boolean(await page.$('.scene--finale')));
  await assert('finale notes saved reply', Boolean(await page.$('.finale-reply-note')));
  await overflow(`finale ${label}`);
  await shot(`${label}-12-finale`);

  await click('.finale-actions .btn--primary', 950);
  await assert('read letter again opens letter', Boolean(await page.$('.letter-opened')));
  const prefilled = await page.$eval('#reply', (el) => el.value).catch(() => null);
  log('  prefilled reply:', prefilled);
  await assert('reply prefilled from storage', prefilled === reply);
  await click('.reply-form .text-link', 950);
  await assert('back to finale', Boolean(await page.$('.scene--finale')));

  await click('.finale-actions .text-link', 950);
  await assert('restart returns to invitation', Boolean(await page.$('.scene--invitation')));
  await assert('restart resets first beat', /A little world/i.test((await text('.invite-copy h1')) || ''));
  await assert('chapter nav hidden on invitation', !(await page.$('.chapter-nav')));
  await shot(`${label}-13-restart`);
}

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
await walk('desktop', false);

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
await walk('mobile', true);

log('\n===== reduced motion =====');
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await fresh();
await click('.invite-actions .btn--primary', 100);
await click('.invite-actions .btn--primary', 300);
await assert('reduced motion reaches flowers fast', Boolean(await page.$('.scene--flowers')));

log('\n===== console/page errors =====');
if (errors.length === 0) log('none');
else errors.forEach((e) => log(' -', e));

await browser.disconnect();
