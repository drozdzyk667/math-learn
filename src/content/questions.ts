export type Locale = "pl" | "en";
export type QuestionKind = "numeric" | "word" | "mcq";
export type QuestionMode = "mixed" | "quick" | "word";

export type QuestionOption = {
  id: string;
  label: string;
  value: number;
};

export type GeneratedQuestion = {
  id: string;
  unitId: string;
  kind: QuestionKind;
  lead: string;
  math?: string;
  tail?: string;
  answer: number;
  answerSuffix?: string;
  options?: QuestionOption[];
  hint: string;
  hintMath?: string;
  solution: string;
  solutionMath?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
};

const int = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const t = (locale: Locale, pl: string, en: string) =>
  locale === "pl" ? pl : en;
const signed = (value: number) =>
  value >= 0 ? `+ ${value}` : `- ${Math.abs(value)}`;
const fact = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
const tokenFor = (unitId: string, seed: number) =>
  `${unitId}-${seed}-${Math.random().toString(36).slice(2, 7)}`;

function baseQuestion(
  unitId: string,
  locale: Locale,
  token: string,
): GeneratedQuestion {
  if (unitId === "real-numbers") {
    const base = int(2, 8);
    const expA = int(2, 5);
    const expB = int(1, 4);
    const expC = expA + expB - 2;
    return {
      id: token, unitId, kind: "numeric", difficulty: "easy", points: 1,
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
      id: token, unitId, kind: "numeric", difficulty: "easy", points: 1,
      lead: t(locale, `Dla x = ${x} oblicz:`, `For x = ${x}, evaluate:`),
      math: `(x+${b})^2-x^2-${b ** 2}`,
      answer: 2 * x * b,
      hint: t(locale, "Użyj wzoru na kwadrat sumy.", "Use the square-of-a-sum identity."),
      hintMath: "(a+b)^2=a^2+2ab+b^2",
      solution: t(locale, "Rozwiń nawias i zredukuj wyrazy podobne.", "Expand and simplify like terms."),
      solutionMath: `(x+${b})^2-x^2-${b ** 2}=2\\cdot ${x}\\cdot ${b}=${2 * x * b}`,
    };
  }

  if (unitId === "equations") {
    const r1 = int(-6, 2);
    const r2 = int(3, 9);
    const sum = r1 + r2;
    const prod = r1 * r2;
    return {
      id: token, unitId, kind: "numeric", difficulty: "medium", points: 2,
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
      id: token, unitId, kind: "numeric", difficulty: "medium", points: 2,
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
      id: token, unitId, kind: "numeric", difficulty: "easy", points: 1,
      lead: t(locale, `Dla x = ${x} oblicz wartość funkcji:`, `For x = ${x}, evaluate:`),
      math: `f(x)=${a}x${signed(b)}`,
      answer: a * x + b,
      hint: t(locale, "Podstaw argument w miejsce x.", "Substitute the argument for x."),
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
      id: token, unitId, kind: "numeric", difficulty: "medium", points: 2,
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
      id: token, unitId, kind: "numeric", difficulty: "medium", points: 2,
      lead: t(locale, `W trójkącie prostokątnym przyprostokątne mają długości ${a} i ${b}. Oblicz przeciwprostokątną.`, `A right triangle has legs ${a} and ${b}. Find the hypotenuse.`),
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
      id: token, unitId, kind: "numeric", difficulty: "easy", points: 1,
      lead: t(locale, `Trójkąt ma podstawę ${base} i wysokość ${h}. Oblicz jego pole.`, `A triangle has base ${base} and height ${h}. Find its area.`),
      math: "P=\\frac{a\\cdot h}{2}",
      answer,
      hint: t(locale, "Podstaw długość podstawy i wysokości.", "Substitute the base and height."),
      solution: t(locale, "Pole trójkąta wynosi:", "The area is:"),
      solutionMath: `P=\\frac{${base}\\cdot${h}}{2}=${answer}`,
    };
  }

  if (unitId === "analytic-geometry") {
    const x1 = int(-5, 3);
    const y1 = int(-5, 3);
    const [dx, dy] = pick([[3, 4], [4, 3], [6, 8], [8, 6]] as const);
    const answer = Number(Math.sqrt(dx * dx + dy * dy).toFixed(4));
    return {
      id: token, unitId, kind: "numeric", difficulty: "medium", points: 2,
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
      id: token, unitId, kind: "numeric", difficulty: "easy", points: 1,
      lead: t(locale, `Prostopadłościan ma wymiary ${a}, ${b} i ${h}. Oblicz objętość.`, `A cuboid has side lengths ${a}, ${b} and ${h}. Find its volume.`),
      math: "V=a\\cdot b\\cdot h",
      answer,
      hint: t(locale, "Pomnóż trzy wymiary bryły.", "Multiply the three dimensions."),
      solution: t(locale, "Objętość wynosi:", "The volume is:"),
      solutionMath: `V=${a}\\cdot${b}\\cdot${h}=${answer}`,
    };
  }

  if (unitId === "combinatorics") {
    const n = int(5, 8);
    const answer = fact(n);
    return {
      id: token, unitId, kind: "numeric", difficulty: "medium", points: 2,
      lead: t(locale, `Na ile sposobów można ustawić ${n} różnych książek w jednym rzędzie?`, `In how many ways can ${n} distinct books be arranged in one row?`),
      math: `P_${n}=${n}!`,
      answer,
      hint: t(locale, "To permutacja wszystkich elementów.", "This is a permutation of all elements."),
      solution: t(locale, "Liczba ustawień to:", "The number of arrangements is:"),
      solutionMath: `${n}!=${answer}`,
    };
  }

  if (unitId === "probability") {
    const sides = pick([4, 5, 8, 10]);
    const favourable = int(1, sides - 1);
    const answer = Number(((100 * favourable) / sides).toFixed(2));
    return {
      id: token, unitId, kind: "numeric", difficulty: "easy", points: 1,
      lead: t(locale, `Mamy ${sides} jednakowo prawdopodobnych wyników, z czego ${favourable} są sprzyjające. Podaj prawdopodobieństwo w procentach.`, `There are ${sides} equally likely outcomes and ${favourable} are favourable. Give the probability as a percentage.`),
      math: "P(A)=\\frac{|A|}{|\\Omega|}",
      answer, answerSuffix: "%",
      hint: t(locale, "Podziel liczbę wyników sprzyjających przez liczbę wszystkich.", "Divide favourable outcomes by all outcomes."),
      solution: t(locale, "Otrzymujemy:", "We get:"),
      solutionMath: `P(A)=\\frac{${favourable}}{${sides}}=${answer}\\%`,
    };
  }

  const a = int(1, 5);
  const p = int(-6, 6);
  const q = int(-8, 8);
  return {
    id: token, unitId: "calculus", kind: "numeric", difficulty: "medium", points: 2,
    lead: t(locale, "Podaj najmniejszą wartość funkcji:", "Give the minimum value of:"),
    math: `f(x)=${a}(x-${p})^2${signed(q)}`,
    answer: q,
    hint: t(locale, "Odczytaj wierzchołek z postaci kanonicznej.", "Read the vertex from vertex form."),
    hintMath: "f(x)=a(x-p)^2+q",
    solution: t(locale, "Ponieważ a > 0, parabola jest skierowana w górę.", "Since a > 0, the parabola opens upward."),
    solutionMath: `\\min f(x)=q=${q}`,
  };
}

