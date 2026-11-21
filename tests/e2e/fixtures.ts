import { test as base, expect, type Page, type Locator } from "@playwright/test";

type Fixtures = {
  app: Page;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, run) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    await run(page);

    expect(
      consoleErrors,
      `Console errors on ${page.url()}:\n${consoleErrors.join("\n")}`,
    ).toEqual([]);
  },
});

export { expect };

export async function screenshotClipped(page: Page, locator: Locator, path: string) {
  const box = await locator.boundingBox();
  if (!box)
    throw new Error("screenshotClipped: locator has no bounding box (not visible?)");
  await page.screenshot({ path, clip: box });
}
