import { test, expect } from "./fixtures";

test("app boots and renders with no console errors", async ({ app }) => {
  await expect(app.locator("body")).toBeVisible();
  await expect(app).toHaveTitle(/.+/);
});
