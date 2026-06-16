/**
 * MetroMile — Google Apps Script backend.
 * Bound to the master Google Sheet. Deployed as a Web App
 * (Execute as: me, Access: anyone). All requests are POST with a JSON body.
 *
 * The Next.js app talks to this script and never reads/writes the sheet
 * directly. Auth is enforced via a shared token in `apiToken`, except for
 * `feedback.create` which is public (rate-limit relies on Apps Script quota).
 *
 * Set Script Properties:
 *   API_TOKEN = <long random string, must match APPS_SCRIPT_TOKEN in Next.js>
 *   DRIVE_FOLDER_ID = <id of folder in your Drive where photos will land>
 *
 * Sheet tabs (created automatically on first call):
 *   Drivers, Shifts, Rides, Expenses, Feedback, Owners, Settings
 */

// ---------- Config ----------
const SHEETS = {
  DRIVERS:  { name: "Drivers",  headers: ["id","name","phone","username","password","commission_pct","active","created_at"] },
  SHIFTS:   { name: "Shifts",   headers: ["id","driver_id","start_ts","start_lat","start_lng","start_photo1_url","start_photo2_url","start_km","end_ts","end_lat","end_lng","end_km","total_km","status"] },
  RIDES:    { name: "Rides",    headers: ["id","shift_id","driver_id","fare","commission_amt","driver_payout","ts"] },
  EXPENSES: { name: "Expenses", headers: ["id","shift_id","driver_id","type","amount","photo_url","ts","lat","lng","note"] },
  FEEDBACK: { name: "Feedback", headers: ["id","ts","name","phone","rating","comment"] },
  OWNERS:   { name: "Owners",   headers: ["username","password"] },
  SETTINGS: { name: "Settings", headers: ["key","value"] },
};

const PUBLIC_ACTIONS = new Set([
  "feedback.create",
  "driver.signup",
  "owner.signup",
  "owner.has_any",
]);

// ---------- Entry points ----------
function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents || "{}");
  } catch (err) {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const action = String(body.action || "");
  if (!action) return jsonResponse({ ok: false, error: "missing_action" }, 400);

  if (!PUBLIC_ACTIONS.has(action)) {
    const expected = PropertiesService.getScriptProperties().getProperty("API_TOKEN");
    if (!expected || body.apiToken !== expected) {
      return jsonResponse({ ok: false, error: "unauthorized" }, 401);
    }
  }

  try {
    ensureSheets();
    const handler = HANDLERS[action];
    if (!handler) return jsonResponse({ ok: false, error: "unknown_action" }, 400);
    const result = handler(body);
    return jsonResponse({ ok: true, data: result });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message || err) }, 500);
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "metromile-backend", time: new Date().toISOString() });
}

