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

  it("creates long multi-step reasoning tasks for every curriculum unit", () => {
    const unitIds = [
      "real-numbers",
      "algebra",
      "equations",
      "systems",
      "functions",
      "sequences",
      "trigonometry",
      "planimetry",
      "analytic-geometry",
      "stereometry",
      "combinatorics",
      "probability",
      "calculus",
    ];

    for (const [index, unitId] of unitIds.entries()) {
      const question = generateReasoningQuestion(unitId, "pl", 42 + index);

      expect(question.kind, unitId).toBe("word");
      expect(question.difficulty, unitId).toBe("hard");
      expect(question.points, unitId).toBeGreaterThanOrEqual(4);
      expect(question.lead.length, unitId).toBeGreaterThan(100);
      expect(question.solutionMath, unitId).toBeTruthy();
    }
  });

  it("uses reasoning problems for the dedicated word-problem mode", () => {
    const question = generateQuestion("equations", "pl", 77, "word");

    expect(question.kind).toBe("word");
    expect(question.difficulty).toBe("hard");
    expect(question.points).toBeGreaterThanOrEqual(4);
    expect(question.lead.length).toBeGreaterThan(100);
  });

  it("keeps a quick variant concise and numerically checkable", () => {
    const question = generateQuestion("equations", "en", 42, "quick");

    expect(question.kind).toBe("numeric");
    expect(Number.isFinite(question.answer)).toBe(true);
    expect(question.hint.length).toBeGreaterThan(5);
  });
});
