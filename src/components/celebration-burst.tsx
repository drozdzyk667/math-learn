"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PartyPopper } from "lucide-react";

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
}: {
  active: boolean;
  message: string;
}) {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) return;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => setVisible(false), 2600);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);

  if (!visible) return null;

  return (
    <div className="lesson-celebration" role="status" aria-live="polite">
      <div className="lesson-confetti" aria-hidden="true">
        {particles.map((style, index) => (
          <i key={index} style={style} />
        ))}
      </div>
      <div className="lesson-xp-toast">
        <PartyPopper size={20} aria-hidden="true" />
        <b>{message}</b>
      </div>
    </div>
  );
}
