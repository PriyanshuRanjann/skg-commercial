"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCar, FaFlask } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { BRAND_NAME } from "@/lib/config";

export default function DriverLoginPage() {
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
      const res = await fetch("/api/auth/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(humanizeError(data.error));
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
    <div className="min-h-screen flex items-center justify-center bg-light-gray px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 text-primary-blue font-bold text-xl">
          <FaCar className="text-primary-orange text-2xl" />
          <span>{BRAND_NAME}</span>
        </Link>
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-primary-blue">Driver Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to start your shift.
            </p>
          </div>

          {demoMode && (
            <div className="bg-primary-orange/10 border border-primary-orange/30 rounded-lg px-3 py-2.5 text-xs text-primary-blue space-y-1">
              <p className="flex items-center gap-1.5 font-bold">
                <FaFlask className="text-primary-orange" /> Demo mode (no backend deployed)
              </p>
              <p>
                Try: <code className="font-mono bg-white px-1 rounded">demo</code> /
                <code className="font-mono bg-white px-1 rounded ml-1">demo123</code>
              </p>
              <button
                type="button"
                onClick={() => setForm({ username: "demo", password: "demo123" })}
                className="text-primary-orange hover:underline font-semibold"
              >
                Fill in demo credentials
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              autoComplete="username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth size="lg" disabled={busy}>
              {busy ? <Spinner size="sm" className="mr-2" /> : null}
              Sign in
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500">
            Owner?{" "}
            <Link href="/owner/login" className="text-primary-orange hover:underline">
              Owner login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function humanizeError(code: unknown): string {
  switch (code) {
    case "invalid_credentials":
      return "Wrong username or password.";
    case "driver_inactive":
      return "Your account is inactive. Contact the owner.";
    case "invalid_input":
      return "Please check the form and try again.";
    default:
      return "Login failed. Please try again.";
  }
}
