import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { CartButton } from "./cart";
import CursorReveal from "./cursor-reveal";
import ScrollReveal from "./scroll-reveal";
import styles from "./hero-banner.module.css";

/*
 * Assets
 * ------
 * hero-bare.jpg, the wordmark, the video and its poster are the real supplied
 * assets.
 *
 * One Figma image is still a stand-in: it lives behind figma.com, which this
 * environment's egress policy blocks. It is named .PLACEHOLDER so it is obvious
 * in the tree which file still needs the real export:
 *
 *   card-moss.PLACEHOLDER.jpg  -> Figma node 17001:89 (the EcoStove card image)
 */
const BARE_STILL = "/media/hero-bare.jpg";
const CARD_IMAGE = "/media/card-moss.PLACEHOLDER.jpg";
const LOGO = "/media/VIRA-HAUS-logo.png";

const ALIVE_POSTER = "/media/hero-alive-poster.jpg";
const ALIVE_WEBM = "/media/hero-alive.webm";
const ALIVE_MP4 = "/media/hero-alive.mp4";

/*
 * The frame's icons are exported SVGs on the same blocked host, so these are
 * redrawn from the reference screenshot and are approximations, not the
 * originals. Replace them once the exports are available.
 */
function GridGlyph() {
  return (
    <svg viewBox="0 0 11 11" fill="none" aria-hidden>
      {[0, 1].map((row) =>
        [0, 1].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={2.2 + col * 6.6}
            cy={2.2 + row * 6.6}
            r="1.6"
            fill="currentColor"
          />
        )),
      )}
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 17 17" fill="none" aria-hidden>
      <path d="M4.8 1.9 14.4 8.5 4.8 15.1Z" fill="currentColor" />
    </svg>
  );
}

function BurgerGlyph() {
  return (
    <svg viewBox="0 0 32 8" fill="none" aria-hidden>
      <path d="M0 1h32M0 7h32" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/*
 * Splits a line into per-glyph spans so each can rise from its own depth. The
 * index feeds the CSS `--i` variable; a caller passes `offset` so a second line
 * continues the cascade instead of restarting it.
 */
function Glyphs({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} className={styles.space} aria-hidden />
        ) : (
          <span
            key={i}
            className={styles.letter}
            style={{ "--i": offset + i } as CSSProperties}
            aria-hidden
          >
            {ch}
          </span>
        ),
      )}
    </>
  );
}

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <CursorReveal
        className={styles.stage}
        revealSize={460}
        feather={0.62}
        followSpeed={0.52}
        inertia={0.42}
        enterDuration={950}
        exitDuration={700}
        defaultRevealSize={0}
        organic={0.7}
        touchFallback="top"
        idleSweep
        idleSweepDelay={3000}
        bottomLayer={
          <Image
            src={BARE_STILL}
            alt="A weathered driftwood branch suspended against a pale field."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        }
        topLayer={
          <video
            className="h-full w-full object-cover"
            poster={ALIVE_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={ALIVE_WEBM} type="video/webm" />
            <source src={ALIVE_MP4} type="video/mp4" />
          </video>
        }
      >
        <div className={styles.overlay}>
          <div className={styles.grid} aria-hidden>
            <span className={styles.gridLine} style={{ left: "0%" }} />
            <span className={styles.gridLine} style={{ left: "25%" }} />
            <span className={styles.gridLine} style={{ left: "75%" }} />
            <span className={styles.gridLine} style={{ left: "calc(100% - 1px)" }} />
          </div>

          {/* 561x120 wordmark, drawn white on transparent — sits straight on the plate. */}
          <Image
            src={LOGO}
            alt="ViraHaus"
            width={561}
            height={120}
            priority
            className={styles.logo}
          />

          <nav className={styles.nav}>
            <Link className={styles.navHome} href="/">
              Home
            </Link>
            <Link className={styles.navShop} href="/#shop">
              shop
            </Link>
            <Link className={styles.navContact} href="/#gift">
              Contact
            </Link>
          </nav>

          <Link className={styles.about} href="/#about">
            About
          </Link>

          <div className={styles.cartSlot}>
            <CartButton tone="light" />
          </div>

          <button className={styles.burger} type="button" aria-label="Open menu">
            <BurgerGlyph />
          </button>

          <h1 className={styles.headline} aria-label="Find your inner green">
            <Glyphs text="Find your" />
            <br />
            <Glyphs text="inner green" offset={9} />
          </h1>

          <p className={styles.copy}>
            <span className={styles.copyInner}>
              Nurturing green spaces, cultivating sustainable solutions, and inspiring a
              greener tomorrow for all.
            </span>
          </p>

          <button className={styles.pill} type="button">
            <span className={styles.pillIcon}>
              <GridGlyph />
            </span>
            Our Products
          </button>

          <button className={styles.play} type="button" aria-label="Play showreel">
            <span className={styles.playInner}>
              <PlayGlyph />
            </span>
          </button>

          {/* Only a mouse can reveal the moss, so only a mouse is told. Fades on the first move. */}
          <p className={styles.hint}>
            <span className={styles.hintDot} aria-hidden />
            Move your mouse to see it come alive
          </p>

          <div className={styles.scrollRail} aria-hidden>
            <span className={styles.scrollLine} />
            <span className={styles.scrollLabel}>Scroll</span>
            <span className={styles.scrollTick} />
          </div>

          {/* Hidden on first paint; enters once the visitor scrolls down. */}
          <ScrollReveal>
            <article className={styles.card}>
              <Image
                src={CARD_IMAGE}
                alt=""
                width={880}
                height={588}
                className={styles.cardImage}
              />
              <p className={styles.cardKicker}>EcoStove</p>
              <p className={styles.cardTitle}>Heat for Life</p>
              <button className={styles.cardButton} type="button" aria-label="View EcoStove">
                <GridGlyph />
              </button>
            </article>
          </ScrollReveal>
        </div>
      </CursorReveal>
    </section>
  );
}
