import { Lexend, Lexend_Exa, Readex_Pro } from "next/font/google";

/* English: the hero's own pair. */
export const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
export const lexendExa = Lexend_Exa({ variable: "--font-lexend-exa", subsets: ["latin"] });

/*
 * Arabic: Readex Pro is Lexend carried into Arabic. It is loaded under the same
 * two variable names, so every rule written for the English site (the hero's
 * module CSS, .display, Tailwind's font-sans) picks it up without a second set
 * of styles. Its Latin glyphs are Lexend's, so product names still match.
 */
export const readexBody = Readex_Pro({ variable: "--font-lexend", subsets: ["arabic", "latin"] });
export const readexDisplay = Readex_Pro({ variable: "--font-lexend-exa", subsets: ["arabic", "latin"], weight: ["400", "500", "600"] });
