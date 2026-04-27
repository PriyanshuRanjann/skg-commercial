"use client";

import { useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          phone: phone || undefined,
          rating,
          comment: comment || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("Could not save your feedback. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <section className="py-32 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
            <FaCheckCircle className="text-accent-light text-4xl" />
          </div>
          <h1 className="heading-display text-4xl text-foreground mb-3">
            Thank <span className="gold-text">you</span>.
          </h1>
          <p className="text-muted">
            We appreciate your feedback. Safe travels.
          </p>
          <p className="mt-12 text-[10px] tracking-[0.3em] uppercase text-accent">
            {BRAND_NAME} — {BRAND_TAGLINE}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
            Passenger feedback
          </span>
          <h1 className="mt-5 heading-display text-4xl md:text-5xl text-foreground">
            How was your <span className="gold-text">ride</span>?
          </h1>
          <p className="mt-3 text-muted">
            30-second feedback. Helps us serve you better.
          </p>
        </div>

        <form onSubmit={onSubmit} className="card-luxe p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-muted mb-3 text-center">
              Rate your ride
            </label>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="text-4xl transition-all hover:scale-115"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <FaStar
                    className={
                      n <= (hover || rating) ? "text-accent-light drop-shadow-[0_0_12px_rgba(201,168,124,0.5)]" : "text-foreground/15"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <Field label="Name (optional)">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-modern"
            />
          </Field>
          <Field label="Phone (optional)">
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-modern"
            />
          </Field>
          <Field label="Comment (optional)">
            <textarea
              name="comment"
              rows={4}
              placeholder="Tell us about your ride..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-modern"
            />
          </Field>

          {error && (
            <p className="text-sm text-[var(--danger)] bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full btn-gold py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy && <Spinner size="sm" className="mr-2" />}
            Submit feedback
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
