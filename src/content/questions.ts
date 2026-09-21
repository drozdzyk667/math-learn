export type Locale = "pl" | "en";

export type GeneratedQuestion = {
  id: string;
  unitId: string;
  lead: string;
  math: string;
  tail?: string;
  answer: number;
  answerSuffix?: string;
  hint: string;
  hintMath?: string;
  solution: string;
  solutionMath?: string;
  difficulty: "easy" | "medium" | "hard";
};

const int = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const t = (locale: Locale, pl: string, en: string) => (locale === "pl" ? pl : en);
const signed = (value: number) => (value >= 0 ? `+ ${value}` : `- ${Math.abs(value)}`);
const fact = (n: number) => Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);

export function generateQuestion(
  unitId: string,
  locale: Locale,
  seed = Date.now(),
): GeneratedQuestion {
  const token = `${unitId}-${seed}-${Math.random().toString(36).slice(2, 7)}`;

  if (unitId === "real-numbers") {
    const base = int(2, 8);
    const expA = int(2, 5);
    const expB = int(1, 4);
    const expC = expA + expB - 2;
    return {
      id: token,
      unitId,
      difficulty: "easy",
      lead: t(locale, "Oblicz wartość wyrażenia:", "Evaluate:"),
      math: `\\frac{${base}^{${expA}}\\cdot ${base}^{${expB}}}{${base}^{${expC}}}`,
      answer: base ** 2,
      hint: t(locale, "Połącz potęgi o tej samej podstawie.", "Combine powers with the same base."),
      hintMath: "a^m\\cdot a^n=a^{m+n},\\qquad \\frac{a^m}{a^n}=a^{m-n}",
      solution: t(locale, "Po zebraniu wykładników otrzymujemy:", "After combining the exponents:"),
      solutionMath: `${base}^{${expA}+${expB}-${expC}}=${base}^2=${base ** 2}`,
    };
  }

  if (unitId === "algebra") {
    const x = int(2, 7);
    const b = int(1, 6);
    return {
      id: token,
      unitId,
      difficulty: "easy",
      lead: t(locale, `Dla x = ${x} oblicz:`, `For x = ${x}, evaluate:`),
      math: `(x+${b})^2-x^2-${b ** 2}`,
      answer: 2 * x * b,
      hint: t(locale, "Użyj wzoru na kwadrat sumy.", "Use the square-of-a-sum identity."),
      hintMath: "(a+b)^2=a^2+2ab+b^2",
      solution: t(locale, "Po rozwinięciu i redukcji wyrazów:", "Expand and simplify:"),
      solutionMath: `(x+${b})^2-x^2-${b ** 2}=2\\cdot x\\cdot ${b}=2\\cdot ${x}\\cdot ${b}=${2 * x * b}`,
    };
  }

  if (unitId === "equations") {
    const r1 = int(-6, 2);
    const r2 = int(3, 9);
    const sum = r1 + r2;
    const prod = r1 * r2;
    return {
      id: token,
      unitId,
      difficulty: "medium",
      lead: t(locale, "Podaj większy pierwiastek równania:", "Give the larger root of:"),
      math: `x^2${signed(-sum)}x${signed(prod)}=0`,
      answer: Math.max(r1, r2),
      hint: t(locale, "Spróbuj rozłożyć trójmian na czynniki.", "Try factoring the quadratic."),
      hintMath: `(x-${r1})(x-${r2})=0`,
      solution: t(locale, "Równanie ma dwa pierwiastki:", "The equation has two roots:"),
      solutionMath: `x_1=${r1},\\qquad x_2=${r2}`,
    };
  }

  if (unitId === "systems") {
    const x = int(1, 8);
    const y = int(1, 8);
    const s = x + y;
    const d = x - y;
    return {
      id: token,
      unitId,
      difficulty: "medium",
      lead: t(locale, "Rozwiąż układ i podaj wartość x:", "Solve the system and give x:"),
      math: `\\begin{cases}x+y=${s}\\\\x-y=${d}\\end{cases}`,
      answer: x,
      hint: t(locale, "Dodaj równania stronami.", "Add the equations side by side."),
      hintMath: `2x=${s + d}`,
      solution: t(locale, "Po dodaniu równań:", "After adding the equations:"),
      solutionMath: `2x=${s + d}\\Rightarrow x=${x}`,
    };
  }

  if (unitId === "functions") {
    const a = pick([-3, -2, 2, 3, 4]);
    const b = int(-6, 6);
    const x = int(-4, 5);
    return {
      id: token,
      unitId,
      difficulty: "easy",
      lead: t(locale, `Dla x = ${x} oblicz wartość funkcji:`, `For x = ${x}, evaluate:`),
      math: `f(x)=${a}x${signed(b)}`,
      answer: a * x + b,
      hint: t(locale, "Podstaw podany argument w miejsce x.", "Substitute the given value for x."),
      solution: t(locale, "Po podstawieniu:", "After substitution:"),
      solutionMath: `f(${x})=${a}\\cdot(${x})${signed(b)}=${a * x + b}`,
    };
  }

  if (unitId === "sequences") {
    const a1 = int(1, 8);
    const r = int(2, 7);
    const n = int(5, 12);
    const answer = a1 + (n - 1) * r;
    return {
      id: token,
      unitId,
      difficulty: "medium",
      lead: t(locale, "Dany jest ciąg arytmetyczny:", "An arithmetic sequence is given:"),
      math: `a_1=${a1},\\qquad r=${r}`,
      tail: t(locale, `Oblicz a_${n}.`, `Find a_${n}.`),
      answer,
      hint: t(locale, "Skorzystaj ze wzoru na wyraz n-ty.", "Use the nth-term formula."),
      hintMath: "a_n=a_1+(n-1)r",
      solution: t(locale, "Podstawiamy dane do wzoru:", "Substitute into the formula:"),
      solutionMath: `a_${n}=${a1}+(${n}-1)\\cdot${r}=${answer}`,
    };
  }

  if (unitId === "trigonometry") {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]] as const;
    const [a, b, c] = pick([...triples]);
    return {
      id: token,
      unitId,
      difficulty: "medium",
      lead: t(
        locale,
        `W trójkącie prostokątnym przyprostokątne mają długości ${a} i ${b}. Oblicz przeciwprostokątną c.`,
        `A right triangle has legs ${a} and ${b}. Find the hypotenuse c.`,
      ),
      math: `c=\\sqrt{${a}^2+${b}^2}`,
      answer: c,
      hint: t(locale, "Zastosuj twierdzenie Pitagorasa.", "Use the Pythagorean theorem."),
      hintMath: "a^2+b^2=c^2",
      solution: t(locale, "Po podstawieniu:", "After substitution:"),
      solutionMath: `c=\\sqrt{${a}^2+${b}^2}=${c}`,
    };
  }

  if (unitId === "planimetry") {
    const base = int(4, 14);
    const h = int(3, 10);
    const answer = (base * h) / 2;
    return {
      id: token,
      unitId,
      difficulty: "easy",
      lead: t(
        locale,
        `Trójkąt ma podstawę a = ${base} i wysokość h = ${h}. Oblicz jego pole.`,
        `A triangle has base a = ${base} and height h = ${h}. Find its area.`,
      ),
      math: "P=\\frac{a\\cdot h}{2}",
      answer,
      hint: t(locale, "Podstaw długość podstawy i wysokości do wzoru.", "Substitute the base and height into the formula."),
      solution: t(locale, "Pole trójkąta wynosi:", "The area is:"),
      solutionMath: `P=\\frac{${base}\\cdot${h}}{2}=${answer}`,
    };
  }

  if (unitId === "analytic-geometry") {
    const x1 = int(-5, 3);
    const y1 = int(-5, 3);
    const pair = pick([[3, 4], [4, 3], [6, 8], [8, 6]] as const);
    const [dx, dy] = pair;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const answer = Number(dist.toFixed(4));
    return {
      id: token,
      unitId,
      difficulty: "medium",
      lead: t(locale, "Oblicz odległość punktów:", "Find the distance between:"),
      math: `A=(${x1},${y1}),\\qquad B=(${x1 + dx},${y1 + dy})`,
      answer,
      hint: t(locale, "Użyj wzoru na odległość punktów.", "Use the distance formula."),
      hintMath: "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}",
      solution: t(locale, "Różnice współrzędnych dają:", "The coordinate differences give:"),
      solutionMath: `d=\\sqrt{${dx}^2+${dy}^2}=${answer}`,
    };
  }

  if (unitId === "stereometry") {
    const a = int(2, 8);
    const b = int(2, 8);
    const h = int(2, 8);
    const answer = a * b * h;
    return {
      id: token,
      unitId,
      difficulty: "easy",
      lead: t(
        locale,
        `Prostopadłościan ma wymiary ${a}, ${b} i ${h}. Oblicz jego objętość.`,
        `A cuboid has side lengths ${a}, ${b} and ${h}. Find its volume.`,
      ),
      math: "V=a\\cdot b\\cdot h",
      answer,
      hint: t(locale, "Pomnóż długość, szerokość i wysokość.", "Multiply length, width and height."),
      solution: t(locale, "Objętość wynosi:", "The volume is:"),
      solutionMath: `V=${a}\\cdot${b}\\cdot${h}=${answer}`,
    };
  }

  if (unitId === "combinatorics") {
    const n = int(5, 9);
    const answer = fact(n);
    return {
      id: token,
      unitId,
      difficulty: "medium",
      lead: t(
        locale,
        `Na ile sposobów można ustawić ${n} różnych książek w jednym rzędzie?`,
        `In how many ways can ${n} distinct books be arranged in one row?`,
      ),
      math: `P_${n}=${n}!`,
      answer,
      hint: t(locale, "To permutacja wszystkich elementów.", "This is a permutation of all elements."),
      hintMath: "P_n=n!",
      solution: t(locale, "Liczba ustawień to:", "The number of arrangements is:"),
      solutionMath: `${n}!=${answer}`,
    };
  }

  if (unitId === "probability") {
    const sides = pick([4, 5, 8, 10]);
    const favourable = int(1, sides - 1);
    const answer = Number(((100 * favourable) / sides).toFixed(2));
    return {
      id: token,
      unitId,
      difficulty: "easy",
      lead: t(
        locale,
        `Mamy ${sides} jednakowo prawdopodobnych wyników, z czego ${favourable} są sprzyjające. Podaj prawdopodobieństwo w procentach.`,
        `There are ${sides} equally likely outcomes and ${favourable} are favourable. Give the probability as a percentage.`,
      ),
      math: "P(A)=\\frac{|A|}{|\\Omega|}",
      answer,
      answerSuffix: "%",
      hint: t(locale, "Podziel liczbę wyników sprzyjających przez liczbę wszystkich wyników.", "Divide favourable outcomes by all outcomes."),
      solution: t(locale, "Otrzymujemy:", "We get:"),
      solutionMath: `P(A)=\\frac{${favourable}}{${sides}}=${answer}\\%`,
    };
  }

  const a = int(1, 5);
  const p = int(-6, 6);
  const q = int(-8, 8);
  return {
    id: token,
    unitId: "calculus",
    difficulty: "medium",
    lead: t(locale, "Podaj najmniejszą wartość funkcji:", "Give the minimum value of:"),
    math: `f(x)=${a}(x-${p})^2${signed(q)}`,
    answer: q,
    hint: t(locale, "Odczytaj wierzchołek z postaci kanonicznej.", "Read the vertex from vertex form."),
    hintMath: "f(x)=a(x-p)^2+q",
    solution: t(locale, "Ponieważ a > 0, parabola jest skierowana w górę.", "Since a > 0, the parabola opens upward."),
    solutionMath: `\\min f(x)=q=${q}`,
  };
}

export function generateSet(unitIds: string[], count: number, locale: Locale) {
  const source = unitIds.length
    ? unitIds
    : ["real-numbers", "algebra", "equations", "functions"];
  return Array.from({ length: count }, (_, i) =>
    generateQuestion(source[i % source.length], locale, Date.now() + i),
  );
}
