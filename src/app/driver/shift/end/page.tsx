"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getCurrentLocation, formatLatLng, type Coords } from "@/lib/geo";
import { FaMapMarkerAlt } from "react-icons/fa";

function EndShiftForm() {
  const router = useRouter();
  const params = useSearchParams();
  const shiftId = params.get("id") ?? "";
  const startKm = Number(params.get("startKm") ?? "0");

  const [km, setKm] = useState<string>("");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationState, setLocationState] = useState<"fetching" | "ok" | "fail">("fetching");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-capture GPS on mount
  useEffect(() => {
    let cancelled = false;
    getCurrentLocation().then((c) => {
      if (cancelled) return;
      if (c) {
        setCoords(c);
        setLocationState("ok");
      } else {
        setLocationState("fail");
      }
    });
    return () => { cancelled = true; };
  }, []);

  const retryLocation = async () => {
    setLocationState("fetching");
    setCoords(null);
    const c = await getCurrentLocation();
    if (c) {
      setCoords(c);
      setLocationState("ok");
    } else {
      setLocationState("fail");
    }
  };

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
      const finalCoords = coords ?? (await getCurrentLocation());
      const res = await fetch(`/api/shifts/${encodeURIComponent(shiftId)}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          km: endKm,
          lat: finalCoords?.lat ?? null,
          lng: finalCoords?.lng ?? null,
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
          Enter the closing odometer reading. Location is captured automatically.
        </p>
      </div>

      {/* Auto-detected location status */}
      <div className="flex items-center gap-2 text-sm">
        <FaMapMarkerAlt
          className={
            locationState === "ok"
              ? "text-green-400"
              : locationState === "fail"
              ? "text-[var(--danger)]"
              : "text-muted"
          }
        />
        {locationState === "fetching" && (
          <span className="text-muted flex items-center gap-1.5">
            <Spinner size="sm" /> Detecting location…
          </span>
        )}
        {locationState === "ok" && coords && (
          <span className="text-green-400 font-medium">{formatLatLng(coords)}</span>
        )}
        {locationState === "fail" && (
          <span className="text-[var(--danger)]">
            Location unavailable.{" "}
            <button
              type="button"
              onClick={retryLocation}
              className="underline font-semibold"
            >
              Retry
            </button>
          </span>
        )}
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
