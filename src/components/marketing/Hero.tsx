import Link from "next/link";
import { FaPhoneAlt, FaArrowRight, FaRoute, FaBolt } from "react-icons/fa";
import { BRAND_TAGLINE, CONTACT_PHONE_E164, CONTACT_PHONE_DISPLAY } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh text-white">
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      {/* Decorative blurs */}
      <div className="absolute -top-32 -right-24 w-96 h-96 bg-primary-orange/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] bg-primary-blue/40 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-36">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur text-xs font-semibold tracking-wide animate-fade-up">
            <FaBolt className="text-primary-orange-light" />
            INTERCITY · ON-DEMAND · PUNE
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight animate-fade-up delay-100">
            Every mile, <br />
            <span className="gradient-text">made easy.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/75 max-w-xl leading-relaxed animate-fade-up delay-200">
            On-demand rides anywhere in Pune, plus outstation trips to
            Mumbai, Lonavala, Nashik, Shirdi and beyond — driven by professionals
            you can trust.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up delay-300">
            <Link
              href="/book-ride"
              className="group inline-flex items-center gap-2 bg-primary-orange text-white px-6 py-3.5 rounded-full font-semibold hover:bg-primary-orange-light btn-glow transition-all"
            >
              Book a ride
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-6 py-3.5 rounded-full font-semibold backdrop-blur transition-colors"
            >
              <FaPhoneAlt />
              <span className="hidden sm:inline">{CONTACT_PHONE_DISPLAY}</span>
              <span className="sm:hidden">Call now</span>
            </a>
          </div>

          {/* Service-type cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl animate-fade-up delay-300">
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-orange/20 flex items-center justify-center text-primary-orange-light">
                  <FaBolt />
                </div>
                <div>
                  <p className="font-bold">On-demand</p>
                  <p className="text-xs text-white/60">Local Pune rides</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-orange/20 flex items-center justify-center text-primary-orange-light">
                  <FaRoute />
                </div>
                <div>
                  <p className="font-bold">Intercity</p>
                  <p className="text-xs text-white/60">Outstation trips</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline echo for SEO/branding (sr-friendly visual repetition removed; tagline lives only in heading) */}
        <p className="sr-only">{BRAND_TAGLINE}</p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </section>
  );
}
