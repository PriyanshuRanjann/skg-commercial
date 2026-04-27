import Link from "next/link";
import Image from "next/image";
import { FaBolt, FaRoute, FaPlaneDeparture, FaArrowRight } from "react-icons/fa";

const services = [
  {
    icon: <FaBolt />,
    title: "Intra-city On-demand",
    blurb:
      "Quick rides anywhere in Pune. Daily commute, last-minute meetings, or a night out — book in minutes.",
    bullets: ["Pune-wide pickup", "Hourly packages", "Verified driver"],
    cta: "Book on-demand",
    href: "/book-ride",
  },
  {
    icon: <FaRoute />,
    title: "Intercity (Outstation)",
    blurb:
      "Drop trips and round trips to Mumbai, Lonavala, Nashik, Shirdi, and other destinations across Maharashtra.",
    bullets: [
      "Same-day & overnight",
      "Transparent km rates",
      "Fuel + tolls included on round trips",
    ],
    cta: "Plan an outstation",
    href: "/book-ride",
  },
  {
    icon: <FaPlaneDeparture />,
    title: "Airport Transfers",
    blurb:
      "Punctual pickup & drop for Pune Airport. We track your flight so you don't worry about delays.",
    bullets: ["Flight tracking", "Meet & greet", "Fixed transparent fare"],
    cta: "Book airport ride",
    href: "/book-ride",
  },
];

export default function ServiceAreas() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Faint Ertiga photo as bg */}
      <div className="absolute inset-0 -z-10 opacity-[0.06]">
        <Image
          src="/images/hero/ertiga.jpg"
          alt=""
          fill
          aria-hidden
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            What we do
          </span>
          <h2 className="mt-5 heading-display text-4xl md:text-6xl text-foreground">
            Three ways to <span className="gold-text">ride</span>.
          </h2>
          <p className="mt-4 text-muted">
            Quick local trips, full-day outstation runs, or airport transfers — we run all three.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="card-luxe p-8 group flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent-light text-2xl mb-6 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all">
                {s.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 tracking-wide">
                {s.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-5">{s.blurb}</p>
              <ul className="space-y-2 mb-7 text-sm text-foreground/85">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="text-accent mt-1 text-xs">◆</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="mt-auto inline-flex items-center gap-2 text-accent-light hover:text-accent font-semibold text-sm group-hover:gap-3 transition-all"
              >
                {s.cta}
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
