"use client";

import { useState } from "react";

const locations = [
  "Dhanori",
  "Viman Nagar",
  "Kharadi",
  "Hinjewadi",
  "Pune Station",
  "Pune Airport",
  "Shivajinagar",
  "Koregaon Park",
  "Hadapsar",
  "Wakad",
  "Baner",
  "Aundh",
  "Pimpri-Chinchwad",
  "Magarpatta",
  "Kalyani Nagar",
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `New Booking Request:\nName: ${formData.name}\nContact: ${formData.contact}\nEmail: ${formData.email}\nFrom: ${formData.from}\nTo: ${formData.to}\nDate: ${formData.date}\nTime: ${formData.time}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary-blue mb-8">
          Book Your Ride
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact"
              placeholder="Phone"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              From
            </label>
            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            >
              <option value="">Select Pickup</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              To
            </label>
            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            >
              <option value="">Select Drop</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary-orange text-white py-3 rounded-md font-bold text-lg hover:bg-orange-600 transition-colors cursor-pointer"
            >
              Check Availability
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
