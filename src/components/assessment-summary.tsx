"use client";

import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  CircleAlert,
  Target,
  Trophy,
} from "lucide-react";
import type { CSSProperties } from "react";
import { curriculum } from "@/content/curriculum";
import type { GeneratedQuestion } from "@/content/questions";
import type { Language } from "@/lib/i18n";
import { MathFormula } from "./math";

function isCorrect(question: GeneratedQuestion, rawAnswer: string | undefined) {
  if (!rawAnswer?.trim()) return false;
  const parsed = Number(rawAnswer.replace(",", "."));
  return Number.isFinite(parsed) && Math.abs(parsed - question.answer) < 0.011;
}

function kindLabel(kind: GeneratedQuestion["kind"], lang: Language) {
  if (kind === "mcq") return lang === "pl" ? "ABCD" : "MCQ";
  if (kind === "word") return lang === "pl" ? "Opisowe" : "Word problem";
  return lang === "pl" ? "Otwarte" : "Open";
}

function displayAnswer(
  question: GeneratedQuestion,
  rawAnswer: string,
  lang: Language,
) {
  if (!rawAnswer.trim()) {
    return lang === "pl" ? "Brak odpowiedzi" : "No answer";
  }

  if (question.kind === "mcq" && question.options) {
    const value = Number(rawAnswer.replace(",", "."));
    const option = question.options.find((item) => item.value === value);
    return option ? `${option.id}. ${option.label}` : rawAnswer;
  }

  return rawAnswer + (question.answerSuffix ?? "");
}

function displayCorrectAnswer(question: GeneratedQuestion) {
  if (question.kind === "mcq" && question.options) {
    const option = question.options.find((item) => item.value === question.answer);
    if (option) return `${option.id}. ${option.label}`;
  }
  return String(question.answer) + (question.answerSuffix ?? "");
}

