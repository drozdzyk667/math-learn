import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/pl",
  "/pl/path",
  "/pl/knowledge",
  "/pl/formulas",
  "/pl/tasks",
  "/pl/lab",
  "/pl/tests",
  "/pl/exam",
  "/pl/profile",
];

for (const route of routes) {
  test(`no serious or critical axe violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}

test("guided lesson route has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/pl/learn/sets-intervals");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "critical" || violation.impact === "serious",
  );

  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});
