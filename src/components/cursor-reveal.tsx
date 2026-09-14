"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";

import styles from "./cursor-reveal.module.css";

export type TouchFallback = "top" | "bottom" | "drift";

export interface CursorRevealProps {
  /** Layer revealed inside the cursor mask. Image, video, text or component. */
  topLayer: ReactNode;
  /** Layer visible by default, everywhere outside the mask. */
  bottomLayer: ReactNode;
  /** Diameter of the reveal in px while the cursor is inside. */
  revealSize?: number;
  /** Edge softness. 0 is a hard circle, 1 is almost entirely falloff. */
  feather?: number;
  /** How quickly the mask chases the cursor. 0 is languid, 1 is immediate. */
  followSpeed?: number;
  /** How far the mask trails behind the cursor. 0 is none, 1 is heavy drag. */
  inertia?: number;
  /** Milliseconds for the mask to expand when the cursor enters. */
  enterDuration?: number;
  /** Milliseconds for the mask to collapse when the cursor leaves. */
  exitDuration?: number;
  /** Diameter in px while the cursor is outside. 0 hides the reveal entirely. */
  defaultRevealSize?: number;
  /** Shape irregularity. 0 is a true circle, 1 is a strongly lobed blob. */
  organic?: number;
  /** What a device without a fine pointer sees instead of cursor tracking. */
  touchFallback?: TouchFallback;
  /**
   * Until the visitor first moves the mouse, glide the reveal across the stage
   * on its own every few seconds, so the hidden layer announces itself.
   */
  idleSweep?: boolean;
  /** Milliseconds after mount before the first idle sweep. */
  idleSweepDelay?: number;
  /** Rendered above both layers and never masked, for headlines and CTAs. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/*
 * The mask box is drawn larger than the reveal so the offset lobes have room to
 * sit inside it without being clipped into a hard edge. BASE_RADIUS is tuned so
 * the visible blob measures `revealSize` across.
 */
const BOX_RATIO = 1.3;
const BASE_RADIUS = 38.5;

/*
 * `.inner` counter-scales by 1/scale, so the rendered scale is floored to keep
 * that reciprocal finite. Below the floor the reveal is faded out anyway.
 */
const MIN_RENDER_SCALE = 0.08;
const OPACITY_RAMP = 0.28;
const HIDE_BELOW = 0.004;

/* A slow, shallow pulse so the shape breathes rather than sitting inert. */
const BREATH_AMPLITUDE = 0.035;
const BREATH_SPEED = 0.00055;

/* Exponential smoothing rates, in reciprocal seconds. */
const FOLLOW_RATE = [3, 26] as const;
const TRAIL_RATE = [26, 3.5] as const;
const SNAP_RATE = 1000;

/* The idle sweep: one pass along a shallow arc, then a pause before the next. */
const SWEEP_DURATION = 4200;
const SWEEP_GAP = 3200;
const SWEEP_FROM_X = 0.3;
const SWEEP_TO_X = 0.72;
const SWEEP_Y = 0.6;
const SWEEP_LIFT = 0.12;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Alpha stops approximating a gaussian falloff across the feathered band. */
function gradientStops(feather: number) {
  const f = clamp01(feather);
  const core = 1 - f;
  const stops = ["rgba(0,0,0,1) 0%"];

  if (core > 0) stops.push(`rgba(0,0,0,1) ${(core * 100).toFixed(2)}%`);

  const steps = 7;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const alpha = 1 - smoothstep(t);
    stops.push(`rgba(0,0,0,${alpha.toFixed(3)}) ${((core + t * f) * 100).toFixed(2)}%`);
  }

  return stops.join(", ");
}

/*
 * Three overlapping ellipses. Mask layers composite additively by default, so
 * their union reads as an organic blob while staying a single static paint.
 */
const LOBES = [
  { rx: 38.5, ry: 38.5, ox: 0, oy: 0 },
  { rx: 36, ry: 39.5, ox: -7, oy: 5.5 },
  { rx: 39.5, ry: 35.5, ox: 6.5, oy: -5 },
] as const;

function buildMask(feather: number, organic: number) {
  const org = clamp01(organic);
  const stops = gradientStops(feather);
  const lobes = org < 0.001 ? LOBES.slice(0, 1) : LOBES;

  return lobes
    .map(({ rx, ry, ox, oy }) => {
      const w = mix(BASE_RADIUS, rx, org).toFixed(2);
      const h = mix(BASE_RADIUS, ry, org).toFixed(2);
      const cx = (50 + ox * org).toFixed(2);
      const cy = (50 + oy * org).toFixed(2);
      return `radial-gradient(${w}% ${h}% at ${cx}% ${cy}%, ${stops})`;
    })
    .join(", ");
}

