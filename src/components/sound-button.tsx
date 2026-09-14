"use client";

import { useEffect, useRef, useState } from "react";

import { Soundscape } from "./ambient-sound";

/*
 * The hero's play control. Idle it is the play glyph; pressed it starts the
 * synthesised rainforest and turns into four bars that move with the rain.
 */
export default function SoundButton({ className, innerClassName }: { className?: string; innerClassName?: string }) {
  const [on, setOn] = useState(false);
  const scape = useRef<Soundscape | null>(null);

  useEffect(() => () => scape.current?.stop(), []);

  const toggle = () => {
    if (!scape.current) scape.current = new Soundscape();
    if (on) { scape.current.stop(); setOn(false); }
    else { void scape.current.start(); setOn(true); }
  };

  return (
    <button
      type="button"
      className={className}
      data-on={on}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn the rainforest sound off" : "Play the rainforest sound"}
      title={on ? "Sound on" : "Sound off"}
    >
      <span className={innerClassName}>
        {on ? (
          <svg viewBox="0 0 17 17" fill="none" aria-hidden>
            {[2.5, 6.5, 10.5, 14.5].map((x, i) => (
              <rect key={x} x={x - 1} y="4" width="2" height="9" rx="1" fill="currentColor" style={{ transformOrigin: "50% 50%", animation: `soundBar 0.9s ease-in-out ${i * 0.15}s infinite alternate` }} />
            ))}
          </svg>
        ) : (
          <svg viewBox="0 0 17 17" fill="none" aria-hidden>
            <path d="M4.8 1.9 14.4 8.5 4.8 15.1Z" fill="currentColor" />
          </svg>
        )}
      </span>
    </button>
  );
}
