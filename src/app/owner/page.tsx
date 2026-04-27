import { callSheets } from "@/lib/sheets";
import { StatCard } from "@/components/ui/Card";
import { FaRoute, FaMoneyBillWave, FaGasPump, FaCommentDots } from "react-icons/fa";

type Shift = { start_ts: string; total_km: number | string; driver_id: string };
type Ride = { fare: number | string; commission_amt: number | string; driver_payout: number | string; ts: string };
type Expense = { amount: number | string; ts: string };
type Feedback = { ts: string; rating: number };

function todayIsoStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function num(v: number | string | undefined): number {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

async function safeFetch<T>(kind: string, from?: string): Promise<T[]> {
  try {
    return await callSheets<T[]>("owner.list", { kind, from });
  } catch {
    return [];
  }
}

export default async function OwnerOverview() {
  const fromIso = todayIsoStart();
  const [shifts, rides, expenses, feedback] = await Promise.all([
    safeFetch<Shift>("shifts", fromIso),
    safeFetch<Ride>("rides", fromIso),
    safeFetch<Expense>("expenses", fromIso),
    safeFetch<Feedback>("feedback", fromIso),
  ]);

  const totalKm = shifts.reduce((s, r) => s + num(r.total_km), 0);
  const totalFare = rides.reduce((s, r) => s + num(r.fare), 0);
  const totalCommission = rides.reduce((s, r) => s + num(r.commission_amt), 0);
  const totalExpenses = expenses.reduce((s, r) => s + num(r.amount), 0);
  const avgRating = feedback.length
    ? (feedback.reduce((s, r) => s + num(r.rating), 0) / feedback.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-blue">Today</h1>
        <p className="text-sm text-gray-500">All numbers reset at midnight, IST.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active shifts today" value={shifts.length} icon={<FaRoute />} />
        <StatCard label="Total km" value={totalKm} icon={<FaRoute />} />
        <StatCard label="Total fare" value={`₹${totalFare.toFixed(0)}`} icon={<FaMoneyBillWave />} />
        <StatCard label="Commission earned" value={`₹${totalCommission.toFixed(0)}`} hint="Your share" icon={<FaMoneyBillWave />} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Expenses today" value={`₹${totalExpenses.toFixed(0)}`} icon={<FaGasPump />} />
        <StatCard label="Rides logged" value={rides.length} icon={<FaMoneyBillWave />} />
        <StatCard label="Feedback today" value={feedback.length} icon={<FaCommentDots />} />
        <StatCard label="Avg rating today" value={avgRating} icon={<FaCommentDots />} />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-primary-blue mb-2">Today&apos;s rides</h2>
        {rides.length === 0 ? (
          <p className="text-sm text-gray-500">No rides logged yet today.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left py-1">Time</th>
                <th className="text-right py-1">Fare</th>
                <th className="text-right py-1">Commission</th>
                <th className="text-right py-1">Driver payout</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((r, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-1">{r.ts ? new Date(r.ts).toLocaleTimeString() : "—"}</td>
                  <td className="py-1 text-right">₹{num(r.fare).toFixed(2)}</td>
                  <td className="py-1 text-right">₹{num(r.commission_amt).toFixed(2)}</td>
                  <td className="py-1 text-right">₹{num(r.driver_payout).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