export default function CursorReveal({
  topLayer,
  bottomLayer,
  revealSize = 420,
  feather = 0.6,
  followSpeed = 0.5,
  inertia = 0.45,
  enterDuration = 900,
  exitDuration = 700,
  defaultRevealSize = 0,
  organic = 0.7,
  touchFallback = "top",
  idleSweep = false,
  idleSweepDelay = 2800,
  children,
  className,
  style,
}: CursorRevealProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  /*
   * Everything the animation loop reads lives in refs. Pointer movement never
   * touches React state, so no re-render happens between enter and leave.
   */
  const motion = useRef({
    pointerX: 0,
    pointerY: 0,
    leadX: 0,
    leadY: 0,
    x: 0,
    y: 0,
    scale: 0,
    targetScale: 0,
    inside: false,
    lastFrame: 0,
    running: false,
    /* Start time of the idle sweep in flight, or 0. */
    sweepStart: 0,
    interacted: false,
  });

  const rect = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const reduced = useRef(false);
  const mode = useRef<"pointer" | TouchFallback>("pointer");

  const box = revealSize * BOX_RATIO;
  const restScale = clamp01(revealSize > 0 ? defaultRevealSize / revealSize : 0);

  const config = useRef({ box, restScale, followSpeed, inertia, enterDuration, exitDuration, idleSweep, idleSweepDelay });

  /*
   * Republished after every render so prop edits reach the running loop without
   * tearing it down. Committing in an effect rather than during render keeps this
   * safe under concurrent rendering, where a render may be discarded.
   */
  useEffect(() => {
    config.current = { box, restScale, followSpeed, inertia, enterDuration, exitDuration, idleSweep, idleSweepDelay };
  });

  const maskImage = useMemo(() => buildMask(feather, organic), [feather, organic]);

  useEffect(() => {
    const stage = stageRef.current;
    const reveal = revealRef.current;
    const inner = innerRef.current;
    if (!stage || !reveal || !inner) return;

    const state = motion.current;
    let frame = 0;

    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      rect.current = {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      };
      stage.style.setProperty("--stage-w", `${bounds.width}px`);
      stage.style.setProperty("--stage-h", `${bounds.height}px`);
    };

    const draw = (now: number) => {
      const { scale } = state;

      if (scale < HIDE_BELOW) {
        if (reveal.style.visibility !== "hidden") {
          reveal.style.visibility = "hidden";
          reveal.style.opacity = "0";
        }
        return;
      }

      if (reveal.style.visibility !== "visible") reveal.style.visibility = "visible";

      const breath = reduced.current
        ? 1
        : 1 + BREATH_AMPLITUDE * Math.sin(now * BREATH_SPEED);
      const rendered = Math.max(scale, MIN_RENDER_SCALE) * breath;
      const half = config.current.box / 2;

      reveal.style.transform =
        `translate3d(${(state.x - half).toFixed(2)}px, ${(state.y - half).toFixed(2)}px, 0)` +
        ` scale(${rendered.toFixed(4)})`;
      reveal.style.opacity = clamp01(scale / OPACITY_RAMP).toFixed(3);

      /* Inverse of the parent transform, so the top layer stays pinned to the stage. */
      inner.style.transform =
        `translate3d(${(half - state.x / rendered).toFixed(2)}px,` +
        ` ${(half - state.y / rendered).toFixed(2)}px, 0)` +
        ` scale(${(1 / rendered).toFixed(5)})`;
    };

    const tick = (now: number) => {
      const cfg = config.current;
      const dt = Math.min((now - state.lastFrame) / 1000, 0.05);
      state.lastFrame = now;

      /*
       * The idle sweep: a slow arc across the lower half of the stage, then the
       * mask closes and the next pass is scheduled. Any real pointer move ends it.
       */
      if (state.sweepStart) {
        const { width, height } = rect.current;
        const p = (now - state.sweepStart) / SWEEP_DURATION;
        if (p >= 1) {
          state.sweepStart = 0;
          state.targetScale = cfg.restScale;
          scheduleSweep(SWEEP_GAP);
        } else {
          const e = smoothstep(clamp01(p));
          state.pointerX = width * (SWEEP_FROM_X + (SWEEP_TO_X - SWEEP_FROM_X) * e);
          state.pointerY = height * (SWEEP_Y - SWEEP_LIFT * Math.sin(e * Math.PI));
        }
      }

      /* An ambient path for devices that cannot point at anything. */
      if (mode.current === "drift") {
        const { width, height } = rect.current;
        state.pointerX = width * (0.5 + 0.3 * Math.sin(now * 0.00019));
        state.pointerY = height * (0.5 + 0.18 * Math.sin(now * 0.00031 + 1.2));
      }

      const followRate = reduced.current
        ? SNAP_RATE
        : mix(FOLLOW_RATE[0], FOLLOW_RATE[1], clamp01(cfg.followSpeed));
      const trailRate = reduced.current
        ? SNAP_RATE
        : mix(TRAIL_RATE[0], TRAIL_RATE[1], clamp01(cfg.inertia));

      /*
       * Two cascaded exponential filters: the first sets how eagerly the mask
       * chases the cursor, the second adds the trailing weight. Framing both in
       * terms of dt keeps the feel identical at 60Hz and 120Hz.
       */
      const kFollow = 1 - Math.exp(-followRate * dt);
      state.leadX += (state.pointerX - state.leadX) * kFollow;
      state.leadY += (state.pointerY - state.leadY) * kFollow;

      const kTrail = 1 - Math.exp(-trailRate * dt);
      state.x += (state.leadX - state.x) * kTrail;
      state.y += (state.leadY - state.y) * kTrail;

      const growing = state.targetScale > state.scale;
      const duration = Math.max(growing ? cfg.enterDuration : cfg.exitDuration, 1);
      /* Five time constants lands within ~1% of the target in `duration` ms. */
      const kScale = 1 - Math.exp((-5000 / duration) * dt);
      state.scale += (state.targetScale - state.scale) * kScale;

      draw(now);

      const settled =
        Math.abs(state.scale - state.targetScale) < 0.0005 &&
        Math.abs(state.x - state.pointerX) < 0.05 &&
        Math.abs(state.y - state.pointerY) < 0.05;

      /*
       * Park the loop once nothing is moving and nothing is breathing, so an
       * idle hero costs no frames at all.
       */
      if (settled && (state.scale < HIDE_BELOW || reduced.current)) {
        state.running = false;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (state.running) return;
      state.running = true;
      state.lastFrame = performance.now();
      frame = requestAnimationFrame(tick);
    };

    let sweepTimer = 0;
    const scheduleSweep = (delay: number) => {
      window.clearTimeout(sweepTimer);
      if (!config.current.idleSweep || state.interacted || mode.current !== "pointer") return;
      sweepTimer = window.setTimeout(() => {
        if (state.interacted || state.inside || mode.current !== "pointer" || reduced.current) return;
        const { width, height } = rect.current;
        state.sweepStart = performance.now();
        state.pointerX = state.leadX = state.x = width * SWEEP_FROM_X;
        state.pointerY = state.leadY = state.y = height * SWEEP_Y;
        state.targetScale = 1;
        start();
      }, delay);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (mode.current !== "pointer") return;
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

      if (!state.interacted) {
        state.interacted = true;
        state.sweepStart = 0;
        window.clearTimeout(sweepTimer);
        stage.dataset.interacted = "true";
      }

      state.pointerX = event.clientX - rect.current.left;
      state.pointerY = event.clientY - rect.current.top;

      /* On entry, place the mask under the cursor and let it grow there. */
      if (!state.inside) {
        state.inside = true;
        state.targetScale = 1;
        state.leadX = state.x = state.pointerX;
        state.leadY = state.y = state.pointerY;
      }

      start();
    };

    const onPointerLeave = () => {
      if (mode.current !== "pointer") return;
      state.inside = false;
      state.targetScale = config.current.restScale;
      start();
    };

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMode = () => {
      reduced.current = prefersReduced.matches;
      mode.current = finePointer.matches ? "pointer" : touchFallback;
      stage.dataset.mode = mode.current;

      if (mode.current === "drift") {
        state.targetScale = 1;
        start();
      } else if (mode.current !== "pointer") {
        /*
         * `top` and `bottom` are handled entirely in CSS. Clear the inline
         * styles the loop may have written — inline wins over the stylesheet,
         * so leaving them would keep the fallback layer hidden.
         */
        state.inside = false;
        state.scale = 0;
        state.targetScale = 0;
        cancelAnimationFrame(frame);
        state.running = false;
        reveal.style.visibility = "";
        reveal.style.opacity = "";
        reveal.style.transform = "";
        inner.style.transform = "";
      }
    };

    measure();
    applyMode();

    if (restScale > 0 && mode.current === "pointer") {
      state.pointerX = state.leadX = state.x = rect.current.width / 2;
      state.pointerY = state.leadY = state.y = rect.current.height / 2;
      state.targetScale = restScale;
      start();
    }

    scheduleSweep(config.current.idleSweepDelay);

    const observer = new ResizeObserver(measure);
    observer.observe(stage);

    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    finePointer.addEventListener("change", applyMode);
    prefersReduced.addEventListener("change", applyMode);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(sweepTimer);
      state.sweepStart = 0;
      state.running = false;
      observer.disconnect();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      finePointer.removeEventListener("change", applyMode);
      prefersReduced.removeEventListener("change", applyMode);
    };
  }, [touchFallback, restScale]);

  const vars = {
    "--reveal-box": `${box}px`,
    "--reveal-mask": maskImage,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={stageRef}
      data-mode="pointer"
      className={[styles.stage, className].filter(Boolean).join(" ")}
      style={vars}
    >
      <div className={`${styles.layer} ${styles.bottom}`}>{bottomLayer}</div>

      <div ref={revealRef} className={styles.reveal} aria-hidden="true">
        <div ref={innerRef} className={styles.inner}>
          {topLayer}
        </div>
      </div>

      {children ? <div className={styles.overlay}>{children}</div> : null}
    </div>
  );
}
