import Link from "next/link";

const services = [
  {
    title: "Flat 20% Off on First Ride",
    description:
      "Get a warm welcome with an exclusive discount on your very first ride with us.",
    cta: "Book Now",
  },
  {
    title: "Corporate Travel Packages",
    description:
      "Customized corporate travel packages for businesses across Pune.",
    cta: "Book Now",
  },
  {
    title: "Airport Pickup Discount",
    description:
      "Hassle-free airport transfers at competitive prices across Pune.",
    cta: "Book Now",
  },
];

export default function ServiceAreas() {
  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
          Our Service Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-5xl">
                🚕
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary-blue mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{s.description}</p>
                <Link
                  href="/book-ride"
                  className="inline-block bg-primary-orange text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
