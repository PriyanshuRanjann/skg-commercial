import Image from "next/image";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaQrcode,
  FaUserShield,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-deep)] text-foreground overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-48 right-0 w-[32rem] h-[32rem] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-[24rem] h-[24rem] bg-accent-deep/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top hairline */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/images/brand/logo.png"
              alt={BRAND_NAME}
              width={56}
              height={56}
              className="rounded-xl"
            />
            <div>
              <p className="font-light text-xl tracking-[0.2em] uppercase">{BRAND_NAME}</p>
              <p className="text-xs text-accent tracking-[0.3em] uppercase mt-1">
                Premium chauffeur service
              </p>
            </div>
          </div>
          <p className="text-3xl md:text-4xl heading-display max-w-md">
            <span className="gold-text">{BRAND_TAGLINE}.</span>
          </p>
          <p className="text-sm text-muted mt-5 max-w-md leading-relaxed">
            Intercity outstation and on-demand intra-city cabs across Pune.
            Maruti Suzuki Ertiga, professional chauffeur, every ride done right.
          </p>

          <div className="mt-7 flex gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-[var(--hairline-strong)] flex items-center justify-center text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-[var(--hairline-strong)] flex items-center justify-center text-foreground/70 hover:text-accent hover:border-accent/40 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-5">
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            <FooterLink href="/" label="Home" />
            <FooterLink href="/about" label="About" />
            <FooterLink href="/book-ride" label="Book a Ride" />
            <FooterLink href="/offers" label="Offers" />
            <FooterLink href="/contact" label="Contact" />
            <FooterLink href="/feedback" label="Leave feedback" />
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-5">
            Reach us
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-accent mt-1 shrink-0" />
              <span className="text-foreground/75 leading-relaxed">{CONTACT_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-accent shrink-0" />
              <a href={`tel:${CONTACT_PHONE_DISPLAY}`} className="text-foreground/75 hover:text-accent-light transition-colors">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-accent shrink-0" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground/75 hover:text-accent-light transition-colors">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>

          {/* Team / internal access */}
          <div className="mt-8 pt-7 border-t border-[var(--hairline)]">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted mb-4">
              For our team
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/driver/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-[var(--hairline-strong)] text-xs font-medium hover:bg-white/10 hover:border-accent/40 transition-all"
              >
                <FaUserShield className="text-accent" /> Driver
              </Link>
              <Link
                href="/owner/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-[var(--hairline-strong)] text-xs font-medium hover:bg-white/10 hover:border-accent/40 transition-all"
              >
                <FaUserShield className="text-accent" /> Owner
              </Link>
              <Link
                href="/qr"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-[var(--hairline-strong)] text-xs font-medium hover:bg-white/10 hover:border-accent/40 transition-all"
              >
                <FaQrcode className="text-accent" /> QR sticker
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[var(--hairline)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <p className="tracking-[0.3em] uppercase">Pune · India</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-foreground/70 hover:text-accent-light transition-colors"
      >
        <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-3" />
        {label}
      </Link>
    </li>
  );
}
