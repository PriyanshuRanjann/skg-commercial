"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import {
  BRAND_NAME,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  buildWhatsAppLink,
} from "@/lib/config";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Contact from ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    window.open(buildWhatsAppLink(message), "_blank");
  };

  return (
    <section className="py-24 md:py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            Get in touch
          </span>
          <h1 className="mt-5 heading-display text-4xl md:text-6xl text-foreground">
            Let&apos;s <span className="gold-text">talk</span>.
          </h1>
          <p className="mt-4 text-muted">
            Reach us by phone, WhatsApp, or fill the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ContactRow
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={CONTACT_ADDRESS}
            />
            <ContactRow
              icon={<FaPhone />}
              label="Phone"
              value={CONTACT_PHONE_DISPLAY}
              href={`tel:${CONTACT_PHONE_DISPLAY}`}
            />
            <ContactRow
              icon={<FaWhatsapp />}
              label="WhatsApp"
              value={CONTACT_PHONE_DISPLAY}
              href={`https://wa.me/${CONTACT_PHONE_DISPLAY.replace(/\D/g, "")}`}
            />
            <ContactRow
              icon={<FaEnvelope />}
              label="Email"
              value={CONTACT_EMAIL}
              href={`mailto:${CONTACT_EMAIL}`}
            />

            {/* Map */}
            <div className="card-luxe p-2 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.6!2d73.87!3d18.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM1JzI0LjAiTiA3M8KwNTInMTIuMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: "0.875rem", filter: "grayscale(40%) invert(92%) hue-rotate(180deg) brightness(0.8)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${BRAND_NAME} location`}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card-luxe p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-semibold tracking-wide text-foreground">
              Send a message
            </h2>
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
            <Field label="Email (optional)">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className="input-modern"
              />
            </Field>
            <Field label="Phone">
              <input
                type="tel"
                name="phone"
                placeholder="Your phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </Field>
            <Field label="Message">
              <textarea
                name="message"
                placeholder="What can we help with?"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="input-modern"
              />
            </Field>
            <button
              type="submit"
              className="w-full btn-gold inline-flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base group"
            >
              <FaWhatsapp /> Send via WhatsApp
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent-light shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
          {label}
        </p>
        <p className="text-foreground mt-1">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="card-luxe p-5 flex items-center gap-4 hover:bg-white/[0.03]">
        {inner}
      </a>
    );
  }
  return <div className="card-luxe p-5 flex items-center gap-4">{inner}</div>;
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
