import Image from "next/image";

import CursorReveal from "./cursor-reveal";

/*
 * TODO: replace with the real bare-driftwood still. Only the video reached the
 * session, so this stand-in is a desaturated frame of it — the reveal mechanic
 * is correct, the resting image is not.
 */
const BARE_STILL = "/media/hero-bare.PLACEHOLDER.jpg";

const ALIVE_POSTER = "/media/hero-alive-poster.jpg";
const ALIVE_WEBM = "/media/hero-alive.webm";
const ALIVE_MP4 = "/media/hero-alive.mp4";

/*
 * A halo in the background tone, rather than a full scrim. It keeps the type
 * legible where it crosses the branch without washing out the reveal underneath.
 */
const HALO = {
  textShadow:
    "0 0 18px rgba(236,234,230,0.92), 0 0 44px rgba(236,234,230,0.75), 0 0 90px rgba(236,234,230,0.5)",
};

export default function HeroBanner() {
  return (
    <CursorReveal
      className="h-[100svh] min-h-[560px] w-full bg-[#c9c5bf]"
      revealSize={460}
      feather={0.62}
      followSpeed={0.52}
      inertia={0.42}
      enterDuration={950}
      exitDuration={700}
      defaultRevealSize={0}
      organic={0.7}
      touchFallback="top"
      bottomLayer={
        <Image
          src={BARE_STILL}
          alt="A weathered driftwood branch suspended against a pale grey field."
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
      <div className="pointer-events-none flex h-full flex-col justify-between p-6 text-[#16140f] sm:p-10 lg:p-14">
        <span className="text-sm font-medium tracking-[0.42em] uppercase" style={HALO}>
          Virahaus
        </span>

        <div className="max-w-3xl">
          <h1
            className="text-[clamp(2.4rem,7.4vw,6rem)] leading-[0.94] font-light tracking-[-0.03em] text-balance"
            style={HALO}
          >
            Nothing here
            <br />
            is as dead
            <br />
            as it looks.
          </h1>

          <p
            className="mt-7 max-w-md text-base leading-relaxed opacity-80 sm:text-lg"
            style={HALO}
          >
            Every surface we work with is already carrying something. We build so it shows.
          </p>
        </div>

        <span className="text-xs tracking-[0.24em] uppercase opacity-60" style={HALO}>
          <span className="hidden sm:inline">Move your cursor</span>
          <span className="sm:hidden">Scroll</span>
        </span>
      </div>
    </CursorReveal>
  );
}