export function generateWordQuestion(
  unitId: string,
  locale: Locale,
  seed = Date.now(),
): GeneratedQuestion {
  const token = tokenFor(unitId, seed);

  if (unitId === "real-numbers") {
    const price = pick([200, 320, 480, 600]);
    const discount = pick([10, 20, 25]);
    const answer = price * (1 - discount / 100);
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Kurtka kosztowała ${price} zł. W czasie promocji cenę obniżono o ${discount}%. Ile kosztuje po obniżce?`, `A jacket cost ${price}. Its price was reduced by ${discount}%. What is the new price?`),
      math: `K=${price}\\left(1-\\frac{${discount}}{100}\\right)`,
      answer,
      answerSuffix: locale === "pl" ? " zł" : "",
      hint: t(locale, "Najpierw policz, jaka część ceny pozostaje po obniżce.", "Find the fraction of the price that remains after the discount."),
      solution: t(locale, "Po obniżce zostaje odpowiednia część ceny początkowej:", "The new price is the remaining fraction of the original price:"),
      solutionMath: `K=${price}\\cdot${1 - discount / 100}=${answer}`,
    };
  }

  if (unitId === "algebra") {
    const w = int(4, 9);
    const x = int(2, 5);
    const answer = (w + x) * (w - 1);
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Prostokąt ma boki długości (a+${x}) oraz (a-1). Dla a=${w} oblicz jego pole.`, `A rectangle has sides (a+${x}) and (a-1). For a=${w}, find its area.`),
      math: `P=(a+${x})(a-1)`,
      answer,
      hint: t(locale, "Najpierw oblicz długości obu boków.", "First calculate both side lengths."),
      solution: t(locale, "Po podstawieniu wartości a:", "After substituting a:"),
      solutionMath: `P=(${w}+${x})(${w}-1)=${answer}`,
    };
  }

  if (unitId === "equations") {
    const years = int(3, 8);
    const age = int(14, 20);
    const target = age + years;
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Olek ma dziś ${age} lat. Za ile lat będzie miał ${target} lat? Ułóż równanie i oblicz x.`, `Olek is ${age} years old today. In how many years will he be ${target}? Form an equation and find x.`),
      math: `${age}+x=${target}`,
      answer: years,
      hint: t(locale, "Niewiadoma x oznacza liczbę lat, które upłyną.", "Let x be the number of years that pass."),
      solution: t(locale, "Odejmujemy obecny wiek od wieku docelowego.", "Subtract the current age from the target age."),
      solutionMath: `x=${target}-${age}=${years}`,
    };
  }

  if (unitId === "systems") {
    const adult = int(20, 35);
    const student = int(10, 18);
    const a = 2;
    const s = 3;
    const total = a * adult + s * student;
    return {
      id: token, unitId, kind: "word", difficulty: "hard", points: 3,
      lead: t(locale, `Do kina kupiono 2 bilety normalne i 3 ulgowe za ${total} zł. Bilet normalny kosztuje ${adult} zł. Ile kosztuje bilet ulgowy?`, `Two adult and three student cinema tickets cost ${total}. An adult ticket costs ${adult}. What is the student ticket price?`),
      math: `2\\cdot${adult}+3x=${total}`,
      answer: student,
      hint: t(locale, "Odejmij koszt biletów normalnych i podziel resztę przez 3.", "Subtract the adult-ticket cost and divide the remainder by 3."),
      solution: t(locale, "Po uporządkowaniu równania:", "After rearranging the equation:"),
      solutionMath: `3x=${total - 2 * adult}\\Rightarrow x=${student}`,
    };
  }

  if (unitId === "functions") {
    const start = int(4, 9);
    const km = int(2, 5);
    const distance = int(6, 15);
    const answer = start + km * distance;
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Taksówka pobiera ${start} zł opłaty początkowej i ${km} zł za każdy kilometr. Ile zapłacisz za kurs długości ${distance} km?`, `A taxi charges ${start} initially and ${km} per kilometre. How much is a ${distance} km ride?`),
      math: `f(x)=${km}x+${start}`,
      answer,
      answerSuffix: locale === "pl" ? " zł" : "",
      hint: t(locale, "Koszt to opłata początkowa plus koszt przejechanych kilometrów.", "Cost equals the initial fee plus the distance charge."),
      solution: t(locale, "Podstawiamy długość kursu:", "Substitute the ride distance:"),
      solutionMath: `f(${distance})=${km}\\cdot${distance}+${start}=${answer}`,
    };
  }

  if (unitId === "sequences") {
    const first = int(20, 50);
    const add = int(5, 15);
    const week = int(6, 12);
    const answer = first + (week - 1) * add;
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `W pierwszym tygodniu Kuba odkłada ${first} zł, a w każdym kolejnym o ${add} zł więcej. Ile odłoży w ${week}. tygodniu?`, `Kuba saves ${first} in week one and ${add} more each following week. How much will he save in week ${week}?`),
      math: `a_n=a_1+(n-1)r`,
      answer,
      hint: t(locale, "Kwoty tworzą ciąg arytmetyczny.", "The weekly amounts form an arithmetic sequence."),
      solution: t(locale, "Korzystamy ze wzoru na wyraz n-ty:", "Use the nth-term formula:"),
      solutionMath: `a_${week}=${first}+(${week}-1)\\cdot${add}=${answer}`,
    };
  }

  if (unitId === "trigonometry") {
    const h = pick([3, 4, 5]);
    const d = pick([4, 12, 12]);
    const answer = Number(Math.sqrt(h * h + d * d).toFixed(2));
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Drabina opiera się o ścianę. Jej dolny koniec stoi ${d} m od ściany, a górny sięga ${h} m wysokości. Jak długa jest drabina?`, `A ladder leans against a wall. Its base is ${d} m from the wall and reaches ${h} m high. How long is the ladder?`),
      math: `l=\\sqrt{${d}^2+${h}^2}`,
      answer,
      answerSuffix: " m",
      hint: t(locale, "Drabina jest przeciwprostokątną.", "The ladder is the hypotenuse."),
      solution: t(locale, "Stosujemy twierdzenie Pitagorasa:", "Apply the Pythagorean theorem:"),
      solutionMath: `l=\\sqrt{${d}^2+${h}^2}=${answer}`,
    };
  }

  if (unitId === "planimetry") {
    const a = int(8, 15);
    const h = int(5, 12);
    const answer = (a * h) / 2;
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Trójkątny fragment działki ma podstawę ${a} m i wysokość ${h} m. Ile metrów kwadratowych ma ten fragment?`, `A triangular plot has a base of ${a} m and height of ${h} m. What is its area?`),
      math: "P=\\frac{ah}{2}",
      answer,
      answerSuffix: " m²",
      hint: t(locale, "Użyj wzoru na pole trójkąta.", "Use the triangle area formula."),
      solution: t(locale, "Pole wynosi:", "The area is:"),
      solutionMath: `P=\\frac{${a}\\cdot${h}}{2}=${answer}`,
    };
  }

  if (unitId === "stereometry") {
    const a = int(20, 40);
    const b = int(15, 30);
    const h = int(20, 35);
    const answer = Number((a * b * h / 1000).toFixed(2));
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `Akwarium ma wymiary ${a} cm × ${b} cm × ${h} cm. Ile litrów wody mieści do pełna? Przyjmij 1 l = 1000 cm³.`, `An aquarium measures ${a} cm × ${b} cm × ${h} cm. How many litres does it hold? Use 1 L = 1000 cm³.`),
      math: `V=${a}\\cdot${b}\\cdot${h}`,
      answer,
      answerSuffix: " l",
      hint: t(locale, "Najpierw policz objętość w cm³, potem podziel przez 1000.", "Find the volume in cm³, then divide by 1000."),
      solution: t(locale, "Po przeliczeniu jednostek:", "After converting units:"),
      solutionMath: `V=\\frac{${a}\\cdot${b}\\cdot${h}}{1000}=${answer}\\text{ l}`,
    };
  }

  if (unitId === "probability") {
    const red = int(2, 5);
    const blue = int(3, 6);
    const all = red + blue;
    const answer = Number(((red / all) * 100).toFixed(2));
    return {
      id: token, unitId, kind: "word", difficulty: "medium", points: 2,
      lead: t(locale, `W pudełku są ${red} czerwone i ${blue} niebieskie kule. Losujemy jedną kulę. Jakie jest prawdopodobieństwo wylosowania czerwonej? Podaj w procentach.`, `A box contains ${red} red and ${blue} blue balls. One ball is drawn. What is the probability of drawing red? Give a percentage.`),
      math: `P(A)=\\frac{${red}}{${all}}`,
      answer,
      answerSuffix: "%",
      hint: t(locale, "Wyniki sprzyjające to czerwone kule, wszystkie wyniki to wszystkie kule.", "Favourable outcomes are red balls; total outcomes are all balls."),
      solution: t(locale, "Prawdopodobieństwo wynosi:", "The probability is:"),
      solutionMath: `P(A)=\\frac{${red}}{${all}}=${answer}\\%`,
    };
  }

  return baseQuestion(unitId, locale, token);
}

