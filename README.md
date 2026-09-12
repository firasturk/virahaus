# Virahaus

Hero banner built around a cursor-driven reveal: a bare driftwood branch at rest,
the same branch alive — moss, and a blue dart frog walking it — revealed through a
soft organic mask that follows the cursor.

## Running it

```bash
npm install
npm run dev
```

## `<CursorReveal />`

`src/components/cursor-reveal.tsx` — stacks two full-bleed layers and reveals the
top one through a feathered, cursor-following mask. Layers accept anything:
image, video, text, or another component.

| Control | Default | What it does |
| --- | --- | --- |
| `topLayer` | — | Revealed inside the mask |
| `bottomLayer` | — | Visible everywhere else |
| `revealSize` | `420` | Diameter of the reveal in px, cursor inside |
| `feather` | `0.6` | Edge softness. `0` is a hard circle, `1` is almost all falloff |
| `followSpeed` | `0.5` | How eagerly the mask chases the cursor |
| `inertia` | `0.45` | How far it trails behind |
| `enterDuration` | `900` | ms to expand on enter |
| `exitDuration` | `700` | ms to collapse on leave |
| `defaultRevealSize` | `0` | Diameter while the cursor is outside. `0` hides it |
| `organic` | `0.7` | Shape irregularity. `0` is a true circle |
| `touchFallback` | `"top"` | `top`, `bottom`, or `drift` when there is no fine pointer |
| `children` | — | Rendered above both layers, never masked |

### How the mask stays cheap

The masked box carries a **static** radial-gradient, rasterised once. Moving the
reveal is then pure `transform`, handled by the compositor — the mask itself is
never recomputed. An inner element applies the inverse transform so the top layer
stays pinned to the stage while the window over it travels.

Cursor movement drives refs and direct style writes inside a `requestAnimationFrame`
loop; React never re-renders between pointer enter and leave. Position is smoothed
by two cascaded exponential filters — one for follow, one for trail — framed in
terms of frame delta, so the feel is identical at 60Hz and 120Hz.

Measured in Chromium at 1440×860: **59.9fps median** under continuous cursor motion
(p95 16.8ms), and the loop parks itself at **0 frames** when nothing is moving.

### Responsive and accessibility

- No fine pointer (`hover: hover and pointer: fine` fails) → falls back per
  `touchFallback`; tracking never attaches, so scrolling is untouched.
- `prefers-reduced-motion: reduce` → smoothing and the breathing pulse are dropped.
- Listeners are passive and nothing calls `preventDefault`.

## Assets

`public/media/` — transcoded from the source clip, which was HEVC and so unplayable
in Chrome and Firefox. Shipped as VP9 (490KB) with an H.264 fallback (956KB), audio
stripped.

> **`hero-bare.PLACEHOLDER.jpg` is a stand-in.** The real bare-driftwood still never
> reached the build; this is a desaturated frame of the video. Drop the real file in
> and update `BARE_STILL` in `src/components/hero-banner.tsx`.

## Still open

The hero's type, layout and colour are placeholders pending the Figma design
(`Daily Hero 2 — Arkkhe`). The reveal component itself is design-agnostic.
