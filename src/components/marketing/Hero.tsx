import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaArrowRight, FaRoute, FaBolt, FaStar } from "react-icons/fa";
import { BRAND_TAGLINE, CONTACT_PHONE_E164, CONTACT_PHONE_DISPLAY } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/ertiga.jpg"
          alt="Maruti Suzuki Ertiga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_center] scale-105"
        />
        {/* Vignettes for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-deep)] via-[var(--bg-deep)]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg-deep)]/40 to-transparent" />
        <div className="absolute inset-0 bg-[var(--bg-deep)]/30" />
      </div>

      {/* Subtle decorative blurs */}
      <div className="absolute top-1/4 -right-24 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-3xl pointer-events-none animate-float" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="max-w-2xl">
          {/* Eyebrow with stars */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-[var(--hairline-strong)] backdrop-blur-md text-xs font-medium tracking-[0.2em] uppercase animate-fade-up">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-accent text-[10px]" />
              ))}
            </span>
            <span className="text-foreground/80">Premium chauffeur · Pune</span>
          </div>

          <h1 className="mt-7 heading-display text-white text-6xl md:text-7xl lg:text-8xl animate-fade-up delay-100">
            Every mile,
            <br />
            <span className="gold-text">made easy.</span>
          </h1>

          <p className="mt-7 text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed animate-fade-up delay-200">
            On-demand rides anywhere in Pune. Outstation trips to Mumbai,
            Lonavala, Nashik &amp; Shirdi — driven by professionals you can trust.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 animate-fade-up delay-300">
            <Link
              href="/book-ride"
              className="group inline-flex items-center gap-2 btn-gold px-7 py-4 rounded-full font-semibold text-base"
            >
              Book a ride
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="btn-ghost inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base"
            >
              <FaPhoneAlt />
              <span>{CONTACT_PHONE_DISPLAY}</span>
            </a>
          </div>

          {/* Service-type pills */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg animate-fade-up delay-400">
            <ServicePill icon={<FaBolt />} label="On-demand" hint="Local Pune rides" />
            <ServicePill icon={<FaRoute />} label="Intercity" hint="Outstation trips" />
          </div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <span className="sr-only">{BRAND_TAGLINE}</span>
    </section>
  );
}

function ServicePill({
  icon,
  label,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-[var(--hairline-strong)] backdrop-blur-md p-4 hover:bg-white/[0.06] hover:border-accent/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent-light">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted mt-0.5">{hint}</p>
        </div>
      </div>
    </div>
  );
}
