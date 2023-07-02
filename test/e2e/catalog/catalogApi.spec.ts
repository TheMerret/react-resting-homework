import { test, expect } from "@playwright/test";

test("cart should show entries from api", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 644 });
  await page.goto("./catalog");
  await page.waitForSelector(".card-link");
  const title = await page.locator("h5.card-title").first().textContent();
  expect(title?.length).toBeGreaterThan(0);
  const text = await page.locator("p.card-text").first().textContent();
  expect(text?.at(0)).toBe("$");
  const link = await page.locator("a.card-link").first().getAttribute("href");
  expect(link?.endsWith("/hw/store/catalog/0")).toBe(true);
});
