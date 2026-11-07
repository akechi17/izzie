import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
for (let i = 0; i < 4; i += 1) {
  await page.getByRole("button", { name: /next/i }).click();
  await page.waitForTimeout(260);
}
await page.waitForTimeout(700);

const buttons = await page.locator("button[aria-label]").evaluateAll((els) =>
  els.map((e) => e.getAttribute("aria-label")),
);
console.log("aria-labels:", JSON.stringify(buttons, null, 1));

await page.screenshot({ path: ".scratch/shots/dbg-empty.png", fullPage: true });
await browser.close();
