import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:4200';
const OUT = 'screenshots';

const routes = [
  ['', 'landing'],
  ['mapa', 'mapa'],
  ['equipo', 'equipo'],
  ['servicios', 'servicios'],
  ['proyectos', 'proyectos'],
  ['contacto', 'contacto'],
];

const viewports = [
  { id: 'd', width: 1440, height: 900, deviceScaleFactor: 1 },
  { id: 't', width: 820, height: 1180, deviceScaleFactor: 1 },
  { id: 'm', width: 390, height: 844, deviceScaleFactor: 2 },
];

const only = process.argv[2];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

for (const vp of viewports) {
  if (only && only !== 'all' && only !== vp.id) continue;
  await page.setViewport(vp);
  for (const [route, name] of routes) {
    if (process.argv[3] && process.argv[3] !== name) continue;
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1600));
    const m = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflowX = document.documentElement.scrollWidth > vw + 1;
      const overflowY = document.documentElement.scrollHeight > window.innerHeight + 1;
      const offenders = [];
      document.querySelectorAll('body *').forEach((el) => {
        const cls = typeof el.className === 'string' ? el.className.trim() : '';
        if (/star-field|warp__/.test(cls)) return;
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > vw + 1 || r.left < -1)) {
          offenders.push(
            `${el.tagName.toLowerCase()}${cls ? '.' + cls.split(/\s+/).join('.') : ''} [${Math.round(r.left)}..${Math.round(r.right)}]`,
          );
        }
      });
      offenders.sort((a, b) => Number(b.match(/\.\.(\d+)\]/)[1]) - Number(a.match(/\.\.(\d+)\]/)[1]));
      return {
        vw,
        vh: window.innerHeight,
        scrollW: document.documentElement.scrollWidth,
        scrollH: document.documentElement.scrollHeight,
        overflowX,
        overflowY,
        offenders: offenders.slice(0, 6),
      };
    });
    const file = `${OUT}/${vp.id}-${name}.png`;
    await page.screenshot({ path: file });
    console.log(
      `${vp.id} ${name.padEnd(10)} viewport=${m.vw}x${m.vh} scroll=${m.scrollW}x${m.scrollH} ` +
        `overflowX=${m.overflowX ? 'SI' : 'no'} overflowY=${m.overflowY ? 'SI(scroll vertical)' : 'no'}`,
    );
    if (m.offenders.length) console.log('   fuera de pantalla: ' + m.offenders.join(' | '));
  }
}

if (errors.length) {
  console.log('\nERRORES DE CONSOLA:');
  [...new Set(errors)].forEach((e) => console.log('  ' + e));
} else {
  console.log('\nSin errores de consola.');
}

await browser.close();
