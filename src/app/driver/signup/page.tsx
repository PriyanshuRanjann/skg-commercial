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
      eyebrow="Driver application"
      title={<>Apply to <span className="gold-text">drive</span>.</>}
      subtitle="Create an account. The owner reviews and approves before you can log in."
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
  const [form, setForm] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/driver/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(humanize(data.error));
        return;
      }
      router.replace("/driver/login?signup=1");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Full name">
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-modern"
          placeholder="As on your ID"
        />
      </Field>
      <Field label="Phone">
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input-modern"
          placeholder="+91 ..."
        />
      </Field>
      <Field label="Username">
        <input
          type="text"
          required
          autoComplete="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="input-modern"
          placeholder="3+ characters, no spaces"
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-modern"
          placeholder="6+ characters"
        />
      </Field>
      <Field label="Confirm password">
        <input
          type="password"
          required
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="input-modern"
        />
      </Field>

      {error && (
        <p className="text-sm text-[var(--danger)] bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <p className="text-xs text-muted leading-relaxed">
        Your account will be created in <span className="text-foreground">pending</span> state.
        The owner reviews and approves new drivers before they can log shifts.
      </p>

      <button
        type="submit"
        disabled={busy}
        className="w-full btn-gold py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {busy ? <Spinner size="sm" className="mr-2" /> : <FaUserPlus />}
        Submit application
        <FaArrowRight />
      </button>
    </form>
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

function humanize(code: unknown): string {
  switch (code) {
    case "username_taken":
      return "That username is already taken. Try another.";
    case "missing_fields":
    case "invalid_input":
      return "Please fill in all required fields.";
    default:
      return "Could not submit application. Please try again.";
  }
}
