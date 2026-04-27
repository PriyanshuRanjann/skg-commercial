# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SKG Ride Services — a marketing/booking website for a Pune-based commercial cab service. Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. No backend; bookings flow out to WhatsApp via `wa.me` deep links.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, extends `eslint-config-next` core-web-vitals + typescript)

There is no test framework configured.

## Critical: Next.js 16 is new

Per `AGENTS.md`, this project is on Next.js 16.2.2 — **APIs, conventions, and file structure may differ from training data**. Before writing non-trivial Next.js code (route handlers, server components, caching, metadata, dynamic params, etc.), consult `node_modules/next/dist/docs/` and heed deprecation notices. Don't rely on memory of older Next.js versions.

Tailwind is v4 (PostCSS-based, configured in `eslint.config.mjs`-adjacent `postcss.config.mjs`). Theming uses the new `@theme inline` block in `src/app/globals.css`, not `tailwind.config.js`.

## Architecture

- `src/app/` — App Router pages. `layout.tsx` wraps every page with `<Navbar>` + `<main>` + `<Footer>`. The home page (`page.tsx`) is purely a composition of section components from `src/components/`.
- `src/components/` — section components (`Hero`, `BookingForm`, `WhyChooseUs`, `ServiceAreas`, `Testimonials`, `Navbar`, `Footer`). Interactive ones use `"use client"`.
- Path alias `@/*` → `./src/*` (configured in `tsconfig.json`).
- Icons come from `react-icons/fa` (FontAwesome).

### Form submission pattern

Forms (`BookingForm`, contact, book-ride) do **not** post to a backend. They format a message and open `https://wa.me/919876543210?text=...` in a new tab. The phone number is currently hardcoded across multiple files — when changing it, search for `wa.me` and update every occurrence.

### Theming

Custom brand colors live as CSS variables in `src/app/globals.css` and are exposed to Tailwind through `@theme inline`:

- `primary-blue` (`#1a3a5c`) — headings, nav text
- `primary-orange` (`#e8880a`) — CTAs, accents
- `light-blue`, `light-gray`

Use Tailwind utilities like `bg-primary-orange`, `text-primary-blue` rather than raw hex values.
