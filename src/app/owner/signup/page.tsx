"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaCrown } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";
import { AuthShell } from "@/components/shared/AuthShell";

export default function OwnerSignupPage() {
  return (
    <AuthShell
      eyebrow="First-time setup"
      title={<>Create your <span className="gold-text">owner</span> account.</>}
      subtitle="One-time bootstrap. After this, owner signup is closed."
      footer={
        <>
          Already set up?{" "}
          <Link href="/owner/login" className="text-accent-light hover:text-accent font-semibold">
            Sign in
          </Link>
        </>
      }
    >
      <OwnerSignupForm />
    </AuthShell>
  );
}

function OwnerSignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/owner/exists")
      .then((r) => r.json())
      .then((d) => setClosed(d.ok && d.exists))
      .catch(() => setClosed(null));
  }, []);

  if (closed === true) {
    return (
      <div className="text-center space-y-4">
        <FaCrown className="text-accent text-3xl mx-auto" />
        <p className="text-foreground">
          Owner account is already configured. Owner signup is closed.
        </p>
        <Link
          href="/owner/login"
          className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
        >
          Sign in <FaArrowRight />
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/owner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(humanize(data.error));
        return;
      }
      router.replace("/owner");
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
          placeholder="Pick something memorable"
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
          placeholder="8+ characters"
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
        Once created, this is the only owner account. Choose a strong password —
        you can&apos;t reset it through this form.
      </p>

      <button
        type="submit"
        disabled={busy}
        className="w-full btn-gold py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {busy ? <Spinner size="sm" className="mr-2" /> : <FaCrown />}
        Create owner account
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
    case "owner_exists":
      return "An owner account already exists. Please log in.";
    case "missing_fields":
    case "invalid_input":
      return "Please fill in all required fields.";
    default:
      return "Could not create account. Please try again.";
  }
}
