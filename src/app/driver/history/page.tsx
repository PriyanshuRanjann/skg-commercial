import { getSession } from "@/lib/auth";
import { callSheets } from "@/lib/sheets";
import Link from "next/link";

type ShiftRow = {
  id: string;
  start_ts: string;
  end_ts: string;
  start_km: number | string;
  end_km: number | string;
  total_km: number | string;
  status: string;
};

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) return null;

  let rows: ShiftRow[] = [];
  let backendDown = false;
  try {
    rows = await callSheets<ShiftRow[]>("history.driver", { driver_id: session.sub, limit: 30 });
  } catch {
    backendDown = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-blue">Shift history</h1>
        <Link href="/driver" className="text-sm text-primary-orange underline">
          Back
        </Link>
      </div>

      {backendDown && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3">
          Backend not reachable.
        </div>
      )}

      {rows.length === 0 && !backendDown ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-gray-500 text-center">
          No shifts yet. Start your first one!
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light-gray text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Start</th>
                <th className="text-left px-4 py-2">End</th>
                <th className="text-right px-4 py-2">km</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-2">{r.start_ts ? new Date(r.start_ts).toLocaleString() : "—"}</td>
                  <td className="px-4 py-2">{r.end_ts ? new Date(r.end_ts).toLocaleString() : "—"}</td>
                  <td className="px-4 py-2 text-right">{r.total_km || "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        r.status === "active"
                          ? "text-primary-orange font-semibold"
                          : "text-gray-500"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
