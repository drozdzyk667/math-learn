"use client";

import { useMemo, useState } from "react";
import { Activity, MoveDiagonal2, Sigma, Waves } from "lucide-react";
import { MathFormula } from "./math";

type LabMode = "quadratic" | "linear" | "sine" | "absolute";

const WIDTH = 620;
const HEIGHT = 320;
const X_MIN = -10;
const X_MAX = 10;
const Y_MIN = -10;
const Y_MAX = 10;

function toPath(fn: (x: number) => number) {
  const sx = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * WIDTH;
  const sy = (y: number) =>
    HEIGHT - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * HEIGHT;

  const points: string[] = [];
  let drawing = false;

  for (let index = 0; index <= 320; index += 1) {
    const x = X_MIN + (index / 320) * (X_MAX - X_MIN);
    const y = fn(x);
    const visible = Number.isFinite(y) && y >= Y_MIN - 5 && y <= Y_MAX + 5;

    if (!visible) {
      drawing = false;
      continue;
    }

    points.push(
      `${drawing ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`,
    );
    drawing = true;
  }

  return points.join(" ");
}

const signed = (value: number) => {
  if (value === 0) return "";
  return value > 0 ? `+${value}` : `${value}`;
};

type SliderConfig = {
  key: string;
  value: number;
  setter: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
};