export function generateReasoningQuestion(
  unitId: string,
  locale: Locale,
  seed = Date.now(),
): GeneratedQuestion {
  const token = tokenFor(unitId, seed);

  if (unitId === "real-numbers") {
    const price = pick([400, 500, 800, 1000]);
    const increase = pick([10, 20, 25]);
    const discount = pick([10, 20, 25]);
    const answer = Number(
      (price * (1 + increase / 100) * (1 - discount / 100)).toFixed(2),
    );
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `Sklep podniósł cenę roweru kosztującego początkowo ${price} zł o ${increase}%. Tydzień później ogłosił promocję i obniżył nową cenę o ${discount}%. Klient twierdzi, że skoro procent podwyżki i obniżki są podobne, cena prawie wróciła do początkowej. Oblicz końcową cenę roweru i podaj ją w złotych.`,
        `A shop increased the price of a bicycle originally costing ${price} by ${increase}%. A week later it discounted the new price by ${discount}%. A customer claims the price is almost back to the original because the percentages are similar. Calculate the final price.`,
      ),
      math: `K=${price}\\left(1+\\frac{${increase}}{100}\\right)\\left(1-\\frac{${discount}}{100}\\right)`,
      answer,
      answerSuffix: locale === "pl" ? " zł" : "",
      hint: t(
        locale,
        "Druga zmiana procentowa dotyczy już zmienionej ceny, a nie ceny początkowej.",
        "The second percentage change applies to the already changed price, not the original price.",
      ),
      solution: t(
        locale,
        "Najpierw stosujemy podwyżkę, a dopiero do otrzymanej kwoty obniżkę.",
        "Apply the increase first, then the discount to the resulting amount.",
      ),
      solutionMath: `K=${price}\\cdot${1 + increase / 100}\\cdot${1 - discount / 100}=${answer}`,
    };
  }

  if (unitId === "functions") {
    const startA = 8;
    const rateA = 3;
    const startB = 20;
    const rateB = 2;
    const distance = pick([8, 10, 12, 15]);
    const costA = startA + rateA * distance;
    const costB = startB + rateB * distance;
    const answer = Math.min(costA, costB);
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `Dwie firmy taksówkarskie mają różne cenniki. Firma A pobiera ${startA} zł opłaty początkowej i ${rateA} zł za kilometr. Firma B pobiera ${startB} zł na start i ${rateB} zł za kilometr. Planujesz przejazd długości ${distance} km. Oblicz koszt w obu firmach i podaj niższą cenę kursu.`,
        `Two taxi companies use different tariffs. Company A charges ${startA} initially and ${rateA} per kilometre. Company B charges ${startB} initially and ${rateB} per kilometre. You plan a ${distance} km trip. Calculate both costs and give the cheaper price.`,
      ),
      math: `A(x)=${rateA}x+${startA},\\qquad B(x)=${rateB}x+${startB}`,
      answer,
      answerSuffix: locale === "pl" ? " zł" : "",
      hint: t(
        locale,
        "Policz wartości obu funkcji dla tej samej długości trasy i dopiero potem je porównaj.",
        "Evaluate both functions for the same distance, then compare them.",
      ),
      solution: t(locale, "Porównujemy oba koszty:", "Compare both costs:"),
      solutionMath: `A(${distance})=${costA},\\qquad B(${distance})=${costB},\\qquad \\min=${answer}`,
    };
  }

  if (unitId === "sequences") {
    const first = pick([40, 50, 60]);
    const add = pick([10, 15, 20]);
    const weeks = pick([8, 10, 12]);
    const last = first + (weeks - 1) * add;
    const answer = (weeks * (first + last)) / 2;
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `Maja odkłada pieniądze na laptop. W pierwszym tygodniu odkłada ${first} zł, a w każdym kolejnym tygodniu o ${add} zł więcej niż tydzień wcześniej. Chce wiedzieć nie ile odłoży w ostatnim tygodniu, lecz ile pieniędzy zgromadzi łącznie po ${weeks} tygodniach. Oblicz całkowitą kwotę.`,
        `Maja is saving for a laptop. She saves ${first} in week one and ${add} more each following week. She wants the total saved after ${weeks} weeks, not just the final week's amount. Calculate the total.`,
      ),
      math: `S_n=\\frac{n(a_1+a_n)}{2}`,
      answer,
      answerSuffix: locale === "pl" ? " zł" : "",
      hint: t(
        locale,
        "Najpierw oblicz ostatni wyraz ciągu, a następnie sumę wszystkich wyrazów.",
        "First find the last term, then use the sum formula.",
      ),
      solution: t(locale, "Obliczamy ostatni wyraz i sumę:", "Find the last term and then the sum:"),
      solutionMath: `a_${weeks}=${last},\\qquad S_${weeks}=\\frac{${weeks}(${first}+${last})}{2}=${answer}`,
    };
  }

  if (unitId === "systems") {
    const normal = pick([26, 30, 32]);
    const reduced = pick([16, 18, 20]);
    const adults = pick([2, 3, 4]);
    const students = pick([3, 4, 5]);
    const total = adults * normal + students * reduced;
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `Grupa zapłaciła za bilety do muzeum ${total} zł. Kupiono ${adults} bilety normalne i ${students} ulgowe. Bilet normalny kosztuje o ${normal - reduced} zł więcej niż ulgowy. Ile kosztuje bilet ulgowy? Zapisz zależności i sprawdź wynik z łączną kwotą.`,
        `A group paid ${total} for museum tickets: ${adults} adult tickets and ${students} reduced tickets. An adult ticket costs ${normal - reduced} more than a reduced ticket. What is the reduced ticket price? Model the relationships and verify the total.`,
      ),
      math: `\\begin{cases}${adults}x+${students}y=${total}\\\\x-y=${normal - reduced}\\end{cases}`,
      answer: reduced,
      answerSuffix: locale === "pl" ? " zł" : "",
      hint: t(locale, "Nie zgaduj ceny — wykorzystaj oba warunki jednocześnie.", "Use both conditions together rather than guessing."),
      solution: t(locale, "Rozwiązanie układu daje ceny obu typów biletów:", "Solving the system gives both ticket prices:"),
      solutionMath: `x=${normal},\\qquad y=${reduced}`,
    };
  }

  if (unitId === "planimetry") {
    const length = pick([20, 24, 30]);
    const width = pick([12, 15, 18]);
    const path = 1;
    const outer = length * width;
    const inner = (length - 2 * path) * (width - 2 * path);
    const answer = outer - inner;
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `Prostokątny ogród ma wymiary ${length} m × ${width} m. Wzdłuż całego wewnętrznego brzegu ogrodu ma powstać ścieżka o szerokości ${path} m. Oblicz powierzchnię samej ścieżki, a nie całego ogrodu.`,
        `A rectangular garden measures ${length} m by ${width} m. A ${path} m wide path is built all along the inside edge. Find the area of the path only, not the whole garden.`,
      ),
      math: `P_{ścieżki}=P_{zew}-P_{wew}`,
      answer,
      answerSuffix: " m²",
      hint: t(locale, "Odejmij pole mniejszego prostokąta bez ścieżki od pola całego ogrodu.", "Subtract the inner rectangle from the whole garden."),
      solution: t(locale, "Wewnętrzny prostokąt jest krótszy o 2 m w każdym wymiarze.", "The inner rectangle is smaller by 2 m in each dimension."),
      solutionMath: `P=${length}\\cdot${width}-(${length - 2})(${width - 2})=${answer}`,
    };
  }

  if (unitId === "probability") {
    const red = 4;
    const blue = 6;
    const total = red + blue;
    const answer = Number(((red / total) * ((red - 1) / (total - 1)) * 100).toFixed(2));
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `W pudełku są ${red} czerwone i ${blue} niebieskich kul. Losujemy kolejno dwie kule bez zwracania pierwszej. Jakie jest prawdopodobieństwo, że obie wylosowane kule będą czerwone? Podaj wynik w procentach.`,
        `A box contains ${red} red and ${blue} blue balls. Two balls are drawn without replacement. What is the probability that both are red? Give a percentage.`,
      ),
      math: `P=\\frac{${red}}{${total}}\\cdot\\frac{${red - 1}}{${total - 1}}`,
      answer,
      answerSuffix: "%",
      hint: t(locale, "Po pierwszym losowaniu zmienia się zarówno liczba czerwonych kul, jak i liczba wszystkich kul.", "After the first draw, both the number of red balls and the total number change."),
      solution: t(locale, "Mnożymy prawdopodobieństwa kolejnych zdarzeń warunkowych:", "Multiply the probabilities of the consecutive conditional events:"),
      solutionMath: `P=\\frac{${red}}{${total}}\\cdot\\frac{${red - 1}}{${total - 1}}=${answer}\\%`,
    };
  }

  if (unitId === "stereometry") {
    const length = 40;
    const width = 25;
    const height = 30;
    const fill = pick([60, 70, 80]);
    const full = (length * width * height) / 1000;
    const answer = Number((full * fill / 100).toFixed(2));
    return {
      id: token,
      unitId,
      kind: "word",
      difficulty: "hard",
      points: 4,
      lead: t(
        locale,
        `Akwarium ma wymiary ${length} cm × ${width} cm × ${height} cm. Nie jest napełnione do pełna — woda zajmuje ${fill}% jego objętości. Ile litrów wody znajduje się w akwarium? Przyjmij 1 litr = 1000 cm³.`,
        `An aquarium measures ${length} cm × ${width} cm × ${height} cm and is only ${fill}% full. How many litres of water does it contain? Use 1 litre = 1000 cm³.`,
      ),
      math: `V_w=${fill}\\%\\cdot \\frac{${length}\\cdot${width}\\cdot${height}}{1000}`,
      answer,
      answerSuffix: " l",
      hint: t(locale, "Najpierw oblicz pełną pojemność, potem weź odpowiedni procent.", "Find full capacity first, then take the required percentage."),
      solution: t(locale, "Pełna pojemność i faktyczna ilość wody:", "Full capacity and actual amount of water:"),
      solutionMath: `V=${full}\\text{ l},\\qquad V_w=${fill / 100}\\cdot${full}=${answer}\\text{ l}`,
    };
  }

  return generateWordQuestion(unitId, locale, seed);
}

