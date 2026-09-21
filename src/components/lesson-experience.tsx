"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Lightbulb,
  Lock,
  Medal,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { curriculum } from "@/content/curriculum";
import {
  generateQuestion,
  generateReasoningQuestion,
  generateWordQuestion,
  type GeneratedQuestion,
} from "@/content/questions";
import {
  getLessonVariables,
  lessonExplanation,
  lessonFormulaTex,
} from "@/content/lesson-details";
import type { Language } from "@/lib/i18n";
import { MathFormula } from "./math";
import { CelebrationBurst } from "./celebration-burst";

type Progress = {
  xp: number;
  streak: number;
  completedLessons: string[];
  answered: number;
  correct: number;
};

const fallbackProgress: Progress = {
  xp: 420,
  streak: 3,
  completedLessons: ["sets-intervals", "powers-roots", "identities"],
  answered: 12,
  correct: 9,
};

function findLesson(lessonId: string) {
  for (const unit of curriculum) {
    const lesson = unit.lessons.find((item) => item.id === lessonId);
    if (lesson) return { unit, lesson };
  }
  return null;
}

function readProgress() {
  if (typeof window === "undefined") return fallbackProgress;
  try {
    const raw = localStorage.getItem("mathly-progress");
    return raw ? (JSON.parse(raw) as Progress) : fallbackProgress;
  } catch {
    return fallbackProgress;
  }
}

function saveProgress(progress: Progress) {
  localStorage.setItem("mathly-progress", JSON.stringify(progress));
}

