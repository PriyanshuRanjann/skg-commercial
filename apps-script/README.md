# MetroMile — Apps Script Backend

This is the Google Apps Script Web App that the Next.js site talks to. It owns the Google Sheet (system of record) and the Drive folder where driver photos go.

## One-time setup

1. Open your master Google Sheet (the one shared in the brief).
2. **Extensions → Apps Script** — opens the script editor bound to that sheet.
3. Paste the contents of [`Code.gs`](./Code.gs) into the editor (replace the default `Code.gs` file).
4. **Project Settings → Script Properties** → add two properties:
   - `API_TOKEN` — a long random string. Copy this value into the Next.js `.env.local` as `APPS_SCRIPT_TOKEN`.
   - `DRIVE_FOLDER_ID` — the ID of a Google Drive folder you create for uploads (e.g. `MetroMile Uploads`). The ID is the long string in the folder URL: `drive.google.com/drive/folders/<THIS>`.
5. In the script editor, edit `setupSeed()` at the bottom of `Code.gs` — change `OWNER_USERNAME` and `OWNER_PASSWORD` — then **Run → setupSeed**. Approve the OAuth scopes when prompted (Sheets + Drive).
6. **Deploy → New deployment** → Type: **Web app** → Execute as: **Me** → Who has access: **Anyone**. Click Deploy. Copy the Web App URL.
7. Put the Web App URL into Next.js `.env.local` as `APPS_SCRIPT_URL`.

## Re-deploying after editing `Code.gs`

Apps Script Web Apps are versioned. After every edit, do **Deploy → Manage deployments → ✏️ → New version → Deploy** so the URL keeps pointing at the latest code.

## Sheet tabs created

`setupSeed()` (and any first request) ensures the following tabs exist with the correct headers:

| Tab | Purpose |
|---|---|
| Drivers | Driver accounts (id, name, phone, username, salted password hash, commission %, active flag) |
| Shifts | One row per shift (start/end timestamps, GPS, photo URLs, km) |
| Rides | One row per ride/fare (computes commission from driver's % at write time) |
| Expenses | Fuel/Toll/Maintenance/Parking/Other with optional photo |
| Feedback | Passenger feedback (QR scan submissions) |
| Owners | Owner login(s) |
| Settings | Key/value config (e.g. `default_commission_pct`) |

## Endpoints (all POST, JSON body, action in body)

Every authenticated call must include `apiToken: <API_TOKEN>`. `feedback.create` is the one public action.

- `driver.login` — `{username, password}` → driver row (no password) or 401
- `owner.login` — `{username, password}` → `{username}`
- `shift.start` — `{driver_id, photo1_b64, photo2_b64, lat, lng, km}` → `{shift_id}`
- `shift.end` — `{shift_id, lat, lng, km}` → ok (computes total_km)
- `shift.active` — `{driver_id}` → active shift row or null
- `ride.create` — `{shift_id, driver_id, fare}` → `{id, commission_amt, driver_payout}` (computes from driver's %)
- `expense.create` — `{shift_id, driver_id, type, amount, photo_b64?, lat, lng, note?}` → `{id}`
- `feedback.create` — `{name?, phone?, rating, comment}` → `{id}` (PUBLIC)
- `owner.list` — `{kind: 'drivers'|'shifts'|'rides'|'expenses'|'feedback', from?, to?}` → rows
- `driver.upsert` — `{id?, name, phone, username, password?, commission_pct, active}` → driver row
- `driver.delete` — `{id}` → soft delete (`active=false`)
- `settings.get` — `{}` → `{key: value, ...}`
- `settings.set` — `{key, value}` → ok
- `history.driver` — `{driver_id, limit?}` → past shifts (newest first)

## Notes on security

- **Passwords are salted SHA-256.** Apps Script doesn't expose bcrypt natively; SHA-256 + a per-record salt is adequate for a small business app where the script is the only reader. If you ever add many drivers, consider migrating to PBKDF2 (also available via `Utilities.computeHmacSha256Signature` loops).
- **HTTPS-only.** Apps Script Web Apps are served over HTTPS by Google.
- **No status codes.** Apps Script Web Apps cannot set custom HTTP status codes. The Next.js client checks `body.ok` instead.

## Local testing

You can hit a deployed URL directly with `curl`:

```sh
curl -L -X POST "$APPS_SCRIPT_URL" \
  -H 'Content-Type: application/json' \
  -d '{"action":"feedback.create","rating":5,"comment":"Smooth ride"}'
```

`-L` is needed because Apps Script returns a 302 to a `googleusercontent.com` URL on first hit.
