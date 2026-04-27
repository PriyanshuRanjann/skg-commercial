"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

type Driver = {
  id: string;
  name: string;
  phone: string;
  username: string;
  commission_pct: number | string;
  active: boolean | string;
  created_at: string;
};

type FormState = {
  id?: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  commission_pct: string;
  active: boolean;
};

const empty: FormState = {
  name: "",
  phone: "",
  username: "",
  password: "",
  commission_pct: "20",
  active: true,
};

export function DriversManager({ initial }: { initial: Driver[] }) {
  const router = useRouter();
  const [drivers, setDrivers] = useState(initial);
  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editing = !!form.id;

  const reset = () => {
    setForm(empty);
    setError(null);
  };

  const onSelect = (d: Driver) =>
    setForm({
      id: d.id,
      name: d.name,
      phone: d.phone || "",
      username: d.username,
      password: "",
      commission_pct: String(d.commission_pct ?? "0"),
      active: String(d.active).toLowerCase() !== "false",
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        username: form.username,
        commission_pct: Number(form.commission_pct),
        active: form.active,
      };
      if (form.id) payload.id = form.id;
      if (form.password) payload.password = form.password;

      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(humanize(data.error));
        return;
      }
      reset();
      router.refresh();
      // Optimistic: refetch
      const list = await fetch("/api/drivers").then((r) => r.json());
      if (list.ok) setDrivers(list.drivers);
    } catch (err) {
      setError((err as Error).message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Deactivate this driver? They won't be able to log in.")) return;
    setBusy(true);
    try {
      await fetch(`/api/drivers?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const list = await fetch("/api/drivers").then((r) => r.json());
      if (list.ok) setDrivers(list.drivers);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-light-gray text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Username</th>
              <th className="text-right px-4 py-2">Commission %</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500">
                  No drivers yet. Add one with the form on the right.
                </td>
              </tr>
            )}
            {drivers.map((d) => (
              <tr key={d.id} className="border-t border-gray-100">
                <td className="px-4 py-2">
                  <div className="font-semibold text-primary-blue">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.phone || "—"}</div>
                </td>
                <td className="px-4 py-2">{d.username}</td>
                <td className="px-4 py-2 text-right">{d.commission_pct}%</td>
                <td className="px-4 py-2">
                  {String(d.active).toLowerCase() === "false" ? (
                    <span className="text-gray-400">Inactive</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => onSelect(d)}
                    className="text-sm text-primary-orange hover:underline"
                  >
                    Edit
                  </button>
                  {String(d.active).toLowerCase() !== "false" && (
                    <button
                      onClick={() => onDelete(d.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Disable
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-md p-5 space-y-4 h-fit">
        <h2 className="text-lg font-semibold text-primary-blue">
          {editing ? "Edit driver" : "Add driver"}
        </h2>

        <Input
          label="Name"
          name="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Username"
          name="username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          label={editing ? "New password (leave blank to keep)" : "Password"}
          name="password"
          type="password"
          required={!editing}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          label="Commission %"
          name="commission_pct"
          type="number"
          min={0}
          max={100}
          step="0.5"
          required
          value={form.commission_pct}
          onChange={(e) => setForm({ ...form, commission_pct: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active (can log in)
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" fullWidth disabled={busy}>
            {busy ? <Spinner size="sm" className="mr-2" /> : null}
            {editing ? "Save changes" : "Create driver"}
          </Button>
          {editing && (
            <Button type="button" variant="ghost" onClick={reset}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function humanize(err: unknown): string {
  switch (err) {
    case "username_taken":
      return "Username already taken.";
    case "password_required":
      return "A password is required for new drivers.";
    case "invalid_input":
      return "Please check the form values.";
    default:
      return typeof err === "string" ? err : "Could not save driver.";
  }
}
