# Mathly — deep review: UX, a11y, WCAG, architecture and testing

Date: 2026-09-22

## Executive summary

The MVP now has real URL-based navigation, dedicated lesson subpages, deterministic question generation, mixed assessment formats, automated unit tests, Playwright E2E tests and automated axe accessibility smoke checks.

The most important architectural change is that navigation is no longer held only in React state. Core modules now have stable URLs and the guided lesson is its own route.

## Route architecture

Implemented routes:

- `/pl`, `/en` — dashboard
- `/[locale]/path`
- `/[locale]/knowledge`
- `/[locale]/formulas`
- `/[locale]/tasks`
- `/[locale]/lab`
- `/[locale]/tests`
- `/[locale]/exam`
- `/[locale]/profile`
- `/[locale]/learn/[lessonId]`

The root route redirects to `/pl`.

The locale segment is validated in the App Router layout. Guided lessons validate lesson IDs and expose static params, matching the route structure used by the programming-learning project.

### Architecture findings

**Resolved**
- Client-only view switching was replaced by real Next.js routes.
- Lesson details/formulas were moved into a shared content module.
- Random task generation is seeded/deterministic, avoiding SSR/hydration inconsistencies for generated content rendered during initial page load.
- The guided lesson is now separated from the large dashboard component.

**Remaining technical debt**
- `math-app.tsx` is still too large and owns multiple independent feature views. It should be split into `features/dashboard`, `features/path`, `features/knowledge`, `features/practice`, `features/assessment` and `features/profile`.
- Progress persistence is still localStorage-only. A production version needs a repository/service abstraction and authenticated persistence.
- The current route pages reuse one large client bundle. The next architecture step is one feature component per route so Next.js can split bundles more effectively.
- Assessment state is local to the current route. Resume-after-refresh should be implemented before treating timed exams as production-ready.

## Guided learning UX

The Path and Practice modules now intentionally have different jobs:

- **Path**: structured teaching, lesson progression, formula explanation, variable-by-variable explanation, worked example, core exercise and reasoning challenge.
- **Knowledge base**: reference/recall material.
- **Practice**: independent random generator.
- **Tests / Exam**: assessment, not teaching.

The guided lesson route includes:
- step navigation;
- large mathematical notation;
- variable explanations;
- worked reasoning;
- multi-step word problem;
- XP rewards;
- level progress;
- streak information;
- reduced-motion-compatible celebration effects;
- PRO/advanced content affordance.

## Question quality

The generator now supports:
- short numeric tasks;
- word problems;
- multiple-choice ABCD;
- longer multi-step reasoning tasks.

Longer reasoning scenarios currently include:
- successive percentage changes;
- comparing taxi tariffs;
- arithmetic-sequence total savings;
- ticket-price systems of equations;
- inner-border area of a garden;
- probability without replacement;
- partially filled volume problems.

### Remaining content risk

Generated tasks are synthetic. Before production or paid access:
- validate every template mathematically;
- tag each template with curriculum outcome and difficulty;
- create a regression set for edge cases and expected answers;
- add official-exam-inspired tasks written from scratch or sourced with licensing care;
- separate basic and advanced curriculum coverage explicitly in content metadata.

## Accessibility / WCAG review

Target: WCAG 2.2 AA where applicable.

### Implemented
- skip links;
- visible focus indicators;
- keyboard-operable route navigation;
- `aria-current` for active navigation / lesson step;
- `aria-expanded` / `aria-controls` for expandable help;
- accessible range labels in the function laboratory;
- status/live regions for answer feedback and XP celebration;
- graph `title` and `desc`;
- reduced-motion handling;
- forced-colors fallbacks;
- minimum target-size work for important controls;
- non-colour indicators for success/error states;
- focus + scroll restoration on assessment pagination;
- deterministic content to avoid hydration instability;
- dark mathematical notation forced on white exam paper.

### Automated accessibility coverage

Playwright + `@axe-core/playwright` now scans:
- dashboard;
- learning path;
- knowledge base;
- formulas;
- practice;
- lab;
- tests;
- mock exam;
- profile;
- guided lesson route.

CI fails on serious or critical axe violations.

### Manual checks still required for a real conformance claim

Automated axe tests are not a WCAG certification. Before production:
1. Keyboard-only pass for every route and dialog-like flow.
2. NVDA + Chrome on Windows.
3. VoiceOver + Safari on iOS/macOS.
4. 200% browser zoom and 400% reflow checks.
5. Text-spacing override test.
6. Light and dark theme contrast measurement.
7. Mobile orientation / dynamic text tests.
8. Screen-reader review of KaTeX output.
9. Verify focus order after client-side navigation.
10. Verify timed exam does not create an inaccessible time-pressure experience; allow pause/accommodation if product requirements permit.

## Function lab

The graph panel uses fixed desktop dimensions and a fixed state slot for the vertex / linear-function message. This prevents the `a = 0` transition from changing the card height.

Remaining recommended browser checks:
- Safari range input rendering;
- Firefox SVG sizing;
- 200% zoom;
- mobile landscape.

## Assessment UX

Implemented:
- intro screen before exam/test;
- timer starts only after Start;
- mixed-format questions;
- 12-question unit tests;
- 20-question mock exam;
- A4-like paper;
- zoom controls;
- page-by-page pagination;
- answer persistence between pages;
- Next/Back controls;
- automatic scroll and focus to the top after page change.

Remaining production work:
- autosave timed attempt state;
- explicit unanswered-question summary before submit;
- per-topic weak-area report;
- question navigator (1–20) with answered/unanswered state;
- robust score model based on points rather than count only;
- printable/exportable result summary.

## Test architecture

### Unit layer — Vitest

Current coverage:
- mixed assessment generation;
- presence of numeric / word / ABCD formats;
- long reasoning-task shape;
- numeric answer integrity.

Recommended next unit tests:
- score tolerance / decimal parsing;
- deterministic seed snapshots;
- level/XP calculations;
- route helpers;
- progress repository;
- every question template with boundary values.

### E2E layer — Playwright

Current coverage:
- root locale redirect;
- routed module navigation;
- language route preservation;
- dedicated lesson route;
- exam intro before timer;
- assessment pagination and scroll-to-top;
- axe accessibility smoke suite.

Recommended next E2E tests:
- mobile viewport navigation;
- dark/light theme persistence;
- lesson completion and XP persistence;
- browser back/forward history;
- refresh on every route;
- test/exam completion and results;
- keyboard-only answer flow;
- reduced-motion behaviour.

## CI quality gate

The CI pipeline now runs:

1. dependency install;
2. ESLint;
3. TypeScript typecheck;
4. Vitest;
5. Next.js production build;
6. Playwright Chromium installation;
7. E2E + axe WCAG smoke tests.

A deployment should not be treated as validated unless this pipeline is green.

## Priority backlog

### P0 before public launch
- make CI fully green including axe/E2E;
- manually test keyboard and screen-reader flows;
- persist timed assessment state across refresh;
- validate generated maths templates;
- split score from question count and use points.

### P1
- split `math-app.tsx` into route-level feature components;
- add a progress repository abstraction;
- add question navigator / unanswered review;
- richer lesson-specific explanations instead of generic fallbacks;
- add mobile E2E project.

### P2
- backend account sync;
- paid Basic/PRO entitlement model;
- spaced repetition;
- adaptive difficulty;
- official-style exam blueprint generation;
- analytics around learning outcomes rather than only XP.
