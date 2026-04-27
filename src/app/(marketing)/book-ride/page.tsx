"use client";

import { useState } from "react";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";
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
    vehicleType: "Ertiga (6+1)",
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
    <section className="py-24 md:py-32 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            Reserve your ride
          </span>
          <h1 className="mt-5 heading-display text-4xl md:text-6xl text-foreground">
            Book your <span className="gold-text">ride</span>.
          </h1>
          <p className="mt-3 text-muted">
            Fill in the details — we&apos;ll WhatsApp you to confirm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-luxe p-6 md:p-10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Name">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                name="phone"
                placeholder="+91 ..."
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>
          </div>

          <Field label="Email (optional)">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-modern"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Pickup location">
              <select
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                required
                className="input-modern"
              >
                <option value="">Select pickup</option>
                {SERVICE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </Field>
            <Field label="Drop location">
              <input
                type="text"
                name="drop"
                placeholder="Pune area or outstation city"
                value={formData.drop}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Date">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>
            <Field label="Vehicle">
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="input-modern"
              >
                <option value="Ertiga (6+1)">Ertiga (6+1)</option>
              </select>
            </Field>
          </div>

          <Field label="Special instructions (optional)">
            <textarea
              name="instructions"
              placeholder="Anything we should know? Pickup landmark, luggage, child seat..."
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              className="input-modern"
            />
          </Field>

          <button
            type="submit"
            className="w-full btn-gold inline-flex items-center justify-center gap-2 py-5 rounded-full font-bold text-base group"
          >
            <FaWhatsapp className="text-lg" />
            Submit booking request
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-muted mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
