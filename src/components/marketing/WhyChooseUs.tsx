import {
  FaClock,
  FaMapMarkerAlt,
  FaCarAlt,
  FaRupeeSign,
} from "react-icons/fa";

const features = [
  {
    icon: <FaClock className="text-3xl text-primary-orange" />,
    title: "On Time Pickup",
    description: "We value your time with punctual pickups every time.",
  },
  {
    icon: <FaMapMarkerAlt className="text-3xl text-primary-orange" />,
    title: "GPS Tracking",
    description: "Track your ride in real-time for complete peace of mind.",
  },
  {
    icon: <FaCarAlt className="text-3xl text-primary-orange" />,
    title: "Clean & Comfortable",
    description: "Well-maintained, sanitized vehicles for a safe journey.",
  },
  {
    icon: <FaRupeeSign className="text-3xl text-primary-orange" />,
    title: "Affordable Pricing",
    description: "Transparent pricing with no hidden charges.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-primary-blue mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
