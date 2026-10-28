const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const DEFAULT_CHROME = '/root/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome';

(async () => {
  const root = path.resolve(__dirname, '..', 'assets/posts/batch-medico-criador-01');
  const out = path.join(root, 'preview');
  fs.mkdirSync(out, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || DEFAULT_CHROME,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  });

  const jobs = [];
  [0.3, 3.3, 6.3, 9.3, 12.3].forEach((t, i) => jobs.push({ file: `01-prompt-nao-e-produto.html?t=${t}`, name: `r1-${i + 1}.png`, w: 1080, h: 1920 }));
  [1, 2, 3, 4, 5, 6, 7].forEach((n) => jobs.push({ file: `02-cinco-perguntas-crivo.html?slide=${n}`, name: `c1-${n}.png`, w: 1080, h: 1350 }));
  [0.3, 3.3, 6.3, 10.3, 13.3].forEach((t, i) => jobs.push({ file: `03-designer-ia-direcao-humana.html?t=${t}`, name: `r2-${i + 1}.png`, w: 1080, h: 1920 }));

  const completed = [];
  const failures = [];

  for (const job of jobs) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: job.w, height: job.h, deviceScaleFactor: 1 });
      await page.goto(`file://${path.join(root, job.file)}`, { waitUntil: 'networkidle0' });
      await page.screenshot({ path: path.join(out, job.name), clip: { x: 0, y: 0, width: job.w, height: job.h } });
      completed.push(job.name);
    } catch (error) {
      failures.push({ file: job.file, output: job.name, error: error.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(JSON.stringify({ requested: jobs.length, completed: completed.length, failures, output: out }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
