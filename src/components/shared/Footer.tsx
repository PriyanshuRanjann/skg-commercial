import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCar, FaQrcode, FaUserShield } from "react-icons/fa";
import Link from "next/link";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
} from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative bg-primary-blue-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[28rem] h-[28rem] bg-primary-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 text-2xl font-black mb-3">
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FaCar className="text-primary-orange-light" />
            </span>
            {BRAND_NAME}
          </div>
          <p className="text-2xl md:text-3xl font-black leading-tight max-w-md">
            <span className="gradient-text">{BRAND_TAGLINE}.</span>
          </p>
          <p className="text-sm text-white/70 mt-4 max-w-md leading-relaxed">
            Intercity outstation and on-demand intra-city cabs across Pune. One Ertiga,
            one driver, every ride done right.
          </p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-primary-orange-light transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary-orange-light transition-colors">About</Link></li>
            <li><Link href="/book-ride" className="hover:text-primary-orange-light transition-colors">Book Ride</Link></li>
            <li><Link href="/offers" className="hover:text-primary-orange-light transition-colors">Offers</Link></li>
            <li><Link href="/contact" className="hover:text-primary-orange-light transition-colors">Contact</Link></li>
            <li><Link href="/feedback" className="hover:text-primary-orange-light transition-colors">Leave feedback</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">Reach us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-primary-orange-light mt-1 shrink-0" />
              <span className="text-white/80">{CONTACT_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FaPhone className="text-primary-orange-light shrink-0" />
              <a href={`tel:${CONTACT_PHONE_DISPLAY}`} className="hover:text-primary-orange-light">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaEnvelope className="text-primary-orange-light shrink-0" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary-orange-light">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>

          {/* Team / internal access */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-3">For our team</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/driver/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold hover:bg-white/15"
              >
                <FaUserShield /> Driver login
              </Link>
              <Link
                href="/owner/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold hover:bg-white/15"
              >
                <FaUserShield /> Owner console
              </Link>
              <Link
                href="/qr"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold hover:bg-white/15"
              >
                <FaQrcode /> Print QR sticker
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 text-center py-5 text-white/50 text-xs">
        &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
