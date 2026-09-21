"use client";

import { useMemo, useState } from "react";
import { MathFormula } from "./math";

function toPath(a: number, b: number, c: number) {
  const width = 620;
  const height = 320;
  const xMin = -10;
  const xMax = 10;
  const yMin = -10;
  const yMax = 10;

  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
  const sy = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = xMin + (i / 240) * (xMax - xMin);
    const y = a * x * x + b * x + c;
    if (y >= yMin - 4 && y <= yMax + 4) {
      pts.push(`${pts.length ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
  }
  return pts.join(" ");
}

const signed = (value: number) => {
  if (value === 0) return "";
  return value > 0 ? `+${value}` : `${value}`;
};

export function FunctionLab({
  labels,
}: {
  labels: { title: string; sub: string };
}) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-2);

  const path = useMemo(() => toPath(a, b, c), [a, b, c]);
  const vertexX = a === 0 ? null : -b / (2 * a);
  const vertexY =
    vertexX === null ? null : a * vertexX * vertexX + b * vertexX + c;

  const formula = a === 0
    ? `f(x)=${b}x${signed(c)}`
    : `f(x)=${a}x^2${signed(b)}x${signed(c)}`;

  return (
    <section className="lab-grid">
      <div className="panel lab-copy">
        <span className="eyebrow">INTERACTIVE LAB</span>
        <h2>{labels.title}</h2>
        <p>{labels.sub}</p>

        <div className="formula-big">
          <MathFormula tex={formula} display />
        </div>

        <div className="vertex-slot" aria-live="polite">
          {vertexX !== null ? (
            <div className="vertex-pill">
              <MathFormula
                tex={`W=(${vertexX.toFixed(2)},\\,${vertexY?.toFixed(2)})`}
              />
            </div>
          ) : (
            <div className="vertex-pill ghost-vertex">W = —</div>
          )}
        </div>

        {[
          { k: "a", v: a, s: setA, min: -3, max: 3, step: 0.25 },
          { k: "b", v: b, s: setB, min: -6, max: 6, step: 0.5 },
          { k: "c", v: c, s: setC, min: -8, max: 8, step: 0.5 },
        ].map((item) => (
          <label className="slider" key={item.k}>
            <span>
              {item.k} <b>{item.v}</b>
            </span>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={item.v}
              onChange={(event) => item.s(Number(event.target.value))}
            />
          </label>
        ))}
      </div>

      <div className="panel graph-panel" aria-label="Quadratic function graph">
        <svg viewBox="0 0 620 320" role="img" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="grid" width="31" height="16" patternUnits="userSpaceOnUse">
              <path
                d="M 31 0 L 0 0 0 16"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".08"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="620" height="320" fill="url(#grid)" />
          <line x1="0" y1="160" x2="620" y2="160" className="axis" />
          <line x1="310" y1="0" x2="310" y2="320" className="axis" />
          <path d={path} className="curve" fill="none" />
        </svg>
      </div>
    </section>
  );
}
