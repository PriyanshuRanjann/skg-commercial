"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaUserPlus } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";
import { AuthShell } from "@/components/shared/AuthShell";

export default function DriverSignupPage() {
  return (
    <AuthShell
      eyebrow="Driver portal"
      title={<>Create your <span className="gold-text">account</span>.</>}
      subtitle="Sign up to start logging shifts."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/driver/login" className="text-accent-light hover:text-accent font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <DriverSignupForm />
    </AuthShell>
  );
}

function DriverSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", pin: "", confirmPin: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPinChange = (field: "pin" | "confirmPin") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!/^\d{4}$/.test(form.pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }
    if (form.pin !== form.confirmPin) {
      setError("PINs don't match.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/driver/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username.trim(), pin: form.pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(humanize(data.error));
        return;
      }
      router.replace("/driver");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Username">
        <input
          type="text"
          required
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="input-modern"
          placeholder="Choose a username"
        />
      </Field>
      <Field label="4-digit PIN">
        <input
          type="password"
          required
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={4}
          value={form.pin}
          onChange={onPinChange("pin")}
          className="input-modern tracking-[0.5em] text-center text-xl"
          placeholder="••••"
        />
      </Field>
      <Field label="Confirm PIN">
        <input
          type="password"
          required
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={4}
          value={form.confirmPin}
          onChange={onPinChange("confirmPin")}
          className="input-modern tracking-[0.5em] text-center text-xl"
          placeholder="••••"
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
        className="w-full btn-gold py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {busy ? <Spinner size="sm" className="mr-2" /> : <FaUserPlus />}
        Create account
        <FaArrowRight />
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-muted mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function humanize(code: unknown): string {
  switch (code) {
    case "email_taken":
    case "username_taken":
      return "That username is already taken.";
    case "missing_fields":
    case "invalid_input":
      return "Please fill in all required fields correctly.";
    default:
      return "Could not create account. Please try again.";
  }
}
