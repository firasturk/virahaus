import type { ReactNode } from "react";

import AutoplayVideos from "./autoplay-videos";
import { CartProvider } from "./cart";
import { MenuOverlay } from "./site-menu";
import type { Lang } from "@/lib/i18n";

/* Everything every page shares, in the page's language: cart, menu, video autoplay. */
export default function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <body className="flex min-h-full flex-col">
      <CartProvider lang={lang}>
        {children}
        <MenuOverlay lang={lang} />
        <AutoplayVideos />
      </CartProvider>
    </body>
  );
}
