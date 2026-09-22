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
  await page
    .locator(".assessment-floating-dock")
    .getByRole("button", { name: /Następna strona/i })
    .click();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(120);
  await expect(page.getByText(/2 \/ 3/)).toBeVisible();
});


test("submitted unit test shows detailed summary without reopening the paper", async ({ page }) => {
  await page.goto("/pl/tests");
  await page.getByRole("button", { name: /Zobacz wstęp/i }).first().click();
  await page.getByRole("button", { name: /Start — otwórz arkusz/i }).click();

  await page.locator(".paper-input-wrap input").first().fill("999999");

  const activeDock = page.locator(".assessment-floating-dock");
  await activeDock.getByRole("button", { name: /Następna strona/i }).click();
  await activeDock.getByRole("button", { name: /Następna strona/i }).click();
  await activeDock.getByRole("button", { name: /^Oddaj$/i }).click();

  await expect(page.getByText("PODSUMOWANIE ARKUSZA")).toBeVisible();
  await expect(page.getByText(/zadań wymaga powtórki/i)).toBeVisible();
  await expect(page.getByText("Twoja odpowiedź").first()).toBeVisible();
  await expect(page.getByText("Poprawna odpowiedź").first()).toBeVisible();
  await expect(page.getByText("Dlaczego tak?").first()).toBeVisible();
  await expect(page.locator(".paper-viewport")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Odpowiedzi na arkuszu/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Zobacz odpowiedzi na arkuszu/i })).toHaveCount(0);
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


test("active assessment uses guarded red quit action and logical 100% zoom", async ({ page }) => {
  await page.goto("/pl/tests");
  await page.getByRole("button", { name: /Zobacz wstęp/i }).first().click();
  await page.getByRole("button", { name: /Start — otwórz arkusz/i }).click();

  await expect(page.getByRole("button", { name: "Przerwij", exact: true })).toBeVisible();
  await expect(page.getByText("100%", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Przerwij", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(/Na pewno chcesz przerwać/i)).toBeVisible();

  await page.getByRole("button", { name: /Zostań i dokończ/i }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Przerwij", exact: true }).click();
  await page.getByRole("button", { name: /Tak, przerwij/i }).click();
  await expect(page.getByText(/Zanim zaczniesz/i)).toBeVisible();
});

test("lesson exercise exposes separate yellow hint and red answer reveals", async ({ page }) => {
  await page.goto("/pl/path");
  await page
    .getByRole("button", { name: /Rozpocznij lekcję krok po kroku/i })
    .click();

  await page.getByRole("button", { name: /Ćwiczenie/i }).click();

  const hintButton = page.getByRole("button", { name: /Pokaż podpowiedź/i });
  const answerButton = page.getByRole("button", { name: /Pokaż odpowiedź/i });

  await expect(hintButton).toBeVisible();
  await expect(answerButton).toBeVisible();

  await hintButton.click();
  await expect(page.locator(".lesson-reveal-hint")).toBeVisible();

  await answerButton.click();
  await expect(page.locator(".lesson-reveal-answer")).toBeVisible();
  await expect(page.getByText(/Poprawna odpowiedź:/i)).toBeVisible();
});


test("assessment floating dock stays below bars and disables page boundaries", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/pl/tests");
  await page.getByRole("button", { name: /Zobacz wstęp/i }).first().click();
  await page.getByRole("button", { name: /Start — otwórz arkusz/i }).click();

  const dock = page.locator(".assessment-floating-dock");
  const controls = page.locator(".paper-controls");
  const dockBox = await dock.boundingBox();
  const controlsBox = await controls.boundingBox();

  expect(dockBox).not.toBeNull();
  expect(controlsBox).not.toBeNull();
  expect(dockBox!.y).toBeGreaterThanOrEqual(
    controlsBox!.y + controlsBox!.height + 10,
  );

  const previous = dock.getByRole("button", { name: /Poprzednia strona/i });
  const next = dock.getByRole("button", { name: /Następna strona/i });

  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.click();
  await expect(previous).toBeEnabled();

  await next.click();
  await expect(next).toBeDisabled();
  await expect(dock.getByRole("button", { name: /Oddaj/i })).toBeVisible();
});

test("function laboratory exposes multiple stable graph experiments", async ({ page }) => {
  await page.goto("/pl/lab");

  await expect(page.getByRole("button", { name: /Parabola/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Prosta/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Sinus/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Moduł/i })).toBeVisible();

  const graphPanel = page.locator(".graph-panel");
  const initialHeight = await graphPanel.evaluate((element) => element.getBoundingClientRect().height);

  await page.getByRole("button", { name: /Sinus/i }).click();
  await expect(page.getByText(/Amplituda/i).first()).toBeVisible();

  const sineHeight = await graphPanel.evaluate((element) => element.getBoundingClientRect().height);
  expect(Math.abs(sineHeight - initialHeight)).toBeLessThan(3);

  await page.getByRole("button", { name: /Moduł/i }).click();
  await expect(page.getByText(/Wierzchołek/i).first()).toBeVisible();
});

test("moving through lesson steps shows XP toast without fireworks", async ({ page }) => {
  await page.goto("/pl/path");
  await page
    .getByRole("button", { name: /Rozpocznij lekcję krok po kroku/i })
    .click();

  await page.getByRole("button", { name: /^Dalej$/i }).click();

  await expect(page.locator(".lesson-xp-toast")).toBeVisible();
  await expect(page.locator(".lesson-confetti")).toHaveCount(0);
});
