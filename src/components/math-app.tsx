"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Flame,
  FlaskConical,
  Languages,
  Lightbulb,
  Lock,
  Moon,
  Play,
  RefreshCcw,
  Sigma,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { curriculum, formulas } from "@/content/curriculum";
import {
  generateQuestion,
  generateSet,
  generateWordQuestion,
  type GeneratedQuestion,
} from "@/content/questions";
import { copy, type Language } from "@/lib/i18n";
import { FunctionLab } from "./function-lab";
import { MathFormula } from "./math";

type View =
  | "home"
  | "path"
  | "knowledge"
  | "formulas"
  | "tasks"
  | "lab"
  | "tests"
  | "exam"
  | "profile";

type Progress = {
  xp: number;
  streak: number;
  completedLessons: string[];
  answered: number;
  correct: number;
};

const initialProgress: Progress = {
  xp: 420,
  streak: 3,
  completedLessons: ["sets-intervals", "powers-roots", "identities"],
  answered: 12,
  correct: 9,
};

const lessonFormulaTex: Record<string, string> = {
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

const formulaTex: Record<string, string> = {
  quadratic: "x_{1,2}=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}",
  identity: "(a+b)^2=a^2+2ab+b^2",
  arith: "a_n=a_1+(n-1)r",
  geom: "a_n=a_1\\cdot q^{n-1}",
  trig: "\\sin^2\\alpha+\\cos^2\\alpha=1",
  circle: "(x-a)^2+(y-b)^2=r^2",
  prob: "P(A)=\\frac{|A|}{|\\Omega|}",
  compound: "K_n=K_0(1+p)^n",
};

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Logo() {
  return (
    <span className="logo">
      <Sigma size={20} />
    </span>
  );
}

export function MathApp() {
  const [lang, setLang] = useState<Language>("pl");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [view, setView] = useState<View>("home");
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [ready, setReady] = useState(false);
  const tr = copy[lang];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLang(readLocal<Language>("mathly-lang", "pl"));
      setTheme(readLocal<"dark" | "light">("mathly-theme", "dark"));
      setProgress(readLocal<Progress>("mathly-progress", initialProgress));
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mathly-theme", JSON.stringify(theme));
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    localStorage.setItem("mathly-lang", JSON.stringify(lang));
  }, [ready, lang]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("mathly-progress", JSON.stringify(progress));
  }, [ready, progress]);

  const totalLessons = curriculum.reduce(
    (sum, unit) => sum + unit.lessons.length,
    0,
  );
  const mastery = Math.round(
    (progress.completedLessons.length / totalLessons) * 100,
  );

  const markLesson = (lessonId: string) => {
    setProgress((previous) => {
      if (previous.completedLessons.includes(lessonId)) return previous;
      return {
        ...previous,
        completedLessons: [...previous.completedLessons, lessonId],
        xp: previous.xp + 35,
        streak: Math.max(previous.streak, 3),
      };
    });
  };

  const nav: Array<{ id: View; label: string; icon: ReactNode }> = [
    { id: "home", label: tr.nav.home, icon: <Sparkles size={18} /> },
    { id: "path", label: tr.nav.path, icon: <Target size={18} /> },
    { id: "knowledge", label: tr.nav.knowledge, icon: <BookOpen size={18} /> },
    { id: "formulas", label: tr.nav.formulas, icon: <BrainCircuit size={18} /> },
    { id: "tasks", label: tr.nav.tasks, icon: <Calculator size={18} /> },
    { id: "lab", label: tr.nav.lab, icon: <FlaskConical size={18} /> },
    { id: "tests", label: tr.nav.tests, icon: <BadgeCheck size={18} /> },
    { id: "exam", label: tr.nav.exam, icon: <Clock3 size={18} /> },
    { id: "profile", label: tr.nav.profile, icon: <CircleUserRound size={18} /> },
  ];

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        {lang === "pl" ? "Przejdź do treści" : "Skip to content"}
      </a>
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("home")}>
          <Logo />
          <span>
            <b>Mathly</b>
            <small>LEARN • SOLVE • MASTER</small>
          </span>
        </button>

        <nav>
          {nav.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "nav active" : "nav"}
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => setView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {(["tasks", "tests", "exam"] as View[]).includes(item.id) && <em>NEW</em>}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="mastery-mini">
            <span>{tr.mastery}</span>
            <b>{mastery}%</b>
            <div><i style={{ width: mastery + "%" }} /></div>
          </div>
          <div className="settings">
            <button
              aria-label={lang === "pl" ? "Switch to English" : "Przełącz na polski"}
              onClick={() => setLang(lang === "pl" ? "en" : "pl")}
            >
              <Languages size={16} /> {lang.toUpperCase()}
            </button>
            <button
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      <main className="main" id="main-content" tabIndex={-1}>
        <header className="topbar">
          <div className="top-pills">
            <span><Flame size={16} /> {progress.streak}</span>
            <span><Zap size={16} /> {progress.xp} XP</span>
            <b className="avatar">M</b>
          </div>
        </header>

        <div className="content">
          {view === "home" && (
            <Home
              lang={lang}
              progress={progress}
              mastery={mastery}
              setView={setView}
              markLesson={markLesson}
            />
          )}
          {view === "path" && (
            <Path
              lang={lang}
              completed={progress.completedLessons}
              markLesson={markLesson}
            />
          )}
          {view === "knowledge" && <Knowledge lang={lang} />}
          {view === "formulas" && <FormulaCards lang={lang} />}
          {view === "tasks" && (
            <Practice
              lang={lang}
              onOpenKnowledge={() => setView("knowledge")}
              onResult={(ok) =>
                setProgress((p) => ({
                  ...p,
                  answered: p.answered + 1,
                  correct: p.correct + (ok ? 1 : 0),
                  xp: p.xp + (ok ? 20 : 0),
                }))
              }
            />
          )}
          {view === "lab" && (
            <FunctionLab
              labels={{ title: tr.labTitle, sub: tr.labSub }}
              language={lang}
            />
          )}
          {view === "tests" && (
            <Tests
              lang={lang}
              onFinish={(score) =>
                setProgress((p) => ({
                  ...p,
                  xp: p.xp + score * 10,
                  answered: p.answered + 8,
                  correct: p.correct + score,
                }))
              }
            />
          )}
          {view === "exam" && (
            <Exam
              lang={lang}
              completedLessons={progress.completedLessons}
              onFinish={(score, total) =>
                setProgress((p) => ({
                  ...p,
                  xp: p.xp + score * 12,
                  answered: p.answered + total,
                  correct: p.correct + score,
                }))
              }
            />
          )}
          {view === "profile" && (
            <Profile
              lang={lang}
              progress={progress}
              mastery={mastery}
              reset={() => setProgress(initialProgress)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function Home({
  lang,
  progress,
  mastery,
  setView,
  markLesson,
}: {
  lang: Language;
  progress: Progress;
  mastery: number;
  setView: (view: View) => void;
  markLesson: (id: string) => void;
}) {
  const tr = copy[lang];
  const lessons = curriculum.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ lesson, unit })),
  );
  const next =
    lessons.find(({ lesson }) => !progress.completedLessons.includes(lesson.id)) ??
    lessons[0];

  return (
    <>
      <section className="hero panel">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            {lang === "pl" ? " TWOJA PRZESTRZEŃ NAUKI" : " PERSONAL LEARNING SPACE"}
          </span>
          <h1>{tr.hello}</h1>
          <p>{tr.subtitle}</p>
          <button className="primary" onClick={() => setView("path")}>
            <Play size={17} fill="currentColor" /> {tr.continue}
          </button>
        </div>
        <div className="math-art" aria-hidden="true">
          <div className="orbit one" />
          <div className="orbit two" />
          <div className="math-core">π<span>√</span><b>∞</b><i>∫</i></div>
        </div>
      </section>

      <section className="stats">
        <Stat
          icon={<Trophy />}
          label={tr.xp}
          value={String(progress.xp)}
          sub={lang === "pl" ? "+120 w tym tygodniu" : "+120 this week"}
        />
        <Stat
          icon={<Flame />}
          label={tr.streak}
          value={String(progress.streak)}
          sub={lang === "pl" ? "dni z rzędu" : "days in a row"}
        />
        <Stat
          icon={<BarChart3 />}
          label={tr.mastery}
          value={mastery + "%"}
          sub={
            progress.completedLessons.length +
            " " +
            (lang === "pl" ? "ukończonych lekcji" : "completed lessons")
          }
        />
        <Stat
          icon={<Target />}
          label={tr.weekly}
          value="3 / 5"
          sub={lang === "pl" ? "sesji nauki" : "study sessions"}
        />
      </section>

      <section className="home-grid">
        <article className="panel continue-card">
          <div className="unit-head">
            <span className={"unit-badge " + next.unit.accent}>
              {next.unit.roman}
            </span>
            <div>
              <small>{tr.recommended}</small>
              <h2>{next.lesson.title[lang]}</h2>
            </div>
            <span className="time">
              <Clock3 size={15} /> {next.lesson.minutes} min
            </span>
          </div>
          <p>{next.lesson.summary[lang]}</p>
          {lessonFormulaTex[next.lesson.id] && (
            <div className="formula">
              <MathFormula tex={lessonFormulaTex[next.lesson.id]} display />
            </div>
          )}
          <div className="actions">
            <button
              className="primary small"
              onClick={() => markLesson(next.lesson.id)}
            >
              <CheckCircle2 size={16} /> {tr.markDone}
            </button>
            <button className="ghost" onClick={() => setView("path")}>
              {tr.nav.path} <ChevronRight size={16} />
            </button>
          </div>
        </article>

        <article className="panel daily">
          <div className="section-title">
            <b>{tr.todayPlan}</b>
            <small>~35 min</small>
          </div>
          {[
            [tr.nav.path, next.lesson.title[lang], "12 min", "path"],
            [tr.nav.tasks, lang === "pl" ? "4 zadania" : "4 problems", "15 min", "tasks"],
            [tr.nav.formulas, lang === "pl" ? "8 fiszek" : "8 cards", "8 min", "formulas"],
          ].map((item, index) => (
            <button key={String(item[3])} onClick={() => setView(item[3] as View)}>
              <span>{index + 1}</span>
              <div><b>{item[0]}</b><small>{item[1]}</small></div>
              <em>{item[2]}</em>
            </button>
          ))}
        </article>
      </section>

      <PageHead
        eyebrow={lang === "pl" ? "TRYBY NAUKI" : "LEARNING MODES"}
        title={lang === "pl" ? "Ucz się różnymi sposobami" : "Learn in different ways"}
        text={
          lang === "pl"
            ? "Teoria, praktyka, klasówki i tryb egzaminacyjny korzystają z jednego wspólnego postępu."
            : "Theory, practice, unit tests and exam mode all share one progress system."
        }
      />

      <section className="mode-grid">
        {[
          ["knowledge", <BookOpen key="knowledge" />, tr.nav.knowledge, lang === "pl" ? "Krótka teoria, przykłady i typowe pułapki." : "Concise theory, examples and common traps."],
          ["tasks", <Calculator key="tasks" />, tr.nav.tasks, lang === "pl" ? "Losowane warianty z pełnymi rozwiązaniami." : "Randomised variants with worked solutions."],
          ["tests", <BadgeCheck key="tests" />, tr.nav.tests, lang === "pl" ? "Arkusz klasówki po każdym dziale." : "A paper-style test after every unit."],
          ["exam", <Clock3 key="exam" />, tr.nav.exam, lang === "pl" ? "60 minut z przerobionych działów." : "60 minutes based on covered units."],
        ].map(([id, icon, title, desc]) => (
          <button
            key={String(id)}
            className="mode-card panel"
            onClick={() => setView(id as View)}
          >
            <span>{icon}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
            <ChevronRight size={18} />
          </button>
        ))}
      </section>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="stat panel">
      <span>{icon}</span>
      <div><small>{label}</small><b>{value}</b><em>{sub}</em></div>
    </div>
  );
}

