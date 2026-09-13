"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { DUR_COPY, figSpring } from "./motion";

/* Fades and lifts content into view on the prototype's own curve. Runs once. */
export default function Reveal({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: DUR_COPY, delay, ease: figSpring }}
    >
      {children}
    </motion.div>
  );
}
