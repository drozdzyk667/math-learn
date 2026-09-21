export type Localized = { pl: string; en: string };

export type Lesson = {
  id: string;
  title: Localized;
  summary: Localized;
  level: "basic" | "extended";
  minutes: number;
  formula?: string;
};

export type Unit = {
  id: string;
  roman: string;
  title: Localized;
  short: Localized;
  icon: string;
  accent: string;
  lessons: Lesson[];
};

export const curriculum: Unit[] = [
  {
    id: "real-numbers", roman: "I", icon: "∑", accent: "violet",
    title: { pl: "Liczby rzeczywiste", en: "Real numbers" },
    short: { pl: "Potęgi, pierwiastki, logarytmy, procenty i wartość bezwzględna.", en: "Powers, roots, logarithms, percentages and absolute value." },
    lessons: [
      { id: "sets-intervals", title: { pl: "Zbiory liczbowe i przedziały", en: "Number sets and intervals" }, summary: { pl: "N, Z, Q, R oraz zapis i działania na przedziałach.", en: "N, Z, Q, R and interval notation and operations." }, level: "basic", minutes: 18 },
      { id: "powers-roots", title: { pl: "Potęgi i pierwiastki", en: "Powers and roots" }, summary: { pl: "Prawa działań, wykładniki wymierne i upraszczanie wyrażeń.", en: "Exponent laws, rational exponents and simplifying expressions." }, level: "basic", minutes: 24, formula: "aᵐ · aⁿ = aᵐ⁺ⁿ" },
      { id: "percentages", title: { pl: "Procenty i procent składany", en: "Percentages and compound growth" }, summary: { pl: "Zmiany procentowe, lokaty, kredyty i wzrost wykładniczy.", en: "Percentage change, savings, loans and exponential growth." }, level: "basic", minutes: 20, formula: "Kₙ = K₀(1 + p)ⁿ" },
      { id: "logs", title: { pl: "Logarytmy", en: "Logarithms" }, summary: { pl: "Definicja, własności i zamiana logarytmowania na potęgowanie.", en: "Definition, properties and relation to exponentiation." }, level: "basic", minutes: 28, formula: "logₐ(xy) = logₐx + logₐy" }
    ]
  },
  {
    id: "algebra", roman: "II", icon: "x²", accent: "cyan",
    title: { pl: "Wyrażenia algebraiczne", en: "Algebraic expressions" },
    short: { pl: "Wielomiany, wzory skróconego mnożenia i wyrażenia wymierne.", en: "Polynomials, identities and rational expressions." },
    lessons: [
      { id: "identities", title: { pl: "Wzory skróconego mnożenia", en: "Algebraic identities" }, summary: { pl: "Kwadrat sumy i różnicy, różnica kwadratów.", en: "Square of a sum/difference and difference of squares." }, level: "basic", minutes: 22, formula: "(a+b)² = a² + 2ab + b²" },
      { id: "polynomials", title: { pl: "Wielomiany", en: "Polynomials" }, summary: { pl: "Dodawanie, mnożenie i rozkład na czynniki.", en: "Addition, multiplication and factorisation." }, level: "basic", minutes: 26 },
      { id: "rational-expressions", title: { pl: "Wyrażenia wymierne", en: "Rational expressions" }, summary: { pl: "Dziedzina, skracanie, mnożenie i dzielenie.", en: "Domain, simplification, multiplication and division." }, level: "basic", minutes: 28 }
    ]
  },
  {
    id: "equations", roman: "III", icon: "=", accent: "amber",
    title: { pl: "Równania i nierówności", en: "Equations and inequalities" },
    short: { pl: "Liniowe, kwadratowe, wielomianowe oraz z wartością bezwzględną.", en: "Linear, quadratic, polynomial and absolute-value problems." },
    lessons: [
      { id: "linear-equations", title: { pl: "Równania i nierówności liniowe", en: "Linear equations and inequalities" }, summary: { pl: "Przekształcenia równoważne i zapis zbioru rozwiązań.", en: "Equivalent transformations and solution sets." }, level: "basic", minutes: 20 },
      { id: "quadratic-equations", title: { pl: "Równania kwadratowe", en: "Quadratic equations" }, summary: { pl: "Delta, pierwiastki, postać iloczynowa i nierówności.", en: "Discriminant, roots, factored form and inequalities." }, level: "basic", minutes: 34, formula: "x = (-b ± √Δ) / 2a" },
      { id: "parameters", title: { pl: "Równania z parametrem", en: "Equations with parameters" }, summary: { pl: "Liczba rozwiązań i warunki zależne od parametru.", en: "Number of solutions and parameter-dependent conditions." }, level: "extended", minutes: 36 }
    ]
  },
  {
    id: "systems", roman: "IV", icon: "⎧", accent: "rose",
    title: { pl: "Układy równań", en: "Systems of equations" },
    short: { pl: "Układy liniowe, interpretacja geometryczna i zadania tekstowe.", en: "Linear systems, geometric interpretation and word problems." },
    lessons: [
      { id: "linear-systems", title: { pl: "Układy dwóch równań liniowych", en: "Two linear equations" }, summary: { pl: "Podstawianie, eliminacja i interpretacja na wykresie.", en: "Substitution, elimination and graph interpretation." }, level: "basic", minutes: 28 },
      { id: "mixed-systems", title: { pl: "Układy liniowo-kwadratowe", en: "Linear-quadratic systems" }, summary: { pl: "Układy sprowadzalne do równania liniowego lub kwadratowego.", en: "Systems reducible to linear or quadratic equations." }, level: "extended", minutes: 36 }
    ]
  },
  {
    id: "functions", roman: "V", icon: "ƒ", accent: "emerald",
    title: { pl: "Funkcje", en: "Functions" },
    short: { pl: "Własności, wykresy, funkcja liniowa, kwadratowa, wykładnicza i logarytmiczna.", en: "Properties, graphs, linear, quadratic, exponential and logarithmic functions." },
    lessons: [
      { id: "function-basics", title: { pl: "Język funkcji", en: "Function language" }, summary: { pl: "Dziedzina, zbiór wartości, miejsca zerowe i monotoniczność.", en: "Domain, range, zeros and monotonicity." }, level: "basic", minutes: 24 },
      { id: "linear-function", title: { pl: "Funkcja liniowa", en: "Linear function" }, summary: { pl: "Współczynniki, równanie prostej i interpretacja.", en: "Coefficients, line equation and interpretation." }, level: "basic", minutes: 26, formula: "f(x) = ax + b" },
      { id: "quadratic-function", title: { pl: "Funkcja kwadratowa", en: "Quadratic function" }, summary: { pl: "Postacie funkcji, wierzchołek, ekstremum i wykres.", en: "Forms, vertex, extrema and graph." }, level: "basic", minutes: 36, formula: "f(x) = a(x-p)² + q" },
      { id: "exp-log-functions", title: { pl: "Funkcja wykładnicza i logarytmiczna", en: "Exponential and logarithmic functions" }, summary: { pl: "Wykresy, własności oraz modelowanie zmian.", en: "Graphs, properties and modelling change." }, level: "basic", minutes: 30 }
    ]
  },
  {
    id: "sequences", roman: "VI", icon: "aₙ", accent: "blue",
    title: { pl: "Ciągi", en: "Sequences" },
    short: { pl: "Ciąg arytmetyczny, geometryczny, rekurencja i granice na rozszerzeniu.", en: "Arithmetic, geometric and recursive sequences, plus limits at extended level." },
    lessons: [
      { id: "arithmetic-sequence", title: { pl: "Ciąg arytmetyczny", en: "Arithmetic sequence" }, summary: { pl: "Wyraz ogólny i suma początkowych wyrazów.", en: "General term and partial sum." }, level: "basic", minutes: 26, formula: "aₙ = a₁ + (n−1)r" },
      { id: "geometric-sequence", title: { pl: "Ciąg geometryczny", en: "Geometric sequence" }, summary: { pl: "Iloraz, wyraz ogólny i suma.", en: "Ratio, general term and sum." }, level: "basic", minutes: 28, formula: "aₙ = a₁qⁿ⁻¹" },
      { id: "limits", title: { pl: "Granice ciągów", en: "Sequence limits" }, summary: { pl: "Podstawowe granice i twierdzenia o działaniach.", en: "Basic limits and limit laws." }, level: "extended", minutes: 34 }
    ]
  },
  {
    id: "trigonometry", roman: "VII", icon: "sin", accent: "fuchsia",
    title: { pl: "Trygonometria", en: "Trigonometry" },
    short: { pl: "Sinus, cosinus, tangens, twierdzenia sinusów i cosinusów.", en: "Sine, cosine, tangent, sine and cosine rules." },
    lessons: [
      { id: "trig-basics", title: { pl: "Sinus, cosinus i tangens", en: "Sine, cosine and tangent" }, summary: { pl: "Wartości szczególne i trójkąt prostokątny.", en: "Special values and right triangles." }, level: "basic", minutes: 30, formula: "sin²α + cos²α = 1" },
      { id: "sine-cosine-rule", title: { pl: "Twierdzenie sinusów i cosinusów", en: "Sine and cosine rules" }, summary: { pl: "Rozwiązywanie trójkątów i pola.", en: "Solving triangles and areas." }, level: "basic", minutes: 32 }
    ]
  },
  {
    id: "planimetry", roman: "VIII", icon: "△", accent: "lime",
    title: { pl: "Planimetria", en: "Plane geometry" },
    short: { pl: "Trójkąty, okręgi, podobieństwo, Tales i dowody geometryczne.", en: "Triangles, circles, similarity, Thales and geometric proofs." },
    lessons: [
      { id: "triangles", title: { pl: "Trójkąty i podobieństwo", en: "Triangles and similarity" }, summary: { pl: "Cechy podobieństwa, skala i zależności pól.", en: "Similarity criteria, scale and area relations." }, level: "basic", minutes: 34 },
      { id: "circles", title: { pl: "Okrąg i koło", en: "Circles" }, summary: { pl: "Kąty wpisane i środkowe, łuki, cięciwy i styczne.", en: "Inscribed/central angles, arcs, chords and tangents." }, level: "basic", minutes: 32 }
    ]
  },
  {
    id: "analytic-geometry", roman: "IX", icon: "↗", accent: "sky",
    title: { pl: "Geometria analityczna", en: "Analytic geometry" },
    short: { pl: "Proste, odległości, okręgi, wektory i układ współrzędnych.", en: "Lines, distances, circles, vectors and coordinates." },
    lessons: [
      { id: "lines", title: { pl: "Proste w układzie współrzędnych", en: "Lines in the coordinate plane" }, summary: { pl: "Postać kierunkowa i ogólna, równoległość i punkty przecięcia.", en: "Slope/general forms, parallelism and intersections." }, level: "basic", minutes: 30 },
      { id: "circle-equation", title: { pl: "Równanie okręgu", en: "Circle equation" }, summary: { pl: "Środek, promień i położenie względem prostej.", en: "Centre, radius and relation to a line." }, level: "basic", minutes: 28, formula: "(x−a)² + (y−b)² = r²" }
    ]
  },
  {
    id: "stereometry", roman: "X", icon: "⬡", accent: "orange",
    title: { pl: "Stereometria", en: "Solid geometry" },
    short: { pl: "Graniastosłupy, ostrosłupy, bryły obrotowe, kąty i przekroje.", en: "Prisms, pyramids, solids of revolution, angles and sections." },
    lessons: [
      { id: "solids", title: { pl: "Pola i objętości brył", en: "Surface area and volume" }, summary: { pl: "Graniastosłup, ostrosłup, walec, stożek i kula.", en: "Prism, pyramid, cylinder, cone and sphere." }, level: "basic", minutes: 38 },
      { id: "spatial-angles", title: { pl: "Kąty w przestrzeni", en: "Angles in space" }, summary: { pl: "Kąt prosta–płaszczyzna i kąt dwuścienny.", en: "Line-plane and dihedral angles." }, level: "basic", minutes: 34 }
    ]
  },
  {
    id: "combinatorics", roman: "XI", icon: "n!", accent: "pink",
    title: { pl: "Kombinatoryka", en: "Combinatorics" },
    short: { pl: "Reguły zliczania, permutacje, kombinacje i wariacje.", en: "Counting rules, permutations, combinations and variations." },
    lessons: [
      { id: "counting", title: { pl: "Reguły dodawania i mnożenia", en: "Addition and multiplication rules" }, summary: { pl: "Systematyczne zliczanie możliwości bez pomijania przypadków.", en: "Systematic counting without missing cases." }, level: "basic", minutes: 28 },
      { id: "combinations", title: { pl: "Permutacje, wariacje i kombinacje", en: "Permutations, variations and combinations" }, summary: { pl: "Modele z kolejnością i bez kolejności.", en: "Models with and without order." }, level: "extended", minutes: 36, formula: "C(n,k) = n! / (k!(n−k)!)" }
    ]
  },
  {
    id: "probability", roman: "XII", icon: "%", accent: "teal",
    title: { pl: "Prawdopodobieństwo i statystyka", en: "Probability and statistics" },
    short: { pl: "Model klasyczny, średnie, mediana, dominanta i prawdopodobieństwo warunkowe.", en: "Classical probability, averages, median, mode and conditional probability." },
    lessons: [
      { id: "classical-probability", title: { pl: "Prawdopodobieństwo klasyczne", en: "Classical probability" }, summary: { pl: "Przestrzeń zdarzeń i liczenie przypadków sprzyjających.", en: "Sample spaces and favourable outcomes." }, level: "basic", minutes: 30, formula: "P(A) = |A| / |Ω|" },
      { id: "statistics", title: { pl: "Statystyka opisowa", en: "Descriptive statistics" }, summary: { pl: "Średnia, średnia ważona, mediana i dominanta.", en: "Mean, weighted mean, median and mode." }, level: "basic", minutes: 24 }
    ]
  },
  {
    id: "calculus", roman: "XIII", icon: "∂", accent: "indigo",
    title: { pl: "Optymalizacja i rachunek różniczkowy", en: "Optimisation and differential calculus" },
    short: { pl: "Optymalizacja funkcji kwadratowej; na rozszerzeniu granice i pochodne.", en: "Quadratic optimisation; at extended level limits and derivatives." },
    lessons: [
      { id: "quadratic-optimisation", title: { pl: "Optymalizacja funkcją kwadratową", en: "Quadratic optimisation" }, summary: { pl: "Modelowanie problemu i odczyt ekstremum.", en: "Modelling a problem and reading an extremum." }, level: "basic", minutes: 32 },
      { id: "derivatives", title: { pl: "Pochodna i jej zastosowania", en: "Derivative and applications" }, summary: { pl: "Interpretacja geometryczna, monotoniczność i optymalizacja.", en: "Geometric interpretation, monotonicity and optimisation." }, level: "extended", minutes: 42, formula: "f′(x) = limₕ→₀ [f(x+h)−f(x)]/h" }
    ]
  }
];

