"use client";

import { useEffect } from "react";

const STYLE_ID = "mm-widget-theme";
const PHONE_DISPLAY = "+91 22 6423 0501";
const PHONE_TEL = "tel:+912264230501";

// Hex values mirror tokens from src/app/globals.css. Inlined because CSS vars
// defined on document :root don't pierce the widget's Shadow DOM. Update both
// here and in globals.css if the brand palette shifts.
const PANEL_OVERRIDES = `
  :host {
    --ao-bg: #1a1611;
    --ao-bg-secondary: #14110d;
    --ao-border: rgba(240, 232, 214, 0.08);
    --ao-text: #f0e8d6;
    --ao-text-light: #8a8275;
  }
  .mm-phone-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .mm-phone-popover {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 240px;
    padding: 12px 14px;
    background: var(--ao-bg);
    border: 1px solid var(--ao-border);
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
    color: var(--ao-text);
    font-size: 13px;
    z-index: 10;
  }
  .mm-phone-popover[hidden] { display: none; }
  .mm-phone-popover p {
    margin: 0 0 6px;
    opacity: 0.8;
  }
  .mm-phone-popover a {
    display: inline-block;
    color: var(--ao-primary);
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    letter-spacing: 0.2px;
  }
  .mm-phone-popover a:hover { text-decoration: underline; }
`;

const CAR_GLYPH = `
  <path d="M5 17h14M3 17V11l2-5h14l2 5v6"/>
  <circle cx="7" cy="17" r="2"/>
  <circle cx="17" cy="17" r="2"/>
`;

const PHONE_SVG_PATH =
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z";

function injectPanelOverrides(root: ShadowRoot) {
  if (root.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = PANEL_OVERRIDES;
  root.appendChild(style);
}

function swapGlyph(root: ShadowRoot) {
  const svg = root.querySelector(".ao-bubble svg");
  if (!svg) return;
  const path = svg.querySelector("path");
  if (!path) return;
  const d = path.getAttribute("d") || "";
  if (!d.startsWith("M21 15")) return;
  svg.innerHTML = CAR_GLYPH;
}

function injectPhoneButton(root: ShadowRoot) {
  const header = root.querySelector(".ao-header");
  if (!header) return;
  if (header.querySelector("#mm-phone-wrap")) return;

  const wrap = document.createElement("span");
  wrap.id = "mm-phone-wrap";
  wrap.className = "mm-phone-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "mm-phone-btn";
  btn.className = "ao-header__btn";
  btn.setAttribute("aria-label", "Call our AI agent");
  btn.setAttribute("aria-haspopup", "true");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="${PHONE_SVG_PATH}"/></svg>`;

  const pop = document.createElement("div");
  pop.id = "mm-phone-popover";
  pop.className = "mm-phone-popover";
  pop.hidden = true;
  pop.innerHTML = `<p>Connect with our AI agent at:</p><a href="${PHONE_TEL}">${PHONE_DISPLAY}</a>`;

  wrap.appendChild(btn);
  wrap.appendChild(pop);

  const closeBtn = header.querySelector(".ao-header__btn");
  if (closeBtn) header.insertBefore(wrap, closeBtn);
  else header.appendChild(wrap);

  let outsideHandler: ((e: Event) => void) | null = null;
  let escHandler: ((e: KeyboardEvent) => void) | null = null;

  const closePop = () => {
    pop.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (outsideHandler) {
      document.removeEventListener("click", outsideHandler, true);
      root.removeEventListener("click", outsideHandler, true);
      outsideHandler = null;
    }
    if (escHandler) {
      document.removeEventListener("keydown", escHandler);
      escHandler = null;
    }
  };

  const openPop = () => {
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    outsideHandler = (e: Event) => {
      const target = e.target as Node;
      if (!wrap.contains(target)) closePop();
    };
    escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePop();
    };
    // Defer attach so the click that opened the popover doesn't immediately close it.
    setTimeout(() => {
      document.addEventListener("click", outsideHandler!, true);
      root.addEventListener("click", outsideHandler!, true);
      document.addEventListener("keydown", escHandler!);
    }, 0);
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (pop.hidden) openPop();
    else closePop();
  });
}

export function WidgetTheme() {
  useEffect(() => {
    let shadowObserver: MutationObserver | null = null;
    let bodyObserver: MutationObserver | null = null;

    const wireUp = () => {
      const host = document.getElementById("alwayson-widget");
      const root = host?.shadowRoot;
      if (!root) return false;

      injectPanelOverrides(root);
      swapGlyph(root);
      injectPhoneButton(root);

      shadowObserver = new MutationObserver(() => {
        swapGlyph(root);
        injectPhoneButton(root);
      });
      shadowObserver.observe(root, { childList: true, subtree: true });
      return true;
    };

    if (!wireUp()) {
      bodyObserver = new MutationObserver(() => {
        if (wireUp()) {
          bodyObserver?.disconnect();
          bodyObserver = null;
        }
      });
      bodyObserver.observe(document.body, { childList: true });
    }

    return () => {
      shadowObserver?.disconnect();
      bodyObserver?.disconnect();
    };
  }, []);

  return null;
}
