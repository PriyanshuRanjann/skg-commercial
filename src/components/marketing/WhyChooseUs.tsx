import {
  FaClock,
  FaMapMarkedAlt,
  FaCarSide,
  FaRupeeSign,
} from "react-icons/fa";

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
      "Maruti Suzuki Ertiga (6+1) — sanitized between rides, AC, generous luggage space for outstation runs.",
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
    <section className="py-20 md:py-24 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-orange/10 text-primary-orange text-xs font-bold tracking-wide uppercase">
            Why ride with us
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-primary-blue tracking-tight">
            Built for trust.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card-soft p-6">
              <div className="w-11 h-11 rounded-xl bg-primary-blue text-primary-orange-light text-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-primary-blue mb-2">
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
