import { test, expect } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("scamshield:intro", "seen"));
});

test("checks a standalone link", async ({ app }) => {
  await app.goto("/link-check");
  await app.getByRole("button", { name: "Use a lookalike example" }).click();
  await app.getByRole("button", { name: "Check link", exact: true }).click();
  await expect(app.locator("#case-verdict")).toHaveText("Suspicious", { timeout: 90000 });
  await expect(app.locator(".url-anatomy > div")).toHaveCount(5);
});

test("completes the practice game by keyboard", async ({ app }) => {
  await app.goto("/practice");
  const answers = ["ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowLeft"];
  for (const answer of answers) {
    await app.keyboard.press(answer);
    await app.keyboard.press("Enter");
  }
  await expect(app.locator(".practice-score")).toHaveText("12/12");
});

test("builds an emergency checklist", async ({ app }) => {
  await app.goto("/help");
  await app.getByLabel("Paid money").check();
  await app.getByLabel("Shared an OTP").check();
  await expect(app.locator(".timeline-block")).toHaveCount(3);
  await expect(app.locator(".timeline-block").first()).toContainText("Call the bank");
});
