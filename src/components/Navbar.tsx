"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCar, FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/book-ride", label: "Book Ride" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-primary-blue font-bold text-xl">
          <FaCar className="text-primary-orange text-2xl" />
          <span>SKG Ride Services</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary-blue hover:text-primary-orange font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book-ride"
            className="bg-primary-orange text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors"
          >
            Book Now
          </Link>
        </nav>

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
        <nav className="md:hidden bg-white border-t px-4 pb-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-primary-blue hover:text-primary-orange font-medium py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book-ride"
            className="block bg-primary-orange text-white text-center px-5 py-2 rounded-md font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