export const allLessons = curriculum.flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id, unitTitle: unit.title })));

export const formulas = [
  { id: "quadratic", unitId: "equations", name: { pl: "Pierwiastki równania kwadratowego", en: "Quadratic roots" }, formula: "x₁,₂ = (−b ± √Δ) / 2a", note: { pl: "Δ = b² − 4ac", en: "Δ = b² − 4ac" } },
  { id: "identity", unitId: "algebra", name: { pl: "Kwadrat sumy", en: "Square of a sum" }, formula: "(a+b)² = a² + 2ab + b²", note: { pl: "Uważaj na składnik 2ab.", en: "Do not forget the 2ab term." } },
  { id: "arith", unitId: "sequences", name: { pl: "Ciąg arytmetyczny", en: "Arithmetic sequence" }, formula: "aₙ = a₁ + (n−1)r", note: { pl: "r to różnica ciągu.", en: "r is the common difference." } },
  { id: "geom", unitId: "sequences", name: { pl: "Ciąg geometryczny", en: "Geometric sequence" }, formula: "aₙ = a₁ · qⁿ⁻¹", note: { pl: "q to iloraz ciągu.", en: "q is the common ratio." } },
  { id: "trig", unitId: "trigonometry", name: { pl: "Jedynka trygonometryczna", en: "Pythagorean identity" }, formula: "sin²α + cos²α = 1", note: { pl: "Jedna z najczęściej używanych tożsamości.", en: "One of the most used trigonometric identities." } },
  { id: "circle", unitId: "analytic-geometry", name: { pl: "Równanie okręgu", en: "Circle equation" }, formula: "(x−a)² + (y−b)² = r²", note: { pl: "S = (a,b), promień r.", en: "Centre S = (a,b), radius r." } },
  { id: "prob", unitId: "probability", name: { pl: "Prawdopodobieństwo klasyczne", en: "Classical probability" }, formula: "P(A) = |A| / |Ω|", note: { pl: "Dla jednakowo prawdopodobnych wyników.", en: "For equally likely outcomes." } },
  { id: "compound", unitId: "real-numbers", name: { pl: "Procent składany", en: "Compound growth" }, formula: "Kₙ = K₀(1+p)ⁿ", note: { pl: "p zapisuj jako ułamek, np. 5% = 0,05.", en: "Use p as a decimal, e.g. 5% = 0.05." } }
];
