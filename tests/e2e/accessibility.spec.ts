import { mkdir } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";

const routes = [
  ["home", "/"], ["patterns", "/patterns"], ["pattern-detail", "/patterns/bank-kyc-update"],
  ["link-check", "/link-check"], ["practice", "/practice"], ["help", "/help"],
  ["insights", "/insights"], ["methodology", "/methodology"], ["privacy", "/privacy"],
  ["auth", "/auth"], ["history", "/history"], ["report-unavailable", "/report/00000000-0000-0000-0000-000000000000"],
];
const widths = [1440, 768, 390];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("scamshield:intro", "seen"));
});
for (const [name, route] of routes) {
  for (const width of widths) {
    test(`${name} passes layout, palette and accessibility checks at ${width}`, async ({ app }) => {
      test.setTimeout(90000);
      await app.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await app.goto(route);
      await expect(app.locator("h1").first()).toBeVisible();
      const overflow = await app.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow).toBe(false);
      const blur = await app.locator(".glass").first().evaluate((element) => getComputedStyle(element).backdropFilter);
      const radius = Number(blur.match(/blur\((\d+)px\)/)?.[1] ?? 0);
      expect(radius).toBeGreaterThan(0);
      expect(radius).toBeLessThanOrEqual(width === 1440 ? 28 : 16);
      const invalidColours = await app.locator("body *").evaluateAll((elements) => elements.flatMap((element) => {
        const style = getComputedStyle(element);
        const values = [style.color, style.backgroundColor, style.borderTopColor, style.borderBottomColor];
        return values.flatMap((value) => {
          const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
          if (channels.length < 3 || (channels[3] ?? 1) < 0.2) return [];
          const [r = 0, g = 0, b = 0] = channels.map((channel) => channel / 255);
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          if (!delta) return [];
          let hue = 0;
          if (max === r) hue = 60 * (((g - b) / delta) % 6);
          else if (max === g) hue = 60 * ((b - r) / delta + 2);
          else hue = 60 * ((r - g) / delta + 4);
          if (hue < 0) hue += 360;
          return hue >= 150 && hue <= 345 ? [`${element.tagName}: ${value}`] : [];
        });
      }));
      expect(invalidColours).toEqual([]);
      const invalidText = await app.locator("p, h1, h2, h3, li, label, a, button, span, strong").evaluateAll((elements) => elements.flatMap((element) => {
        const colour = getComputedStyle(element).color;
        const channels = colour.match(/[\d.]+/g)?.map(Number) ?? [];
        if (channels[0] === 10 && channels[1] === 10 && channels[2] === 10) return [];
        if (channels[0] === 255 && channels[1] === 255 && channels[2] === 255 && getComputedStyle(element).backgroundColor === "rgb(10, 10, 10)") return [];
        return [`${element.tagName}: ${colour}`];
      }));
      expect(invalidText).toEqual([]);
      const results = await new AxeBuilder({ page: app }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations, JSON.stringify(results.violations.map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.map((node) => node.target) })))).toEqual([]);
      await mkdir("docs/screenshots", { recursive: true });
      await app.screenshot({ path: `docs/screenshots/${name}-${width}.png`, fullPage: true });
    });
  }
}
