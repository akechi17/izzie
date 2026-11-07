import { chromium } from "playwright";

const OUT = ".scratch/shots";
const browser = await chromium.launch();

async function open({ width = 1280, height = 950 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  return page;
}

async function opened(opts) {
  const page = await open(opts);
  await page.getByRole("button", { name: "Open Your Surprise", exact: true }).click();
  await page.waitForTimeout(1500);
  return page;
}

/** The masthead "Next" — its sr-only text makes it unique against Dev Tools. */
const next = (page) => page.getByRole("button", { name: /to the next page/ });

// 1 — opening: closed, mid-fold, open
{
  const page = await open();
  await page.screenshot({ path: `${OUT}/v2-A-closed.png` });
  await page.getByRole("button", { name: "Open Your Surprise", exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/v2-A-midfold.png` });
  await page.waitForTimeout(280);
  await page.screenshot({ path: `${OUT}/v2-A-risen.png` });
  await page.close();
}

// 2 — cake: mic first
{
  const page = await opened();
  for (let i = 0; i < 3; i += 1) {
    await next(page).click();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/v2-D-cake.png`, fullPage: true });
  await page.close();
}

// 3 — bouquet
{
  const page = await opened({ height: 1100 });
  for (let i = 0; i < 4; i += 1) {
    await next(page).click();
    await page.waitForTimeout(320);
  }
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/v2-E-empty.png`, fullPage: true });

  const add = page.getByRole("button", { name: /^Add one / });
  const n = await add.count();
  console.log("add buttons:", n);

  const picks = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3];
  for (let i = 0; i < picks.length; i += 1) {
    const btn = add.nth(picks[i] % n);
    if (await btn.isEnabled()) await btn.click();
    if (i === 4) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/v2-E-five.png`, fullPage: true });
    }
  }
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/v2-E-fourteen.png`, fullPage: true });

  await page.getByRole("button", { name: /give your bouquet/i }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/v2-E-given.png`, fullPage: true });
  await page.close();
}

await browser.close();
console.log("done");
