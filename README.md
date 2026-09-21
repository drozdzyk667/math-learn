# Mathly / math-learn

Dwujęzyczna platforma do nauki matematyki licealnej. Projekt jest matematycznym odpowiednikiem `planer-nauki`, ale z własnym kierunkiem wizualnym i osobną architekturą treści.

## Co już działa

- PL / EN, dark / light mode
- realne routy Next.js dla wszystkich głównych modułów
- osobne podstrony lekcji `/[locale]/learn/[lessonId]`
- ścieżka 13 działów licealnych
- baza wiedzy jako szybka ściąga
- prowadzone lekcje krok po kroku
- duże wzory KaTeX i objaśnienia zmiennych
- generator: krótkie zadania, ABCD, zadania opisowe i dłuższe zadania na rozumowanie
- interaktywne laboratorium funkcji
- klasówki: 12 zadań, intro, A4, paginacja, zoom
- próbna matura: 20 zadań, 60 minut, intro przed startem
- XP, poziomy, streak, mastery, osiągnięcia
- celebracje / confetti respektujące reduced motion
- localStorage jako tymczasowa persystencja MVP
- CI: lint, typecheck, unit tests, build, Playwright E2E i axe WCAG smoke tests

## Routy

- `/pl`, `/en`
- `/[locale]/path`
- `/[locale]/knowledge`
- `/[locale]/formulas`
- `/[locale]/tasks`
- `/[locale]/lab`
- `/[locale]/tests`
- `/[locale]/exam`
- `/[locale]/profile`
- `/[locale]/learn/[lessonId]`

## Stack

Next.js 16.3+, React 19.3, TypeScript 6, KaTeX, Lucide, Vitest, Playwright, axe-core.

## Uruchomienie

```bash
npm install
npm run dev
```

Walidacja:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Dokumentacja jakości

- `docs/ux-a11y-audit.md`
- `docs/deep-review-2026-09-22.md`

## Najważniejsze kolejne kroki

1. rozbić `math-app.tsx` na feature-level components per route,
2. dodać backendową persystencję postępu,
3. autosave klasówki / matury i resume po refreshu,
4. punktowy scoring zamiast liczenia tylko poprawnych pytań,
5. pełna walidacja treści matematycznych,
6. ręczny pass NVDA / VoiceOver i zoom 200–400%,
7. model Basic / PRO i entitlementy.
