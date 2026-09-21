import { describe, expect, it } from "vitest";
import {
  generateQuestion,
  generateReasoningQuestion,
  generateSet,
} from "../src/content/questions";

describe("math question generation", () => {
  it("builds a mixed assessment with open, word and ABCD tasks", () => {
    const questions = generateSet(
      ["real-numbers", "functions", "sequences", "probability"],
      20,
      "pl",
    );

    expect(questions).toHaveLength(20);
    expect(questions.some((question) => question.kind === "numeric")).toBe(true);
    expect(questions.some((question) => question.kind === "word")).toBe(true);
    expect(questions.some((question) => question.kind === "mcq")).toBe(true);
    expect(questions.every((question) => question.points >= 1)).toBe(true);
  });

  it("creates long multi-step reasoning tasks", () => {
    const question = generateReasoningQuestion("functions", "pl", 42);

    expect(question.kind).toBe("word");
    expect(question.difficulty).toBe("hard");
    expect(question.points).toBeGreaterThanOrEqual(3);
    expect(question.lead.length).toBeGreaterThan(140);
    expect(question.solutionMath).toBeTruthy();
  });

  it("keeps a quick variant concise and numerically checkable", () => {
    const question = generateQuestion("equations", "en", 42, "quick");

    expect(question.kind).toBe("numeric");
    expect(Number.isFinite(question.answer)).toBe(true);
    expect(question.hint.length).toBeGreaterThan(5);
  });
});
