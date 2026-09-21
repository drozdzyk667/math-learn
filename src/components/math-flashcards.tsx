"use client";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Layers3,
  RotateCw,
  Shuffle,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { curriculum } from "@/content/curriculum";
import {
  flashcardCounts,
  mathFlashcards,
  type FlashcardLevel,
} from "@/content/flashcards";
import type { Language } from "@/lib/i18n";
import { MathFormula } from "./math";

type DeckFilter = "all" | "favorites";
type LevelFilter = "all" | FlashcardLevel;

function shuffle<T>(items: readonly T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

export function MathFlashcards({ lang }: { lang: Language }) {
  const counts = flashcardCounts();
  const [level, setLevel] = useState<LevelFilter>("all");
  const [filter, setFilter] = useState<DeckFilter>("all");
  const [unitId, setUnitId] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const raw = localStorage.getItem("mathly-flashcard-favorites");
      if (raw) {
        try {
          setFavoriteIds(JSON.parse(raw) as string[]);
        } catch {
          setFavoriteIds([]);
        }
      }
      setFavoritesReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!favoritesReady) return;
    localStorage.setItem(
      "mathly-flashcard-favorites",
      JSON.stringify(favoriteIds),
    );
  }, [favoriteIds, favoritesReady]);

  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const sourceCards = useMemo(
    () =>
      mathFlashcards.filter(
        (card) =>
          (level === "all" || card.level === level) &&
          (unitId === "all" || card.unitId === unitId) &&
          (filter === "all" || favorites.has(card.id)),
      ),
    [favorites, filter, level, unitId],
  );

  const cards = useMemo(() => {
    if (!order.length) return sourceCards;
    const byId = new Map(sourceCards.map((card) => [card.id, card]));
    const ordered = order
      .map((id) => byId.get(id))
      .filter(Boolean) as typeof sourceCards;
    const used = new Set(ordered.map((card) => card.id));
    return [...ordered, ...sourceCards.filter((card) => !used.has(card.id))];
  }, [order, sourceCards]);

  const safeIndex = cards.length ? Math.min(index, cards.length - 1) : 0;
  const card = cards[safeIndex];
  const favoriteCount = mathFlashcards.filter((item) =>
    favorites.has(item.id),
  ).length;

  const resetDeck = () => {
    setIndex(0);
    setOrder([]);
    setFlipped(false);
  };

  const changeLevel = (next: LevelFilter) => {
    setLevel(next);
    resetDeck();
  };

  const changeUnit = (next: string) => {
    setUnitId(next);
    resetDeck();
  };

  const changeFilter = (next: DeckFilter) => {
    setFilter(next);
    resetDeck();
  };

  const move = (delta: number) => {
    if (!cards.length) return;
    setIndex((current) => (current + delta + cards.length) % cards.length);
    setFlipped(false);
  };

  const shuffleDeck = () => {
    setOrder(shuffle(sourceCards).map((item) => item.id));
    setIndex(0);
    setFlipped(false);
  };

  const toggleFavorite = () => {
    if (!card) return;
    setFavoriteIds((current) =>
      current.includes(card.id)
        ? current.filter((id) => id !== card.id)
        : [...current, card.id],
    );
  };

  const unit = card
    ? curriculum.find((item) => item.id === card.unitId)
    : undefined;

  return (
    <div className="math-flashcards-page">
      <section className="flashcards-hero panel">
        <div className="flashcards-hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} />
            {lang === "pl" ? "TRYB FISZEK" : "FLASHCARD MODE"}
          </span>
          <h1>
            {lang === "pl"
              ? "Jedna rzecz. Jedna odpowiedź. Powtórka."
              : "One idea. One answer. Repeat."}
          </h1>
          <p>
            {lang === "pl"
              ? "Najpierw odpowiedz w głowie. Dopiero potem odwróć kartę i sprawdź wzór oraz krótkie wyjaśnienie, dlaczego działa."
              : "Answer in your head first. Then flip the card to reveal the formula and a short explanation of why it works."}
          </p>
          <div className="flashcard-stats">
            <span><strong>{counts.total}</strong>{lang === "pl" ? " wszystkich fiszek" : " total cards"}</span>
            <span><strong>{counts.basic}</strong>{lang === "pl" ? " podstawowych" : " foundation"}</span>
            <span><strong>{counts.advanced}</strong>{lang === "pl" ? " rozszerzonych" : " advanced"}</span>
            <span><Heart size={14} fill={favoriteCount ? "currentColor" : "none"} /><strong>{favoriteCount}</strong>{lang === "pl" ? " ulubionych" : " favorites"}</span>
          </div>
        </div>

        <div className="flashcards-hero-art" aria-hidden="true">
          <span className="flash-orbit flash-orbit-a" />
          <span className="flash-orbit flash-orbit-b" />
          <div className="flash-math-card front">a²+b²</div>
          <div className="flash-math-card back">sin α</div>
          <div className="flash-math-card mini">∑</div>
        </div>
      </section>

      <section className="flashcard-toolbar panel">
        <div className="flashcard-toolbar-row">
          <div className="flashcard-segmented" role="group" aria-label={lang === "pl" ? "Poziom fiszek" : "Flashcard level"}>
            {([
              ["all", lang === "pl" ? "Wszystkie" : "All"],
              ["basic", lang === "pl" ? "Podstawa" : "Foundation"],
              ["advanced", lang === "pl" ? "Rozszerzenie" : "Advanced"],
            ] as const).map(([value, label]) => (
              <button type="button" key={value} className={level === value ? "active" : ""} aria-pressed={level === value} onClick={() => changeLevel(value)}>
                {label}
                <small>{value === "all" ? counts.total : value === "basic" ? counts.basic : counts.advanced}</small>
              </button>
            ))}
          </div>

          <div className="flashcard-segmented compact" role="group" aria-label={lang === "pl" ? "Filtr talii" : "Deck filter"}>
            <button type="button" className={filter === "all" ? "active" : ""} aria-pressed={filter === "all"} onClick={() => changeFilter("all")}>
              <Layers3 size={14} />{lang === "pl" ? "Talia" : "Deck"}
            </button>
            <button type="button" className={filter === "favorites" ? "active" : ""} aria-pressed={filter === "favorites"} onClick={() => changeFilter("favorites")}>
              <Heart size={14} fill={filter === "favorites" ? "currentColor" : "none"} />
              {lang === "pl" ? "Ulubione" : "Favorites"}<small>{favoriteCount}</small>
            </button>
          </div>

          <button className="secondary flash-shuffle" onClick={shuffleDeck} disabled={!cards.length}>
            <Shuffle size={16} />{lang === "pl" ? "Przetasuj" : "Shuffle"}
          </button>
        </div>

        <label className="flashcard-unit-filter">
          <span>{lang === "pl" ? "Dział" : "Unit"}</span>
          <select value={unitId} onChange={(event) => changeUnit(event.target.value)}>
            <option value="all">{lang === "pl" ? "Wszystkie działy" : "All units"}</option>
            {curriculum.map((item) => (
              <option key={item.id} value={item.id}>{item.roman}. {item.title[lang]}</option>
            ))}
          </select>
        </label>
      </section>

      {!cards.length ? (
        <section className="flashcard-empty panel">
          <Heart size={30} />
          <h2>{lang === "pl" ? "Tutaj na razie nic nie ma." : "Nothing here yet."}</h2>
          <p>{lang === "pl" ? "Zmień filtr albo dodaj kilka fiszek do ulubionych." : "Change the filter or add a few cards to your favorites."}</p>
          <button className="primary" onClick={() => changeFilter("all")}>{lang === "pl" ? "Pokaż całą talię" : "Show full deck"}</button>
        </section>
      ) : (
        <>
          <div className="flashcard-progress-row">
            <span>{safeIndex + 1} / {cards.length}</span>
            <div aria-hidden="true"><i style={{ width: ((safeIndex + 1) / cards.length) * 100 + "%" }} /></div>
            <strong>{unit?.roman}. {unit?.title[lang]} • {card.tag[lang]}</strong>
          </div>

          <section className="flashcard-stage">
            <button
              type="button"
              className={"flashcard-favorite-button " + (favorites.has(card.id) ? "active" : "")}
              aria-pressed={favorites.has(card.id)}
              aria-label={favorites.has(card.id) ? (lang === "pl" ? "Usuń z ulubionych" : "Remove from favorites") : (lang === "pl" ? "Dodaj do ulubionych" : "Add to favorites")}
              onClick={toggleFavorite}
            >
              <Heart size={21} fill={favorites.has(card.id) ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              className={"math-flashcard " + (flipped ? "is-flipped" : "")}
              aria-pressed={flipped}
              aria-label={flipped ? (lang === "pl" ? "Pokaż pytanie" : "Show question") : (lang === "pl" ? "Pokaż odpowiedź" : "Show answer")}
              onClick={() => setFlipped((current) => !current)}
            >
              <span className="math-flashcard-inner">
                <span className="math-flashcard-face math-flashcard-front">
                  <span className="flashcard-kicker">{lang === "pl" ? "SPRÓBUJ ODPOWIEDZIEĆ" : "TRY TO ANSWER"}</span>
                  <strong>{card.front[lang]}</strong>
                  <span className="flashcard-face-footer"><RotateCw size={17} />{lang === "pl" ? "Kliknij kartę, żeby odsłonić odpowiedź" : "Click the card to reveal the answer"}</span>
                </span>

                <span className="math-flashcard-face math-flashcard-back">
                  <span className="flashcard-kicker">{lang === "pl" ? "NAJKRÓCEJ" : "SHORT ANSWER"}</span>
                  <strong>{card.back[lang]}</strong>
                  {card.formula && <span className="flashcard-formula"><MathFormula tex={card.formula} display /></span>}
                  <span className="flashcard-why"><small>{lang === "pl" ? "DLACZEGO?" : "WHY?"}</small><p>{card.why[lang]}</p></span>
                  <span className="flashcard-face-footer"><RotateCw size={17} />{lang === "pl" ? "Kliknij, żeby wrócić do pytania" : "Click to see the question again"}</span>
                </span>
              </span>
            </button>
          </section>

          <div className="flashcard-controls">
            <button className="secondary" onClick={() => move(-1)}><ArrowLeft size={18} />{lang === "pl" ? "Poprzednia" : "Previous"}</button>
            <button className="primary" onClick={() => setFlipped((current) => !current)}><RotateCw size={18} />{flipped ? (lang === "pl" ? "Pytanie" : "Question") : (lang === "pl" ? "Pokaż odpowiedź" : "Show answer")}</button>
            <button className="secondary" onClick={() => move(1)}>{lang === "pl" ? "Następna" : "Next"}<ArrowRight size={18} /></button>
          </div>

          <section className="flashcard-tip-row">
            <div><Star size={17} /><span>{lang === "pl" ? "Nie odwracaj od razu. Spróbuj powiedzieć odpowiedź własnymi słowami." : "Do not flip immediately. Try saying the answer in your own words first."}</span></div>
            <div><Shuffle size={17} /><span>{lang === "pl" ? "Mieszaj działy, żeby ćwiczyć rozpoznawanie metody, a nie kolejności." : "Mix units so you practise recognising the method rather than the order."}</span></div>
          </section>
        </>
      )}
    </div>
  );
}
