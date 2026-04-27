"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { PhotoCapture } from "@/components/driver/PhotoCapture";
import { EXPENSE_CATEGORIES } from "@/lib/config";
import { fileToBase64, getCurrentLocation } from "@/lib/geo";

type ActiveShift = { id: string };

export default function NewExpensePage() {
  const router = useRouter();
  const [shift, setShift] = useState<ActiveShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

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
    setDone(false);
    const amt = Number(amount);
    if (!isFinite(amt) || amt < 0) {
      setError("Enter a valid amount.");
      return;
    }
    setBusy(true);
    try {
      const c = await getCurrentLocation();
      const photo_b64 = photo ? await fileToBase64(photo) : undefined;
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shift_id: shift?.id ?? "",
          type,
          amount: amt,
          note: note || undefined,
          photo_b64,
          lat: c?.lat ?? null,
          lng: c?.lng ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to log expense.");
        return;
      }
      setDone(true);
      setAmount("");
      setNote("");
      setPhoto(null);
    } catch (err) {
      setError((err as Error).message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        <Spinner size="sm" /> Loading…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-blue">Log Expense</h1>
        <p className="text-sm text-gray-600">
          Fuel, toll, parking, maintenance — anything you spent for this shift.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
        <Select
          label="Category"
          name="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Input
          label="Amount (₹)"
          name="amount"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Textarea
          label="Note (optional)"
          name="note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <PhotoCapture label="Receipt photo (optional)" onChange={setPhoto} />
      </div>

      {done && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-300 rounded-md px-3 py-2">
          Expense logged.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button type="submit" fullWidth size="lg" disabled={busy}>
          {busy ? <Spinner size="sm" className="mr-2" /> : null}
          Save Expense
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
