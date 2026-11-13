/* Single source for the ways to reach ViraHaus. Orders go out over WhatsApp. */
export const WHATSAPP_NUMBER = "962787777177";
export const WHATSAPP_DISPLAY = "+962 78 777 7177";

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/* PLACEHOLDER social handles until the real accounts are set. */
export const INSTAGRAM_URL = "https://www.instagram.com/virahaus.jo";
export const TIKTOK_URL = "https://www.tiktok.com/@virahaus";
