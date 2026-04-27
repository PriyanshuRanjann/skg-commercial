"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

type Shift = {
  id: string;
  driver_id: string;
  driver_name: string;
  start_ts: string;
  start_lat?: string | number;
  start_lng?: string | number;
  end_ts?: string;
  end_lat?: string | number;
  end_lng?: string | number;
  start_km: number | string;
  end_km?: number | string;
  total_km?: number | string;
  status: string;
  start_photo1_url?: string;
  start_photo2_url?: string;
};

const ShiftMap = dynamic(() => import("./ShiftMap"), { ssr: false });

function num(v: unknown): number | null {
  const n = Number(v);
  return isFinite(n) && n !== 0 ? n : null;
}

export function ShiftsView({ shifts }: { shifts: Shift[] }) {
  const points = useMemo(() => {
    return shifts.flatMap((s) => {
      const out: { lat: number; lng: number; label: string; kind: "start" | "end" }[] = [];
      const sLat = num(s.start_lat), sLng = num(s.start_lng);
      const eLat = num(s.end_lat),   eLng = num(s.end_lng);
      if (sLat !== null && sLng !== null) {
        out.push({ lat: sLat, lng: sLng, label: `${s.driver_name} — start`, kind: "start" });
      }
      if (eLat !== null && eLng !== null) {
        out.push({ lat: eLat, lng: eLng, label: `${s.driver_name} — end`, kind: "end" });
      }
      return out;
    });
  }, [shifts]);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-card)] rounded-xl shadow-md overflow-hidden">
        <ShiftMap points={points} />
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-[var(--bg-elevated)] text-muted">
            <tr>
              <th className="text-left px-4 py-2">Driver</th>
              <th className="text-left px-4 py-2">Started</th>
              <th className="text-left px-4 py-2">Ended</th>
              <th className="text-right px-4 py-2">Start km</th>
              <th className="text-right px-4 py-2">End km</th>
              <th className="text-right px-4 py-2">Total km</th>
              <th className="text-left px-4 py-2">Photos</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {shifts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted py-6">No shifts yet.</td>
              </tr>
            ) : shifts.map((s) => (
              <tr key={s.id} className="border-t border-[var(--hairline)]">
                <td className="px-4 py-2">{s.driver_name}</td>
                <td className="px-4 py-2">{s.start_ts ? new Date(s.start_ts).toLocaleString() : "—"}</td>
                <td className="px-4 py-2">{s.end_ts ? new Date(s.end_ts).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 text-right">{s.start_km}</td>
                <td className="px-4 py-2 text-right">{s.end_km || "—"}</td>
                <td className="px-4 py-2 text-right font-semibold">{s.total_km || "—"}</td>
                <td className="px-4 py-2">
                  {s.start_photo1_url && (
                    <a href={s.start_photo1_url} target="_blank" className="text-accent underline mr-2">P1</a>
                  )}
                  {s.start_photo2_url && (
                    <a href={s.start_photo2_url} target="_blank" className="text-accent underline">P2</a>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className={s.status === "active" ? "text-accent font-semibold" : "text-muted"}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
