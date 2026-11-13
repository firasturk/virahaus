import type { MetadataRoute } from "next";

/*
 * Web app manifest: lets phones "Add to Home Screen" today, and is the base for
 * a future app (a PWA first, then the same routes wrapped with Capacitor for the
 * App Store and Google Play). See README, "Turning it into an app".
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ViraHaus",
    short_name: "ViraHaus",
    description: "Handmade sealed terrariums, vivariums and plants. Delivered across Jordan.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16140f",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