function getLessonVariables(lessonId: string, lang: Language) {
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
      ["Δ", pl ? "wyróżnik: b² − 4ac" : "discriminant: b² − 4ac"],
      ["x₁, x₂", pl ? "pierwiastki równania" : "equation roots"],
    ],
    "linear-function": [
      ["a", pl ? "współczynnik kierunkowy" : "slope"],
      ["b", pl ? "punkt przecięcia z osią Y" : "y-intercept"],
      ["x", pl ? "argument funkcji" : "function input"],
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
    ],
    "classical-probability": [
      ["|A|", pl ? "liczba wyników sprzyjających" : "favourable outcomes"],
      ["|Ω|", pl ? "liczba wszystkich możliwych wyników" : "all possible outcomes"],
    ],
  };
  return map[lessonId] ?? [
    ["x", pl ? "niewiadoma lub argument zależny od zadania" : "unknown or input, depending on the problem"],
    ["dane", pl ? "wartości podane w treści zadania" : "values given in the problem"],
  ];
}

function Path({
  lang,
  completed,
  markLesson,
}: {
  lang: Language;
  completed: string[];
  markLesson: (id: string) => void;
}) {
  const tr = copy[lang];
  const [selected, setSelected] = useState({
    unitId: curriculum[0].id,
    lessonId: curriculum[0].lessons[0].id,
  });
  const [lessonOpen, setLessonOpen] = useState(false);

  const selectedUnit =
    curriculum.find((unit) => unit.id === selected.unitId) ?? curriculum[0];
  const selectedLesson =
    selectedUnit.lessons.find((lesson) => lesson.id === selected.lessonId) ??
    selectedUnit.lessons[0];
  const doneInUnit = selectedUnit.lessons.filter((lesson) =>
    completed.includes(lesson.id),
  ).length;
  const unitProgress = Math.round((doneInUnit / selectedUnit.lessons.length) * 100);
  const previewQuestion = generateQuestion(selected.unitId, lang, 20260921, "quick");
  const wordQuestion = generateWordQuestion(selected.unitId, lang, 20260922);

  const selectLesson = (unitId: string, lessonId: string) => {
    setSelected({ unitId, lessonId });
    setLessonOpen(false);
  };

  return (
    <>
      <PageHead
        eyebrow={lang === "pl" ? "PROGRAM" : "CURRICULUM"}
        title={tr.curriculum}
        text={
          lang === "pl"
            ? "Ścieżka to pełne lekcje krok po kroku: teoria, znaczenie symboli, przykłady, zadania podstawowe i część zaawansowana."
            : "The path contains complete step-by-step lessons: theory, symbol meanings, examples, core practice and advanced material."
        }
      />

      <div className="learning-path-shell">
        <div className="path-list">
          {curriculum.map((unit, unitIndex) => {
            const done = unit.lessons.filter((lesson) =>
              completed.includes(lesson.id),
            ).length;
            const unitSelected = selected.unitId === unit.id;

            return (
              <section
                className={unitSelected ? "unit panel selected-unit" : "unit panel"}
                key={unit.id}
              >
                <div className="unit-title">
                  <span className={"unit-badge " + unit.accent}>{unit.roman}</span>
                  <div>
                    <small>{lang === "pl" ? "MODUŁ" : "UNIT"} {unitIndex + 1}</small>
                    <h2>{unit.title[lang]}</h2>
                    <p>{unit.short[lang]}</p>
                  </div>
                  <div className="unit-progress">
                    <b>{Math.round((done / unit.lessons.length) * 100)}%</b>
                    <span><i style={{ width: (done / unit.lessons.length) * 100 + "%" }} /></span>
                  </div>
                </div>

                <div className="lesson-list">
                  {unit.lessons.map((lesson, lessonIndex) => {
                    const isDone = completed.includes(lesson.id);
                    const isSelected =
                      selected.lessonId === lesson.id &&
                      selected.unitId === unit.id;
                    return (
                      <button
                        key={lesson.id}
                        className={["lesson", isDone ? "done" : "", isSelected ? "selected" : ""].join(" ")}
                        onClick={() => selectLesson(unit.id, lesson.id)}
                      >
                        <span>{isDone ? <CheckCircle2 size={20} /> : <b>{lessonIndex + 1}</b>}</span>
                        <div>
                          <b>{lesson.title[lang]}</b>
                          <small>{lesson.summary[lang]}</small>
                        </div>
                        <em>
                          {lesson.level === "basic" ? tr.basic : tr.extended}
                          {" • "}{lesson.minutes} min
                        </em>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="lesson-preview panel">
          <div className="preview-top">
            <span className={"unit-badge preview-icon " + selectedUnit.accent}>{selectedUnit.icon}</span>
            <div>
              <small>{lang === "pl" ? "PODGLĄD LEKCJI" : "LESSON PREVIEW"}</small>
              <h2>{selectedLesson.title[lang]}</h2>
            </div>
          </div>

          <div className="lesson-progress-card">
            <div>
              <span>{lang === "pl" ? "Postęp działu" : "Unit progress"}</span>
              <b>{unitProgress}%</b>
            </div>
            <div className="lesson-progress-track"><i style={{ width: unitProgress + "%" }} /></div>
            <small>{doneInUnit}/{selectedUnit.lessons.length} {lang === "pl" ? "lekcji ukończonych" : "lessons completed"}</small>
          </div>

          <p>{selectedLesson.summary[lang]}</p>

          <div className="preview-block">
            <span>{lang === "pl" ? "W tej lekcji" : "In this lesson"}</span>
            <ul>
              <li>{lang === "pl" ? "zrozumiesz skąd bierze się wzór i kiedy go używać" : "understand where the formula comes from and when to use it"}</li>
              <li>{lang === "pl" ? "przejdziesz przez przykład krok po kroku" : "walk through an example step by step"}</li>
              <li>{lang === "pl" ? "rozwiążesz zadanie krótkie i opisowe" : "solve a short and a word problem"}</li>
            </ul>
          </div>

          {lessonFormulaTex[selectedLesson.id] && (
            <div className="preview-formula">
              <span>{lang === "pl" ? "Kluczowy wzór" : "Key formula"}</span>
              <MathFormula tex={lessonFormulaTex[selectedLesson.id]} display />
            </div>
          )}

          <div className="preview-actions preview-actions-strong">
            <button className="lesson-start-button" onClick={() => setLessonOpen(true)}>
              <Play size={18} fill="currentColor" />
              {lang === "pl" ? "Rozpocznij lekcję krok po kroku" : "Start step-by-step lesson"}
            </button>
            <button
              className="lesson-complete-button"
              onClick={() => markLesson(selectedLesson.id)}
              disabled={completed.includes(selectedLesson.id)}
            >
              <CheckCircle2 size={18} />
              {completed.includes(selectedLesson.id) ? tr.done : tr.markDone}
            </button>
          </div>
        </aside>
      </div>

      {lessonOpen && (
        <section className="lesson-room panel" aria-label={selectedLesson.title[lang]}>
          <header className="lesson-room-header">
            <div>
              <span className="eyebrow">{lang === "pl" ? "LEKCJA INTERAKTYWNA" : "INTERACTIVE LESSON"}</span>
              <h2>{selectedLesson.title[lang]}</h2>
              <p>{selectedLesson.summary[lang]}</p>
            </div>
            <button className="ghost" onClick={() => setLessonOpen(false)}>
              {lang === "pl" ? "Zamknij" : "Close"} ×
            </button>
          </header>

          <div className="lesson-room-grid">
            <article className="lesson-step">
              <span className="lesson-step-number">1</span>
              <div>
                <small>{lang === "pl" ? "ZROZUM IDEĘ" : "UNDERSTAND THE IDEA"}</small>
                <h3>{selectedUnit.title[lang]}</h3>
                <p>
                  {selectedUnit.short[lang]}{" "}
                  {lang === "pl"
                    ? "Najpierw rozpoznaj, jakie dane masz w zadaniu i czego dokładnie szukasz. Dopiero potem wybieraj wzór."
                    : "First identify the known values and what you need to find. Only then choose a formula."}
                </p>
              </div>
            </article>

            <article className="lesson-step">
              <span className="lesson-step-number">2</span>
              <div>
                <small>{lang === "pl" ? "ROZBIERZ WZÓR" : "BREAK DOWN THE FORMULA"}</small>
                <h3>{lang === "pl" ? "Co oznacza każdy symbol?" : "What does each symbol mean?"}</h3>
                {lessonFormulaTex[selectedLesson.id] ? (
                  <>
                    <div className="lesson-main-formula"><MathFormula tex={lessonFormulaTex[selectedLesson.id]} display /></div>
                    <div className="variable-grid">
                      {getLessonVariables(selectedLesson.id, lang).map(([symbol, meaning]) => (
                        <div key={symbol}><b>{symbol}</b><span>{meaning}</span></div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>{lang === "pl" ? "W tej lekcji nacisk jest na metodę i kolejność działań, nie na jeden wzór." : "This lesson focuses on method and order of operations rather than a single formula."}</p>
                )}
              </div>
            </article>

            <article className="lesson-step lesson-step-wide">
              <span className="lesson-step-number">3</span>
              <div>
                <small>{lang === "pl" ? "PRZYKŁAD KROK PO KROKU" : "STEP-BY-STEP EXAMPLE"}</small>
                <MathProblem question={previewQuestion} />
                <ol className="worked-steps">
                  <li>{lang === "pl" ? "Zapisz dane i określ niewiadomą." : "Write down the known values and the unknown."}</li>
                  <li>{lang === "pl" ? "Wybierz regułę lub wzór pasujący do typu zadania." : "Choose the rule or formula that matches the problem type."}</li>
                  <li>{lang === "pl" ? "Podstaw wartości, policz i sprawdź sens wyniku." : "Substitute, calculate and check whether the result makes sense."}</li>
                </ol>
                <div className="worked-answer">
                  <span>{previewQuestion.solution}</span>
                  {previewQuestion.solutionMath && <MathFormula tex={previewQuestion.solutionMath} display />}
                </div>
              </div>
            </article>

            <article className="lesson-step lesson-practice-card">
              <span className="lesson-step-number">4</span>
              <div>
                <small>{lang === "pl" ? "ZADANIE PODSTAWOWE" : "CORE PRACTICE"}</small>
                <MathProblem question={wordQuestion} compact />
                <span className="level-chip">{lang === "pl" ? "PODSTAWA" : "CORE"}</span>
              </div>
            </article>

            <article className="lesson-step lesson-pro-card">
              <span className="lesson-step-number"><Lock size={16} /></span>
              <div>
                <small>{lang === "pl" ? "ROZSZERZENIE PRO" : "ADVANCED PRO"}</small>
                <h3>{lang === "pl" ? "Zadania wieloetapowe i maturalne" : "Multi-step and exam-style problems"}</h3>
                <p>{lang === "pl" ? "Dłuższe zadania opisowe, łączenie kilku metod, trudniejsze warianty i pełne rozwiązania krok po kroku." : "Longer word problems, multiple methods, harder variants and complete step-by-step solutions."}</p>
                <span className="pro-chip">PRO</span>
              </div>
            </article>
          </div>
        </section>
      )}
    </>
  );
}

function Knowledge({ lang }: { lang: Language }) {
  const tr = copy[lang];
  const [selectedUnitId, setSelectedUnitId] = useState(curriculum[0].id);
  const selectedUnit =
    curriculum.find((unit) => unit.id === selectedUnitId) ?? curriculum[0];

  return (
    <>
      <PageHead
        eyebrow={lang === "pl" ? "BIBLIOTEKA" : "KNOWLEDGE BASE"}
        title={tr.knowledgeTitle}
        text={
          lang === "pl"
            ? "Szybka ściąga do przypomnienia teorii: definicje, wzory, znaczenie symboli i typowe zastosowania. Pełne prowadzenie krok po kroku zostaje w Ścieżce."
            : "A fast reference for definitions, formulas, symbol meanings and typical uses. Full step-by-step teaching stays in the Learning Path."
        }
      />

      <div className="knowledge-shell">
        <aside className="panel knowledge-nav">
          {curriculum.map((unit) => (
            <button
              key={unit.id}
              className={selectedUnit.id === unit.id ? "active" : ""}
              onClick={() => setSelectedUnitId(unit.id)}
            >
              <span className={"knowledge-nav-icon " + unit.accent}>{unit.icon}</span>
              <div><b>{unit.title[lang]}</b><small>{unit.lessons.length} {lang === "pl" ? "tematów" : "topics"}</small></div>
              <ChevronRight size={18} />
            </button>
          ))}
        </aside>

        <article className="panel knowledge-detail">
          <header className="knowledge-detail-header">
            <span className={"knowledge-hero-icon " + selectedUnit.accent}>{selectedUnit.icon}</span>
            <div>
              <small>{lang === "pl" ? "SZYBKA POWTÓRKA" : "QUICK REFERENCE"}</small>
              <h2>{selectedUnit.title[lang]}</h2>
              <p>{selectedUnit.short[lang]}</p>
            </div>
          </header>

          <div className="knowledge-callout">
            <Lightbulb size={20} />
            <div>
              <b>{lang === "pl" ? "Jak korzystać z tej sekcji?" : "How to use this section"}</b>
              <span>{lang === "pl" ? "Przypomnij sobie definicję i wzór. Pełne wyjaśnienie z ćwiczeniami krok po kroku znajdziesz w Ścieżce." : "Recall the definition and formula. Full guided explanations live in the Learning Path."}</span>
            </div>
          </div>

          <div className="knowledge-topic-list">
            {selectedUnit.lessons.map((lesson, index) => (
              <section key={lesson.id} className="knowledge-topic-row">
                <span className="knowledge-topic-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="knowledge-topic-title">
                    <h3>{lesson.title[lang]}</h3>
                    <span>{lesson.level === "basic" ? tr.basic : tr.extended}</span>
                  </div>
                  <p>{lesson.summary[lang]}</p>
                  {lessonFormulaTex[lesson.id] && (
                    <div className="knowledge-formula-large"><MathFormula tex={lessonFormulaTex[lesson.id]} display /></div>
                  )}
                  <div className="knowledge-mini-explanation">
                    <b>{lang === "pl" ? "Zapamiętaj:" : "Remember:"}</b>
                    <span>{lang === "pl" ? "Zwróć uwagę na znaczenie symboli i warunki zastosowania wzoru." : "Pay attention to symbol meanings and when the formula can be used."}</span>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
      <p className="source-note">{tr.sourceNote}</p>
    </>
  );
}

function FormulaCards({ lang }: { lang: Language }) {
  const tr = copy[lang];
  const [flipped, setFlipped] = useState<string[]>([]);

  return (
    <>
      <PageHead
        eyebrow="ACTIVE RECALL"
        title={tr.flashcards}
        text={
          lang === "pl"
            ? "Najpierw spróbuj odtworzyć wzór z pamięci. Dopiero potem odwróć kartę."
            : "Recall the formula from memory first. Then flip the card."
        }
      />
      <div className="flash-grid">
        {formulas.map((card) => {
          const isFlipped = flipped.includes(card.id);
          return (
            <button
              key={card.id}
              className={isFlipped ? "flash panel flipped" : "flash panel"}
              onClick={() =>
                setFlipped((items) =>
                  items.includes(card.id)
                    ? items.filter((id) => id !== card.id)
                    : [...items, card.id],
                )
              }
            >
              <small>{curriculum.find((u) => u.id === card.unitId)?.title[lang]}</small>
              <h3>{card.name[lang]}</h3>
              {isFlipped ? (
                <>
                  <div className="flash-formula">
                    <MathFormula tex={formulaTex[card.id] ?? card.formula} display />
                  </div>
                  <p>{card.note[lang]}</p>
                </>
              ) : (
                <span className="flip-hint">{tr.flip}</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function MathProblem({
  question,
  compact = false,
}: {
  question: GeneratedQuestion;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "math-problem compact" : "math-problem"}>
      <p>{question.lead}</p>
      <MathFormula tex={question.math} display />
      {question.tail && <p>{question.tail}</p>}
    </div>
  );
}

const practiceContext: Record<
  string,
  {
    tip: Record<Language, string>;
    curiosity: Record<Language, string>;
    trap: Record<Language, string>;
  }
> = {
  "real-numbers": {
    tip: { pl: "Najpierw sprowadź potęgi do tej samej podstawy, dopiero potem licz.", en: "Bring powers to the same base before calculating." },
    curiosity: { pl: "Logarytmy zamieniają mnożenie w dodawanie — dlatego przez stulecia przyspieszały obliczenia astronomiczne.", en: "Logarithms turn multiplication into addition, which is why they once sped up astronomical calculations." },
    trap: { pl: "Nie dodawaj wykładników przy dodawaniu potęg — ta reguła działa tylko przy mnożeniu.", en: "Do not add exponents when adding powers; that rule only applies to multiplication." },
  },
  algebra: {
    tip: { pl: "Szukaj wspólnego czynnika i wzorów skróconego mnożenia zanim zaczniesz rozwijać wszystko po kolei.", en: "Look for a common factor or an identity before expanding everything." },
    curiosity: { pl: "Symboliczna algebra pozwala jednym wzorem opisać nieskończenie wiele konkretnych obliczeń.", en: "Symbolic algebra lets one formula describe infinitely many concrete calculations." },
    trap: { pl: "W (a+b)² najczęściej gubi się środkowy składnik 2ab.", en: "The most common mistake in (a+b)² is forgetting the middle term 2ab." },
  },
  equations: {
    tip: { pl: "Po rozwiązaniu równania podstaw wynik z powrotem — szybka kontrola często wychwytuje błąd znaku.", en: "Substitute your result back into the equation to catch sign errors." },
    curiosity: { pl: "Wyróżnik Δ mówi nie tylko jak liczyć pierwiastki, ale też ile punktów przecięcia z osią X ma parabola.", en: "The discriminant Δ tells you both how to find roots and how many x-axis intersections a parabola has." },
    trap: { pl: "Przy przenoszeniu wyrazu na drugą stronę pamiętaj o zmianie znaku.", en: "When moving a term across the equals sign, remember to change its sign." },
  },
  systems: {
    tip: { pl: "Wybierz metodę, która najszybciej eliminuje jedną niewiadomą.", en: "Choose the method that eliminates one variable fastest." },
    curiosity: { pl: "Geometrycznie rozwiązanie układu dwóch równań liniowych to punkt przecięcia dwóch prostych.", en: "Geometrically, solving two linear equations means finding where two lines intersect." },
    trap: { pl: "Mnożąc całe równanie, pomnóż każdy jego składnik — także wyraz wolny.", en: "When multiplying an equation, multiply every term, including the constant." },
  },
  functions: {
    tip: { pl: "Zawsze zacznij od dziedziny, potem miejsc zerowych i monotoniczności.", en: "Start with the domain, then zeros and monotonicity." },
    curiosity: { pl: "Ten sam kształt wykresu może opisywać drogę, koszt, temperaturę albo wzrost populacji.", en: "The same graph shape can model distance, cost, temperature or population growth." },
    trap: { pl: "Nie myl f(x) z iloczynem f·x — to wartość funkcji dla argumentu x.", en: "Do not read f(x) as f times x; it is the value of the function at x." },
  },
  sequences: {
    tip: { pl: "Najpierw rozpoznaj: stała różnica oznacza ciąg arytmetyczny, stały iloraz — geometryczny.", en: "A constant difference means arithmetic; a constant ratio means geometric." },
    curiosity: { pl: "Ciągi geometryczne pojawiają się m.in. w procencie składanym i modelach wzrostu.", en: "Geometric sequences appear in compound interest and growth models." },
    trap: { pl: "We wzorze na aₙ występuje n−1, nie n.", en: "The nth-term formula uses n−1, not n." },
  },
  trigonometry: {
    tip: { pl: "Zaznacz przeciwprostokątną i bok naprzeciw wybranego kąta zanim wybierzesz funkcję.", en: "Mark the hypotenuse and the side opposite the angle before choosing a ratio." },
    curiosity: { pl: "Trygonometria pozwala mierzyć odległości, których nie da się zmierzyć bezpośrednio.", en: "Trigonometry can measure distances that cannot be measured directly." },
    trap: { pl: "Sprawdź tryb kalkulatora: stopnie i radiany dają zupełnie inne wyniki.", en: "Check the calculator mode: degrees and radians give very different results." },
  },
  planimetry: {
    tip: { pl: "Zanim liczysz, dopisz na rysunku wszystkie znane długości i kąty.", en: "Before calculating, label all known lengths and angles on the diagram." },
    curiosity: { pl: "Podobieństwo figur jest podstawą skal map, modeli i wielu pomiarów pośrednich.", en: "Similarity underpins map scales, models and many indirect measurements." },
    trap: { pl: "Przy zmianie skali k pola rosną k² razy, a nie k razy.", en: "If lengths scale by k, areas scale by k², not k." },
  },
  "analytic-geometry": {
    tip: { pl: "Traktuj współrzędne jak dane do wzoru i pilnuj nawiasów przy liczbach ujemnych.", en: "Treat coordinates as formula inputs and use brackets around negative values." },
    curiosity: { pl: "Geometria analityczna połączyła algebrę z geometrią w jeden język.", en: "Analytic geometry joined algebra and geometry into one language." },
    trap: { pl: "W odległości punktów obie różnice współrzędnych są podnoszone do kwadratu.", en: "In the distance formula, both coordinate differences are squared." },
  },
  stereometry: {
    tip: { pl: "Narysuj bryłę pomocniczo i zaznacz wysokość prostopadłą do podstawy.", en: "Sketch the solid and mark the height perpendicular to the base." },
    curiosity: { pl: "Przekrój przestrzennej bryły często zamienia trudne zadanie 3D w zwykłą geometrię 2D.", en: "A cross-section often turns a hard 3D problem into ordinary 2D geometry." },
    trap: { pl: "Nie myl wysokości ściany bocznej z wysokością całej bryły.", en: "Do not confuse a slant height with the solid's perpendicular height." },
  },
  combinatorics: {
    tip: { pl: "Najpierw odpowiedz: czy kolejność ma znaczenie i czy elementy mogą się powtarzać?", en: "First ask whether order matters and whether repetition is allowed." },
    curiosity: { pl: "Kombinatoryka stoi za liczeniem możliwości w kryptografii, algorytmach i prawdopodobieństwie.", en: "Combinatorics powers counting in cryptography, algorithms and probability." },
    trap: { pl: "Kombinacji używamy, gdy kolejność nie ma znaczenia.", en: "Use combinations only when order does not matter." },
  },
  probability: {
    tip: { pl: "Zdefiniuj przestrzeń wszystkich wyników zanim zaczniesz liczyć zdarzenie.", en: "Define the full sample space before counting the event." },
    curiosity: { pl: "Prawdopodobieństwo 50% nie oznacza, że w dwóch próbach dokładnie raz zajdzie zdarzenie.", en: "A 50% probability does not mean an event must happen exactly once in two trials." },
    trap: { pl: "Nie zakładaj jednakowego prawdopodobieństwa wyników, jeśli zadanie tego nie gwarantuje.", en: "Do not assume outcomes are equally likely unless the problem guarantees it." },
  },
  calculus: {
    tip: { pl: "W optymalizacji najpierw zapisz wielkość, którą maksymalizujesz lub minimalizujesz jako funkcję jednej zmiennej.", en: "In optimisation, first express the quantity to maximise or minimise as a function of one variable." },
    curiosity: { pl: "Pochodna opisuje chwilowe tempo zmiany — od prędkości auta po tempo wzrostu kosztu.", en: "A derivative describes an instantaneous rate of change, from vehicle speed to cost growth." },
    trap: { pl: "Punkt, w którym pochodna jest równa zero, nie zawsze jest ekstremum.", en: "A point where the derivative is zero is not always an extremum." },
  },
};

function Practice({
  lang,
  onOpenKnowledge,
  onResult,
}: {
  lang: Language;
  onOpenKnowledge: () => void;
  onResult: (correct: boolean) => void;
}) {
  const tr = copy[lang];
  const [unitId, setUnitId] = useState("real-numbers");
  const [question, setQuestion] = useState(() =>
    generateQuestion("real-numbers", lang),
  );
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setQuestion(generateQuestion(unitId, lang));
      setAnswer("");
      setState("idle");
      setShowHint(false);
      setShowSolution(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [unitId, lang]);

  const randomise = () => {
    setQuestion(generateQuestion(unitId, lang));
    setAnswer("");
    setState("idle");
    setShowHint(false);
    setShowSolution(false);
  };

  const check = () => {
    const parsed = Number(answer.replace(",", "."));
    const ok = Number.isFinite(parsed) && Math.abs(parsed - question.answer) < 0.011;
    setState(ok ? "correct" : "wrong");
    onResult(ok);
  };

  const difficulty =
    question.difficulty === "easy"
      ? lang === "pl" ? "ŁATWE" : "EASY"
      : question.difficulty === "medium"
        ? lang === "pl" ? "ŚREDNIE" : "MEDIUM"
        : lang === "pl" ? "TRUDNE" : "HARD";

  const selectedUnit =
    curriculum.find((unit) => unit.id === unitId) ?? curriculum[0];
  const keyLesson = selectedUnit.lessons.find(
    (lesson) => Boolean(lessonFormulaTex[lesson.id]),
  );
  const context = practiceContext[unitId] ?? practiceContext["real-numbers"];

  return (
    <>
      <PageHead
        eyebrow={lang === "pl" ? "TRENING" : "PRACTICE ENGINE"}
        title={tr.tasksTitle}
        text={
          lang === "pl"
            ? "Każde losowanie daje inny wariant. Uczysz się metody rozwiązania, a nie jednej odpowiedzi."
            : "Every draw creates a new variant, so you learn the method rather than memorising an answer."
        }
      />

      <div className="practice-grid">
        <aside className="panel topic-list">
          {curriculum.map((unit) => (
            <button
              key={unit.id}
              className={unitId === unit.id ? "active" : ""}
              onClick={() => setUnitId(unit.id)}
            >
              <span>{unit.icon}</span>{unit.title[lang]}
            </button>
          ))}
        </aside>

        <div className="practice-workspace">
          <section className="panel problem">
          <div className="problem-meta"><span>{difficulty}</span></div>
          <MathProblem question={question} />

          <div className="answer-box">
            <label>{lang === "pl" ? "Twoja odpowiedź" : "Your answer"}</label>
            <div>
              <div className="answer-input-wrap">
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && check()}
                  inputMode="decimal"
                  placeholder="="
                  aria-label={lang === "pl" ? "Twoja odpowiedź" : "Your answer"}
                />
                {question.answerSuffix && <span>{question.answerSuffix}</span>}
              </div>
              <button className="primary" onClick={check}>{tr.check}</button>
            </div>
          </div>

          {state !== "idle" && (
            <div
              className={state === "correct" ? "feedback good" : "feedback bad"}
              role="status"
              aria-live="polite"
            >
              {state === "correct" ? <CheckCircle2 /> : <Lightbulb />}
              <b>{state === "correct" ? tr.correct : tr.wrong}</b>
            </div>
          )}

          <div className="problem-actions">
            <button
              className="hint-action"
              aria-expanded={showHint}
              aria-controls="practice-hint"
              onClick={() => setShowHint((value) => !value)}
            >
              <Lightbulb size={17} /> {tr.hint}
            </button>
            <button
              className="solution-action"
              aria-expanded={showSolution}
              aria-controls="practice-solution"
              onClick={() => setShowSolution((value) => !value)}
            >
              <BookOpen size={17} /> {tr.solution}
            </button>
            <button className="randomize-action" onClick={randomise}>
              <RefreshCcw size={17} /> {tr.newVariant}
            </button>
          </div>

          <div className="reveal-slot">
            {showHint && (
              <div className="reveal hint-reveal" id="practice-hint">
                <Lightbulb size={17} />
                <div>
                  <span>{question.hint}</span>
                  {question.hintMath && <MathFormula tex={question.hintMath} display />}
                </div>
              </div>
            )}
            {showSolution && (
              <div className="reveal solution" id="practice-solution">
                <Sigma size={17} />
                <div>
                  <span>{question.solution}</span>
                  {question.solutionMath && (
                    <MathFormula tex={question.solutionMath} display />
                  )}
                </div>
              </div>
            )}
          </div>
          </section>

          <aside
            className="panel practice-context"
            aria-label={lang === "pl" ? "Teoria do bieżącego zadania" : "Theory for the current problem"}
          >
            <div className="context-heading">
              <span className={"unit-badge " + selectedUnit.accent}>
                {selectedUnit.icon}
              </span>
              <div>
                <small>{lang === "pl" ? "NAUKA + PRAKTYKA" : "LEARN + PRACTISE"}</small>
                <h2>{selectedUnit.title[lang]}</h2>
              </div>
            </div>

            <section className="context-section context-theory">
              <span>{lang === "pl" ? "W pigułce" : "In a nutshell"}</span>
              <p>{selectedUnit.short[lang]}</p>
              {keyLesson && lessonFormulaTex[keyLesson.id] && (
                <div className="context-formula">
                  <MathFormula tex={lessonFormulaTex[keyLesson.id]} display />
                </div>
              )}
            </section>

            <section className="context-section context-tip">
              <span><Lightbulb size={18} /> {lang === "pl" ? "Wskazówka" : "Tip"}</span>
              <p>{context.tip[lang]}</p>
            </section>

            <section className="context-section context-curiosity">
              <span><Sparkles size={18} /> {lang === "pl" ? "Ciekawostka" : "Did you know?"}</span>
              <p>{context.curiosity[lang]}</p>
            </section>

            <section className="context-section context-trap">
              <span><Target size={18} /> {lang === "pl" ? "Typowy błąd" : "Common mistake"}</span>
              <p>{context.trap[lang]}</p>
            </section>

            <button className="context-knowledge-button" onClick={onOpenKnowledge}>
              <BookOpen size={18} />
              {lang === "pl" ? "Otwórz pełną bazę wiedzy" : "Open the full knowledge base"}
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}

function Tests({
  lang,
  onFinish,
}: {
  lang: Language;
  onFinish: (score: number) => void;
}) {
  const tr = copy[lang];
  const [active, setActive] = useState<{
    unitId: string;
    questions: GeneratedQuestion[];
  } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const start = (unitId: string) => {
    setActive({ unitId, questions: generateSet([unitId], 8, lang) });
    setAnswers({});
    setResult(null);
  };

  const finish = () => {
    if (!active) return;
    const score = scoreQuestions(active.questions, answers);
    setResult(score);
    onFinish(score);
  };

  if (active) {
    const unit = curriculum.find((item) => item.id === active.unitId);
    return (
      <Assessment
        lang={lang}
        title={unit?.title[lang] ?? tr.classTests}
        kind="test"
        durationLabel="25 min"
        questions={active.questions}
        answers={answers}
        setAnswers={setAnswers}
        result={result}
        onFinish={finish}
        back={() => setActive(null)}
      />
    );
  }

  return (
    <>
      <PageHead
        eyebrow={lang === "pl" ? "SPRAWDŹ SIĘ" : "CHECKPOINTS"}
        title={tr.classTests}
        text={tr.classTestsSub}
      />
      <div className="test-grid">
        {curriculum.map((unit) => (
          <article className="panel test-card" key={unit.id}>
            <span className={"unit-badge " + unit.accent}>{unit.roman}</span>
            <div>
              <h3>{unit.title[lang]}</h3>
              <p>
                {unit.lessons.length} {lang === "pl" ? "lekcje" : "lessons"}
                {" • "}8 {tr.questions}{" • "}~25 min
              </p>
            </div>
            <button className="primary small" onClick={() => start(unit.id)}>
              {tr.testStart} <ChevronRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function Exam({
  lang,
  completedLessons,
  onFinish,
}: {
  lang: Language;
  completedLessons: string[];
  onFinish: (score: number, total: number) => void;
}) {
  const tr = copy[lang];
  const availableUnits = useMemo(
    () =>
      curriculum
        .filter((unit) =>
          unit.lessons.some((lesson) => completedLessons.includes(lesson.id)),
        )
        .map((unit) => unit.id),
    [completedLessons],
  );

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(3600);
  const [started, setStarted] = useState(false);

  const units = availableUnits.length
    ? availableUnits
    : ["real-numbers", "algebra", "equations", "functions"];

  const finish = useCallback(() => {
    const score = scoreQuestions(questions, answers);
    setResult(score);
    onFinish(score, questions.length);
  }, [answers, onFinish, questions]);

  useEffect(() => {
    if (!started || result !== null) return;
    const id = window.setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [started, result]);

  useEffect(() => {
    if (!(started && remaining === 0 && result === null && questions.length)) {
      return;
    }
    const frame = window.requestAnimationFrame(() => finish());
    return () => window.cancelAnimationFrame(frame);
  }, [started, remaining, result, questions.length, finish]);

  if (started) {
    return (
      <Assessment
        lang={lang}
        title={lang === "pl" ? "Próbna matura z matematyki" : "Mathematics mock exam"}
        kind="exam"
        durationLabel="60 min"
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        result={result}
        onFinish={finish}
        back={() => setStarted(false)}
        timer={remaining}
      />
    );
  }

  return (
    <>
      <PageHead
        eyebrow={lang === "pl" ? "TRYB EGZAMINACYJNY" : "EXAM MODE"}
        title={tr.examTitle}
        text={tr.examSub}
      />
      <section className="panel exam-card">
        <div className="clock">
          <Clock3 size={42} />
          <b>60:00</b>
          <span>{lang === "pl" ? "bez podpowiedzi" : "no hints"}</span>
        </div>
        <div>
          <h2>{lang === "pl" ? "Twój spersonalizowany arkusz" : "Your personalised paper"}</h2>
          <p>
            {lang === "pl"
              ? "12 losowych zadań wyłącznie z działów, które już rozpocząłeś. Każda próba tworzy nowy arkusz."
              : "12 random problems only from units you have started. Every attempt creates a new paper."}
          </p>
          <div className="tags">
            {units.map((id) => (
              <span key={id}>
                {curriculum.find((unit) => unit.id === id)?.title[lang]}
              </span>
            ))}
          </div>
          <button
            className="primary"
            onClick={() => {
              setQuestions(generateSet(units, 12, lang));
              setAnswers({});
              setResult(null);
              setRemaining(3600);
              setStarted(true);
            }}
          >
            <Play size={17} fill="currentColor" /> {tr.examStart}
          </button>
        </div>
      </section>
    </>
  );
}

function scoreQuestions(
  questions: GeneratedQuestion[],
  answers: Record<string, string>,
) {
  return questions.filter((question) => {
    const answer = Number((answers[question.id] ?? "").replace(",", "."));
    return Number.isFinite(answer) && Math.abs(answer - question.answer) < 0.011;
  }).length;
}

function chunkQuestions(questions: GeneratedQuestion[], perPage = 4) {
  const pages: GeneratedQuestion[][] = [];
  for (let i = 0; i < questions.length; i += perPage) {
    pages.push(questions.slice(i, i + perPage));
  }
  return pages;
}

function Assessment({
  lang,
  title,
  kind,
  durationLabel,
  questions,
  answers,
  setAnswers,
  result,
  onFinish,
  back,
  timer,
}: {
  lang: Language;
  title: string;
  kind: "test" | "exam";
  durationLabel: string;
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  result: number | null;
  onFinish: () => void;
  back: () => void;
  timer?: number;
}) {
  const tr = copy[lang];
  const pages = chunkQuestions(questions);
  const [paperZoom, setPaperZoom] = useState(125);
  const paperStyle = {
    "--paper-scale": paperZoom / 100,
  } as CSSProperties;

  return (
    <div className="assessment-screen">
      <div className="assessment-toolbar">
        <button className="ghost" onClick={back}>
          ← {lang === "pl" ? "Wróć" : "Back"}
        </button>
        <div>
          <span>
            {kind === "exam"
              ? lang === "pl" ? "PRÓBNY EGZAMIN" : "MOCK EXAM"
              : lang === "pl" ? "KLASÓWKA" : "UNIT TEST"}
          </span>
          <b>{title}</b>
        </div>
        <div className="assessment-right">
          <div
            className="zoom-controls"
            role="group"
            aria-label={lang === "pl" ? "Powiększenie arkusza" : "Paper zoom"}
          >
            <button
              type="button"
              onClick={() => setPaperZoom((value) => Math.max(80, value - 10))}
              disabled={paperZoom <= 80}
              aria-label={lang === "pl" ? "Pomniejsz arkusz" : "Zoom out"}
            >
              <ZoomOut size={20} />
            </button>
            <span aria-live="polite">{paperZoom}%</span>
            <button
              type="button"
              onClick={() => setPaperZoom((value) => Math.min(150, value + 10))}
              disabled={paperZoom >= 150}
              aria-label={lang === "pl" ? "Powiększ arkusz" : "Zoom in"}
            >
              <ZoomIn size={20} />
            </button>
          </div>
          {timer !== undefined ? (
            <b className="timer">
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </b>
          ) : (
            <b className="timer">{durationLabel}</b>
          )}
        </div>
      </div>

      {result !== null && (
        <div className="result panel">
          <Trophy size={34} />
          <b>{result}/{questions.length}</b>
          <span>{Math.round((result / questions.length) * 100)}%</span>
          <p>
            {result / questions.length >= 0.75
              ? lang === "pl" ? "Bardzo solidny wynik." : "Strong result."
              : lang === "pl"
                ? "Wróć do błędnych typów zadań i spróbuj ponownie."
                : "Review missed problem types and try again."}
          </p>
        </div>
      )}

      <div className="paper-viewport">
        <div className="paper-stack" style={paperStyle}>
        {pages.map((page, pageIndex) => {
          const firstQuestionIndex = pageIndex * 4;
          return (
            <section className="paper-page" key={pageIndex}>
              <header className="paper-header">
                <div className="paper-brand">
                  <span>Σ</span>
                  <div><b>MATHLY</b><small>ARKUSZ MATEMATYCZNY</small></div>
                </div>
                <div className="paper-meta">
                  <span>
                    {kind === "exam"
                      ? lang === "pl" ? "PRÓBNA MATURA" : "MOCK EXAM"
                      : lang === "pl" ? "KLASÓWKA" : "UNIT TEST"}
                  </span>
                  <b>{title}</b>
                  <small>{durationLabel} • {questions.length} {tr.questions}</small>
                </div>
              </header>

              {pageIndex === 0 && (
                <>
                  <div className="paper-student">
                    <label>{lang === "pl" ? "Imię i nazwisko" : "Name"}<span /></label>
                    <label>{lang === "pl" ? "Data" : "Date"}<span /></label>
                  </div>
                  <div className="paper-instructions">
                    <b>{lang === "pl" ? "Instrukcja" : "Instructions"}</b>
                    <span>
                      {lang === "pl"
                        ? "Zapisuj tok rozumowania w wyznaczonym miejscu. Wpisz wynik w polu odpowiedzi."
                        : "Show your reasoning in the working area and enter the final result in the answer field."}
                    </span>
                  </div>
                </>
              )}

              <div className="paper-questions">
                {page.map((question, localIndex) => {
                  const questionIndex = firstQuestionIndex + localIndex;
                  const numeric = Number(
                    (answers[question.id] ?? "").replace(",", "."),
                  );
                  const ok =
                    Number.isFinite(numeric) &&
                    Math.abs(numeric - question.answer) < 0.011;

                  return (
                    <article className="paper-question" key={question.id}>
                      <div className="paper-question-number">{questionIndex + 1}</div>
                      <div className="paper-question-body">
                        <MathProblem question={question} />
                        <div className="paper-answer-row">
                          <label>
                            {lang === "pl" ? "Odpowiedź:" : "Answer:"}
                          </label>
                          <div className="paper-input-wrap">
                            <input
                              disabled={result !== null}
                              value={answers[question.id] ?? ""}
                              onChange={(event) =>
                                setAnswers((current) => ({
                                  ...current,
                                  [question.id]: event.target.value,
                                }))
                              }
                              inputMode="decimal"
                              aria-label={
                                (lang === "pl" ? "Odpowiedź do zadania " : "Answer for question ") +
                                (questionIndex + 1)
                              }
                            />
                            {question.answerSuffix && <span>{question.answerSuffix}</span>}
                          </div>
                          {result !== null && (
                            <b className={ok ? "paper-ok" : "paper-wrong"}>
                              {ok
                                ? "✓"
                                : (lang === "pl" ? "Poprawna: " : "Correct: ") +
                                  question.answer +
                                  (question.answerSuffix ?? "")}
                            </b>
                          )}
                        </div>
                        <div className="working-space" aria-label={lang === "pl" ? "Miejsce na rozwiązanie" : "Working area"} />
                        {result !== null && (
                          <div className="paper-solution">
                            <span>{question.solution}</span>
                            {question.solutionMath && (
                              <MathFormula tex={question.solutionMath} />
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <footer className="paper-footer">
                <span>Mathly</span>
                <span>
                  {lang === "pl" ? "strona" : "page"} {pageIndex + 1}/{pages.length}
                </span>
              </footer>
            </section>
          );
        })}
        </div>
      </div>

      {result === null && (
        <div className="assessment-submit">
          <button className="primary finish" onClick={onFinish}>
            {tr.finish} <CheckCircle2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function Profile({
  lang,
  progress,
  mastery,
  reset,
}: {
  lang: Language;
  progress: Progress;
  mastery: number;
  reset: () => void;
}) {
  const tr = copy[lang];
  const accuracy = progress.answered
    ? Math.round((progress.correct / progress.answered) * 100)
    : 0;
  const level = Math.floor(progress.xp / 250) + 1;

  return (
    <>
      <PageHead
        eyebrow={lang === "pl" ? "PROFIL" : "PROFILE"}
        title={tr.profileTitle}
        text={
          lang === "pl"
            ? "XP i seria pomagają utrzymać rytm, ale najważniejsza pozostaje znajomość materiału."
            : "XP and streaks support consistency, while mastery remains the main metric."
        }
      />

      <section className="panel profile-card">
        <div className="big-avatar">M</div>
        <div>
          <h2>Math Explorer</h2>
          <p>{progress.xp} XP • Level {level}</p>
          <div className="xp-bar">
            <i style={{ width: (progress.xp % 250) / 2.5 + "%" }} />
          </div>
        </div>
        <span className="rank"><Trophy size={17} /> ALGEBRAIST</span>
      </section>

      <section className="stats">
        <Stat icon={<Flame />} label={tr.streak} value={String(progress.streak)} sub={lang === "pl" ? "dni z rzędu" : "consecutive days"} />
        <Stat icon={<BarChart3 />} label={tr.mastery} value={mastery + "%"} sub={progress.completedLessons.length + " " + (lang === "pl" ? "lekcji" : "lessons")} />
        <Stat icon={<Target />} label={lang === "pl" ? "Skuteczność" : "Accuracy"} value={accuracy + "%"} sub={progress.correct + "/" + progress.answered} />
        <Stat icon={<Zap />} label={tr.xp} value={String(progress.xp)} sub={"Level " + level} />
      </section>

      <section className="panel achievements">
        <h3>{lang === "pl" ? "Osiągnięcia" : "Achievements"}</h3>
        <div>
          {[
            ["🔥", "3 DAY", lang === "pl" ? "Trzy dni z rzędu" : "Three-day streak"],
            ["∑", "FIRST STEPS", lang === "pl" ? "Pierwsze lekcje ukończone" : "First lessons completed"],
            ["🎯", "ACCURATE", lang === "pl" ? "75%+ poprawnych odpowiedzi" : "75%+ correct answers"],
            ["🏁", "EXAM READY", lang === "pl" ? "Ukończ próbny egzamin" : "Complete a mock exam"],
          ].map((item, index) => (
            <article
              className={index < 3 ? "achievement unlocked" : "achievement"}
              key={String(item[1])}
            >
              <i>{item[0]}</i>
              <b>{item[1]}</b>
              <small>{item[2]}</small>
            </article>
          ))}
        </div>
      </section>

      <button className="reset" onClick={reset}>
        <RefreshCcw size={16} /> {tr.reset}
      </button>
    </>
  );
}

function PageHead({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <header className="page-head">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
