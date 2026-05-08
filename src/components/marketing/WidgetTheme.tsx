"use client";

import { useEffect } from "react";

const STYLE_ID = "mm-widget-theme";

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
`;

const CAR_GLYPH = `
  <path d="M5 17h14M3 17V11l2-5h14l2 5v6"/>
  <circle cx="7" cy="17" r="2"/>
  <circle cx="17" cy="17" r="2"/>
`;

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

      shadowObserver = new MutationObserver(() => swapGlyph(root));
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
