import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCar } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold mb-4">
            <FaCar className="text-primary-orange" />
            SKG Ride Services
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Reliable and affordable commercial cab services across Pune. Your
            trusted partner for daily commute, airport transfers, and corporate
            travel.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/" className="hover:text-primary-orange transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary-orange transition-colors">About Us</Link></li>
            <li><Link href="/book-ride" className="hover:text-primary-orange transition-colors">Book Ride</Link></li>
            <li><Link href="/offers" className="hover:text-primary-orange transition-colors">Offers</Link></li>
            <li><Link href="/contact" className="hover:text-primary-orange transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-primary-orange mt-1 shrink-0" />
              Amorapolis, Bharat Mata Road, Dhanori, Pune MH 411015
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-primary-orange shrink-0" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary-orange shrink-0" />
              info@skgrideservices.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-600 text-center py-4 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SKG Ride Services. All rights reserved.
      </div>
    </footer>
  );
}
