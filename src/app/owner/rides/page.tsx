import { callSheets } from "@/lib/sheets";

type Ride = {
  id: string;
  shift_id: string;
  driver_id: string;
  fare: number | string;
  commission_amt: number | string;
  driver_payout: number | string;
  ts: string;
};

type Driver = { id: string; name: string };

function num(v: unknown): number {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

export default async function RidesPage() {
  let rides: Ride[] = [];
  let drivers: Driver[] = [];
  let backendDown = false;
  try {
    [rides, drivers] = await Promise.all([
      callSheets<Ride[]>("owner.list", { kind: "rides" }),
      callSheets<Driver[]>("owner.list", { kind: "drivers" }),
    ]);
  } catch {
    backendDown = true;
  }

  const driverName = new Map(drivers.map((d) => [d.id, d.name]));

  const totalFare = rides.reduce((s, r) => s + num(r.fare), 0);
  const totalCommission = rides.reduce((s, r) => s + num(r.commission_amt), 0);
  const totalPayout = rides.reduce((s, r) => s + num(r.driver_payout), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Rides</h1>

      {backendDown ? (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm rounded-lg px-4 py-3">
          Backend not reachable.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
              <p className="text-sm text-muted">Total fare (all time)</p>
              <p className="text-2xl font-bold text-foreground">₹{totalFare.toFixed(0)}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
              <p className="text-sm text-muted">Your commission</p>
              <p className="text-2xl font-bold text-accent">₹{totalCommission.toFixed(0)}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
              <p className="text-sm text-muted">Driver payouts</p>
              <p className="text-2xl font-bold text-foreground">₹{totalPayout.toFixed(0)}</p>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-[var(--bg-elevated)] text-muted">
                <tr>
                  <th className="text-left px-4 py-2">When</th>
                  <th className="text-left px-4 py-2">Driver</th>
                  <th className="text-right px-4 py-2">Fare</th>
                  <th className="text-right px-4 py-2">Commission</th>
                  <th className="text-right px-4 py-2">Driver payout</th>
                </tr>
              </thead>
              <tbody>
                {rides.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-6">No rides logged yet.</td>
                  </tr>
                ) : rides.map((r) => (
                  <tr key={r.id} className="border-t border-[var(--hairline)]">
                    <td className="px-4 py-2">{r.ts ? new Date(r.ts).toLocaleString() : "—"}</td>
                    <td className="px-4 py-2">{driverName.get(r.driver_id) || r.driver_id}</td>
                    <td className="px-4 py-2 text-right">₹{num(r.fare).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right text-accent">₹{num(r.commission_amt).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">₹{num(r.driver_payout).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