function makeMcq(
  question: GeneratedQuestion,
  locale: Locale,
): GeneratedQuestion {
  const answer = question.answer;
  const scale = Math.max(1, Math.abs(answer) * 0.15);
  const candidates = [
    answer,
    Number((answer + scale).toFixed(2)),
    Number((answer - scale).toFixed(2)),
    Number((answer * 2).toFixed(2)),
    Number((answer / 2).toFixed(2)),
  ];
  const unique = [...new Set(candidates)].slice(0, 4);
  while (unique.length < 4) unique.push(answer + unique.length + 1);
  const shuffled = unique
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }, index) => ({
      id: String.fromCharCode(65 + index),
      label: `${value}${question.answerSuffix ?? ""}`,
      value,
    }));

  return {
    ...question,
    kind: "mcq",
    points: Math.max(1, question.points),
    tail:
      question.tail ??
      t(locale, "Wybierz jedną poprawną odpowiedź.", "Choose one correct answer."),
    options: shuffled,
  };
}

export function generateQuestion(
  unitId: string,
  locale: Locale,
  seed = Date.now(),
  mode: QuestionMode = "mixed",
): GeneratedQuestion {
  const token = tokenFor(unitId, seed);
  if (mode === "quick") return baseQuestion(unitId, locale, token);
  if (mode === "word") return generateWordQuestion(unitId, locale, seed);

  const variant = int(0, 4);
  if (variant === 0) return baseQuestion(unitId, locale, token);
  if (variant === 1) return generateWordQuestion(unitId, locale, seed);
  if (variant === 2) return generateReasoningQuestion(unitId, locale, seed);
  if (variant === 3) return makeMcq(baseQuestion(unitId, locale, token), locale);
  return makeMcq(generateWordQuestion(unitId, locale, seed), locale);
}

export function generateSet(
  unitIds: string[],
  count: number,
  locale: Locale,
) {
  const source = unitIds.length
    ? unitIds
    : ["real-numbers", "algebra", "equations", "functions"];

  return Array.from({ length: count }, (_, i) => {
    const unitId = source[i % source.length];
    const seed = Date.now() + i;
    const pattern = i % 5;
    if (pattern === 0) return generateQuestion(unitId, locale, seed, "quick");
    if (pattern === 1) return generateQuestion(unitId, locale, seed, "word");
    if (pattern === 2) return generateReasoningQuestion(unitId, locale, seed);
    if (pattern === 3)
      return makeMcq(generateQuestion(unitId, locale, seed, "quick"), locale);
    return makeMcq(generateQuestion(unitId, locale, seed, "word"), locale);
  });
}
