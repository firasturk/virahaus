"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  /** Pixels of page scroll that count as "scrolled down". */
  threshold?: number;
}

/*
 * Hides its children until the visitor scrolls down, and hides them again when
 * they return to the top. The page may have nothing below the hero yet, so
 * scroll *intent* — wheel, touch and keyboard — counts as well as scroll
 * position; otherwise a one-screen page could never trigger it.
 *
 * The wrapper is `display: contents`, so it is invisible to layout: the card
 * stays exactly where the artboard puts it. State lives in a data attribute
 * and the transition is pure CSS, so no re-render happens on scroll.
 */
export default function ScrollReveal({ children, threshold = 24 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let revealed = false;
    let touchStartY = 0;

    const set = (next: boolean) => {
      if (next === revealed) return;
      revealed = next;
      el.dataset.revealed = String(next);
    };

    const atTop = () => window.scrollY <= 0;

    const onScroll = () => {
      if (window.scrollY > threshold) set(true);
      else if (atTop()) set(false);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) set(true);
      else if (event.deltaY < 0 && atTop()) set(false);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      const travelled = touchStartY - y;
      if (travelled > 12) set(true);
      else if (travelled < -12 && atTop()) set(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", " "].includes(event.key)) set(true);
      else if (["ArrowUp", "PageUp", "Home"].includes(event.key) && atTop()) set(false);
    };

    /* Someone landing mid-page after a reload should not see it hidden. */
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [threshold]);

  return (
    <div ref={ref} data-revealed="false" style={{ display: "contents" }}>
      {children}
    </div>
  );
}
