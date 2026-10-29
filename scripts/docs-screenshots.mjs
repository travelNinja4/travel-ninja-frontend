// Screenshots Storybook stories into the docs site, for the business documentation the release skill writes.
//
//   pnpm docs:screenshots --list [filter]            list story ids, e.g. --list customers
//   pnpm docs:screenshots <module> <story-id>[=<name>] ...
//
// Storybook must be running (pnpm storybook --ci), or set STORYBOOK_URL. Each image is saved as
// docs-site/static/img/screens/<module>/<name>.png and used in the docs as /img/screens/<module>/<name>.png.
// <name> defaults to the story part of the id (components-customers--no-matches -> no-matches).
// Stories whose name mentions mobile or tablet are taken at that screen size; the rest at desktop size.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE_URL = (process.env.STORYBOOK_URL ?? 'http://localhost:6006').replace(/\/$/, '');
const OUT_DIR = fileURLToPath(new URL('../docs-site/static/img/screens/', import.meta.url));

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
};

async function loadStories() {
  const res = await fetch(`${BASE_URL}/index.json`).catch(() => null);
  if (!res?.ok) {
    throw new Error(`Storybook isn't reachable at ${BASE_URL}. Start it with: pnpm storybook --ci`);
  }
  const { entries } = await res.json();
  return Object.values(entries).filter((entry) => entry.type === 'story');
}

function viewportFor(story) {
  const name = story.name.toLowerCase();
  if (name.includes('mobile')) return VIEWPORTS.mobile;
  if (name.includes('tablet')) return VIEWPORTS.tablet;
  return VIEWPORTS.desktop;
}

async function capture(page, story, file) {
  await page.setViewportSize(viewportFor(story));
  await page.goto(`${BASE_URL}/iframe.html?id=${story.id}&viewMode=story`, {
    waitUntil: 'networkidle',
  });
  await page.waitForFunction(
    () =>
      document.body.classList.contains('sb-show-errordisplay') ||
      document.querySelector('#storybook-root')?.childElementCount > 0,
  );
  if (await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay'))) {
    throw new Error('the story failed to render');
  }
  await page.evaluate(() => document.fonts.ready);
  // Give play functions and entry transitions a moment to settle
  await page.waitForTimeout(600);
  await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
}

async function main() {
  const [first, ...rest] = process.argv.slice(2);
  const stories = await loadStories();

  if (!first || first === '--list') {
    const filter = (rest[0] ?? '').toLowerCase();
    for (const story of stories) {
      if (`${story.id} ${story.title}`.toLowerCase().includes(filter)) {
        console.log(`${story.id.padEnd(55)} ${story.title} / ${story.name}`);
      }
    }
    return;
  }

  if (rest.length === 0) {
    throw new Error('Pass at least one story id after the module name. Use --list to see them.');
  }

  const moduleDir = path.join(OUT_DIR, first);
  await mkdir(moduleDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  let failed = 0;

  try {
    for (const arg of rest) {
      const [id, name = id.split('--').pop()] = arg.split('=');
      const story = stories.find((entry) => entry.id === id);
      if (!story) {
        console.error(`✗ ${id}: no such story`);
        failed++;
        continue;
      }
      const file = path.join(moduleDir, `${name}.png`);
      try {
        await capture(page, story, file);
        console.log(`✓ ${id} -> /img/screens/${first}/${name}.png`);
      } catch (error) {
        console.error(`✗ ${id}: ${error.message}`);
        failed++;
      }
    }
  } finally {
    await browser.close();
  }

  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
