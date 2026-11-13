"use client";

import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";

import type { CategorySlug } from "@/data/products";

/*
 * Which category the shop grid shows. Any link on the site can set it: on the
 * home page the grid updates and the page scrolls to it; from another page the
 * link goes to /#shop-<slug> and the grid reads the hash when it mounts.
 */
export type ShopFilter = CategorySlug | "all";

const SLUGS: ShopFilter[] = ["all", "terrarium", "vivarium", "plants"];
let current: ShopFilter = "all";
const listeners = new Set<() => void>();

function fromHash() {
  if (typeof window === "undefined") return;
  const m = window.location.hash.match(/^#shop-(\w+)$/);
  if (m && SLUGS.includes(m[1] as ShopFilter)) current = m[1] as ShopFilter;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  fromHash();
  listeners.add(l);
  const onHash = () => { fromHash(); emit(); };
  window.addEventListener("hashchange", onHash);
  return () => { listeners.delete(l); window.removeEventListener("hashchange", onHash); };
}

export function useShopFilter() {
  return useSyncExternalStore(subscribe, () => current, () => "all" as ShopFilter);
}

export function setShopFilter(next: ShopFilter) {
  current = next;
  emit();
}

/* Set the filter and bring the grid into view. Returns false when the grid is not on this page. */
export function goToShop(next: ShopFilter) {
  const grid = document.getElementById("shop");
  if (!grid) return false;
  setShopFilter(next);
  /* A beat later, so a closing menu has released the page scroll first. */
  window.setTimeout(() => grid.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  return true;
}

export function ShopLink({ to, className, children, onNavigate }: { to: ShopFilter; className?: string; children: ReactNode; onNavigate?: () => void }) {
  return (
    <Link
      href={to === "all" ? "/#shop" : `/#shop-${to}`}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (goToShop(to)) e.preventDefault();
      }}
    >
      {children}
    </Link>
  );
}
