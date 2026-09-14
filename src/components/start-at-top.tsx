"use client";

import { useEffect } from "react";

/*
 * The home page always opens on the hero. Browsers restore the last scroll
 * position on reload and keep a #hash from an earlier in-page link, both of
 * which drop a returning visitor into the middle of the page. Restoration is
 * switched to manual, and once an in-page link has scrolled, the hash is
 * removed from the address so a reload starts at the top again.
 */
export default function StartAtTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);

    let timer = 0;
    const clean = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => history.replaceState(null, "", window.location.pathname + window.location.search), 900);
    };
    if (window.location.hash) clean();
    window.addEventListener("hashchange", clean);
    return () => { window.removeEventListener("hashchange", clean); window.clearTimeout(timer); };
  }, []);
  return null;
}
