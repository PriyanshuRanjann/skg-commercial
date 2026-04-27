"use client";

import { useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
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
      <section className="py-20 bg-light-gray min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center">
          <FaCheckCircle className="text-primary-orange text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary-blue mb-2">Thank you!</h1>
          <p className="text-gray-600">
            We appreciate your feedback. Have a great day!
          </p>
          <p className="mt-8 text-xs text-gray-400">
            {BRAND_NAME} — {BRAND_TAGLINE}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-light-gray min-h-screen">
      <div className="max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary-blue mb-2 text-center">
          How was your ride?
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your feedback helps us serve you better.
        </p>

        <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Rate your ride
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="text-4xl transition-transform hover:scale-110"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <FaStar
                    className={
                      n <= (hover || rating) ? "text-primary-orange" : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Name (optional)"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Phone (optional)"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Textarea
            label="Comments (optional)"
            name="comment"
            rows={4}
            placeholder="Tell us about your ride…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={busy}>
            {busy ? <Spinner size="sm" className="mr-2" /> : null}
            Submit feedback
          </Button>
        </form>
      </div>
    </section>
  );
}
