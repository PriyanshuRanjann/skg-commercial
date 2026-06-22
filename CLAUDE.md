# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Metro Miles** — a Pune-based commercial cab business app. Three things in one Next.js 16 codebase:

1. A public **marketing site** (home, about, book-ride, contact, offers, feedback, QR landing).
2. A **driver portal** (`/driver/*`) — mobile-first PWA where drivers sign in, start/end shifts with photo+GPS proof, and log rides/expenses.
3. An **owner dashboard** (`/owner/*`) — desktop-first admin for managing drivers, viewing shifts/rides/expenses/feedback, and tweaking settings.

Stack: Next.js 16.2.2 App Router, React 19, TypeScript, Tailwind v4, `react-hook-form` + `zod`, `jose` (JWT), `react-leaflet` (maps in owner shifts view).

The system of record is a **Google Sheet** behind a Google Apps Script Web App — see `apps-script/README.md` for the Sheet schema and endpoint contract.

## Commands

- `npm run dev` — dev server
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint flat config (`eslint-config-next` core-web-vitals + typescript)
- `npm run gen-qr` — regenerate `public/qr-feedback.png` (the sticker QR that links to `/feedback`); reads `NEXT_PUBLIC_APP_URL` for the target URL
- `npm run process-images` — one-shot logo/hero image prep (expects specific source PNGs at the repo root); only re-run if those source files are present

No test framework is configured.

## Critical: Next.js 16 surprises

Per `AGENTS.md`, Next.js 16 has breaking changes vs. older versions you may know — APIs, conventions, and file structure may differ from training data. Before writing non-trivial Next.js code (route handlers, server components, caching, metadata, dynamic params, params being async, etc.), consult `node_modules/next/dist/docs/` and heed deprecation notices.

Two specific traps in this repo:

- **`src/proxy.ts` is the middleware file.** Next.js 16 renamed `middleware.ts` → `proxy.ts` and the export from `middleware` → `proxy`. Don't recreate `middleware.ts`.
- **Tailwind is v4** — PostCSS-based (`postcss.config.mjs`). Theming lives in `@theme inline` inside `src/app/globals.css`, not `tailwind.config.js` (there is none).

## Architecture

### Three layouts, three audiences

`src/app/layout.tsx` is bare-bones (just `<html><body>`) — it does **not** wrap pages with Navbar/Footer. Each section provides its own shell:

- `src/app/(marketing)/layout.tsx` — adds `Navbar` + `Footer` for public pages.
- `src/app/driver/layout.tsx` — server-side reads session, shows a slim mobile header only when a driver is signed in. Pages center within `max-w-3xl`.
- `src/app/owner/layout.tsx` — server-side reads session, renders sidebar (desktop) + horizontal nav (mobile) only when an owner is signed in. Login/signup pages render bare.

When adding a new page, put it in the section whose shell you want. Don't try to render `Navbar`/`Footer` from the root layout.

### Backend: Apps Script + Sheets, with mock fallback

All persistent data flows through `src/lib/sheets.ts::callSheets(action, payload)`. This is a **server-only** module — never import it from a client component (it carries `APPS_SCRIPT_TOKEN`).