export function AssessmentSummary({
  lang,
  questions,
  answers,
  onReviewPaper,
}: {
  lang: Language;
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  onReviewPaper: () => void;
}) {
  const rows = questions.map((question, index) => ({
    question,
    index,
    raw: answers[question.id] ?? "",
    answered: Boolean((answers[question.id] ?? "").trim()),
    correct: isCorrect(question, answers[question.id]),
  }));

  const correct = rows.filter((row) => row.correct).length;
  const unanswered = rows.filter((row) => !row.answered).length;
  const wrong = rows.filter((row) => row.answered && !row.correct).length;
  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
  const earnedPoints = rows.reduce(
    (sum, row) => sum + (row.correct ? row.question.points : 0),
    0,
  );
  const percent = totalPoints
    ? Math.round((earnedPoints / totalPoints) * 100)
    : 0;

  const kinds = (["numeric", "word", "mcq"] as const)
    .map((kind) => {
      const kindRows = rows.filter((row) => row.question.kind === kind);
      if (!kindRows.length) return null;
      const kindCorrect = kindRows.filter((row) => row.correct).length;
      return {
        kind,
        count: kindRows.length,
        correct: kindCorrect,
        percent: Math.round((kindCorrect / kindRows.length) * 100),
      };
    })
    .filter(Boolean) as Array<{
      kind: GeneratedQuestion["kind"];
      count: number;
      correct: number;
      percent: number;
    }>;

  const unitStats = curriculum
    .map((unit) => {
      const unitRows = rows.filter((row) => row.question.unitId === unit.id);
      if (!unitRows.length) return null;
      const unitCorrect = unitRows.filter((row) => row.correct).length;
      return {
        unit,
        count: unitRows.length,
        correct: unitCorrect,
        percent: Math.round((unitCorrect / unitRows.length) * 100),
      };
    })
    .filter(Boolean) as Array<{
      unit: (typeof curriculum)[number];
      count: number;
      correct: number;
      percent: number;
    }>;

  const reviewRows = rows.filter((row) => !row.correct);

  const headline =
    percent >= 85
      ? lang === "pl"
        ? "Bardzo mocny wynik"
        : "Excellent result"
      : percent >= 65
        ? lang === "pl"
          ? "Dobry kierunek"
          : "Good progress"
        : lang === "pl"
          ? "Wynik pokazuje, co warto poprawić"
          : "The result shows what to review";

  return (
    <section className="assessment-summary panel" aria-labelledby="assessment-summary-title">
      <div className="assessment-summary-hero">
        <div className="assessment-score-ring" style={{ "--score": percent + "%" } as CSSProperties}>
          <span>{percent}%</span>
          <small>{lang === "pl" ? "wyniku" : "score"}</small>
        </div>
        <div>
          <span className="eyebrow">
            <Trophy size={15} />
            {lang === "pl" ? "PODSUMOWANIE ARKUSZA" : "PAPER SUMMARY"}
          </span>
          <h2 id="assessment-summary-title">{headline}</h2>
          <p>
            {lang === "pl"
              ? "Nie pokazujemy tylko wyniku. Poniżej masz rozpisane błędy, brakujące odpowiedzi i działy, do których warto wrócić."
              : "You get more than a score: below are missed questions, unanswered items and the units worth revisiting."}
          </p>
        </div>
        <button className="primary assessment-summary-paper-cta" onClick={onReviewPaper}>
          <BookOpenCheck size={17} />
          {lang === "pl"
            ? "Zobacz błędy na arkuszu"
            : "See mistakes on the paper"}
        </button>
      </div>

      <div className="assessment-summary-stats">
        <article>
          <CheckCircle2 size={20} />
          <div><b>{correct}/{questions.length}</b><span>{lang === "pl" ? "poprawnych" : "correct"}</span></div>
        </article>
        <article>
          <CircleAlert size={20} />
          <div><b>{wrong}</b><span>{lang === "pl" ? "błędnych" : "wrong"}</span></div>
        </article>
        <article>
          <Target size={20} />
          <div><b>{unanswered}</b><span>{lang === "pl" ? "bez odpowiedzi" : "unanswered"}</span></div>
        </article>
        <article>
          <BarChart3 size={20} />
          <div><b>{earnedPoints}/{totalPoints}</b><span>{lang === "pl" ? "punktów" : "points"}</span></div>
        </article>
      </div>

      <div className="assessment-breakdown-grid">
        <section className="assessment-breakdown-card">
          <div className="assessment-breakdown-title">
            <span>{lang === "pl" ? "Według typu zadania" : "By question type"}</span>
            <small>{lang === "pl" ? "Skuteczność" : "Accuracy"}</small>
          </div>
          {kinds.map((item) => (
            <div className="assessment-breakdown-row" key={item.kind}>
              <div>
                <b>{kindLabel(item.kind, lang)}</b>
                <span>{item.correct}/{item.count}</span>
              </div>
              <i aria-hidden="true"><span style={{ width: item.percent + "%" }} /></i>
              <strong>{item.percent}%</strong>
            </div>
          ))}
        </section>

        <section className="assessment-breakdown-card">
          <div className="assessment-breakdown-title">
            <span>{lang === "pl" ? "Według działu" : "By unit"}</span>
            <small>{lang === "pl" ? "Co powtórzyć" : "What to review"}</small>
          </div>
          {unitStats.map((item) => (
            <div className="assessment-breakdown-row" key={item.unit.id}>
              <div>
                <b>{item.unit.roman}. {item.unit.title[lang]}</b>
                <span>{item.correct}/{item.count}</span>
              </div>
              <i aria-hidden="true"><span style={{ width: item.percent + "%" }} /></i>
              <strong>{item.percent}%</strong>
            </div>
          ))}
        </section>
      </div>

      <section className="assessment-review">
        <div className="assessment-review-heading">
          <div>
            <span className="eyebrow">
              <CircleAlert size={14} />
              {lang === "pl" ? "DO POPRAWY" : "REVIEW"}
            </span>
            <h3>
              {reviewRows.length
                ? lang === "pl"
                  ? reviewRows.length + " zadań wymaga powtórki"
                  : reviewRows.length + " questions need review"
                : lang === "pl"
                  ? "Bez błędów — świetna robota"
                  : "No mistakes — great work"}
            </h3>
          </div>
        </div>

        {reviewRows.length ? (
          <div className="assessment-review-list">
            {reviewRows.map((row) => {
              const unit = curriculum.find((item) => item.id === row.question.unitId);
              return (
                <article className="assessment-review-item" key={row.question.id}>
                  <div className="assessment-review-number">{row.index + 1}</div>
                  <div className="assessment-review-body">
                    <div className="assessment-review-meta">
                      <span>{kindLabel(row.question.kind, lang)}</span>
                      <span>{unit?.title[lang]}</span>
                      <b>{row.question.points} {lang === "pl" ? "pkt" : "pts"}</b>
                    </div>

                    <div className="assessment-review-problem">
                      <p>{row.question.lead}</p>
                      {row.question.math && <MathFormula tex={row.question.math} display />}
                      {row.question.tail && <p>{row.question.tail}</p>}
                    </div>

                    <div className="assessment-answer-compare">
                      <div className="bad">
                        <small>{lang === "pl" ? "Twoja odpowiedź" : "Your answer"}</small>
                        <b>
                          {displayAnswer(row.question, row.raw, lang)}
                        </b>
                      </div>
                      <div className="good">
                        <small>{lang === "pl" ? "Poprawna odpowiedź" : "Correct answer"}</small>
                        <b>{displayCorrectAnswer(row.question)}</b>
                      </div>
                    </div>

                    <div className="assessment-explanation">
                      <div>
                        <strong>{lang === "pl" ? "Co było nie tak?" : "What went wrong?"}</strong>
                        <p>
                          {!row.answered
                            ? lang === "pl"
                              ? "Zadanie zostało pominięte. Zacznij od wypisania danych i nazwij to, czego szukasz."
                              : "The question was skipped. Start by writing down the given data and the unknown."
                            : row.question.hint}
                        </p>
                      </div>
                      <div>
                        <strong>{lang === "pl" ? "Dlaczego tak?" : "Why?"}</strong>
                        <p>{row.question.solution}</p>
                        {row.question.solutionMath && (
                          <MathFormula tex={row.question.solutionMath} display />
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="assessment-perfect">
            <CheckCircle2 size={28} />
            <p>
              {lang === "pl"
                ? "Wszystkie zadania rozwiązane poprawnie. Możesz przejść do trudniejszego działu albo spróbować kolejnego wariantu."
                : "Every question was correct. Move to a harder unit or try another variant."}
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
