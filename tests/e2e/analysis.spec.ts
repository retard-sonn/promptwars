import { test, expect } from "./fixtures";

const providerName = process.env.BEDROCK_API_KEY
  ? "Bedrock"
  : process.env.GEMINI_API_KEY
    ? "Gemini"
    : "AI explanation";
const hasVisionProvider = Boolean(
  process.env.BEDROCK_API_KEY || process.env.GEMINI_API_KEY,
);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("scamshield:intro", "seen"));
});

test("analyses a sample and shows its verdict and provider trace", async ({ app }) => {
  test.setTimeout(120000);
  await app.getByRole("button", { name: "Parcel fee" }).click();
  const submit = app.getByRole("button", { name: "Check message", exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(app.locator("#case-verdict")).toHaveText("Likely a scam", {
    timeout: 90000,
  });
  await expect(app.locator(".provider-trace")).toContainText(providerName, {
    timeout: 90000,
  });
  await expect(app.locator(".tactic-row").first()).toBeVisible();
  await expect(app.locator(".threat-row")).toHaveCount(5);
});

test("uploads a screenshot or reports the missing vision provider", async ({ app }) => {
  test.setTimeout(150000);
  await app.getByRole("tab", { name: "Screenshot" }).click();
  await app
    .locator("#screenshot-input")
    .setInputFiles("tests/fixtures/message-screenshot.webp");
  const submit = app.getByRole("button", { name: "Check message", exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  if (hasVisionProvider) {
    await expect(app.locator(".provider-trace")).toContainText("Screenshot text", {
      timeout: 120000,
    });
    await expect(app.locator(".case-report")).toContainText("Screenshot cues", {
      timeout: 120000,
    });
  } else {
    await expect(app.getByRole("alert")).toContainText(
      "needs a configured vision provider",
    );
  }
});
