import { callSheets } from "@/lib/sheets";
import { FaStar } from "react-icons/fa";

type Feedback = {
  id: string;
  ts: string;
  name?: string;
  phone?: string;
  rating: number;
  comment?: string;
};

export default async function FeedbackPage() {
  let rows: Feedback[] = [];
  let backendDown = false;
  try {
    rows = await callSheets<Feedback[]>("owner.list", { kind: "feedback" });
  } catch {
    backendDown = true;
  }

  const avg = rows.length ? rows.reduce((s, r) => s + Number(r.rating || 0), 0) / rows.length : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Passenger Feedback</h1>

      {backendDown ? (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm rounded-lg px-4 py-3">
          Backend not reachable.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
              <p className="text-sm text-muted">Total feedback</p>
              <p className="text-2xl font-bold text-foreground">{rows.length}</p>
            </div>
            <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
              <p className="text-sm text-muted">Average rating</p>
              <p className="text-2xl font-bold text-accent">{rows.length ? avg.toFixed(1) : "—"}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {rows.length === 0 ? (
              <div className="bg-[var(--bg-card)] rounded-xl shadow-md p-6 text-muted">No feedback yet.</div>
            ) : rows.slice().reverse().map((r) => (
              <div key={r.id} className="bg-[var(--bg-card)] rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className={i < r.rating ? "text-accent" : "text-muted"} />
                      ))}
                      <span className="ml-2 text-sm text-muted">
                        {r.ts ? new Date(r.ts).toLocaleString() : ""}
                      </span>
                    </div>
                    {r.comment && <p className="text-foreground/85 italic">&ldquo;{r.comment}&rdquo;</p>}
                  </div>
                  <div className="text-right text-xs text-muted shrink-0">
                    {r.name && <div className="font-semibold text-foreground">{r.name}</div>}
                    {r.phone && <div>{r.phone}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
