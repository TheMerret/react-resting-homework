import { test, expect } from "@playwright/test";

test("cart should show valid id after checkout", async ({ page }) => {
  page.setViewportSize({ width: 1200, height: 644 });
  await page.goto("./" + "cart");
  const ids = [0, 1];
  const cart = {};
  for (const id of ids) {
    cart[id] = { count: id, name: `${id}`, price: id };
  }

  await page.evaluate((cart) => {
    localStorage.setItem("example-store-cart", JSON.stringify(cart));
  }, cart);
  await page.reload();
  await page.getByLabel("Name").type("test");
  await page.getByLabel("Phone").type("89999999999");
  await page.getByLabel("Address").type("test");
  await page.locator("button.Form-Submit").click();
  await expect(page.locator(".Cart-SuccessMessage")).toHaveScreenshot({
    mask: [page.locator(".Cart-SuccessMessage p:first-of-type")],
  });
  await expect(+(await page.locator(".Cart-Number").innerText())).toBeLessThan(2**32);
});
