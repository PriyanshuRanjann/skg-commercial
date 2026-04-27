"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

type ActiveShift = { id: string };

export default function NewRidePage() {
  const router = useRouter();
  const [shift, setShift] = useState<ActiveShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [fare, setFare] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ commission_amt: number; driver_payout: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/shifts/active")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.ok) setShift(d.shift);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!shift) {
      setError("No active shift. Start a shift first.");
      return;
    }
    const fareNum = Number(fare);
    if (!isFinite(fareNum) || fareNum < 0) {
      setError("Enter a valid fare amount.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shift_id: shift.id, fare: fareNum }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to log ride.");
        return;
      }
      setSuccess({ commission_amt: data.commission_amt, driver_payout: data.driver_payout });
      setFare("");
    } catch (err) {
      setError((err as Error).message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        <Spinner size="sm" /> Loading active shift…
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-700">
          You don&apos;t have an active shift. Start a shift before logging a ride.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.replace("/driver")}
        >
          Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-blue">Log Ride</h1>
        <p className="text-sm text-gray-600">
          Enter the fare collected. Commission is calculated at your rate.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
        <Input
          label="Fare (₹)"
          name="fare"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          required
          autoFocus
          value={fare}
          onChange={(e) => setFare(e.target.value)}
        />
      </div>

      {success && (
        <div className="bg-green-50 border border-green-300 text-green-800 text-sm rounded-lg px-4 py-3 space-y-1">
          <p className="font-semibold">Ride logged.</p>
          <p>Commission: ₹{success.commission_amt.toFixed(2)}</p>
          <p>Your payout: ₹{success.driver_payout.toFixed(2)}</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button type="submit" fullWidth size="lg" disabled={busy}>
          {busy ? <Spinner size="sm" className="mr-2" /> : null}
          Log Ride
        </Button>
        <Button
          type="button"
          variant="ghost"
          fullWidth
          size="lg"
          onClick={() => router.replace("/driver")}
        >
          Done
        </Button>
      </div>
    </form>
  );
}