- If `APPS_SCRIPT_URL` is unset, `callSheets` automatically delegates to `src/lib/mock-store.ts`, an in-memory store seeded with a demo driver (`driver@demo.com` / `Metro@Driver25`) and a demo owner (`owner@demo.com` / `Metro@Admin25`). This means **local dev needs no real backend** — the app is fully functional out of the box. Mock data resets on dev-server restart.
- If `APPS_SCRIPT_URL` is set, requests POST to the Apps Script Web App with `apiToken` for non-public actions. The action surface is fixed (`driver.login`, `shift.start`, `ride.create`, `owner.list`, etc.) — see the `Action` union in `sheets.ts` and the matching dispatch in `apps-script/Code.gs`.
- The Apps Script returns `{ ok, data | error }` envelopes (it can't set HTTP status codes). `callSheets` translates `unauthorized`/`invalid_credentials` errors into 401 via `SheetsError`.

When adding a new backend operation: add the action to both the `Action` union here AND `apps-script/Code.gs`, then re-deploy the Apps Script as a new version (per `apps-script/README.md`).

### Auth

JWT sessions via `jose`, stored in an httpOnly cookie called `mm_session` (12-hour expiry). The session payload carries `sub`, `role`, and `email`.

- `src/lib/auth.ts` — `signSession`, `verifySession`, `getSession`, `requireRole`, `setSessionCookie`, `clearSessionCookie`. Server components and API routes use `getSession()`.
- `src/proxy.ts` — protects `/driver/:path*` and `/owner/:path*`. Allows `/driver/login`, `/driver/signup`, `/owner/login`, `/owner/signup` through. Redirects to the appropriate login on missing/invalid token or wrong role.
- Login/signup API routes live under `src/app/api/auth/{driver,owner}/*`.

`JWT_SECRET` must be set or session signing throws. There is no fallback in dev.

**Auth is email-based.** Both driver and owner portals identify users by email address. `loginSchema` in `validation.ts` uses an `email` field. The API login routes pass `username: parsed.data.email` to `callSheets` so the Apps Script backend still receives the field as `username` — only the value is an email. Driver signup (`driverSignupSchema`) collects email + password only; name and phone are added later by the owner via DriversManager.

### API routes

`src/app/api/*` is the boundary between the React app and `callSheets`. Each route:
1. Validates input with a `zod` schema from `src/lib/validation.ts`.
2. Checks role with `requireRole("driver" | "owner")` where applicable.
3. Calls `callSheets`.
4. Returns `NextResponse.json(...)` and translates `SheetsError.status` into HTTP status.

When adding a new endpoint, follow this same shape and add a schema to `validation.ts` rather than ad-hoc parsing.

### Third-party chat widget

The marketing layout (`src/app/(marketing)/layout.tsx`) injects an AlwaysOn chat widget via `<Script>`. `WidgetTheme` (`src/components/marketing/WidgetTheme.tsx`) patches the widget's Shadow DOM at runtime using `MutationObserver` — it injects brand CSS overrides, swaps the default chat icon for a car glyph, and adds a phone popover button.

**Important:** The phone number in `WidgetTheme.tsx` (`PHONE_DISPLAY` / `PHONE_TEL`) is the AI-agent call line, hardcoded separately from `config.ts`. If the number changes, update both files.

### Owner signup is one-time only

`owner.signup` throws `owner_exists` if any owner already exists in the store. The `/owner/signup` page is only for the initial setup. Check `/api/auth/owner/exists` (`owner.has_any` action) to know whether to show the signup link.

### Components

Grouped by audience under `src/components/`:

- `marketing/` — Hero, BookingForm, WhyChooseUs, ServiceAreas, Testimonials, WidgetTheme.
- `driver/` — LogoutButton, PhotoCapture (camera capture for shift start).
- `owner/` — DriversManager, ShiftsView, ShiftMap (Leaflet — must be `"use client"` and dynamic-imported because Leaflet touches `window`), OwnerLogoutButton.
- `shared/` — Navbar, Footer, AuthShell.
- `ui/` — Button, Card, Input, Spinner (the design-system primitives; prefer these over raw `<button>`/`<input>`).

Path alias `@/*` → `./src/*`. Icons come from `react-icons/fa`.

### Utility lib modules

- `src/lib/geo.ts` — GPS helpers (`getCurrentLocation`, `formatLatLng`) **and** `fileToBase64` (strips the data-URL prefix for sending camera/file photos as base64 to the backend). Used by shift-start and expense forms.
- `src/app/api/me/mode/route.ts` — `GET /api/me/mode` returns `{ demo: boolean }`. `demo: true` when running in mock mode (no `APPS_SCRIPT_URL`). Client components can use this to show a demo banner.

### Brand and config constants

`src/lib/config.ts` is the single source of truth for brand name, taglines, contact info, and the WhatsApp number. **Use `WHATSAPP_NUMBER` and `buildWhatsAppLink(message)` rather than hardcoding `wa.me/...`.** (One stray hardcoded reference exists in `src/app/(marketing)/contact/page.tsx` — fix it next time you're nearby.)

`SERVICE_TYPES`, `SERVICE_LOCATIONS`, `EXPENSE_CATEGORIES` are also defined here as `as const` tuples used for typed selects.

### Theming

The live theme is **dark cream/gold**, defined as CSS variables in `src/app/globals.css` and exposed via `@theme inline`:

- Backgrounds: `--bg`, `--bg-elevated`, `--bg-deep`, `--bg-card` (Tailwind: `bg-elevated`, `bg-deep`, `bg-surface`, etc.)
- Text: `--text`, `--text-strong`, `--text-muted`, `--text-dim`
- Accent: `--accent` (#c9a87c gold), `--accent-light`, `--accent-deep`
- Hairlines: `--hairline`, `--hairline-strong`, `--hairline-gold`

`primary-blue` / `primary-orange` utilities still resolve, but they are **legacy aliases** mapped to the dark theme tokens (`primary-blue` → `--bg-card`, `primary-orange` → `--accent`). Don't reach for them in new code — use the semantic accent/bg utilities directly.

## Environment variables

- `JWT_SECRET` — required; HS256 signing key for session cookies.
- `APPS_SCRIPT_URL` — Apps Script Web App URL. **Leave unset in local dev** to use the in-memory mock store.
- `APPS_SCRIPT_TOKEN` — must match `API_TOKEN` set in the Apps Script's Script Properties (see `apps-script/README.md`).
- `NEXT_PUBLIC_APP_URL` — used by `scripts/gen-qr.mjs` to embed the right URL in the printed QR code.
