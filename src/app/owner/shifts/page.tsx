import { callSheets } from "@/lib/sheets";
import { ShiftsView } from "@/components/owner/ShiftsView";

type Shift = {
  id: string;
  driver_id: string;
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

type Driver = { id: string; name: string };

export default async function ShiftsPage() {
  let shifts: Shift[] = [];
  let drivers: Driver[] = [];
  let backendDown = false;
  try {
    [shifts, drivers] = await Promise.all([
      callSheets<Shift[]>("owner.list", { kind: "shifts" }),
      callSheets<Driver[]>("owner.list", { kind: "drivers" }),
    ]);
  } catch {
    backendDown = true;
  }

  const driverName = new Map(drivers.map((d) => [d.id, d.name]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-blue">Shifts</h1>
      {backendDown ? (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3">
          Backend not reachable.
        </div>
      ) : (
        <ShiftsView
          shifts={shifts.map((s) => ({ ...s, driver_name: driverName.get(s.driver_id) || s.driver_id }))}
        />
      )}
    </div>
  );
}
