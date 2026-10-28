const puppeteer = require('puppeteer-core');
const path = require('path');

const DEFAULT_CHROME = '/root/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome';

(async () => {
  const rootPath = path.resolve(__dirname, '..', 'assets/posts/batch-medico-criador-01');
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || DEFAULT_CHROME,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const jobs = [];
  [0.3, 3.3, 6.3, 9.3, 12.3].forEach((t) => jobs.push([`01-prompt-nao-e-produto.html?t=${t}`, 1080, 1920]));
  [1, 2, 3, 4, 5, 6, 7].forEach((n) => jobs.push([`02-cinco-perguntas-crivo.html?slide=${n}`, 1080, 1350]));
  [0.3, 3.3, 6.3, 10.3, 13.3].forEach((t) => jobs.push([`03-designer-ia-direcao-humana.html?t=${t}`, 1080, 1920]));

  const failures = [];
  let checked = 0;

  for (const [file, width, height] of jobs) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    try {
      await page.setViewport({ width, height });
      await page.goto(`file://${path.join(rootPath, file)}`, { waitUntil: 'networkidle0' });
      const result = await page.evaluate(() => {
        const container = document.querySelector('.stage,.deck');
        if (!container) return { missingContainer: true, root: null, outside: [] };

        const rootRect = container.getBoundingClientRect();
        const visible = [...container.querySelectorAll('h1,h2,h3,p,span,b,strong,small')].filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
        });
        const outside = visible.filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < rootRect.left - 1 || rect.top < rootRect.top - 1 || rect.right > rootRect.right + 1 || rect.bottom > rootRect.bottom + 1;
        }).map((element) => {
          const rect = element.getBoundingClientRect();
          return { text: (element.textContent || '').trim().slice(0, 80), rect: [rect.x, rect.y, rect.right, rect.bottom] };
        });
        return { missingContainer: false, root: [rootRect.width, rootRect.height], outside };
      });

      checked += 1;
      if (result.missingContainer) errors.push('container .stage/.deck not found');
      if (errors.length || result.outside.length || !result.root || result.root[0] !== width || result.root[1] !== height) {
        failures.push({ file, errors, ...result });
      }
    } catch (error) {
      failures.push({ file, errors: [...errors, error.message], root: null, outside: [] });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(JSON.stringify({ checked, requested: jobs.length, failures }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
