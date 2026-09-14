/* Single source for the ways to reach ViraHaus. Orders go out over WhatsApp. */
export const WHATSAPP_NUMBER = "962787777177";
export const WHATSAPP_DISPLAY = "+962 78 777 7177";

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
