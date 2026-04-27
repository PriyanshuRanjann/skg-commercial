import Link from "next/link";

const latestOffers = [
  {
    title: "20% ON Your First Ride",
    description:
      "First-time riders get a flat 20% discount on their inaugural journey with us.",
    cta: "Book Now",
    color: "from-orange-400 to-orange-600",
  },
  {
    title: "Business Travel Packages",
    description:
      "Exclusive corporate travel packages tailored for businesses in Pune.",
    cta: "Book Now",
    color: "from-primary-blue to-blue-800",
  },
  {
    title: "Airport Transfer Discounts",
    description:
      "Flat rate airport transfers with comfortable, reliable service.",
    cta: "Book Now",
    color: "from-blue-500 to-blue-700",
  },
];

const limitedDeals = [
  {
    title: "Weekend Special 10% Off Rides",
    description:
      "Enjoy discounted rides every weekend across all Pune locations.",
    cta: "Grab Offer",
  },
  {
    title: "Long Distance Fare Discount",
    description:
      "Special reduced fares for long distance inter-city travel bookings.",
    cta: "Grab Offer",
  },
  {
    title: "Refer & Earn Free Rides",
    description:
      "Refer a friend and earn free ride credits for your next journey.",
    cta: "Grab Offer",
  },
];

export default function OffersPage() {
  return (
    <>
      {/* Latest Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary-blue mb-12">
            Our Latest Offers
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestOffers.map((offer) => (
              <div
                key={offer.title}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`bg-gradient-to-br ${offer.color} text-white p-8 h-44 flex items-center justify-center`}
                >
                  <h3 className="text-xl font-bold text-center">
                    {offer.title}
                  </h3>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-gray-600 text-sm mb-4">
                    {offer.description}
                  </p>
                  <Link
                    href="/book-ride"
                    className="inline-block bg-primary-orange text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-orange-600 transition-colors"
                  >
                    {offer.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited Time Deals */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
            Limited Time Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {limitedDeals.map((deal) => (
              <div
                key={deal.title}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-primary-blue mb-3">
                  {deal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {deal.description}
                </p>
                <Link
                  href="/book-ride"
                  className="inline-block bg-primary-orange text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  {deal.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
