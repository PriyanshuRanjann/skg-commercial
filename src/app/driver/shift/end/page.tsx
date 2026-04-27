"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getCurrentLocation } from "@/lib/geo";

function EndShiftForm() {
  const router = useRouter();
  const params = useSearchParams();
  const shiftId = params.get("id") ?? "";
  const startKm = Number(params.get("startKm") ?? "0");

  const [km, setKm] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const endKm = Number(km);
    if (!isFinite(endKm) || endKm < startKm) {
      setError(`End km must be ≥ start km (${startKm}).`);
      return;
    }
    setBusy(true);
    try {
      const c = await getCurrentLocation();
      const res = await fetch(`/api/shifts/${encodeURIComponent(shiftId)}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          km: endKm,
          lat: c?.lat ?? null,
          lng: c?.lng ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to end shift.");
        return;
      }
      router.replace("/driver");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  if (!shiftId) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-6">
        <p className="text-[var(--danger)]">No shift selected. Go back to your driver home.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">End Shift</h1>
        <p className="text-sm text-muted">
          Enter the closing odometer reading. Your location is captured automatically.
        </p>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5 space-y-4">
        <p className="text-sm text-muted">
          Start km was <span className="font-semibold text-foreground">{startKm}</span>.
        </p>
        <Input
          label="End km (odometer)"
          name="km"
          type="number"
          inputMode="numeric"
          min={startKm}
          required
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />
        {km && Number(km) >= startKm && (
          <p className="text-sm text-muted">
            Distance this shift: <span className="font-bold text-accent">{Number(km) - startKm} km</span>
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)] bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" variant="danger" disabled={busy}>
        {busy ? <Spinner size="sm" className="mr-2" /> : null}
        End Shift
      </Button>
    </form>
  );
}

export default function ShiftEndPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading…</div>}>
      <EndShiftForm />
    </Suspense>
  );
}