export function LessonExperience({
  lessonId,
  lang,
}: {
  lessonId: string;
  lang: Language;
}) {
  const data = useMemo(() => findLesson(lessonId), [lessonId]);
  const [progress, setProgress] = useState<Progress>(fallbackProgress);
  const [step, setStep] = useState(0);
  const [awardedSteps, setAwardedSteps] = useState<number[]>([]);
  const [example, setExample] = useState<GeneratedQuestion | null>(null);
  const [basicTask, setBasicTask] = useState<GeneratedQuestion | null>(null);
  const [reasoningTask, setReasoningTask] = useState<GeneratedQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [celebration, setCelebration] = useState(0);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProgress(readProgress());
      if (!data) return;
      setExample(generateQuestion(data.unit.id, lang, 1101, "quick"));
      setBasicTask(generateWordQuestion(data.unit.id, lang, 2202));
      setReasoningTask(generateReasoningQuestion(data.unit.id, lang, 3303));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [data, lang]);

  if (!data) return null;

  const { unit, lesson } = data;
  const formula = lessonFormulaTex[lesson.id];
  const variables = getLessonVariables(lesson.id, lang);
  const explanation = lessonExplanation(lesson.id, lang);
  const isCompleted = progress.completedLessons.includes(lesson.id);
  const currentLevel = Math.floor(progress.xp / 250) + 1;
  const levelProgress = ((progress.xp % 250) / 250) * 100;
  const steps = [
    lang === "pl" ? "Zrozum ideę" : "Understand",
    lang === "pl" ? "Rozbierz wzór" : "Formula",
    lang === "pl" ? "Przykład" : "Example",
    lang === "pl" ? "Ćwiczenie" : "Practice",
    lang === "pl" ? "Myślenie" : "Reasoning",
  ];

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    setCelebration((value) => value + 1);
  };

  const awardStep = (stepIndex: number) => {
    if (awardedSteps.includes(stepIndex)) return;
    setAwardedSteps((items) => [...items, stepIndex]);
    setProgress((previous) => {
      const next = { ...previous, xp: previous.xp + 20 };
      saveProgress(next);
      return next;
    });
    triggerCelebration(lang === "pl" ? "+20 XP za etap" : "+20 XP for this step");
  };

  const goToStep = (nextStep: number) => {
    awardStep(step);
    setStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
    setAnswer("");
    setFeedback("idle");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const activeTask = step === 3 ? basicTask : reasoningTask;

  const checkAnswer = () => {
    if (!activeTask) return;
    const parsed = Number(answer.replace(",", "."));
    const correct =
      Number.isFinite(parsed) &&
      Math.abs(parsed - activeTask.answer) < 0.011;
    setFeedback(correct ? "correct" : "wrong");

    setProgress((previous) => {
      const next = {
        ...previous,
        answered: previous.answered + 1,
        correct: previous.correct + (correct ? 1 : 0),
        xp: previous.xp + (correct ? 35 : 0),
      };
      saveProgress(next);
      return next;
    });

    if (correct) {
      triggerCelebration(lang === "pl" ? "Świetnie! +35 XP" : "Great! +35 XP");
    }
  };

  const completeLesson = () => {
    awardStep(step);
    setFinished(true);
    setProgress((previous) => {
      const alreadyCompleted = previous.completedLessons.includes(lesson.id);
      const next = {
        ...previous,
        xp: previous.xp + (alreadyCompleted ? 25 : 100),
        completedLessons: alreadyCompleted
          ? previous.completedLessons
          : [...previous.completedLessons, lesson.id],
      };
      saveProgress(next);
      return next;
    });
    triggerCelebration(
      isCompleted
        ? lang === "pl"
          ? "Powtórka ukończona! +25 XP"
          : "Review complete! +25 XP"
        : lang === "pl"
          ? "Lekcja ukończona! +100 XP"
          : "Lesson complete! +100 XP",
    );
  };

  return (
    <main className="lesson-experience" id="main-content">
      <a className="skip-link" href="#lesson-content">
        {lang === "pl" ? "Przejdź do lekcji" : "Skip to lesson"}
      </a>

      <CelebrationBurst
        key={celebration}
        active={celebration > 0}
        message={celebrationMessage}
      />

      <header className="lesson-experience-header">
        <Link className="lesson-back" href={`/${lang}/path`}>
          <ArrowLeft size={18} />
          {lang === "pl" ? "Ścieżka" : "Learning path"}
        </Link>

        <div className="lesson-route-title">
          <span className={`unit-badge ${unit.accent}`}>{unit.icon}</span>
          <div>
            <small>{unit.title[lang]}</small>
            <b>{lesson.title[lang]}</b>
          </div>
        </div>

        <div
          className="lesson-level-hud"
          aria-label={
            lang === "pl"
              ? `Poziom ${currentLevel}, ${progress.xp} XP`
              : `Level ${currentLevel}, ${progress.xp} XP`
          }
        >
          <div>
            <Star size={16} fill="currentColor" />
            <b>{lang === "pl" ? "POZ." : "LV"} {currentLevel}</b>
          </div>
          <span><Zap size={15} /> {progress.xp} XP</span>
          <i><span style={{ width: levelProgress + "%" }} /></i>
        </div>
      </header>

      <div className="lesson-route-progress" aria-label={lang === "pl" ? "Postęp lekcji" : "Lesson progress"}>
        {steps.map((label, index) => (
          <button
            key={label}
            className={[
              index === step ? "active" : "",
              index < step ? "done" : "",
            ].join(" ")}
            onClick={() => setStep(index)}
            aria-current={index === step ? "step" : undefined}
          >
            <span>{index < step ? <CheckCircle2 size={17} /> : index + 1}</span>
            <b>{label}</b>
          </button>
        ))}
      </div>

      <section className="lesson-route-shell" id="lesson-content">
        <aside className="lesson-route-aside">
          <div className="lesson-mission-card">
            <span className="eyebrow">
              <Target size={14} /> {lang === "pl" ? "MISJA LEKCJI" : "LESSON MISSION"}
            </span>
            <h2>{lesson.title[lang]}</h2>
            <p>{lesson.summary[lang]}</p>
            <div className="lesson-reward-row">
              <span><Zap size={16} /> +20 XP / {lang === "pl" ? "etap" : "step"}</span>
              <span><Trophy size={16} /> +100 XP / {lang === "pl" ? "lekcja" : "lesson"}</span>
            </div>
          </div>

          <div className="lesson-streak-card">
            <Flame size={22} />
            <div>
              <b>{progress.streak} {lang === "pl" ? "dni z rzędu" : "day streak"}</b>
              <span>{lang === "pl" ? "Utrzymaj rytm i zgarnij bonus XP." : "Keep the rhythm and earn bonus XP."}</span>
            </div>
          </div>

          <div className="lesson-pro-teaser">
            <span><Lock size={17} /> PRO</span>
            <b>{lang === "pl" ? "Rozszerzenie i zadania maturalne" : "Advanced and exam problems"}</b>
            <p>{lang === "pl" ? "Trudniejsze warianty, zadania wieloetapowe i pełne strategie rozwiązania." : "Harder variants, multi-step problems and complete solving strategies."}</p>
          </div>
        </aside>

        <article className="lesson-route-content">
          {step === 0 && (
            <section className="lesson-stage-card">
              <span className="lesson-stage-kicker">
                <Sparkles size={17} />
                {lang === "pl" ? "01 • ZROZUM IDEĘ" : "01 • UNDERSTAND THE IDEA"}
              </span>
              <h1>{lesson.title[lang]}</h1>
              <p className="lesson-lead">{explanation}</p>

              <div className="lesson-concept-grid">
                <div>
                  <b>{lang === "pl" ? "Po co mi to?" : "Why does it matter?"}</b>
                  <p>
                    {lang === "pl"
                      ? "Ten temat wraca w kolejnych działach i zadaniach maturalnych. Zamiast zapamiętywać jeden schemat, uczysz się rozpoznawać strukturę problemu."
                      : "This topic returns in later units and exam questions. Instead of memorising one pattern, you learn to recognise the structure of the problem."}
                  </p>
                </div>
                <div>
                  <b>{lang === "pl" ? "Jak myśleć?" : "How to think?"}</b>
                  <p>
                    {lang === "pl"
                      ? "1. Odczytaj dane. 2. Nazwij niewiadomą. 3. Dobierz zależność. 4. Policz. 5. Sprawdź sens wyniku."
                      : "1. Read the data. 2. Name the unknown. 3. Choose the relationship. 4. Calculate. 5. Check the result."}
                  </p>
                </div>
              </div>

              <div className="lesson-tip-box">
                <Lightbulb size={22} />
                <div>
                  <b>{lang === "pl" ? "Wskazówka" : "Tip"}</b>
                  <span>
                    {lang === "pl"
                      ? "Jeśli nie wiesz, od którego wzoru zacząć, zapisz jednostki i dane z treści. Często od razu widać, jaka zależność je łączy."
                      : "If you do not know which formula to start with, write down the units and known values. The relationship often becomes obvious."}
                  </span>
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="lesson-stage-card">
              <span className="lesson-stage-kicker">
                <BookOpen size={17} />
                {lang === "pl" ? "02 • ROZBIERZ WZÓR" : "02 • BREAK DOWN THE FORMULA"}
              </span>
              <h1>{lang === "pl" ? "Każdy symbol ma znaczenie" : "Every symbol has a job"}</h1>
              <p className="lesson-lead">
                {lang === "pl"
                  ? "Nie ucz się wzoru jak ciągu znaków. Rozbij go na części i zobacz, jak zmiana jednej wielkości wpływa na pozostałe."
                  : "Do not memorise the formula as a string of symbols. Break it into parts and see how each quantity affects the others."}
              </p>

              {formula ? (
                <>
                  <div className="lesson-key-formula">
                    <span>{lang === "pl" ? "KLUCZOWY WZÓR" : "KEY FORMULA"}</span>
                    <MathFormula tex={formula} display />
                  </div>
                  <div className="lesson-variable-cards">
                    {variables.map(([symbol, meaning], index) => (
                      <div key={symbol}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <b>{symbol}</b>
                        <p>{meaning}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="lesson-no-formula">
                  <Sparkles size={24} />
                  <b>{lang === "pl" ? "Tutaj ważniejsza jest metoda niż jeden wzór." : "Here the method matters more than one formula."}</b>
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="lesson-stage-card">
              <span className="lesson-stage-kicker">
                <Medal size={17} />
                {lang === "pl" ? "03 • PRZYKŁAD KROK PO KROKU" : "03 • STEP-BY-STEP EXAMPLE"}
              </span>
              <h1>{lang === "pl" ? "Zobacz pełny tok rozumowania" : "Follow the complete reasoning"}</h1>

              {example && (
                <>
                  <div className="lesson-example-problem">
                    <p>{example.lead}</p>
                    {example.math && <MathFormula tex={example.math} display />}
                    {example.tail && <p>{example.tail}</p>}
                  </div>

                  <div className="lesson-reasoning-steps">
                    <div><span>1</span><div><b>{lang === "pl" ? "Dane" : "Given"}</b><p>{lang === "pl" ? "Wypisz informacje, które rzeczywiście są potrzebne do obliczenia wyniku." : "Write down the information that is actually needed."}</p></div></div>
                    <div><span>2</span><div><b>{lang === "pl" ? "Metoda" : "Method"}</b><p>{example.hint}</p>{example.hintMath && <MathFormula tex={example.hintMath} />}</div></div>
                    <div><span>3</span><div><b>{lang === "pl" ? "Obliczenia" : "Calculation"}</b><p>{example.solution}</p>{example.solutionMath && <MathFormula tex={example.solutionMath} display />}</div></div>
                    <div><span>4</span><div><b>{lang === "pl" ? "Kontrola" : "Check"}</b><p>{lang === "pl" ? "Sprawdź znak, jednostkę i to, czy wynik jest logiczny w kontekście zadania." : "Check the sign, unit and whether the result makes sense."}</p></div></div>
                  </div>
                </>
              )}
            </section>
          )}

          {(step === 3 || step === 4) && activeTask && (
            <section className="lesson-stage-card">
              <span className="lesson-stage-kicker">
                {step === 3 ? <Target size={17} /> : <Sparkles size={17} />}
                {step === 3
                  ? lang === "pl" ? "04 • ĆWICZENIE" : "04 • PRACTICE"
                  : lang === "pl" ? "05 • ZADANIE NA MYŚLENIE" : "05 • REASONING CHALLENGE"}
              </span>
              <h1>
                {step === 3
                  ? lang === "pl" ? "Teraz Ty" : "Your turn"
                  : lang === "pl" ? "Połącz kilka kroków" : "Connect several steps"}
              </h1>
              <p className="lesson-lead">
                {step === 3
                  ? lang === "pl" ? "To zadanie sprawdza podstawową metodę z tej lekcji." : "This problem checks the core method from the lesson."
                  : lang === "pl" ? "Nie dostajesz gotowego schematu. Najpierw zdecyduj, co trzeba policzyć po kolei." : "There is no ready-made pattern. Decide what needs to be calculated first."}
              </p>

              <div className="lesson-task-card">
                <div className="lesson-task-meta">
                  <span>{step === 3 ? (lang === "pl" ? "PODSTAWA" : "CORE") : (lang === "pl" ? "ROZUMOWANIE" : "REASONING")}</span>
                  <b>{activeTask.points} pkt</b>
                </div>
                <p>{activeTask.lead}</p>
                {activeTask.math && <MathFormula tex={activeTask.math} display />}
                {activeTask.tail && <p>{activeTask.tail}</p>}

                <div className="lesson-answer-row">
                  <label htmlFor="lesson-answer">
                    {lang === "pl" ? "Twoja odpowiedź" : "Your answer"}
                  </label>
                  <div>
                    <input
                      id="lesson-answer"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && checkAnswer()}
                      inputMode="decimal"
                    />
                    {activeTask.answerSuffix && <span>{activeTask.answerSuffix}</span>}
                  </div>
                  <button onClick={checkAnswer}>
                    <CheckCircle2 size={18} />
                    {lang === "pl" ? "Sprawdź" : "Check"}
                  </button>
                </div>

                {feedback !== "idle" && (
                  <div
                    className={feedback === "correct" ? "lesson-feedback correct" : "lesson-feedback wrong"}
                    role="status"
                    aria-live="polite"
                  >
                    <b>
                      {feedback === "correct"
                        ? lang === "pl" ? "Dobrze!" : "Correct!"
                        : lang === "pl" ? "Jeszcze nie." : "Not yet."}
                    </b>
                    <span>
                      {feedback === "correct"
                        ? activeTask.solution
                        : activeTask.hint}
                    </span>
                    {feedback === "correct" && activeTask.solutionMath && (
                      <MathFormula tex={activeTask.solutionMath} display />
                    )}
                  </div>
                )}
              </div>

              {step === 4 && (
                <div className="lesson-premium-card">
                  <div>
                    <span><Lock size={16} /> PRO</span>
                    <h3>{lang === "pl" ? "Jeszcze trudniejszy wariant" : "An even harder variant"}</h3>
                    <p>{lang === "pl" ? "Zadania łączące kilka działów, pełne rozwiązania maturalne, analiza błędów i dodatkowe serie treningowe." : "Cross-topic problems, full exam solutions, error analysis and extra practice sets."}</p>
                  </div>
                  <button type="button" aria-label={lang === "pl" ? "Funkcja PRO w przygotowaniu" : "PRO feature coming soon"}>
                    <Lock size={17} /> PRO
                  </button>
                </div>
              )}
            </section>
          )}

          <footer className="lesson-route-footer">
            <button
              className="lesson-prev-button"
              disabled={step === 0}
              onClick={() => goToStep(step - 1)}
            >
              <ChevronLeft size={18} />
              {lang === "pl" ? "Wstecz" : "Back"}
            </button>

            <div>
              <span>{step + 1}/{steps.length}</span>
              <b>{steps[step]}</b>
            </div>

            {step < steps.length - 1 ? (
              <button className="lesson-next-button" onClick={() => goToStep(step + 1)}>
                {lang === "pl" ? "Dalej" : "Next"}
                <ChevronRight size={18} />
              </button>
            ) : (
              <button className="lesson-finish-button" onClick={completeLesson}>
                <Trophy size={18} />
                {finished
                  ? lang === "pl" ? "Ukończono" : "Completed"
                  : lang === "pl" ? "Ukończ lekcję" : "Complete lesson"}
              </button>
            )}
          </footer>

          {finished && (
            <section className="lesson-finished-card">
              <Trophy size={38} />
              <div>
                <span>{lang === "pl" ? "LEKCJA UKOŃCZONA" : "LESSON COMPLETE"}</span>
                <h2>{lang === "pl" ? "Dobra robota — progres zapisany" : "Great work — progress saved"}</h2>
                <p>
                  {lang === "pl"
                    ? "XP i ukończenie lekcji zostały zapisane. Możesz wrócić do ścieżki albo zrobić powtórkę."
                    : "XP and lesson completion have been saved. Return to the path or repeat the lesson."}
                </p>
              </div>
              <Link href={`/${lang}/path`}>
                {lang === "pl" ? "Wróć do ścieżki" : "Back to path"} <ChevronRight size={18} />
              </Link>
            </section>
          )}
        </article>
      </section>
    </main>
  );
}
