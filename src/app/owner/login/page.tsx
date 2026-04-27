"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCar, FaFlask } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { BRAND_NAME } from "@/lib/config";

export default function OwnerLoginPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-primary-blue px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 text-white font-bold text-xl">
          <FaCar className="text-primary-orange text-2xl" />
          <span>{BRAND_NAME}</span>
        </Link>
        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-primary-blue">Owner Console</h1>
            <p className="text-sm text-gray-500 mt-1">Restricted area.</p>
          </div>

          {demoMode && (
            <div className="bg-primary-orange/10 border border-primary-orange/30 rounded-lg px-3 py-2.5 text-xs text-primary-blue space-y-1">
              <p className="flex items-center gap-1.5 font-bold">
                <FaFlask className="text-primary-orange" /> Demo mode (no backend deployed)
              </p>
              <p>
                Try: <code className="font-mono bg-white px-1 rounded">owner</code> /
                <code className="font-mono bg-white px-1 rounded ml-1">owner123</code>
              </p>
              <button
                type="button"
                onClick={() => setForm({ username: "owner", password: "owner123" })}
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
            <Button type="submit" fullWidth size="lg" disabled={busy} variant="secondary">
              {busy ? <Spinner size="sm" className="mr-2" /> : null}
              Sign in
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500">
            Driver?{" "}
            <Link href="/driver/login" className="text-primary-orange hover:underline">
              Driver login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
