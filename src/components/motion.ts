/*
 * The prototype's spring (mass 1, stiffness 26, damping 10.2) is critically
 * damped with omega0 * duration = 11.18. Its normalised step response, for use
 * as a Framer Motion `ease` so JS-driven motion matches the CSS keyframes.
 */
export const figSpring = (t: number) => 1 - (1 + 11.1814 * t) * Math.exp(-11.1814 * t);

export const DUR_COPY = 1.2501;
export const DUR_BLOCK = 2.0835;