function jsonResponse(obj /*, status */) {
  // Apps Script Web Apps cannot set custom HTTP status codes — clients should
  // check `ok` in the body. The status arg is here for documentation only.
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- Handlers ----------
const HANDLERS = {
  "driver.login":     handleDriverLogin,
  "driver.signup":    handleDriverSignup,
  "owner.login":      handleOwnerLogin,
  "owner.signup":     handleOwnerSignup,
  "owner.has_any":    handleOwnerHasAny,
  "shift.start":      handleShiftStart,
  "shift.end":        handleShiftEnd,
  "shift.active":     handleShiftActive,
  "ride.create":      handleRideCreate,
  "expense.create":   handleExpenseCreate,
  "feedback.create":  handleFeedbackCreate,
  "owner.list":       handleOwnerList,
  "driver.upsert":    handleDriverUpsert,
  "driver.delete":    handleDriverDelete,
  "settings.get":     handleSettingsGet,
  "settings.set":     handleSettingsSet,
  "history.driver":   handleHistoryDriver,
};

function handleDriverLogin(body) {
  const { username, password } = body;
  if (!username || !password) throw new Error("missing_credentials");
  const driver = findRowByValue(SHEETS.DRIVERS, "username", String(username).trim());
  if (!driver) throw new Error("invalid_credentials");
  if (String(driver.active).toLowerCase() === "false") throw new Error("driver_inactive");
  if (!verifyPassword(password, driver.password)) throw new Error("invalid_credentials");
  return {
    id: driver.id,
    name: driver.name,
    phone: driver.phone,
    username: driver.username,
    commission_pct: Number(driver.commission_pct) || 0,
  };
}

function handleOwnerLogin(body) {
  const { username, password } = body;
  if (!username || !password) throw new Error("missing_credentials");
  const owner = findRowByValue(SHEETS.OWNERS, "username", String(username).trim());
  if (!owner) throw new Error("invalid_credentials");
  if (!verifyPassword(password, owner.password)) throw new Error("invalid_credentials");
  return { username: owner.username };
}

function handleDriverSignup(body) {
  const { name, phone, username, password } = body;
  const u = String(username || "").trim();
  if (!u || !password || !name) throw new Error("missing_fields");
  if (findRowByValue(SHEETS.DRIVERS, "username", u)) throw new Error("username_taken");
  const settings = handleSettingsGet();
  const defaultPct = Number(settings.default_commission_pct) || 20;
  const id = newId("drv");
  appendRow(SHEETS.DRIVERS, {
    id,
    name,
    phone: phone || "",
    username: u,
    password: hashPassword(password),
    commission_pct: defaultPct,
    active: false,
    created_at: nowIso(),
  });
  return { id, name, pending: true };
}

function handleOwnerSignup(body) {
  const sh = getSheet(SHEETS.OWNERS);
  if (sh.getLastRow() > 1) throw new Error("owner_exists");
  const { username, password } = body;
  const u = String(username || "").trim();
  if (!u || !password) throw new Error("missing_fields");
  appendRow(SHEETS.OWNERS, { username: u, password: hashPassword(password) });
  return { username: u };
}

function handleOwnerHasAny() {
  const sh = getSheet(SHEETS.OWNERS);
  return { exists: sh.getLastRow() > 1 };
}

function handleShiftStart(body) {
  const { driver_id, photo1_b64, photo2_b64, lat, lng, km } = body;
  if (!driver_id) throw new Error("missing_driver_id");

  const photo1 = photo1_b64 ? uploadPhoto(photo1_b64, "shift-start-1") : "";
  const photo2 = photo2_b64 ? uploadPhoto(photo2_b64, "shift-start-2") : "";

  const id = newId("shf");
  appendRow(SHEETS.SHIFTS, {
    id,
    driver_id,
    start_ts: nowIso(),
    start_lat: lat ?? "",
    start_lng: lng ?? "",
    start_photo1_url: photo1,
    start_photo2_url: photo2,
    start_km: Number(km) || 0,
    end_ts: "",
    end_lat: "",
    end_lng: "",
    end_km: "",
    total_km: "",
    status: "active",
  });
  return { shift_id: id };
}

function handleShiftEnd(body) {
  const { shift_id, lat, lng, km } = body;
  if (!shift_id) throw new Error("missing_shift_id");
  const sh = getSheet(SHEETS.SHIFTS);
  const idx = findRowIndex(sh, "id", shift_id);
  if (idx < 0) throw new Error("shift_not_found");
  const row = readRow(sh, idx);
  const startKm = Number(row.start_km) || 0;
  const endKm = Number(km) || 0;
  updateRow(sh, idx, {
    end_ts: nowIso(),
    end_lat: lat ?? "",
    end_lng: lng ?? "",
    end_km: endKm,
    total_km: Math.max(0, endKm - startKm),
    status: "completed",
  });
  return { ok: true };
}

function handleShiftActive(body) {
  const { driver_id } = body;
  if (!driver_id) throw new Error("missing_driver_id");
  const sh = getSheet(SHEETS.SHIFTS);
  const data = readAll(sh);
  // Latest active shift for driver
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].driver_id === driver_id && data[i].status === "active") return data[i];
  }
  return null;
}

function handleRideCreate(body) {
  const { shift_id, driver_id, fare } = body;
  if (!shift_id || !driver_id) throw new Error("missing_ids");
  const fareNum = Number(fare);
  if (!isFinite(fareNum) || fareNum < 0) throw new Error("invalid_fare");

  const driver = findRowByValue(SHEETS.DRIVERS, "id", driver_id);
  if (!driver) throw new Error("driver_not_found");
  const pct = Number(driver.commission_pct) || 0;
  const commission = round2(fareNum * pct / 100);
  const payout = round2(fareNum - commission);

  const id = newId("rid");
  appendRow(SHEETS.RIDES, {
    id,
    shift_id,
    driver_id,
    fare: fareNum,
    commission_amt: commission,
    driver_payout: payout,
    ts: nowIso(),
  });
  return { id, commission_amt: commission, driver_payout: payout };
}

function handleExpenseCreate(body) {
  const { shift_id, driver_id, type, amount, photo_b64, lat, lng, note } = body;
  if (!driver_id || !type) throw new Error("missing_fields");
  const amt = Number(amount);
  if (!isFinite(amt) || amt < 0) throw new Error("invalid_amount");

  const photoUrl = photo_b64 ? uploadPhoto(photo_b64, "expense") : "";
  const id = newId("exp");
  appendRow(SHEETS.EXPENSES, {
    id,
    shift_id: shift_id || "",
    driver_id,
    type,
    amount: amt,
    photo_url: photoUrl,
    ts: nowIso(),
    lat: lat ?? "",
    lng: lng ?? "",
    note: note || "",
  });
  return { id };
}

