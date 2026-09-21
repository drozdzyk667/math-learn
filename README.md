# Mathly / math-learn

Interaktywna, dwujęzyczna platforma do nauki matematyki licealnej. Projekt powstał jako matematyczny odpowiednik `planer-nauki`, ale ma własny kierunek wizualny: **mathematical lab**.

## MVP

- PL / EN oraz dark / light mode (domyślnie dark)
- ścieżka 13 działów zgodna z polską podstawą programową liceum/technikum
- baza wiedzy i krótkie lekcje
- fiszki ze wzorami i aktywnym przypominaniem
- generator losowych wariantów zadań z podpowiedzią i rozwiązaniem
- interaktywne laboratorium funkcji kwadratowej
- klasówka po każdym dziale: 8 losowych zadań
- próbna matura 60 min: 12 zadań z przerobionych działów
- XP, streak, mastery, poziom, osiągnięcia, skuteczność
- localStorage jako tymczasowa persystencja MVP
- gotowe do deployu na Vercel jako aplikacja Next.js

## Stack

Next.js 16.3+, React 19.3, TypeScript 6, Motion, Lucide.

## Uruchomienie

```bash
npm install
npm run dev
```

Build:

```bash
npm run typecheck
npm run build
```

## Źródło struktury programu

Układ 13 działów jest oparty o aktualną podstawę programową matematyki dla liceum ogólnokształcącego i technikum (zakres podstawowy i rozszerzony): liczby rzeczywiste, algebra, równania i nierówności, układy równań, funkcje, ciągi, trygonometria, planimetria, geometria analityczna, stereometria, kombinatoryka, prawdopodobieństwo i statystyka oraz optymalizacja / rachunek różniczkowy.

## Dalsze kroki

1. konto użytkownika + Supabase/Postgres,
2. prawdziwy model spaced repetition,
3. pełna baza pytań maturalnych i tagging umiejętności,
4. parser odpowiedzi symbolicznych (np. `sqrt(2)`, ułamki, przedziały),
5. pełny raport po egzaminie i rekomendacje powtórek,
6. PWA/offline,
7. testy jednostkowe i E2E.
