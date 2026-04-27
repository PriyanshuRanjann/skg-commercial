import Link from "next/link";
import { FaPlay, FaCarSide, FaMoneyBillWave, FaGasPump, FaHistory, FaStop } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import { callSheets } from "@/lib/sheets";

type ActiveShift = {
  id: string;
  start_ts: string;
  start_km: number;
  start_lat?: string;
  start_lng?: string;
};

async function fetchActiveShift(driverId: string): Promise<{ shift: ActiveShift | null; backendDown: boolean }> {
  try {
    const shift = await callSheets<ActiveShift | null>("shift.active", { driver_id: driverId });
    return { shift, backendDown: false };
  } catch {
    return { shift: null, backendDown: true };
  }
}

function fmtElapsed(startIso: string): string {
  const start = new Date(startIso).getTime();
  if (!isFinite(start)) return "—";
  const ms = Date.now() - start;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export default async function DriverHome() {
  const session = await getSession();
  const name = session?.name ?? "Driver";
  const { shift, backendDown } = session ? await fetchActiveShift(session.sub) : { shift: null, backendDown: true };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hi, {name}</h1>
        <p className="text-sm text-muted">
          {shift ? "Your shift is in progress." : "You're not on shift right now."}
        </p>
      </div>

      {backendDown && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm rounded-lg px-4 py-3">
          Backend not reachable. Check that <code className="bg-amber-500/20 px-1 rounded">APPS_SCRIPT_URL</code> and <code className="bg-amber-500/20 px-1 rounded">APPS_SCRIPT_TOKEN</code> are set in <code className="bg-amber-500/20 px-1 rounded">.env.local</code>.
        </div>
      )}

      {shift ? (
        <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Started</p>
              <p className="font-semibold text-foreground">{new Date(shift.start_ts).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted">Elapsed</p>
              <p className="font-semibold text-foreground">{fmtElapsed(shift.start_ts)}</p>
            </div>
            <div>
              <p className="text-muted">Start km</p>
              <p className="font-semibold text-foreground">{shift.start_km}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/driver/ride/new"
              className="flex flex-col items-center justify-center gap-2 bg-accent text-[var(--bg-deep)] py-5 rounded-lg font-semibold hover:bg-accent"
            >
              <FaMoneyBillWave className="text-2xl" />
              Log Ride
            </Link>
            <Link
              href="/driver/expense/new"
              className="flex flex-col items-center justify-center gap-2 bg-[var(--bg-deep)] text-foreground py-5 rounded-lg font-semibold hover:bg-accent-light"
            >
              <FaGasPump className="text-2xl" />
              Log Expense
            </Link>
          </div>

          <Link
            href={`/driver/shift/end?id=${shift.id}&startKm=${shift.start_km}`}
            className="flex items-center justify-center gap-2 bg-red-600 text-foreground py-4 rounded-lg font-semibold hover:bg-red-700 w-full"
          >
            <FaStop /> End Shift
          </Link>
        </div>
      ) : (
        <Link
          href="/driver/shift/start"
          className="block bg-accent text-[var(--bg-deep)] text-center py-8 rounded-xl shadow-md hover:bg-accent"
        >
          <FaPlay className="inline-block mr-3 text-2xl align-middle" />
          <span className="text-xl font-bold align-middle">Start Shift</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/driver/history"
          className="flex items-center justify-center gap-2 bg-[var(--bg-card)] text-foreground py-4 rounded-lg font-semibold border border-[var(--hairline)] hover:bg-[var(--bg-elevated)]"
        >
          <FaHistory /> History
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-[var(--bg-card)] text-foreground py-4 rounded-lg font-semibold border border-[var(--hairline)] hover:bg-[var(--bg-elevated)]"
        >
          <FaCarSide /> Public site
        </Link>
      </div>
    </div>
  );
}
