"use client";

import { useState } from "react";
import { FaBolt, FaRoute, FaArrowRight } from "react-icons/fa";
import { SERVICE_LOCATIONS, SERVICE_TYPES, buildWhatsAppLink, type ServiceType } from "@/lib/config";

export default function BookingForm() {
  const [tripType, setTripType] = useState<ServiceType>("intra-city");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    from: "",
    toCity: "",
    toLocal: "",
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
    const drop = tripType === "intercity" ? formData.toCity : formData.toLocal;
    const typeLabel = SERVICE_TYPES.find((t) => t.id === tripType)?.label;
    const message = `New ${typeLabel} Booking:\nName: ${formData.name}\nContact: ${formData.contact}\nFrom: ${formData.from}\nTo: ${drop}\nDate: ${formData.date}\nTime: ${formData.time}`;
    window.open(buildWhatsAppLink(message), "_blank");
  };

  return (
    <section className="py-20 md:py-24 relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-orange/10 text-primary-orange text-xs font-bold tracking-wide uppercase">
            Book in 30 seconds
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-primary-blue tracking-tight">
            Where to today?
          </h2>
          <p className="mt-3 text-muted">
            Pick your trip type — we&apos;ll WhatsApp you a confirmation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-soft p-6 md:p-8 animate-fade-up delay-100"
        >
          {/* Trip type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-light-gray rounded-full mb-6">
            {SERVICE_TYPES.map((t) => {
              const active = tripType === t.id;
              const Icon = t.id === "intra-city" ? FaBolt : FaRoute;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTripType(t.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all ${
                    active
                      ? "bg-primary-blue text-white shadow-md"
                      : "text-primary-blue hover:text-primary-orange"
                  }`}
                >
                  <Icon /> {t.short}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Your name">
              <input
                type="text"
                name="name"
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>

            <Field label="Phone">
              <input
                type="tel"
                name="contact"
                placeholder="+91 ..."
                value={formData.contact}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>

            <Field label="Pickup">
              <select
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                className="input-modern"
              >
                <option value="">Select pickup area</option>
                {SERVICE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </Field>

            <Field label={tripType === "intercity" ? "Destination city" : "Drop"}>
              {tripType === "intercity" ? (
                <input
                  type="text"
                  name="toCity"
                  placeholder="e.g. Mumbai, Shirdi, Nashik"
                  value={formData.toCity}
                  onChange={handleChange}
                  required
                  className="input-modern"
                />
              ) : (
                <select
                  name="toLocal"
                  value={formData.toLocal}
                  onChange={handleChange}
                  required
                  className="input-modern"
                >
                  <option value="">Select drop area</option>
                  {SERVICE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              )}
            </Field>

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
          </div>

          <button
            type="submit"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary-orange text-white py-4 rounded-full font-bold text-base hover:bg-primary-orange-light btn-glow transition-all group"
          >
            Check availability
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-xs text-center text-muted mt-3">
            We&apos;ll reach out on WhatsApp to confirm — no payment yet.
          </p>
        </form>
      </div>

      {/* Inline modern input style — kept here so other pages can opt in if needed */}
      <style>{`
        .input-modern {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--hairline);
          background: #fff;
          color: var(--foreground);
          font-size: 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-modern:focus {
          outline: none;
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 4px rgba(232, 136, 10, 0.12);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wide uppercase text-muted mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