function handleFeedbackCreate(body) {
  const { name, phone, rating, comment } = body;
  const r = Number(rating);
  if (!isFinite(r) || r < 1 || r > 5) throw new Error("invalid_rating");
  const id = newId("fbk");
  appendRow(SHEETS.FEEDBACK, {
    id,
    ts: nowIso(),
    name: name || "",
    phone: phone || "",
    rating: r,
    comment: (comment || "").slice(0, 1000),
  });
  return { id };
}

function handleOwnerList(body) {
  const { kind, from, to } = body;
  const kindMap = {
    drivers: SHEETS.DRIVERS,
    shifts: SHEETS.SHIFTS,
    rides: SHEETS.RIDES,
    expenses: SHEETS.EXPENSES,
    feedback: SHEETS.FEEDBACK,
  };
  const def = kindMap[kind];
  if (!def) throw new Error("invalid_kind");
  let rows = readAll(getSheet(def));
  if (def === SHEETS.DRIVERS) rows = rows.map(stripPassword);
  if (from || to) {
    const tsField = def === SHEETS.SHIFTS ? "start_ts" : "ts";
    rows = rows.filter((r) => {
      const t = r[tsField];
      if (!t) return false;
      if (from && t < from) return false;
      if (to && t > to) return false;
      return true;
    });
  }
  return rows;
}

function handleDriverUpsert(body) {
  const { id, name, phone, username, password, commission_pct, active } = body;
  if (!username || !name) throw new Error("missing_fields");
  const sh = getSheet(SHEETS.DRIVERS);

  if (id) {
    const idx = findRowIndex(sh, "id", id);
    if (idx < 0) throw new Error("driver_not_found");
    const existing = readRow(sh, idx);
    const update = {
      name,
      phone: phone || "",
      username,
      commission_pct: Number(commission_pct) || 0,
      active: active === false ? false : true,
    };
    if (password) update.password = hashPassword(password);
    else update.password = existing.password;
    updateRow(sh, idx, update);
    return stripPassword({ ...existing, ...update });
  }

  // Reject duplicate username
  if (findRowByValue(SHEETS.DRIVERS, "username", username)) {
    throw new Error("username_taken");
  }
  if (!password) throw new Error("password_required");

  const newRow = {
    id: newId("drv"),
    name,
    phone: phone || "",
    username,
    password: hashPassword(password),
    commission_pct: Number(commission_pct) || 0,
    active: active === false ? false : true,
    created_at: nowIso(),
  };
  appendRow(SHEETS.DRIVERS, newRow);
  return stripPassword(newRow);
}

function handleDriverDelete(body) {
  const { id } = body;
  if (!id) throw new Error("missing_id");
  const sh = getSheet(SHEETS.DRIVERS);
  const idx = findRowIndex(sh, "id", id);
  if (idx < 0) throw new Error("driver_not_found");
  // Soft delete: mark inactive
  updateRow(sh, idx, { active: false });
  return { ok: true };
}

function handleSettingsGet() {
  const rows = readAll(getSheet(SHEETS.SETTINGS));
  const out = {};
  rows.forEach((r) => { out[r.key] = r.value; });
  return out;
}

function handleSettingsSet(body) {
  const { key, value } = body;
  if (!key) throw new Error("missing_key");
  const sh = getSheet(SHEETS.SETTINGS);
  const idx = findRowIndex(sh, "key", key);
  if (idx >= 0) updateRow(sh, idx, { key, value: String(value ?? "") });
  else appendRow(SHEETS.SETTINGS, { key, value: String(value ?? "") });
  return { ok: true };
}

function handleHistoryDriver(body) {
  const { driver_id, limit } = body;
  if (!driver_id) throw new Error("missing_driver_id");
  const max = Math.min(Number(limit) || 50, 200);
  const sh = getSheet(SHEETS.SHIFTS);
  const all = readAll(sh).filter((r) => r.driver_id === driver_id);
  return all.slice(-max).reverse();
}

// ---------- Sheet utilities ----------
function ensureSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.values(SHEETS).forEach((def) => {
    let sh = ss.getSheetByName(def.name);
    if (!sh) {
      sh = ss.insertSheet(def.name);
      sh.appendRow(def.headers);
      sh.setFrozenRows(1);
    } else {
      // Make sure header row matches
      const firstRow = sh.getRange(1, 1, 1, def.headers.length).getValues()[0];
      if (firstRow.join("|") !== def.headers.join("|")) {
        sh.getRange(1, 1, 1, def.headers.length).setValues([def.headers]);
        sh.setFrozenRows(1);
      }
    }
  });
}

function getSheet(def) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(def.name);
}

