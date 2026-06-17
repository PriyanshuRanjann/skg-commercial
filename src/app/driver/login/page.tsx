"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaFlask, FaArrowRight } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";
import { AuthShell } from "@/components/shared/AuthShell";

export default function DriverLoginPage() {
  return (
    <AuthShell
      eyebrow="Driver portal"
      title={<>Welcome <span className="gold-text">back</span>.</>}
      subtitle="Sign in to start your shift."
      footer={
        <>
          New driver?{" "}
          <Link href="/driver/signup" className="text-accent-light hover:text-accent font-semibold">
            Apply for an account
          </Link>
        </>
      }
    >
      <DriverLoginForm />
    </AuthShell>
  );
}

function DriverLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const justSignedUp = params.get("signup") === "1";

  useEffect(() => {
    fetch("/api/me/mode")
      .then((r) => r.json())
      .then((d) => setDemoMode(!!d.demo))
      .catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <>
      {justSignedUp && (
        <div className="mb-5 bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-sm text-foreground">
          <p className="font-semibold text-accent-light">Account submitted ✓</p>
          <p className="mt-1 text-muted">Owner approval pending. You&apos;ll be able to log in once approved.</p>
        </div>
      )}

      {demoMode && (
        <div className="mb-5 bg-[var(--bg-card)]/5 border border-[var(--hairline-strong)] rounded-lg px-4 py-3 text-xs text-foreground/85">
          <p className="flex items-center gap-1.5 font-semibold">
            <FaFlask className="text-accent" /> Demo mode
          </p>
          <p className="mt-1 text-muted">
            Try{" "}
            <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded">driver1</code> /{" "}
            <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded">Metro@Driver25</code>
          </p>
          <button
            type="button"
            onClick={() => setForm({ username: "driver1", password: "Metro@Driver25" })}
            className="text-accent-light hover:text-accent font-semibold mt-2"
          >
            Fill demo credentials →
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Username">
          <input
            type="text"
            name="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input-modern"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          className="w-full btn-gold py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy ? <Spinner size="sm" className="mr-2" /> : null}
          Sign in
          <FaArrowRight />
        </button>
      </form>
    </>
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
    case "invalid_credentials":
      return "Wrong username or password.";
    case "driver_inactive":
      return "Your account is not yet approved by the owner.";
    case "invalid_input":
      return "Please check the form and try again.";
    default:
      return "Login failed. Please try again.";
  }
}
