import { FaCar, FaUsers, FaHeadset } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const achievements = [
  {
    icon: <MdVerified className="text-4xl text-primary-orange" />,
    count: "1000+",
    label: "Rides Completed",
  },
  {
    icon: <FaUsers className="text-4xl text-primary-orange" />,
    count: "100+",
    label: "Happy Customers",
  },
  {
    icon: <FaHeadset className="text-4xl text-primary-orange" />,
    count: "24/7",
    label: "Service",
  },
];

const fleet = [
  { name: "Sedan", emoji: "🚗" },
  { name: "SUV", emoji: "🚙" },
  { name: "Luxury Car", emoji: "🏎️" },
];

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
              About SKG Ride Services
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              SKG Ride Services is a trusted cab service provider in Pune
              offering reliable and affordable transportation. We are committed
              to providing safe, comfortable, and timely rides for all your
              travel needs.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether it&apos;s a daily commute, airport transfer, or corporate
              travel, our fleet of well-maintained vehicles and professional
              drivers ensure a seamless experience every time.
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {fleet.map((car) => (
              <div key={car.name} className="text-center">
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
