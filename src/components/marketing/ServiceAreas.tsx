import Link from "next/link";
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
    accent: "from-primary-orange to-primary-orange-light",
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
    accent: "from-primary-blue to-light-blue",
  },
  {
    icon: <FaPlaneDeparture />,
    title: "Airport Transfers",
    blurb:
      "Punctual pickup & drop for Pune Airport. We track your flight so you don't worry about delays.",
    bullets: ["Flight tracking", "Meet & greet", "Fixed transparent fare"],
    cta: "Book airport ride",
    href: "/book-ride",
    accent: "from-primary-blue-dark to-primary-blue",
  },
];

export default function ServiceAreas() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-xs font-bold tracking-wide uppercase">
            What we do
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-primary-blue tracking-tight">
            Two ways to ride
          </h2>
          <p className="mt-3 text-muted">
            Quick local rides on demand, or full-day outstation trips — we run both.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="card-soft p-7 group flex flex-col">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center text-white text-xl mb-5`}
              >
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-primary-blue mb-2">
                {s.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">{s.blurb}</p>
              <ul className="space-y-1.5 mb-6 text-sm text-foreground/80">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-primary-orange mt-1">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="mt-auto inline-flex items-center gap-2 text-primary-orange font-semibold text-sm group-hover:gap-3 transition-all"
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
