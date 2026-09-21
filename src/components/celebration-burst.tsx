"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PartyPopper, Zap } from "lucide-react";

const particles = Array.from({ length: 48 }, (_, index) => {
  const angle = ((index % 16) / 16) * Math.PI * 2;
  const distance = 110 + ((index * 37) % 150);
  return {
    "--x": `${Math.cos(angle) * distance}px`,
    "--y": `${Math.sin(angle) * distance - 70}px`,
    "--r": `${(index % 2 ? 1 : -1) * (120 + index * 13)}deg`,
    "--d": `${(index % 6) * 35}ms`,
  } as CSSProperties;
});

export function CelebrationBurst({
  active,
  message,
  fireworks = false,
}: {
  active: boolean;
  message: string;
  fireworks?: boolean;
}) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) return;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => setVisible(false), 2300);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active, fireworks, message]);

  if (!visible) return null;

  return (
    <div
      className={fireworks ? "lesson-celebration has-fireworks" : "lesson-celebration"}
      role="status"
      aria-live="polite"
    >
      {fireworks && (
        <div className="lesson-confetti" aria-hidden="true">
          {particles.map((style, index) => (
            <i key={index} style={style} />
          ))}
        </div>
      )}

      <div className="lesson-xp-toast">
        {fireworks ? (
          <PartyPopper size={19} aria-hidden="true" />
        ) : (
          <Zap size={19} aria-hidden="true" />
        )}
        <b>{message}</b>
      </div>
    </div>
  );
}
