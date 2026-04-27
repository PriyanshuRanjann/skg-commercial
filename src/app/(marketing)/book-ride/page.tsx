"use client";

import { useState } from "react";
import { SERVICE_LOCATIONS, buildWhatsAppLink } from "@/lib/config";

export default function BookRidePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    vehicleType: "",
    instructions: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Booking Request:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Pickup: ${formData.pickup}
Drop: ${formData.drop}
Date: ${formData.date}
Time: ${formData.time}
Vehicle: ${formData.vehicleType}
Instructions: ${formData.instructions}`;
    window.open(buildWhatsAppLink(message), "_blank");
  };

  return (
    <section className="py-16 bg-light-gray min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-2">
          Book Your Ride
        </h1>
        <p className="text-gray-600 mb-8">
          Fill in the details to book your cab.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
              />
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pickup Location
              </label>
              <select
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="">Pickup Location</option>
                {SERVICE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Drop Location
              </label>
              <select
                name="drop"
                value={formData.drop}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="">Drop Location</option>
                {SERVICE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
              >
                <option value="">Select Vehicle</option>
                <option value="Ertiga">Ertiga (6+1)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              name="instructions"
              placeholder="Special instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-blue text-white py-3 rounded-md font-bold text-lg hover:bg-blue-900 transition-colors cursor-pointer"
          >
            Submit Booking Request
          </button>
        </form>
      </div>
    </section>
  );
}
