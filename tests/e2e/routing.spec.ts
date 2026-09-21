import { expect, test } from "@playwright/test";

test("root redirects to the Polish routed dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/pl$/);
  await expect(page.getByRole("button", { name: /Mathly/i })).toBeVisible();
});

test("primary modules use real URLs and preserve locale", async ({ page }) => {
  await page.goto("/pl");

  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Ścieżka", exact: true })
    .click();
  await expect(page).toHaveURL(/\/pl\/path$/);

  await page.getByRole("button", { name: /Przełącz na angielski/i }).click();
  await expect(page).toHaveURL(/\/en\/path$/);

  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Knowledge base", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/knowledge$/);
});

test("starting a guided lesson opens a dedicated lesson subpage", async ({ page }) => {
  await page.goto("/pl/path");

  await page
    .getByRole("button", { name: /Rozpocznij lekcję krok po kroku/i })
    .click();

  await expect(page).toHaveURL(/\/pl\/learn\//);
  await expect(
    page.getByText(/LEKCJA|MISJA LEKCJI/i).first(),
  ).toBeVisible();
  await expect(page.getByText(/POZ\. \d+/)).toBeVisible();
});

test("mock exam shows intro before the timer starts", async ({ page }) => {
  await page.goto("/pl/exam");

  await expect(page.getByText(/Zanim zaczniesz/i)).toBeVisible();
  await expect(page.getByText("60 min", { exact: true })).toBeVisible();

  await page
    .getByRole("button", { name: /Start — otwórz arkusz/i })
    .click();

  await expect(page.getByText(/59:\d\d|60:00/).first()).toBeVisible();
  await expect(page.getByText(/Strona/i).first()).toBeVisible();
});

test("assessment pagination returns the viewport to the top", async ({ page }) => {
  await page.goto("/pl/tests");
  await page.getByRole("button", { name: /Zobacz wstęp/i }).first().click();
  await page.getByRole("button", { name: /Start — otwórz arkusz/i }).click();

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.getByRole("button", { name: /^Dalej$/i }).click();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(120);
  await expect(page.getByText(/2 \/ 3/)).toBeVisible();
});


test("submitted unit test shows a detailed error review", async ({ page }) => {
  await page.goto("/pl/tests");
  await page.getByRole("button", { name: /Zobacz wstęp/i }).first().click();
  await page.getByRole("button", { name: /Start — otwórz arkusz/i }).click();

  await page.getByRole("button", { name: /Następna strona/i }).click();
  await page.getByRole("button", { name: /Następna strona/i }).click();
  await page.getByRole("button", { name: /Oddaj arkusz/i }).click();

  await expect(page.getByText("PODSUMOWANIE ARKUSZA")).toBeVisible();
  await expect(page.getByText(/zadań wymaga powtórki/i)).toBeVisible();
  await expect(page.getByText("Twoja odpowiedź").first()).toBeVisible();
  await expect(page.getByText("Poprawna odpowiedź").first()).toBeVisible();
  await expect(page.getByText("Dlaczego tak?").first()).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(160);
});

test("Polish flashcards and profile stay fully localized", async ({ page }) => {
  await page.goto("/pl/formulas");
  await expect(page.getByText("TRYB FISZEK")).toBeVisible();
  await expect(page.getByText(/wszystkich fiszek/i)).toBeVisible();
  await expect(page.locator(".math-flashcard")).toBeVisible();

  await page.goto("/pl/profile");
  await expect(page.getByText("Odkrywca matematyki")).toBeVisible();
  await expect(page.getByText("PIERWSZE KROKI")).toBeVisible();
  await expect(page.getByText("GOTOWY NA MATURĘ")).toBeVisible();
  await expect(page.getByText("FIRST STEPS")).toHaveCount(0);
});
