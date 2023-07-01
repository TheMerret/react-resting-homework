import { test, expect } from "@playwright/test";

// TODO: mock cart items.
for (const width of [575, 767, 991, 1200]) {
  for (const path of ["", "catalog", "delivery", "contacts", "cart"])
    test(`if  width is ${width}px is so '${path}' page is responsive`, async ({
      page,
    }) => {
      page.setViewportSize({ width: width, height: 644 });
      await page.goto("./" + path);

      await expect(page).toHaveScreenshot({ fullPage: true });
    });
}
