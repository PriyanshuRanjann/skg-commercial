"use client";

import { useState } from "react";
import { FaBolt, FaRoute, FaArrowRight, FaWhatsapp } from "react-icons/fa";
import {
  SERVICE_LOCATIONS,
  SERVICE_TYPES,
  buildWhatsAppLink,
  type ServiceType,
} from "@/lib/config";

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
    <section className="relative py-24 md:py-32">
      {/* subtle gold edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal in">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            Reserve in 30 seconds
          </span>
          <h2 className="mt-5 heading-display text-4xl md:text-6xl text-foreground">
            Where to <span className="gold-text">today</span>?
          </h2>
          <p className="mt-4 text-muted">
            Pick your trip type — we&apos;ll WhatsApp you to confirm.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-luxe p-6 md:p-10 animate-fade-up delay-100"
        >
          {/* Trip type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[var(--bg-deep)] border border-[var(--hairline)] rounded-full mb-8">
            {SERVICE_TYPES.map((t) => {
              const active = tripType === t.id;
              const Icon = t.id === "intra-city" ? FaBolt : FaRoute;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTripType(t.id)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all ${
                    active
                      ? "btn-gold"
                      : "text-foreground/60 hover:text-accent-light"
                  }`}
                >
                  <Icon /> {t.short}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
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
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
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
            className="mt-8 w-full inline-flex items-center justify-center gap-2 btn-gold py-5 rounded-full font-bold text-base group"
          >
            <FaWhatsapp className="text-lg" />
            Check availability
            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-xs text-center text-muted mt-4">
            We&apos;ll reach out on WhatsApp to confirm — no payment yet.
          </p>
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
