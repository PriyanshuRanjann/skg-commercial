import { callSheets } from "@/lib/sheets";
import { DriversManager } from "@/components/owner/DriversManager";

type Driver = {
  id: string;
  name: string;
  phone: string;
  username: string;
  commission_pct: number | string;
  active: boolean | string;
  created_at: string;
};

export default async function DriversPage() {
  let drivers: Driver[] = [];
  let backendDown = false;
  try {
    drivers = await callSheets<Driver[]>("owner.list", { kind: "drivers" });
  } catch {
    backendDown = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Drivers</h1>
        <p className="text-sm text-muted">
          Create driver accounts and set per-driver commission %.
        </p>
      </div>

      {backendDown ? (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm rounded-lg px-4 py-3">
          Backend not reachable. Configure <code>APPS_SCRIPT_URL</code> + <code>APPS_SCRIPT_TOKEN</code> in <code>.env.local</code>.
        </div>
      ) : (
        <DriversManager initial={drivers} />
      )}
    </div>
  );
}
