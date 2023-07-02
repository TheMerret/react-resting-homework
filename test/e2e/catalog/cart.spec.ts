import { test, expect } from "@playwright/test";

const products = [
  {
    id: 0,
    name: "Gorgeous Pants",
    description:
      "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
    price: 158,
    color: "black",
    material: "Concrete",
  },
  {
    id: 1,
    name: "Small Tuna",
    description:
      "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design",
    price: 437,
    color: "gold",
    material: "Steel",
  },
];

test("cart should be saved after reload", async ({ page }) => {
  const apiUrl = `**\/api\/products/*`;
  let id = 0;
  await page.route(apiUrl, async (route) => {
    const json = products[id];
    await route.fulfill({ json });
  });
  await page.setViewportSize({ width: 1200, height: 644 });
  await page.goto("./catalog/0");
  await page.getByText("Add to Cart").click({ clickCount: 2 });
  id++;
  await page.goto("./catalog/1");
  await page.getByText("Add to Cart").click({ clickCount: 4 });
  await page.goto('./cart');
  const cart = page.locator("table.Cart-Table");
  await expect(cart).toHaveScreenshot();
});
