import { test, expect } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.clear());
});

test("skips the opening by button and keeps the composer usable", async ({ app }) => {
  await expect(app.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
  await app.locator("#message-input").fill("Text entered during the intro");
  await app.getByRole("button", { name: "Skip", exact: true }).click();
  await expect(app.locator(".opening")).toBeHidden();
  await expect(app.locator("#message-input")).toHaveValue("Text entered during the intro");
});

test("skips the opening with Escape", async ({ app }) => {
  await expect(app.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
  await app.keyboard.press("Escape");
  await expect(app.locator(".opening")).toBeHidden();
});

test("skips the opening on scroll", async ({ app }) => {
  await expect(app.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
  await app.evaluate(() => scrollTo(0, 150));
  await expect(app.locator(".opening")).toBeHidden();
});

test("uses the static final state with reduced motion", async ({ app }) => {
  await app.emulateMedia({ reducedMotion: "reduce" });
  await app.goto("/");
  await expect(app.locator(".opening")).toBeHidden();
  await expect(app.locator(".composer")).toBeVisible();
  await expect(app.locator(".story-chapter")).toHaveCount(5);
});
