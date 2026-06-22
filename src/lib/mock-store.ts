/**
 * In-memory mock of the Apps Script backend. Activates automatically when
 * APPS_SCRIPT_URL is empty so the app is fully usable locally before the real
 * Google Apps Script is deployed.
 *
 * Data lives in module-level state — survives across API route calls in the
 * same dev server process, resets when the server restarts.
 */

type Driver = {
  id: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  commission_pct: number;
  active: boolean;
  created_at: string;
};

type Owner = { username: string; password: string };

type Shift = {
  id: string;
  driver_id: string;
  start_ts: string;
  start_lat: number | null;
  start_lng: number | null;
  start_photo1_url: string;
  start_photo2_url: string;
  start_km: number;
  end_ts: string;
  end_lat: number | null;
  end_lng: number | null;
  end_km: number | "";
  total_km: number | "";
  status: "active" | "completed";
};

type Ride = {
  id: string;
  shift_id: string;
  driver_id: string;
  fare: number;
  commission_amt: number;
  driver_payout: number;
  ts: string;
};

type Expense = {
  id: string;
  shift_id: string;
  driver_id: string;
  type: string;
  amount: number;
  photo_url: string;
  ts: string;
  lat: number | null;
  lng: number | null;
  note: string;
};

type Feedback = {
  id: string;
  ts: string;
  name: string;
  phone: string;
  rating: number;
  comment: string;
};

type Settings = Record<string, string>;

type Store = {
  drivers: Driver[];
  owners: Owner[];
  shifts: Shift[];
  rides: Ride[];
  expenses: Expense[];
  feedback: Feedback[];
  settings: Settings;
};

