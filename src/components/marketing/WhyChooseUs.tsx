import { FaClock, FaMapMarkedAlt, FaCarSide, FaRupeeSign } from "react-icons/fa";

const features = [
  {
    icon: <FaClock />,
    title: "On-time, every time",
    description:
      "Punctual pickups. We commit to a window and we hit it — for local hops and outstation trips alike.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Live GPS tracking",
    description:
      "Share your ride with family. Real-time location, route, and ETA available the moment you book.",
  },
  {
    icon: <FaCarSide />,
    title: "Clean, comfortable car",
    description:
      "Maruti Suzuki Ertiga — sanitized between rides, AC, generous luggage space for outstation runs.",
  },
  {
    icon: <FaRupeeSign />,
    title: "Honest pricing",
    description:
      "Transparent km rates for outstation, fixed fares for airport. Tolls itemized. No surge games.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 md:py-32 bg-[var(--bg-elevated)]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            Why ride with us
          </span>
          <h2 className="mt-5 heading-display text-4xl md:text-6xl text-foreground">
            Built for <span className="gold-text">trust</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-luxe p-7 group reveal in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent-deep/10 border border-accent/20 text-accent-light text-xl flex items-center justify-center mb-5 group-hover:border-accent/50 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 tracking-wide">
                {f.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
