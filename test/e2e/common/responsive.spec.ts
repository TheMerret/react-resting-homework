import { test, expect } from '@playwright/test';

for (const width of [575, 767, 991, 1200]) {
  for (const path of ['', 'delivery', 'contacts'])
    test(`if width is ${width}px is so '${path}' page is responsive`, async ({
      page,
    }) => {
      page.setViewportSize({ width: width, height: 644 });
      await page.goto('./' + path);

      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  test(`if width is ${width}px is so 'catalog' page is responsive`, async ({
    page,
  }) => {
    const ids: number[] = [];
    for (let i = 0; i < 12; i++) {
      ids.push(i);
    }
    const apiUrl = `**/api/products`;
    await page.route(apiUrl, async (route) => {
      const json = ids.map((x) => ({
        id: x,
        name: `${x}`,
        price: x,
      }));
      await route.fulfill({ json });
    });
    page.setViewportSize({ width: width, height: 644 });
    await page.goto('./' + 'catalog');

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
  test(`if width is ${width}px is so 'cart' page is responsive`, async ({
    page,
  }) => {
    const ids = [0, 1];
    const cart = {};
    for (const id of ids) {
      cart[id] = { count: id, name: `${id}`, price: id };
    }

    page.setViewportSize({ width: width, height: 644 });
    await page.goto('./' + 'cart');
    await page.evaluate((cart) => {
      localStorage.setItem('example-store-cart', JSON.stringify(cart));
    }, cart);

    await page.reload();

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
}