function appendRow(def, obj) {
  const sh = getSheet(def);
  const row = def.headers.map((h) => obj[h] ?? "");
  sh.appendRow(row);
}

function readAll(sh) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  const cols = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, cols).getValues()[0];
  const data = sh.getRange(2, 1, last - 1, cols).getValues();
  return data.map((r) => {
    const o = {};
    headers.forEach((h, i) => { o[h] = r[i]; });
    return o;
  });
}

function readRow(sh, idx) {
  const cols = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, cols).getValues()[0];
  const r = sh.getRange(idx, 1, 1, cols).getValues()[0];
  const o = {};
  headers.forEach((h, i) => { o[h] = r[i]; });
  return o;
}

function findRowIndex(sh, key, value) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const cols = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, cols).getValues()[0];
  const keyCol = headers.indexOf(key);
  if (keyCol < 0) return -1;
  const data = sh.getRange(2, keyCol + 1, last - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(value)) return i + 2;
  }
  return -1;
}

function findRowByValue(def, key, value) {
  const sh = getSheet(def);
  const idx = findRowIndex(sh, key, value);
  if (idx < 0) return null;
  return readRow(sh, idx);
}

function updateRow(sh, idx, obj) {
  const cols = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, cols).getValues()[0];
  const current = sh.getRange(idx, 1, 1, cols).getValues()[0];
  headers.forEach((h, i) => {
    if (Object.prototype.hasOwnProperty.call(obj, h)) {
      current[i] = obj[h];
    }
  });
  sh.getRange(idx, 1, 1, cols).setValues([current]);
}

// ---------- Crypto + helpers ----------
function hashPassword(password) {
  const salt = Utilities.getUuid().replace(/-/g, "").slice(0, 16);
  const hash = sha256(salt + ":" + password);
  return salt + "$" + hash;
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return false;
  const i = stored.indexOf("$");
  if (i < 0) return false;
  const salt = stored.slice(0, i);
  const expected = stored.slice(i + 1);
  return sha256(salt + ":" + password) === expected;
}

function sha256(str) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
  return bytes.map(byteToHex).join("");
}

function byteToHex(b) {
  const v = (b < 0 ? b + 256 : b).toString(16);
  return v.length === 1 ? "0" + v : v;
}

function uploadPhoto(b64, prefix) {
  const folderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
  if (!folderId) throw new Error("DRIVE_FOLDER_ID_not_set");
  const folder = DriveApp.getFolderById(folderId);
  // Strip optional data URL prefix
  const cleaned = String(b64).replace(/^data:image\/\w+;base64,/, "");
  const blob = Utilities.newBlob(Utilities.base64Decode(cleaned), "image/jpeg", prefix + "-" + Date.now() + ".jpg");
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function newId(prefix) {
  return prefix + "_" + Date.now().toString(36) + "_" + Utilities.getUuid().slice(0, 8);
}

function nowIso() {
  return new Date().toISOString();
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function stripPassword(row) {
  const { password, ...rest } = row;
  return rest;
}

// ---------- One-shot setup helpers ----------
/**
 * Run this once from the Apps Script editor to bootstrap the sheet
 * structure and seed the first owner account.
 *
 *   - Edit OWNER_USERNAME and OWNER_PASSWORD below before running.
 *   - Then in File → Project Settings → Script Properties, add:
 *       API_TOKEN = <a long random string>
 *       DRIVE_FOLDER_ID = <id of a Drive folder you want photos to land in>
 *   - Then deploy as Web App.
 */
function setupSeed() {
  const OWNER_USERNAME = "owner";
  const OWNER_PASSWORD = "Metro@Admin25";

  const DRIVER_USERNAME = "driver1";
  const DRIVER_PASSWORD = "Metro@Driver25";
  const DRIVER_NAME    = "Driver One";
  const DRIVER_PHONE   = "+91 99000 11111";

  ensureSheets();

  if (!findRowByValue(SHEETS.OWNERS, "username", OWNER_USERNAME)) {
    appendRow(SHEETS.OWNERS, {
      username: OWNER_USERNAME,
      password: hashPassword(OWNER_PASSWORD),
    });
  }

  if (!findRowByValue(SHEETS.DRIVERS, "username", DRIVER_USERNAME)) {
    appendRow(SHEETS.DRIVERS, {
      id: newId("drv"),
      name: DRIVER_NAME,
      phone: DRIVER_PHONE,
      username: DRIVER_USERNAME,
      password: hashPassword(DRIVER_PASSWORD),
      commission_pct: 20,
      active: true,
      created_at: nowIso(),
    });
  }

  // Default settings
  if (!findRowByValue(SHEETS.SETTINGS, "key", "default_commission_pct")) {
    appendRow(SHEETS.SETTINGS, { key: "default_commission_pct", value: "20" });
  }
}
