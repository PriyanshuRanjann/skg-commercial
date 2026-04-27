"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCar, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
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

  return (
    <header className="bg-white/80 backdrop-blur border-b border-[var(--hairline)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
          <span className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center">
            <FaCar className="text-primary-orange-light" />
          </span>
          <span className="text-primary-blue">{BRAND_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-primary-blue hover:text-primary-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/driver/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary-blue px-3 py-1.5 rounded-full hover:bg-light-gray transition-colors"
          >
            <FaUserShield className="text-primary-orange" />
            Driver
          </Link>
          <Link
            href="/book-ride"
            className="bg-primary-orange text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-primary-orange-light btn-glow transition-colors"
          >
            Book now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-blue text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-[var(--hairline)] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-primary-blue hover:text-primary-orange font-semibold py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/driver/login"
            className="flex items-center gap-2 text-muted hover:text-primary-blue text-sm font-semibold py-1 border-t border-[var(--hairline)] pt-3"
            onClick={() => setMobileOpen(false)}
          >
            <FaUserShield className="text-primary-orange" /> Driver login
          </Link>
          <Link
            href="/book-ride"
            className="block bg-primary-orange text-white text-center px-5 py-2.5 rounded-full font-semibold mt-2"
            onClick={() => setMobileOpen(false)}
          >
            Book now
          </Link>
        </nav>
      )}
    </header>
  );
}
