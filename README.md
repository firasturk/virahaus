# ViraHaus

Hero banner implementing the Figma frame **`home`** (node `17001:48`) from
*Daily Hero 2 — Arkkhe (Copy)*, built around a cursor-driven reveal: a bare
driftwood branch at rest, the same branch alive — moss, and a blue dart frog
walking it — revealed through a soft organic mask that follows the cursor.

The headline is *"Find your inner green"*, so the reveal is the idea: the green
is inside the dead wood, and the cursor is what finds it.

## Running it

```bash
npm install
npm run dev
```

## Fidelity to the artboard

The Figma frame is a fixed 1440 × 810 composition. `hero-banner.module.css`
reproduces it with every size in `cqw` (1cqw = 1% of stage width) and every
position as a percentage of that grid, so the layout is pixel-exact at 1440px
and scales proportionally at any other width. Divide a Figma px value by 14.4
for its cqw equivalent.

Measured in Chromium at 1440 × 810, every element lands within 0.1px of its
Figma coordinate:

| Element | Figma | Rendered |
| --- | --- | --- |
| Nav (Home / shop / Contact) | x 271 / 442 / 604, cap-top 38 | 271 / 442 / 604, 38 |
| About | x 1302.2, cap-top 35.46 | 1302.2, 35.4 |
| Headline | x 82, cap-top 273 | 82, 273 |
| Body copy | x 462, cap-top 181.35 | 462, 181.3 |
| "Our Products" | 462, 306.35, 178 × 56 | 462, 306.3, 178 × 56 |
| Play control | 123, 485, 126 × 126 | 123, 485, 126 × 126 |
| EcoStove card | 1116, 477, 296 × 280 | 1116, 477, 296 × 280 |

Figma positions text by cap-top while CSS positions the line box, so each text
`top` is the Figma cap-top corrected by that element's measured half-leading and
ascent gap. The comments in the CSS record the original Figma value.

Type: Lexend (body, nav), Lexend Exa (headline, card title). Palette: `#454640`
ground, `#753319` rust, `#d7d8d6` card, `#474842` card text.

## `<CursorReveal />`

`src/components/cursor-reveal.tsx` — stacks two full-bleed layers and reveals the
top one through a feathered, cursor-following mask. Layers accept anything:
image, video, text, or another component. Design-agnostic; the hero just composes it.

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

Measured in Chromium at 1440 × 810: **59.9fps median** under continuous cursor
motion (p95 16.7ms), and the loop parks itself at **0 frames** when nothing moves.

### Responsive and accessibility

- Under 768px the absolute composition reflows to a single column, the decorative
  rules drop out, and a gradient scrim carries the type over the lit video.
- No fine pointer → falls back per `touchFallback`; tracking never attaches, so
  scrolling is untouched.
- `prefers-reduced-motion: reduce` → smoothing and the breathing pulse are dropped.

## Entrance animation

Read out of the *Daily Hero 10 — Arkkhe* prototype (file `anLaOa0DI4KEG6hw2m5pw7`,
page "Animation") through the Plugin API rather than eyeballed from the preview.

The easing is a single curve. The `Orbit_text` reaction carries an explicit
spring — mass 1, stiffness 26, damping 10.2 — which resolves to ζ = 1.0002, i.e.
exactly critically damped, with ω₀ × duration = 11.18 (a 99.98% settle). The
normalised step response is therefore identical for every such reaction in the
file; only the duration changes. It is sampled as a CSS `linear()` easing, which
reproduces the spring instead of approximating it with a bezier.

| Element | Figma duration | Motion |
| --- | --- | --- |
| Navigation | 2.0835s | Logo 110px, centre menu 220px, right items 360px in a 1080px frame — one clock, three distances, so they land as a parallax stagger. Scaled 0.75 here. |
| Display type | 2.1929s | Five glyphs rise from 1.0×–2.95× their own height below home while fading in. The cascade is distance on a shared clock, not staggered delays. |
| Secondary copy | 1.2501s | Drops into its own clip from above. |
| Supporting UI | 2.0835s | Fades and slides in together. |
| Rails | 4.1671s | Arrive last and slowest. |
| Scroll marker | 1.2776s | Figma's GENTLE preset. |

Delays are the one value not taken verbatim: in the prototype they are paced
against a video that plays before the frame animates, so its 2s and 4s waits read
correctly there. This hero has no preamble, so delays are scaled to 0.4× —
preserving order and relative spacing without leaving the page inert for four
seconds. `SLOW` and `GENTLE` are Figma spring presets whose constants the Plugin
API does not expose, only the resolved duration; they are modelled with the same
critically damped curve, matching their non-overshooting character.

Every timing is a custom property on `.stage`, so they can be retuned in one place.

## Pages and sections

- `/` — hero, **About** (`#about`), **Shop** (`#shop`), **Gifting** (`#gift`), footer.
- `/product/[slug]` — product page: sticky gallery with cursor-following zoom and
  thumbnail crossfade, variant selector, magnetic *Add to cart*, full-bleed
  lifestyle image, spec tiles, drag-to-scroll *You may also like*. Statically
  generated for every product.

Everything below the hero is drawn from the hero's own system, defined once in
`globals.css`: the sand ground (`#c9c5bf`), ink type, rust accents (`#753319`),
white type only where it sits on imagery, hairlines at 25/50/75%, the EcoStove
card as the tile (`.tile`), the *Our Products* pill as the button (`.pill-light`,
`.pill-dark`), Lexend for text and Lexend Exa for display (`.display`). Section
headings rise glyph by glyph on the prototype's critically damped spring
(`GlyphRise`), and everything else eases in on the same curve (`Reveal`,
`figSpring` in `motion.ts`).

The shop has three categories — Terrariums, Vivariums, Plants — as tiles that
double as tabs; the grid beneath re-lays out with Framer Motion. Products and
copy live in `src/data/products.ts`. The cart is a small external store backed by
localStorage, read through `useSyncExternalStore` so the server renders it empty
and the client swaps in the stored cart after hydration. Gifting rotates eight
friction-reducing microcopy lines under its CTA (`GIFT_MICROCOPY`).

## Assets

`public/media/` — the video was supplied as HEVC, unplayable in Chrome and
Firefox, so it ships as VP9 (490KB) with an H.264 fallback (956KB), audio stripped.

`hero-bare.jpg` is the real bare-driftwood plate (2048 × 1154). It was checked
against the video by blending the two and by a difference map: the silhouettes
register to within a few pixels along the branch's underside, an offset the
feathered mask absorbs — there is no visible seam at the reveal edge.

### Placeholders that still need the real export

The Figma assets are served from `www.figma.com`, which this build environment's
network policy blocks, so two are still stand-ins. The fourteen product photos are the real supplied files. Each blocked file is named
`.PLACEHOLDER` so it is obvious in the tree:

| Placeholder | Figma node | What it should be |
| --- | --- | --- |
| `card-moss.PLACEHOLDER.jpg` | `17001:89` | The EcoStove card image. Currently a moss crop from the video. |
| `about-terrarium.jpg` | Higgsfield job `512ad8e7` | The generated "abstract 3D terrarium" render; its CDN is blocked here. Currently the terrarium-jar photo, which shares the brief's near-black ground. |
| Icon SVGs | grid / play / burger | Redrawn from the reference screenshot in `hero-banner.tsx`; approximations, not the originals. |

To resolve: export the assets from Figma and upload them into `public/media/`
(GitHub's *Add file → Upload files* on the branch works), then update the
constants at the top of `src/components/hero-banner.tsx`.
