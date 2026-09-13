"use client";

import { motion } from "framer-motion";

import { DUR_BLOCK, figSpring } from "./motion";

/*
 * The hero headline's move, for section headings: each glyph rises from a
 * depth that grows left to right and fades in, all on one clock. Triggers when
 * scrolled into view. `offset` lets a second line continue the cascade.
 */
export default function GlyphRise({ text, offset = 0, className }: { text: string; offset?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} className="inline-block w-[0.28em]" aria-hidden />
        ) : (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            initial={{ opacity: 0, y: `${1 + ((offset + i) / 24) * 1.95}em` }}
            whileInView={{ opacity: 1, y: "0em" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DUR_BLOCK, ease: figSpring }}
          >
            {ch}
          </motion.span>
        ),
      )}
    </span>
  );
}
