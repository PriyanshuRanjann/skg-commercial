import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-blue to-blue-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Reliable Commercial Cab Services Across Pune
          </h1>
          <p className="text-gray-200 text-lg">
            Lorem ipsum dolor sit amet, your trusted fleet solutions and everything Pune needs.
          </p>
          <div className="flex gap-4">
            <Link
              href="/book-ride"
              className="bg-primary-orange text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
            >
              Book a Ride
            </Link>
            <a
              href="tel:+919876543210"
              className="bg-primary-blue border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-primary-blue transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
        <div className="hidden md:flex justify-center">
          <div className="w-96 h-64 bg-white/10 rounded-xl flex items-center justify-center text-6xl">
            🚗
          </div>
        </div>
      </div>
    </section>
  );
}