declare global {
  // Hot-reload-safe singleton
  var __metromileMock: Store | undefined;
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function getStore(): Store {
  if (!globalThis.__metromileMock) {
    globalThis.__metromileMock = {
      drivers: [
        {
          id: "drv_001",
          name: "",
          phone: "",
          username: "driver@demo.com",
          password: "Metro@Driver25",
          commission_pct: 20,
          active: true,
          created_at: nowIso(),
        },
      ],
      owners: [{ username: "owner@demo.com", password: "Metro@Admin25" }],
      shifts: [],
      rides: [],
      expenses: [],
      feedback: [],
      settings: { default_commission_pct: "20" },
    };
  }
  return globalThis.__metromileMock;
}

export function isMockMode(): boolean {
  return !process.env.APPS_SCRIPT_URL;
}

export async function mockCall(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<unknown> {
  const s = getStore();

  switch (action) {
    case "driver.login": {
      const identifier = String(payload.email || payload.username || "").trim().toLowerCase();
      const d = s.drivers.find((x) => x.username === identifier);
      if (!d || d.password !== payload.password) throw new Error("invalid_credentials");
      if (!d.active) throw new Error("driver_inactive");
      return {
        id: d.id,
        email: d.username,
        commission_pct: d.commission_pct,
      };
    }

    case "owner.login": {
      const identifier = String(payload.email || payload.username || "").trim().toLowerCase();
      const o = s.owners.find((x) => x.username === identifier);
      if (!o || o.password !== payload.password) throw new Error("invalid_credentials");
      return { email: o.username };
    }

    case "owner.has_any":
      return { exists: s.owners.length > 0 };

    case "owner.signup": {
      if (s.owners.length > 0) throw new Error("owner_exists");
      const email = String(payload.email || payload.username || "").trim().toLowerCase();
      const password = String(payload.password || "");
      if (!email || !password) throw new Error("missing_fields");
      s.owners.push({ username: email, password });
      return { email };
    }

    case "driver.signup": {
      const email = String(payload.email || payload.username || "").trim().toLowerCase();
      const password = String(payload.password || "");
      if (!email || !password) throw new Error("missing_fields");
      if (s.drivers.some((x) => x.username === email)) throw new Error("email_taken");
      const newDriver: Driver = {
        id: newId("drv"),
        name: "",
        phone: "",
        username: email,
        password,
        commission_pct: Number(s.settings.default_commission_pct) || 20,
        active: true,
        created_at: nowIso(),
      };
      s.drivers.push(newDriver);
      return { id: newDriver.id };
    }

    case "shift.start": {
      const id = newId("shf");
      s.shifts.push({
        id,
        driver_id: String(payload.driver_id),
        start_ts: nowIso(),
        start_lat: (payload.lat as number) ?? null,
        start_lng: (payload.lng as number) ?? null,
        start_photo1_url: payload.photo1_b64 ? `mock://photo/${id}-front` : "",
        start_photo2_url: payload.photo2_b64 ? `mock://photo/${id}-side` : "",
        start_km: Number(payload.km) || 0,
        end_ts: "",
        end_lat: null,
        end_lng: null,
        end_km: "",
        total_km: "",
        status: "active",
      });
      return { shift_id: id };
    }

    case "shift.end": {
      const sh = s.shifts.find((x) => x.id === payload.shift_id);
      if (!sh) throw new Error("shift_not_found");
      const endKm = Number(payload.km) || 0;
      sh.end_ts = nowIso();
      sh.end_lat = (payload.lat as number) ?? null;
      sh.end_lng = (payload.lng as number) ?? null;
      sh.end_km = endKm;
      sh.total_km = Math.max(0, endKm - sh.start_km);
      sh.status = "completed";
      return { ok: true };
    }

    case "shift.active": {
      const driver_id = String(payload.driver_id);
      for (let i = s.shifts.length - 1; i >= 0; i--) {
        if (s.shifts[i].driver_id === driver_id && s.shifts[i].status === "active") {
          return s.shifts[i];
        }
      }
      return null;
    }

    case "ride.create": {
      const driver = s.drivers.find((d) => d.id === payload.driver_id);
      if (!driver) throw new Error("driver_not_found");
      const fare = Number(payload.fare) || 0;
      const commission_amt = Math.round(fare * driver.commission_pct) / 100 * 100 / 100;
      const commission = round2(fare * driver.commission_pct / 100);
      const payout = round2(fare - commission);
      const id = newId("rid");
      s.rides.push({
        id,
        shift_id: String(payload.shift_id),
        driver_id: driver.id,
        fare,
        commission_amt: commission,
        driver_payout: payout,
        ts: nowIso(),
      });
      void commission_amt; // appease linter
      return { id, commission_amt: commission, driver_payout: payout };
    }

    case "expense.create": {
      const id = newId("exp");
      s.expenses.push({
        id,
        shift_id: String(payload.shift_id || ""),
        driver_id: String(payload.driver_id),
        type: String(payload.type),
        amount: Number(payload.amount) || 0,
        photo_url: payload.photo_b64 ? `mock://photo/${id}-receipt` : "",
        ts: nowIso(),
        lat: (payload.lat as number) ?? null,
        lng: (payload.lng as number) ?? null,
        note: String(payload.note || ""),
      });
      return { id };
    }

    case "feedback.create": {
      const id = newId("fbk");
      s.feedback.push({
        id,
        ts: nowIso(),
        name: String(payload.name || ""),
        phone: String(payload.phone || ""),
        rating: Number(payload.rating) || 0,
        comment: String(payload.comment || ""),
      });
      return { id };
    }

    case "owner.list": {
      const kind = String(payload.kind);
      const from = payload.from ? String(payload.from) : null;
      const to = payload.to ? String(payload.to) : null;
      const tsField = kind === "shifts" ? "start_ts" : "ts";

      const map: Record<string, unknown[]> = {
        drivers: s.drivers.map((d) => {
          const { password: _pw, ...rest } = d;
          void _pw;
          return rest;
        }),
        shifts: s.shifts,
        rides: s.rides,
        expenses: s.expenses,
        feedback: s.feedback,
      };
      const list = map[kind];
      if (!list) throw new Error("invalid_kind");

      if (!from && !to) return list;
      return (list as Record<string, unknown>[]).filter((r) => {
        const t = r[tsField];
        if (typeof t !== "string" || !t) return false;
        if (from && t < from) return false;
        if (to && t > to) return false;
        return true;
      });
    }

    case "driver.upsert": {
      const id = payload.id ? String(payload.id) : null;
      const name = String(payload.name);
      const username = String(payload.username).trim();
      const phone = String(payload.phone || "");
      const commission_pct = Number(payload.commission_pct) || 0;
      const active = payload.active !== false;
      const password = payload.password ? String(payload.password) : undefined;

      if (id) {
        const d = s.drivers.find((x) => x.id === id);
        if (!d) throw new Error("driver_not_found");
        d.name = name;
        d.phone = phone;
        d.username = username;
        d.commission_pct = commission_pct;
        d.active = active;
        if (password) d.password = password;
        const { password: _pw, ...rest } = d;
        void _pw;
        return rest;
      }

      if (s.drivers.some((x) => x.username === username)) {
        throw new Error("username_taken");
      }
      if (!password) throw new Error("password_required");
      const newDriver: Driver = {
        id: newId("drv"),
        name,
        phone,
        username,
        password,
        commission_pct,
        active,
        created_at: nowIso(),
      };
      s.drivers.push(newDriver);
      const { password: _pw, ...rest } = newDriver;
      void _pw;
      return rest;
    }

    case "driver.delete": {
      const d = s.drivers.find((x) => x.id === payload.id);
      if (!d) throw new Error("driver_not_found");
      d.active = false;
      return { ok: true };
    }

    case "settings.get":
      return s.settings;

    case "settings.set":
      s.settings[String(payload.key)] = String(payload.value ?? "");
      return { ok: true };

    case "history.driver": {
      const driver_id = String(payload.driver_id);
      const limit = Math.min(Number(payload.limit) || 50, 200);
      const all = s.shifts.filter((x) => x.driver_id === driver_id);
      return all.slice(-limit).reverse();
    }

    default:
      throw new Error("unknown_action");
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
