// Pixel da Meta com consentimento (LGPD).
// O script da Meta só é carregado depois que o visitante aceita os cookies.
// Sem consentimento, nenhuma função aqui envia dados.

export const META_PIXEL_ID = "1650261843114846";

const CONSENT_KEY = "kronica-cookie-consent";
const CONSENT_EVENT = "kronica-consent-change";

export type ConsentValue = "granted" | "denied";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function getConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Navegador sem armazenamento: a escolha vale só para esta visita
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  if (value === "granted") {
    loadPixel();
    trackPageView();
  }
}

// Limpa a escolha para o aviso aparecer de novo (usado na Política de Privacidade)
export function resetConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignora
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function onConsentChange(callback: (value: ConsentValue | null) => void) {
  const handler = (e: Event) => callback((e as CustomEvent).detail ?? null);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

let loaded = false;

// Código base oficial do Pixel da Meta, carregado sob demanda
function loadPixel() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq!("init", META_PIXEL_ID);
}

function canTrack() {
  if (getConsent() !== "granted") return false;
  loadPixel();
  return !!window.fbq;
}

export function trackPageView() {
  if (canTrack()) window.fbq!("track", "PageView");
}

// Eventos padrão da Meta: "Lead" (formulário enviado), "Contact" (clique no WhatsApp),
// "ViewContent" (visita a um projeto)
export function trackEvent(name: "Lead" | "Contact" | "ViewContent", params?: Record<string, string>) {
  if (canTrack()) window.fbq!("track", name, params);
}
