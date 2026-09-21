"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Flame,
  FlaskConical,
  Languages,
  Lightbulb,
  Moon,
  Play,
  RefreshCcw,
  Sigma,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { curriculum, formulas } from "@/content/curriculum";
import {
  generateQuestion,
  generateSet,
  type GeneratedQuestion,
} from "@/content/questions";
import { copy, type Language } from "@/lib/i18n";
import { FunctionLab } from "./function-lab";

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
    setLang(readLocal<Language>("mathly-lang", "pl"));
    setTheme(readLocal<"dark" | "light">("mathly-theme", "dark"));
    setProgress(readLocal<Progress>("mathly-progress", initialProgress));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mathly-theme", JSON.stringify(theme));
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("mathly-lang", JSON.stringify(lang));
  }, [ready, lang]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("mathly-progress", JSON.stringify(progress));
  }, [ready, progress]);

  const totalLessons = curriculum.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const mastery = Math.round((progress.completedLessons.length / totalLessons) * 100);

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

  const nav: Array<{
    id: View;
    label: string;
    icon: React.ReactNode;
  }> = [
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
              onClick={() => setView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === "exam" && <em>NEW</em>}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="mastery-mini">
            <span>{tr.mastery}</span>
            <b>{mastery}%</b>
            <div>
              <i style={{ width: mastery + "%" }} />
            </div>
          </div>

          <div className="settings">
            <button onClick={() => setLang(lang === "pl" ? "en" : "pl")}>
              <Languages size={16} /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
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
            <FunctionLab labels={{ title: tr.labTitle, sub: tr.labSub }} />
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
    unit.lessons.map((lesson) => ({ lesson, unit }))
  );
  const next =
    lessons.find(({ lesson }) => !progress.completedLessons.includes(lesson.id)) ??
    lessons[0];

  return (
    <>
      <section className="hero panel">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> PERSONAL LEARNING SPACE</span>
          <h1>{tr.hello}</h1>
          <p>{tr.subtitle}</p>
          <button className="primary" onClick={() => setView("path")}>
            <Play size={17} fill="currentColor" /> {tr.continue}
          </button>
        </div>
        <div className="math-art">
          <div className="orbit one" />
          <div className="orbit two" />
          <div className="math-core">π<span>√</span><b>∞</b><i>∫</i></div>
        </div>
      </section>

      <section className="stats">
        <Stat icon={<Trophy />} label={tr.xp} value={String(progress.xp)} sub="+120 this week" />
        <Stat icon={<Flame />} label={tr.streak} value={String(progress.streak)} sub={lang === "pl" ? "dni z rzędu" : "days in a row"} />
        <Stat icon={<BarChart3 />} label={tr.mastery} value={mastery + "%"} sub={progress.completedLessons.length + " lessons"} />
        <Stat icon={<Target />} label={tr.weekly} value="3 / 5" sub={lang === "pl" ? "sesji nauki" : "study sessions"} />
      </section>

      <section className="home-grid">
        <article className="panel continue-card">
          <div className="unit-head">
            <span className={"unit-badge " + next.unit.accent}>{next.unit.roman}</span>
            <div>
              <small>{tr.recommended}</small>
              <h2>{next.lesson.title[lang]}</h2>
            </div>
            <span className="time"><Clock3 size={15} /> {next.lesson.minutes} min</span>
          </div>
          <p>{next.lesson.summary[lang]}</p>
          {next.lesson.formula && <div className="formula">{next.lesson.formula}</div>}
          <div className="actions">
            <button className="primary small" onClick={() => markLesson(next.lesson.id)}>
              <CheckCircle2 size={16} /> {tr.markDone}
            </button>
            <button className="ghost" onClick={() => setView("knowledge")}>
              {tr.nav.knowledge} <ChevronRight size={16} />
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
        eyebrow="EXPLORE"
        title={lang === "pl" ? "Ucz się różnymi trybami" : "Learn in different modes"}
        text={lang === "pl"
          ? "Teoria, praktyka, testy i prawdziwy tryb egzaminacyjny pracują na jednym postępie."
          : "Theory, practice, tests and exam mode all share one progress system."}
      />

      <section className="mode-grid">
        {[
          ["knowledge", <BookOpen key="k" />, tr.nav.knowledge, lang === "pl" ? "Krótka teoria, przykłady i pułapki." : "Concise theory, examples and traps."],
          ["tasks", <Calculator key="k" />, tr.nav.tasks, lang === "pl" ? "Losowane warianty z rozwiązaniami." : "Randomised variants with solutions."],
          ["tests", <BadgeCheck key="k" />, tr.nav.tests, lang === "pl" ? "Klasówka po każdym dziale." : "A test after every unit."],
          ["exam", <Clock3 key="k" />, tr.nav.exam, lang === "pl" ? "60 minut z przerobionych działów." : "60 minutes from covered units."],
        ].map(([id, icon, title, desc]) => (
          <button key={String(id)} className="mode-card panel" onClick={() => setView(id as View)}>
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
  icon: React.ReactNode;
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

  return (
    <>
      <PageHead eyebrow="CURRICULUM" title={tr.curriculum} text={tr.curriculumSub} />
      <div className="path-list">
        {curriculum.map((unit) => {
          const done = unit.lessons.filter((lesson) => completed.includes(lesson.id)).length;
          return (
            <section className="unit panel" key={unit.id}>
              <div className="unit-title">
                <span className={"unit-badge " + unit.accent}>{unit.roman}</span>
                <div>
                  <h2>{unit.title[lang]}</h2>
                  <p>{unit.short[lang]}</p>
                </div>
                <b>{done}/{unit.lessons.length}</b>
              </div>
              <div className="lesson-list">
                {unit.lessons.map((lesson) => {
                  const isDone = completed.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      className={isDone ? "lesson done" : "lesson"}
                      onClick={() => markLesson(lesson.id)}
                    >
                      <span>{isDone ? <CheckCircle2 size={18} /> : <Play size={16} />}</span>
                      <div>
                        <b>{lesson.title[lang]}</b>
                        <small>{lesson.summary[lang]}</small>
                      </div>
                      <em>{lesson.level === "basic" ? tr.basic : tr.extended} • {lesson.minutes} min</em>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function Knowledge({ lang }: { lang: Language }) {
  const tr = copy[lang];

  return (
    <>
      <PageHead eyebrow="KNOWLEDGE BASE" title={tr.knowledgeTitle} text={tr.knowledgeSub} />
      <div className="knowledge-grid">
        {curriculum.map((unit) => (
          <article className="panel knowledge-card" key={unit.id}>
            <span className={"unit-badge " + unit.accent}>{unit.icon}</span>
            <h2>{unit.title[lang]}</h2>
            <p>{unit.short[lang]}</p>
            <div>
              {unit.lessons.map((lesson) => (
                <section key={lesson.id}>
                  <b>{lesson.title[lang]}</b>
                  <small>{lesson.summary[lang]}</small>
                  {lesson.formula && <code>{lesson.formula}</code>}
                </section>
              ))}
            </div>
          </article>
        ))}
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
        text={lang === "pl"
          ? "Najpierw spróbuj odtworzyć wzór z pamięci, dopiero potem odwróć kartę."
          : "Recall the formula first, then flip the card."}
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
                    : [...items, card.id]
                )
              }
            >
              <small>{curriculum.find((u) => u.id === card.unitId)?.title[lang]}</small>
              <h3>{card.name[lang]}</h3>
              {isFlipped ? (
                <>
                  <strong>{card.formula}</strong>
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

function Practice({
  lang,
  onResult,
}: {
  lang: Language;
  onResult: (correct: boolean) => void;
}) {
  const tr = copy[lang];
  const [unitId, setUnitId] = useState("real-numbers");
  const [question, setQuestion] = useState(() => generateQuestion("real-numbers", lang));
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setQuestion(generateQuestion(unitId, lang));
    setAnswer("");
    setState("idle");
    setShowHint(false);
    setShowSolution(false);
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

  return (
    <>
      <PageHead
        eyebrow="PRACTICE ENGINE"
        title={tr.tasksTitle}
        text={lang === "pl"
          ? "Każde losowanie daje inny wariant. Uczysz się schematu rozwiązania, a nie jednej odpowiedzi."
          : "Every draw gives a new variant, so you learn the method rather than one answer."}
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

        <section className="panel problem">
          <div className="problem-meta">
            <span>{question.difficulty.toUpperCase()}</span>
            <small>#{question.id.slice(-5)}</small>
          </div>
          <h2>{question.prompt}</h2>

          <div className="answer-box">
            <label>{lang === "pl" ? "Twoja odpowiedź" : "Your answer"}</label>
            <div>
              <input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && check()}
                inputMode="decimal"
                placeholder="="
              />
              <button className="primary" onClick={check}>{tr.check}</button>
            </div>
          </div>

          {state !== "idle" && (
            <div className={state === "correct" ? "feedback good" : "feedback bad"}>
              {state === "correct" ? <CheckCircle2 /> : <Lightbulb />}
              <b>{state === "correct" ? tr.correct : tr.wrong}</b>
            </div>
          )}

          <div className="problem-actions">
            <button className="ghost" onClick={() => setShowHint((v) => !v)}>
              <Lightbulb size={16} /> {tr.hint}
            </button>
            <button className="ghost" onClick={() => setShowSolution((v) => !v)}>
              <BookOpen size={16} /> {tr.solution}
            </button>
            <button className="secondary" onClick={randomise}>
              <RefreshCcw size={16} /> {tr.newVariant}
            </button>
          </div>

          {showHint && <div className="reveal"><Lightbulb size={17} /> {question.hint}</div>}
          {showSolution && <div className="reveal solution"><Sigma size={17} /> {question.solution}</div>}
        </section>
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
  const [active, setActive] = useState<{ unitId: string; questions: GeneratedQuestion[] } | null>(null);
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
    return (
      <Assessment
        lang={lang}
        title={tr.classTests + ": " + curriculum.find((u) => u.id === active.unitId)?.title[lang]}
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
      <PageHead eyebrow="CHECKPOINTS" title={tr.classTests} text={tr.classTestsSub} />
      <div className="test-grid">
        {curriculum.map((unit) => (
          <article className="panel test-card" key={unit.id}>
            <span className={"unit-badge " + unit.accent}>{unit.roman}</span>
            <div>
              <h3>{unit.title[lang]}</h3>
              <p>{unit.lessons.length} {lang === "pl" ? "lekcje" : "lessons"} • 8 {tr.questions} • ~25 min</p>
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
        .filter((unit) => unit.lessons.some((lesson) => completedLessons.includes(lesson.id)))
        .map((unit) => unit.id),
    [completedLessons]
  );

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(3600);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || result !== null) return;
    const id = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, [started, result]);

  const units = availableUnits.length
    ? availableUnits
    : ["real-numbers", "algebra", "equations", "functions"];

  const finish = () => {
    const score = scoreQuestions(questions, answers);
    setResult(score);
    onFinish(score, questions.length);
  };

  useEffect(() => {
    if (started && remaining === 0 && result === null) finish();
  }, [started, remaining, result]);

  if (started) {
    return (
      <Assessment
        lang={lang}
        title={tr.examTitle}
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
      <PageHead eyebrow="EXAM MODE" title={tr.examTitle} text={tr.examSub} />
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
              ? "12 losowych zadań wyłącznie z działów, które już rozpocząłeś. Każda próba daje nowy zestaw."
              : "12 random problems only from units you have started. Every attempt produces a new set."}
          </p>
          <div className="tags">
            {units.map((id) => (
              <span key={id}>{curriculum.find((unit) => unit.id === id)?.title[lang]}</span>
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

function scoreQuestions(questions: GeneratedQuestion[], answers: Record<string, string>) {
  return questions.filter((question) => {
    const answer = Number((answers[question.id] ?? "").replace(",", "."));
    return Number.isFinite(answer) && Math.abs(answer - question.answer) < 0.011;
  }).length;
}

function Assessment({
  lang,
  title,
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
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  result: number | null;
  onFinish: () => void;
  back: () => void;
  timer?: number;
}) {
  const tr = copy[lang];

  return (
    <>
      <div className="assessment-head">
        <button className="ghost" onClick={back}>← {lang === "pl" ? "wróć" : "back"}</button>
        <div><span className="eyebrow">ASSESSMENT</span><h1>{title}</h1></div>
        {timer !== undefined && (
          <b className="timer">
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </b>
        )}
      </div>

      {result !== null && (
        <div className="result panel">
          <Trophy size={34} />
          <b>{result}/{questions.length}</b>
          <span>{Math.round((result / questions.length) * 100)}%</span>
          <p>
            {result / questions.length >= 0.75
              ? lang === "pl" ? "Bardzo solidny wynik." : "Strong result."
              : lang === "pl" ? "Wróć do błędnych typów zadań i spróbuj ponownie." : "Review missed problem types and try again."}
          </p>
        </div>
      )}

      <div className="assessment-list">
        {questions.map((question, index) => {
          const numeric = Number((answers[question.id] ?? "").replace(",", "."));
          const ok = Number.isFinite(numeric) && Math.abs(numeric - question.answer) < 0.011;
          return (
            <article className="panel assessment-question" key={question.id}>
              <span>{index + 1}</span>
              <div>
                <h3>{question.prompt}</h3>
                <div className="assessment-answer">
                  <input
                    disabled={result !== null}
                    value={answers[question.id] ?? ""}
                    onChange={(event) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: event.target.value,
                      }))
                    }
                    placeholder="="
                  />
                  {result !== null && (
                    <b className={ok ? "ok" : "wrong"}>
                      {ok ? "✓" : "→ " + question.answer}
                    </b>
                  )}
                </div>
                {result !== null && <small>{question.solution}</small>}
              </div>
            </article>
          );
        })}
      </div>

      {result === null && (
        <button className="primary finish" onClick={onFinish}>
          {tr.finish} <CheckCircle2 size={18} />
        </button>
      )}
    </>
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
        eyebrow="PROFILE"
        title={tr.profileTitle}
        text={lang === "pl"
          ? "XP i seria pomagają utrzymać rytm, ale główną metryką pozostaje opanowanie materiału."
          : "XP and streaks support consistency, while mastery remains the main metric."}
      />

      <section className="panel profile-card">
        <div className="big-avatar">M</div>
        <div>
          <h2>Math Explorer</h2>
          <p>{progress.xp} XP • Level {level}</p>
          <div className="xp-bar"><i style={{ width: ((progress.xp % 250) / 2.5) + "%" }} /></div>
        </div>
        <span className="rank"><Trophy size={17} /> ALGEBRAIST</span>
      </section>

      <section className="stats">
        <Stat icon={<Flame />} label={tr.streak} value={String(progress.streak)} sub={lang === "pl" ? "dni z rzędu" : "consecutive days"} />
        <Stat icon={<BarChart3 />} label={tr.mastery} value={mastery + "%"} sub={progress.completedLessons.length + " lessons"} />
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
            <article className={index < 3 ? "achievement unlocked" : "achievement"} key={String(item[1])}>
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
