import { describe, expect, it } from "vitest";
import { curriculum } from "../src/content/curriculum";
import { flashcardCounts, mathFlashcards } from "../src/content/flashcards";

describe("math flashcards", () => {
  it("contains a substantial deck across every curriculum unit", () => {
    const counts = flashcardCounts();

    expect(counts.total).toBeGreaterThanOrEqual(50);
    expect(counts.basic).toBeGreaterThan(counts.advanced);

    for (const unit of curriculum) {
      expect(
        mathFlashcards.filter((card) => card.unitId === unit.id).length,
        unit.id,
      ).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps both languages and explanations on every card", () => {
    for (const card of mathFlashcards) {
      expect(card.front.pl.length).toBeGreaterThan(4);
      expect(card.front.en.length).toBeGreaterThan(4);
      expect(card.back.pl.length).toBeGreaterThan(2);
      expect(card.back.en.length).toBeGreaterThan(2);
      expect(card.why.pl.length).toBeGreaterThan(10);
      expect(card.why.en.length).toBeGreaterThan(10);
    }
  });
});
