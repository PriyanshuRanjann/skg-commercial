import { callSheets } from "@/lib/sheets";

type Expense = {
  id: string;
  driver_id: string;
  type: string;
  amount: number | string;
  photo_url?: string;
  ts: string;
  note?: string;
};

type Driver = { id: string; name: string };

function num(v: unknown): number {
  const n = Number(v);
  return isFinite(n) ? n : 0;
}

export default async function ExpensesPage() {
  let expenses: Expense[] = [];
  let drivers: Driver[] = [];
  let backendDown = false;
  try {
    [expenses, drivers] = await Promise.all([
      callSheets<Expense[]>("owner.list", { kind: "expenses" }),
      callSheets<Driver[]>("owner.list", { kind: "drivers" }),
    ]);
  } catch {
    backendDown = true;
  }

  const driverName = new Map(drivers.map((d) => [d.id, d.name]));
  const total = expenses.reduce((s, r) => s + num(r.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-blue">Expenses</h1>

      {backendDown ? (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3">
          Backend not reachable.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md p-5">
            <p className="text-sm text-gray-500">Total expenses (all time)</p>
            <p className="text-2xl font-bold text-primary-blue">₹{total.toFixed(0)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-light-gray text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2">When</th>
                  <th className="text-left px-4 py-2">Driver</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-right px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Note</th>
                  <th className="text-left px-4 py-2">Photo</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-6">No expenses logged yet.</td>
                  </tr>
                ) : expenses.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{r.ts ? new Date(r.ts).toLocaleString() : "—"}</td>
                    <td className="px-4 py-2">{driverName.get(r.driver_id) || r.driver_id}</td>
                    <td className="px-4 py-2">{r.type}</td>
                    <td className="px-4 py-2 text-right">₹{num(r.amount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-gray-600">{r.note || "—"}</td>
                    <td className="px-4 py-2">
                      {r.photo_url ? (
                        <a href={r.photo_url} target="_blank" className="text-primary-orange underline">View</a>
                      ) : "—"}
                    </td>
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
