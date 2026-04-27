import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCarSide, FaHeadset, FaUsers } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";

export const metadata = { title: "About Us" };

const achievements = [
  { icon: <MdVerified />, count: "—", label: "Rides completed" },
  { icon: <FaUsers />, count: "—", label: "Happy customers" },
  { icon: <FaHeadset />, count: "24/7", label: "Available" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero strip */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-mesh -z-10" />
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none -z-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            About {BRAND_NAME}
          </span>
          <h1 className="mt-6 heading-display text-5xl md:text-7xl text-foreground">
            A chauffeur service,
            <br />
            <span className="gold-text">not just a cab.</span>
          </h1>
          <p className="mt-6 text-muted max-w-2xl mx-auto text-lg leading-relaxed">
            {BRAND_NAME} is a Pune-based premium cab service. One car, one driver,
            and a commitment to every mile being made easy.
          </p>
        </div>
      </section>

      {/* Story + image */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--hairline)]">
            <Image
              src="/images/hero/ertiga.jpg"
              alt="Maruti Suzuki Ertiga"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-deep)]/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                Our fleet
              </p>
              <p className="text-2xl font-light text-foreground tracking-wide mt-1">
                Maruti Suzuki <span className="gold-text font-semibold">Ertiga</span>
              </p>
              <p className="text-sm text-foreground/70 mt-1">6 + 1 seater · sanitized · AC</p>
            </div>
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
              Our story
            </span>
            <h2 className="mt-5 heading-display text-3xl md:text-5xl text-foreground">
              Built on a <span className="gold-text">single promise</span>.
            </h2>
            <p className="text-muted mt-6 leading-relaxed">
              We started {BRAND_NAME} with a simple idea — that a cab service should
              feel like a chauffeur service. Punctual, sanitized, and run by people who
              treat your time with respect.
            </p>
            <p className="text-muted mt-4 leading-relaxed">
              Whether it&apos;s a quick run across Pune, an outstation trip to Mumbai,
              or an airport transfer at 4&nbsp;AM, you get the same Ertiga, the same
              professional driver, the same standard. {BRAND_TAGLINE}.
            </p>
            <Link
              href="/book-ride"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold mt-8 group"
            >
              Book a ride
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 md:py-24 bg-[var(--bg-elevated)] border-y border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
              By the numbers
            </span>
            <h2 className="mt-5 heading-display text-3xl md:text-5xl text-foreground">
              Built one ride <span className="gold-text">at a time</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {achievements.map((a) => (
              <div key={a.label} className="card-luxe p-10 text-center">
                <div className="text-3xl text-accent mb-4 inline-flex">{a.icon}</div>
                <p className="text-5xl heading-display gold-text mb-2">{a.count}</p>
                <p className="text-sm text-muted tracking-wide uppercase">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            The car
          </span>
          <h2 className="mt-5 heading-display text-3xl md:text-5xl text-foreground">
            Our <span className="gold-text">Ertiga</span>.
          </h2>
          <p className="mt-4 text-muted">Spacious, comfortable, well-maintained.</p>

          <div className="card-luxe mt-12 p-6 md:p-8 text-left flex flex-col md:flex-row gap-8 items-center">
            <div className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-[var(--hairline)]">
              <Image
                src="/images/hero/ertiga-square.jpg"
                alt="Ertiga"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <FaCarSide className="text-accent text-3xl mb-4" />
              <h3 className="text-2xl font-semibold tracking-wide text-foreground">
                Maruti Suzuki Ertiga
              </h3>
              <p className="text-muted mt-3 leading-relaxed">
                Comfortable seating for 6 + 1 (driver), generous luggage room for
                outstation runs, AC throughout. Cleaned and sanitized between rides.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                <Spec label="Seating" value="6 + 1" />
                <Spec label="Luggage" value="Generous (outstation-ready)" />
                <Spec label="AC" value="Yes, throughout" />
                <Spec label="Sanitized" value="Between every ride" />
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-[var(--hairline)] pb-2 text-sm">
      <span className="text-muted uppercase tracking-[0.2em] text-[10px]">{label}</span>
      <span className="text-foreground">{value}</span>
    </li>
  );
}
