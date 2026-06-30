"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoCapture } from "@/components/driver/PhotoCapture";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { fileToBase64, getCurrentLocation, formatLatLng, type Coords } from "@/lib/geo";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ShiftStartPage() {
  const router = useRouter();
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [km, setKm] = useState<string>("");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationState, setLocationState] = useState<"fetching" | "ok" | "fail">("fetching");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-capture GPS on mount — driver doesn't need to press anything
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
    if (!photo1 || !photo2) {
      setError("Please take both photos.");
      return;
    }
    const kmNum = Number(km);
    if (!isFinite(kmNum) || kmNum < 0) {
      setError("Enter a valid starting km.");
      return;
    }
    setBusy(true);
    try {
      // Attempt a fresh location on submit if we still don't have one
      const finalCoords = coords ?? (await getCurrentLocation());
      const [photo1_b64, photo2_b64] = await Promise.all([
        fileToBase64(photo1),
        fileToBase64(photo2),
      ]);
      const res = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo1_b64,
          photo2_b64,
          km: kmNum,
          lat: finalCoords?.lat ?? null,
          lng: finalCoords?.lng ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to start shift.");
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Start Shift</h1>
        <p className="text-sm text-muted">
          Take two photos of the car. Timestamp and location are captured automatically.
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

      <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5 space-y-5">
        <PhotoCapture label="Front photo" required onChange={setPhoto1} />
        <PhotoCapture label="Side photo" required onChange={setPhoto2} />
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
        <Input
          label="Start km (odometer)"
          name="km"
          type="number"
          inputMode="numeric"
          min={0}
          required
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--danger)] bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" disabled={busy}>
        {busy ? <Spinner size="sm" className="mr-2" /> : null}
        Start Shift
      </Button>
    </form>
  );
}
