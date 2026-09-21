import type { Language } from "@/lib/i18n";

export const lessonFormulaTex: Record<string, string> = {
  "powers-roots": "a^m\\cdot a^n=a^{m+n}",
  percentages: "K_n=K_0(1+p)^n",
  logs: "\\log_a(xy)=\\log_a x+\\log_a y",
  identities: "(a+b)^2=a^2+2ab+b^2",
  "quadratic-equations": "x_{1,2}=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}",
  "linear-function": "f(x)=ax+b",
  "quadratic-function": "f(x)=a(x-p)^2+q",
  "arithmetic-sequence": "a_n=a_1+(n-1)r",
  "geometric-sequence": "a_n=a_1q^{n-1}",
  "trig-basics": "\\sin^2\\alpha+\\cos^2\\alpha=1",
  "circle-equation": "(x-a)^2+(y-b)^2=r^2",
  combinations: "\\binom nk=\\frac{n!}{k!(n-k)!}",
  "classical-probability": "P(A)=\\frac{|A|}{|\\Omega|}",
  derivatives: "f'(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}",
};

export function getLessonVariables(
  lessonId: string,
  lang: Language,
): Array<[string, string]> {
  const pl = lang === "pl";
  const map: Record<string, Array<[string, string]>> = {
    percentages: [
      ["K₀", pl ? "wartość początkowa" : "initial value"],
      ["p", pl ? "zmiana procentowa zapisana jako ułamek" : "percentage change as a decimal"],
      ["n", pl ? "liczba okresów" : "number of periods"],
      ["Kₙ", pl ? "wartość po n okresach" : "value after n periods"],
    ],
    "quadratic-equations": [
      ["a, b, c", pl ? "współczynniki równania kwadratowego" : "quadratic coefficients"],
      ["Δ", pl ? "wyróżnik równania: b² − 4ac" : "discriminant: b² − 4ac"],
      ["x₁, x₂", pl ? "pierwiastki równania" : "equation roots"],
    ],
    "linear-function": [
      ["a", pl ? "współczynnik kierunkowy" : "slope"],
      ["b", pl ? "punkt przecięcia z osią Y" : "y-intercept"],
      ["x", pl ? "argument funkcji" : "function input"],
      ["f(x)", pl ? "wartość funkcji dla x" : "function value at x"],
    ],
    "quadratic-function": [
      ["a", pl ? "kierunek i szerokość paraboli" : "opening and width"],
      ["p", pl ? "współrzędna x wierzchołka" : "vertex x-coordinate"],
      ["q", pl ? "współrzędna y wierzchołka" : "vertex y-coordinate"],
    ],
    "arithmetic-sequence": [
      ["a₁", pl ? "pierwszy wyraz ciągu" : "first term"],
      ["r", pl ? "różnica ciągu" : "common difference"],
      ["n", pl ? "numer wyrazu" : "term number"],
      ["aₙ", pl ? "wyraz o numerze n" : "nth term"],
    ],
    "geometric-sequence": [
      ["a₁", pl ? "pierwszy wyraz ciągu" : "first term"],
      ["q", pl ? "iloraz ciągu" : "common ratio"],
      ["n", pl ? "numer wyrazu" : "term number"],
    ],
    "classical-probability": [
      ["|A|", pl ? "liczba wyników sprzyjających" : "favourable outcomes"],
      ["|Ω|", pl ? "liczba wszystkich możliwych wyników" : "all possible outcomes"],
    ],
  };

  return (
    map[lessonId] ?? [
      ["x", pl ? "niewiadoma lub argument zależny od zadania" : "unknown or input, depending on the problem"],
      ["dane", pl ? "wartości odczytane z treści zadania" : "values read from the problem statement"],
    ]
  );
}

export function lessonExplanation(lessonId: string, lang: Language) {
  const pl = lang === "pl";
  const detailed: Record<string, string> = {
    "powers-roots": pl
      ? "Potęga to skrócony zapis wielokrotnego mnożenia tej samej liczby. Klucz do większości zadań polega na sprowadzeniu wyrażeń do tej samej podstawy i świadomym użyciu praw działań na potęgach."
      : "A power is shorthand for repeated multiplication. Most problems become simpler once expressions share the same base and exponent rules are applied deliberately.",
    percentages: pl
      ? "Procent opisuje część całości względem stu. W zadaniach wieloetapowych każda kolejna zmiana procentowa działa na aktualną wartość, dlatego dwie przeciwne zmiany procentowe zwykle się nie znoszą."
      : "A percentage describes a part per hundred. In multi-step problems each percentage change acts on the current value, so opposite changes usually do not cancel out.",
    "quadratic-equations": pl
      ? "Równanie kwadratowe opisuje zależność z x². Wyróżnik Δ pozwala szybko ustalić liczbę rozwiązań, a następnie obliczyć pierwiastki wzorem kwadratowym."
      : "A quadratic equation contains x². The discriminant Δ tells us how many real solutions exist and then the quadratic formula gives the roots.",
    "linear-function": pl
      ? "Funkcja liniowa opisuje zmianę ze stałym tempem. Współczynnik a mówi, o ile zmienia się wartość funkcji, gdy x rośnie o 1, a b opisuje wartość początkową."
      : "A linear function changes at a constant rate. The coefficient a is the change in output when x increases by one, while b is the starting value.",
    "quadratic-function": pl
      ? "Funkcja kwadratowa tworzy parabolę. Postać kanoniczna pokazuje wprost wierzchołek, a znak współczynnika a decyduje, czy parabola jest skierowana w górę, czy w dół."
      : "A quadratic function forms a parabola. Vertex form exposes the vertex directly, while the sign of a determines whether the parabola opens upward or downward.",
  };

  return (
    detailed[lessonId] ??
    (pl
      ? "Najpierw zrozum sens zależności i oznaczeń, potem dopiero zapamiętuj wzór. W zadaniu zapisuj dane, wybieraj metodę i po obliczeniu sprawdzaj, czy wynik ma sens."
      : "Understand the relationship and notation before memorising a formula. In every problem identify the data, choose a method and verify whether the result makes sense.")
  );
}
