"use client";

import { useEffect } from "react";

/*
 * Phones are stricter about autoplay than the markup alone can satisfy: iOS in
 * Low Power Mode and Android with a data saver ignore `autoplay` until a user
 * gesture, and Safari throttles several videos on one page. This watches every
 * autoplay video on the page: it plays each one as it scrolls into view and
 * pauses it when it leaves, retries on the first touch or scroll, and picks up
 * videos that mount later.
 */
export default function AutoplayVideos() {
  useEffect(() => {
    const tryPlay = (v: HTMLVideoElement) => {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      if (v.paused) v.play().catch(() => {});
    };

    const visible = new Set<HTMLVideoElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) { visible.add(v); tryPlay(v); }
          else { visible.delete(v); if (!v.paused) v.pause(); }
        }
      },
      { threshold: 0.05 },
    );

    const watched = new WeakSet<HTMLVideoElement>();
    const scan = () => {
      document.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((v) => {
        if (watched.has(v)) return;
        watched.add(v);
        io.observe(v);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    /* The first gesture unlocks playback where autoplay was refused. */
    const nudge = () => visible.forEach(tryPlay);
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("touchstart", nudge, opts);
    window.addEventListener("pointerdown", nudge, opts);
    window.addEventListener("scroll", nudge, opts);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) nudge(); });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("touchstart", nudge);
      window.removeEventListener("pointerdown", nudge);
      window.removeEventListener("scroll", nudge);
    };
  }, []);
  return null;
}
