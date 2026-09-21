export type Locale = "pl" | "en";

export type GeneratedQuestion = {
  id: string;
  unitId: string;
  prompt: string;
  answer: number;
  hint: string;
  solution: string;
  difficulty: "easy" | "medium" | "hard";
};

const int = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const t = (locale: Locale, pl: string, en: string) => (locale === "pl" ? pl : en);

export function generateQuestion(unitId: string, locale: Locale, seed = Date.now()): GeneratedQuestion {
  const token = `${unitId}-${seed}-${Math.random().toString(36).slice(2, 7)}`;

  if (unitId === "real-numbers") {
    const base = int(2, 8); const expA = int(2, 5); const expB = int(1, 4);
    return { id: token, unitId, difficulty: "easy", prompt: t(locale, `Oblicz ${base}^${expA} · ${base}^${expB} / ${base}^${expA + expB - 2}.`, `Calculate ${base}^${expA} · ${base}^${expB} / ${base}^${expA + expB - 2}.`), answer: base ** 2, hint: t(locale, "Przy mnożeniu dodaj wykładniki, przy dzieleniu odejmij.", "Add exponents when multiplying and subtract when dividing."), solution: t(locale, `Wykładnik: ${expA}+${expB}−${expA + expB - 2}=2, więc wynik to ${base}²=${base ** 2}.`, `Exponent: ${expA}+${expB}−${expA + expB - 2}=2, so the result is ${base}²=${base ** 2}.`) };
  }

  if (unitId === "algebra") {
    const a = int(2, 7); const b = int(1, 6);
    return { id: token, unitId, difficulty: "easy", prompt: t(locale, `Dla x = ${a} oblicz wartość (x + ${b})² − x² − ${b ** 2}.`, `For x = ${a}, evaluate (x + ${b})² − x² − ${b ** 2}.`), answer: 2 * a * b, hint: t(locale, "Użyj wzoru (a+b)².", "Use (a+b)²."), solution: t(locale, `(x+${b})²−x²−${b ** 2}=2·x·${b}=2·${a}·${b}=${2 * a * b}.`, `(x+${b})²−x²−${b ** 2}=2·x·${b}=2·${a}·${b}=${2 * a * b}.`) };
  }

  if (unitId === "equations") {
    const r1 = int(-6, 2); const r2 = int(3, 9); const sum = r1 + r2; const prod = r1 * r2;
    return { id: token, unitId, difficulty: "medium", prompt: t(locale, `Równanie x² − (${sum})x + (${prod}) = 0 ma dwa pierwiastki. Podaj większy.`, `The equation x² − (${sum})x + (${prod}) = 0 has two roots. Give the larger one.`), answer: Math.max(r1, r2), hint: t(locale, "Spróbuj rozłożyć trójmian na iloczyn.", "Try factoring the quadratic."), solution: t(locale, `(x−${r1})(x−${r2})=0, więc x=${r1} lub x=${r2}.`, `(x−${r1})(x−${r2})=0, so x=${r1} or x=${r2}.`) };
  }

  if (unitId === "systems") {
    const x = int(1, 8); const y = int(1, 8); const s = x + y; const d = x - y;
    return { id: token, unitId, difficulty: "medium", prompt: t(locale, `Rozwiąż układ x + y = ${s}, x − y = ${d}. Podaj x.`, `Solve x + y = ${s}, x − y = ${d}. Give x.`), answer: x, hint: t(locale, "Dodaj równania stronami.", "Add the equations side by side."), solution: t(locale, `2x=${s + d}, więc x=${x}.`, `2x=${s + d}, so x=${x}.`) };
  }

  if (unitId === "functions") {
    const a = pick([-3, -2, 2, 3, 4]); const b = int(-6, 6); const x = int(-4, 5);
    return { id: token, unitId, difficulty: "easy", prompt: t(locale, `Dana jest funkcja f(x) = ${a}x ${b >= 0 ? "+" : "−"} ${Math.abs(b)}. Oblicz f(${x}).`, `Given f(x) = ${a}x ${b >= 0 ? "+" : "−"} ${Math.abs(b)}, find f(${x}).`), answer: a * x + b, hint: t(locale, "Podstaw argument w miejsce x.", "Substitute the argument for x."), solution: `f(${x})=${a}·${x}${b >= 0 ? "+" : ""}${b}=${a * x + b}.` };
  }

  if (unitId === "sequences") {
    const a1 = int(1, 8); const r = int(2, 7); const n = int(5, 12);
    return { id: token, unitId, difficulty: "medium", prompt: t(locale, `Ciąg arytmetyczny ma a₁=${a1} i r=${r}. Oblicz a${n}.`, `An arithmetic sequence has a₁=${a1} and r=${r}. Find a${n}.`), answer: a1 + (n - 1) * r, hint: t(locale, "aₙ = a₁ + (n−1)r", "aₙ = a₁ + (n−1)r"), solution: `a${n}=${a1}+(${n}−1)·${r}=${a1 + (n - 1) * r}.` };
  }

  if (unitId === "trigonometry") {
    const triples = [[3,4,5],[5,12,13],[8,15,17]] as const; const [a,b,c] = pick([...triples]);
    return { id: token, unitId, difficulty: "medium", prompt: t(locale, `W trójkącie prostokątnym przyprostokątne mają długości ${a} i ${b}. Oblicz przeciwprostokątną.`, `A right triangle has legs ${a} and ${b}. Find the hypotenuse.`), answer: c, hint: t(locale, "Zastosuj twierdzenie Pitagorasa.", "Use the Pythagorean theorem."), solution: `c=√(${a}²+${b}²)=${c}.` };
  }

  if (unitId === "planimetry") {
    const base = int(4, 14); const h = int(3, 10);
    return { id: token, unitId, difficulty: "easy", prompt: t(locale, `Trójkąt ma podstawę ${base} i wysokość ${h}. Oblicz pole.`, `A triangle has base ${base} and height ${h}. Find its area.`), answer: base * h / 2, hint: t(locale, "P = ah/2", "A = bh/2"), solution: `${base}·${h}/2=${base * h / 2}.` };
  }

  if (unitId === "analytic-geometry") {
    const x1 = int(-5, 3), y1 = int(-5, 3), dx = pick([3,4,6,8]), dy = pick([4,3,8,6]);
    const dist = Math.sqrt(dx*dx + dy*dy); const rounded = Number(dist.toFixed(4));
    return { id: token, unitId, difficulty: "medium", prompt: t(locale, `Oblicz odległość punktów A=(${x1},${y1}) i B=(${x1+dx},${y1+dy}).`, `Find the distance between A=(${x1},${y1}) and B=(${x1+dx},${y1+dy}).`), answer: rounded, hint: t(locale, "d = √((x₂−x₁)²+(y₂−y₁)²)", "d = √((x₂−x₁)²+(y₂−y₁)²)"), solution: `d=√(${dx}²+${dy}²)=${rounded}.` };
  }

  if (unitId === "stereometry") {
    const a = int(2, 8), b = int(2, 8), h = int(2, 8);
    return { id: token, unitId, difficulty: "easy", prompt: t(locale, `Prostopadłościan ma wymiary ${a} × ${b} × ${h}. Oblicz objętość.`, `A cuboid measures ${a} × ${b} × ${h}. Find its volume.`), answer: a*b*h, hint: t(locale, "V = abc", "V = abc"), solution: `V=${a}·${b}·${h}=${a*b*h}.` };
  }

  if (unitId === "combinatorics") {
    const n = int(5, 9);
    return { id: token, unitId, difficulty: "medium", prompt: t(locale, `Na ile sposobów można ustawić ${n} różnych książek w rzędzie?`, `In how many ways can ${n} distinct books be arranged in a row?`), answer: Array.from({length:n},(_,i)=>i+1).reduce((a,b)=>a*b,1), hint: t(locale, "To permutacja n elementów: n!.", "This is a permutation of n elements: n!."), solution: `${n}! = ${Array.from({length:n},(_,i)=>i+1).reduce((a,b)=>a*b,1)}.` };
  }

  if (unitId === "probability") {
    const sides = pick([6,8,10,12]); const favourable = int(1, sides-1);
    return { id: token, unitId, difficulty: "easy", prompt: t(locale, `Losujemy jedną z ${sides} jednakowo prawdopodobnych liczb. ${favourable} wyniki są sprzyjające. Podaj prawdopodobieństwo w procentach.`, `One of ${sides} equally likely outcomes is drawn. ${favourable} are favourable. Give the probability as a percentage.`), answer: Number((100*favourable/sides).toFixed(2)), hint: t(locale, "P(A)=liczba sprzyjających / liczba wszystkich.", "P(A)=favourable outcomes / all outcomes."), solution: `P=${favourable}/${sides}=${Number((100*favourable/sides).toFixed(2))}%.` };
  }

  const a = int(1, 5); const p = int(-6, 6); const q = int(-8, 8);
  return { id: token, unitId: "calculus", difficulty: "medium", prompt: t(locale, `Funkcja f(x)=${a}(x−${p})²${q >= 0 ? "+" : "−"}${Math.abs(q)}. Podaj jej najmniejszą wartość.`, `For f(x)=${a}(x−${p})²${q >= 0 ? "+" : "−"}${Math.abs(q)}, give its minimum value.`), answer: q, hint: t(locale, "To postać kanoniczna funkcji kwadratowej.", "This is vertex form of a quadratic."), solution: t(locale, `Ponieważ a>0, minimum jest w wierzchołku i wynosi q=${q}.`, `Since a>0, the minimum is at the vertex and equals q=${q}.`) };
}

export function generateSet(unitIds: string[], count: number, locale: Locale) {
  const source = unitIds.length ? unitIds : ["real-numbers", "algebra", "equations", "functions"];
  return Array.from({ length: count }, (_, i) => generateQuestion(source[i % source.length], locale, Date.now() + i));
}
