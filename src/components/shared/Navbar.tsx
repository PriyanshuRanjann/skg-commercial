"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { BRAND_NAME } from "@/lib/config";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/book-ride", label: "Book Ride" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-deep)]/85 backdrop-blur-xl border-b border-[var(--hairline)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/brand/logo.png"
            alt={BRAND_NAME}
            width={48}
            height={48}
            priority
            className="rounded-lg transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:block text-foreground font-light text-xl tracking-[0.2em] uppercase">
            {BRAND_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/75 hover:text-accent-light transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/driver/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
          >
            <FaUserShield className="text-accent" />
            Driver
          </Link>
          <Link
            href="/book-ride"
            className="btn-gold px-6 py-2.5 rounded-full font-semibold text-sm"
          >
            Book a ride
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-[var(--bg-deep)] border-t border-[var(--hairline)] px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-foreground hover:text-accent-light font-medium py-2.5 tracking-wide"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/driver/login"
            className="flex items-center gap-2 text-muted hover:text-foreground text-sm font-medium py-2.5 border-t border-[var(--hairline)] mt-3 pt-4"
            onClick={() => setMobileOpen(false)}
          >
            <FaUserShield className="text-accent" /> Driver login
          </Link>
          <Link
            href="/book-ride"
            className="btn-gold block text-center px-5 py-3 rounded-full font-semibold mt-3"
            onClick={() => setMobileOpen(false)}
          >
            Book a ride
          </Link>
        </nav>
      )}
    </header>
  );
}