export function FunctionLab({
  labels,
  language,
}: {
  labels: { title: string; sub: string };
  language: "pl" | "en";
}) {
  const [mode, setMode] = useState<LabMode>("quadratic");

  const [qa, setQa] = useState(1);
  const [qb, setQb] = useState(0);
  const [qc, setQc] = useState(-2);

  const [lm, setLm] = useState(1);
  const [lb, setLb] = useState(0);

  const [sa, setSa] = useState(3);
  const [sb, setSb] = useState(1);
  const [sd, setSd] = useState(0);

  const [aa, setAa] = useState(1);
  const [ah, setAh] = useState(0);
  const [ak, setAk] = useState(-2);

  const config = useMemo(() => {
    if (mode === "linear") {
      const formula = `f(x)=${lm}x${signed(lb)}`;
      const zero = lm === 0 ? null : -lb / lm;
      return {
        formula,
        path: toPath((x) => lm * x + lb),
        characteristic:
          lm === 0
            ? language === "pl"
              ? "Funkcja stała • brak pojedynczego miejsca zerowego"
              : "Constant function • no single zero"
            : language === "pl"
              ? `Miejsce zerowe: x = ${zero?.toFixed(2)}`
              : `Zero: x = ${zero?.toFixed(2)}`,
        description:
          language === "pl"
            ? "Sprawdź, jak współczynnik kierunkowy zmienia nachylenie prostej, a wyraz wolny przesuwa ją w pionie."
            : "See how the slope changes the line angle and the intercept moves it vertically.",
        sliders: [
          {
            key: "a",
            value: lm,
            setter: setLm,
            min: -4,
            max: 4,
            step: 0.25,
            label: language === "pl" ? "Współczynnik kierunkowy" : "Slope",
          },
          {
            key: "b",
            value: lb,
            setter: setLb,
            min: -8,
            max: 8,
            step: 0.5,
            label: language === "pl" ? "Przecięcie z osią Y" : "Y-intercept",
          },
        ] satisfies SliderConfig[],
      };
    }

    if (mode === "sine") {
      const formula = `f(x)=${sa}\\sin(${sb}x)${signed(sd)}`;
      const period = sb === 0 ? null : (2 * Math.PI) / Math.abs(sb);
      return {
        formula,
        path: toPath((x) => sa * Math.sin(sb * x) + sd),
        characteristic:
          sb === 0
            ? language === "pl"
              ? "B = 0 • wykres staje się funkcją stałą"
              : "B = 0 • the graph becomes constant"
            : language === "pl"
              ? `Amplituda: ${Math.abs(sa).toFixed(2)} • okres: ${period?.toFixed(2)}`
              : `Amplitude: ${Math.abs(sa).toFixed(2)} • period: ${period?.toFixed(2)}`,
        description:
          language === "pl"
            ? "Zmieniaj amplitudę, częstotliwość i przesunięcie pionowe. To dobry sposób, żeby zobaczyć okresowość zamiast uczyć się jej na pamięć."
            : "Change amplitude, frequency and vertical shift to see periodic behaviour instead of memorising it.",
        sliders: [
          {
            key: "A",
            value: sa,
            setter: setSa,
            min: -6,
            max: 6,
            step: 0.25,
            label: language === "pl" ? "Amplituda" : "Amplitude",
          },
          {
            key: "B",
            value: sb,
            setter: setSb,
            min: 0,
            max: 3,
            step: 0.25,
            label: language === "pl" ? "Częstotliwość / okres" : "Frequency / period",
          },
          {
            key: "D",
            value: sd,
            setter: setSd,
            min: -5,
            max: 5,
            step: 0.5,
            label: language === "pl" ? "Przesunięcie pionowe" : "Vertical shift",
          },
        ] satisfies SliderConfig[],
      };
    }

    if (mode === "absolute") {
      const formula = `f(x)=${aa}\\left|x${ah === 0 ? "" : signed(-ah)}\\right|${signed(ak)}`;
      return {
        formula,
        path: toPath((x) => aa * Math.abs(x - ah) + ak),
        characteristic:
          language === "pl"
            ? `Wierzchołek: W = (${ah.toFixed(2)}, ${ak.toFixed(2)})`
            : `Vertex: W = (${ah.toFixed(2)}, ${ak.toFixed(2)})`,
        description:
          language === "pl"
            ? "Obserwuj, jak znak i wartość współczynnika a zmieniają kierunek i stromość litery V, a h i k przesuwają wierzchołek."
            : "See how coefficient a changes the V direction and steepness while h and k move its vertex.",
        sliders: [
          {
            key: "a",
            value: aa,
            setter: setAa,
            min: -4,
            max: 4,
            step: 0.25,
            label: language === "pl" ? "Kierunek i stromość" : "Direction and steepness",
          },
          {
            key: "h",
            value: ah,
            setter: setAh,
            min: -6,
            max: 6,
            step: 0.5,
            label: language === "pl" ? "Przesunięcie poziome" : "Horizontal shift",
          },
          {
            key: "k",
            value: ak,
            setter: setAk,
            min: -6,
            max: 6,
            step: 0.5,
            label: language === "pl" ? "Przesunięcie pionowe" : "Vertical shift",
          },
        ] satisfies SliderConfig[],
      };
    }

    const vertexX = qa === 0 ? null : -qb / (2 * qa);
    const vertexY =
      vertexX === null ? null : qa * vertexX * vertexX + qb * vertexX + qc;

    return {
      formula:
        qa === 0
          ? `f(x)=${qb}x${signed(qc)}`
          : `f(x)=${qa}x^2${signed(qb)}x${signed(qc)}`,
      path: toPath((x) => qa * x * x + qb * x + qc),
      characteristic:
        vertexX === null
          ? language === "pl"
            ? "a = 0 • funkcja liniowa"
            : "a = 0 • linear function"
          : language === "pl"
            ? `Wierzchołek: W = (${vertexX.toFixed(2)}, ${vertexY?.toFixed(2)})`
            : `Vertex: W = (${vertexX.toFixed(2)}, ${vertexY?.toFixed(2)})`,
      description:
        language === "pl"
          ? "Przesuwaj parametry i obserwuj wierzchołek, szerokość oraz kierunek ramion paraboli."
          : "Move the parameters and observe the vertex, width and opening direction of the parabola.",
      sliders: [
        {
          key: "a",
          value: qa,
          setter: setQa,
          min: -3,
          max: 3,
          step: 0.25,
          label:
            language === "pl"
              ? "Kierunek i szerokość paraboli"
              : "Direction and width of the parabola",
        },
        {
          key: "b",
          value: qb,
          setter: setQb,
          min: -6,
          max: 6,
          step: 0.5,
          label:
            language === "pl"
              ? "Położenie osi symetrii"
              : "Position of the symmetry axis",
        },
        {
          key: "c",
          value: qc,
          setter: setQc,
          min: -8,
          max: 8,
          step: 0.5,
          label:
            language === "pl"
              ? "Przecięcie z osią Y"
              : "Y-axis intercept",
        },
      ] satisfies SliderConfig[],
    };
  }, [
    aa,
    ah,
    ak,
    language,
    lb,
    lm,
    mode,
    qa,
    qb,
    qc,
    sa,
    sb,
    sd,
  ]);

  const modes: Array<{
    id: LabMode;
    icon: typeof Sigma;
    pl: string;
    en: string;
  }> = [
    { id: "quadratic", icon: Sigma, pl: "Parabola", en: "Quadratic" },
    { id: "linear", icon: MoveDiagonal2, pl: "Prosta", en: "Linear" },
    { id: "sine", icon: Waves, pl: "Sinus", en: "Sine" },
    { id: "absolute", icon: Activity, pl: "Moduł", en: "Absolute value" },
  ];

  return (
    <section className="lab-shell" aria-labelledby="function-lab-title">
      <div
        className="lab-mode-tabs panel"
        role="group"
        aria-label={language === "pl" ? "Rodzaj wykresu" : "Graph type"}
      >
        {modes.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? "active" : ""}
              aria-pressed={mode === item.id}
              onClick={() => setMode(item.id)}
            >
              <Icon size={17} />
              <span>{language === "pl" ? item.pl : item.en}</span>
            </button>
          );
        })}
      </div>

      <div className="lab-grid">
        <div className="panel lab-copy">
          <span className="eyebrow">
            {language === "pl" ? "INTERAKTYWNE LABORATORIUM" : "INTERACTIVE LAB"}
          </span>
          <h2 id="function-lab-title">{labels.title}</h2>
          <p>{config.description}</p>

          <div className="formula-big" aria-live="polite">
            <MathFormula tex={config.formula} display />
          </div>

          <div className="vertex-slot">
            <div className="vertex-pill" aria-live="polite">
              {config.characteristic}
            </div>
          </div>

          <div className="parameter-list">
            {config.sliders.map((item) => (
              <label className="slider" key={item.key}>
                <span className="slider-heading">
                  <strong className="parameter-symbol">{item.key}</strong>
                  <span className="parameter-description">{item.label}</span>
                  <output htmlFor={`parameter-${mode}-${item.key}`}>
                    {item.value}
                  </output>
                </span>
                <input
                  id={`parameter-${mode}-${item.key}`}
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={item.value}
                  aria-label={`${item.key}: ${item.label}`}
                  onChange={(event) => item.setter(Number(event.target.value))}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="panel graph-panel">
          <div className="graph-panel-heading">
            <div>
              <span>
                {language === "pl" ? "PODGLĄD NA ŻYWO" : "LIVE PREVIEW"}
              </span>
              <b>
                {language === "pl"
                  ? modes.find((item) => item.id === mode)?.pl
                  : modes.find((item) => item.id === mode)?.en}
              </b>
            </div>
            <small>
              {language === "pl"
                ? "Zakres osi: −10 do 10"
                : "Axis range: −10 to 10"}
            </small>
          </div>

          <svg
            viewBox="0 0 620 320"
            role="img"
            aria-labelledby="graph-title graph-description"
            preserveAspectRatio="xMidYMid meet"
          >
            <title id="graph-title">
              {language === "pl" ? "Wykres funkcji" : "Function graph"}
            </title>
            <desc id="graph-description">
              {language === "pl"
                ? `Wykres funkcji: ${config.characteristic}.`
                : `Function graph: ${config.characteristic}.`}
            </desc>
            <defs>
              <pattern
                id="lab-grid-pattern"
                width="31"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 31 0 L 0 0 0 16"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity=".1"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="620" height="320" fill="url(#lab-grid-pattern)" />
            <line x1="0" y1="160" x2="620" y2="160" className="axis" />
            <line x1="310" y1="0" x2="310" y2="320" className="axis" />
            <path d={config.path} className="curve" fill="none" />
          </svg>
        </div>
      </div>
    </section>
  );
}
