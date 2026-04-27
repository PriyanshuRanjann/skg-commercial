"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaFlask, FaArrowRight } from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";
import { AuthShell } from "@/components/shared/AuthShell";

export default function OwnerLoginPage() {
  return (
    <AuthShell
      eyebrow="Owner console"
      title={<>Owner <span className="gold-text">access</span>.</>}
      subtitle="Restricted area."
      footer={<OwnerFooter />}
    >
      <OwnerLoginForm />
    </AuthShell>
  );
}

function OwnerLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

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
      const res = await fetch("/api/auth/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error === "invalid_credentials" ? "Wrong username or password." : "Login failed.");
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
    <>
      {demoMode && (
        <div className="mb-5 bg-[var(--bg-card)]/5 border border-[var(--hairline-strong)] rounded-lg px-4 py-3 text-xs text-foreground/85">
          <p className="flex items-center gap-1.5 font-semibold">
            <FaFlask className="text-accent" /> Demo mode
          </p>
          <p className="mt-1 text-muted">
            Try{" "}
            <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded">owner</code> /{" "}
            <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded">owner123</code>
          </p>
          <button
            type="button"
            onClick={() => setForm({ username: "owner", password: "owner123" })}
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

function OwnerFooter() {
  const [showSetup, setShowSetup] = useState(false);
  useEffect(() => {
    fetch("/api/auth/owner/exists")
      .then((r) => r.json())
      .then((d) => setShowSetup(d.ok && !d.exists))
      .catch(() => {});
  }, []);

  if (!showSetup) {
    return (
      <>
        Driver?{" "}
        <Link href="/driver/login" className="text-accent-light hover:text-accent font-semibold">
          Driver login
        </Link>
      </>
    );
  }
  return (
    <>
      First-time setup?{" "}
      <Link href="/owner/signup" className="text-accent-light hover:text-accent font-semibold">
        Create owner account
      </Link>
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
