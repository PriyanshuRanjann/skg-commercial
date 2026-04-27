import { callSheets } from "@/lib/sheets";
import { BRAND_NAME, CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/config";

export default async function SettingsPage() {
  let settings: Record<string, unknown> = {};
  let backendDown = false;
  try {
    settings = await callSheets<Record<string, unknown>>("settings.get", {});
  } catch {
    backendDown = true;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <section className="bg-[var(--bg-card)] rounded-xl shadow-md p-6 space-y-2">
        <h2 className="font-semibold text-foreground">Brand</h2>
        <p className="text-sm text-muted"><span className="font-semibold">Name:</span> {BRAND_NAME}</p>
        <p className="text-sm text-muted"><span className="font-semibold">Address:</span> {CONTACT_ADDRESS}</p>
        <p className="text-sm text-muted"><span className="font-semibold">Phone:</span> {CONTACT_PHONE_DISPLAY}</p>
        <p className="text-sm text-muted"><span className="font-semibold">Email:</span> {CONTACT_EMAIL}</p>
        <p className="text-xs text-muted mt-2">Edit these in <code>src/lib/config.ts</code>.</p>
      </section>

      <section className="bg-[var(--bg-card)] rounded-xl shadow-md p-6 space-y-2">
        <h2 className="font-semibold text-foreground">Backend (Apps Script)</h2>
        {backendDown ? (
          <p className="text-sm text-amber-300">
            Not reachable. Configure <code>APPS_SCRIPT_URL</code> + <code>APPS_SCRIPT_TOKEN</code> in <code>.env.local</code>.
          </p>
        ) : (
          <ul className="text-sm text-foreground/85 space-y-1">
            {Object.entries(settings).length === 0 ? (
              <li className="text-muted">No settings stored. Defaults will apply.</li>
            ) : (
              Object.entries(settings).map(([k, v]) => (
                <li key={k}>
                  <span className="font-semibold">{k}:</span> {String(v)}
                </li>
              ))
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
