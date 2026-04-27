import { FaCar, FaUsers, FaHeadset } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { BRAND_NAME } from "@/lib/config";

export const metadata = { title: "About Us" };

const achievements = [
  {
    icon: <MdVerified className="text-4xl text-primary-orange" />,
    count: "—",
    label: "Rides Completed",
  },
  {
    icon: <FaUsers className="text-4xl text-primary-orange" />,
    count: "—",
    label: "Happy Customers",
  },
  {
    icon: <FaHeadset className="text-4xl text-primary-orange" />,
    count: "24/7",
    label: "Service",
  },
];

const fleet = [{ name: "Maruti Suzuki Ertiga (6+1)", emoji: "🚙" }];

export default function AboutPage() {
  return (
    <>
      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-7xl">
            <FaCar className="text-primary-blue" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-6">
              About {BRAND_NAME}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              {BRAND_NAME} is a Pune-based commercial cab service committed to
              safe, comfortable, and on-time rides for daily commutes, airport
              transfers, and corporate travel.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every mile, made easy — that&apos;s our promise. Well-maintained
              vehicles and professional drivers, every trip.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
            Our Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {achievements.map((a) => (
              <div
                key={a.label}
                className="bg-white rounded-xl shadow-md p-8 text-center"
              >
                <div className="flex justify-center mb-4">{a.icon}</div>
                <p className="text-3xl font-bold text-primary-blue mb-1">
                  {a.count}
                </p>
                <p className="text-gray-600">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
            Our Fleet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {fleet.map((car) => (
              <div key={car.name} className="sm:col-start-2 text-center">
                <div className="h-48 bg-light-gray rounded-xl flex items-center justify-center text-6xl mb-4">
                  {car.emoji}
                </div>
                <p className="text-lg font-semibold text-primary-blue">
                  {car.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
