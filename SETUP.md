# Metro Miles — Production Setup Guide for Claude

This file tells Claude Code exactly what to do to get Metro Miles live on Vercel with a real Google Apps Script backend.

---

## What Claude needs to do

### 1. Check the codebase is consistent

Run this and fix any TypeScript errors:
```
npm run lint
npm run build
```
Fix every error before proceeding.

---

### 2. Verify env vars are present on Vercel

Ask the user to confirm these three env vars are set in **Vercel → Settings → Environment Variables**:

| Variable | Where it comes from |
|----------|-------------------|
| `JWT_SECRET` | Any long random string (e.g. `metro_miles_secret_2025_xyz`) |
| `APPS_SCRIPT_URL` | The Apps Script Web App URL (user gets this from Step 4 below) |
| `APPS_SCRIPT_TOKEN` | Must match `API_TOKEN` in Apps Script Script Properties |

If `APPS_SCRIPT_URL` is missing, the app runs in mock mode — data resets on every cold start and login won't work reliably on Vercel.

---

### 3. Verify Apps Script payload compatibility

The Next.js signup and login routes must send the right fields to the Apps Script.

**Check `src/app/api/auth/driver/login/route.ts`:**
The `callSheets` call must pass `username` (not `email`):
```ts
callSheets("driver.login", {
  username: parsed.data.email,
  password: parsed.data.password,
})
```

**Check `src/app/api/auth/driver/signup/route.ts`:**
Must pass `username`, `name`, and `password`:
```ts
callSheets("driver.signup", {
  username: parsed.data.email,
  name: parsed.data.email,
  password: parsed.data.password,
})
```

**Check `src/app/api/auth/owner/login/route.ts`:**
Must pass `username`:
```ts
callSheets("owner.login", {
  username: parsed.data.email,
  password: parsed.data.password,
})
```

Fix any of the above that don't match.

---

### 4. Manual steps the user must do in the browser

Tell the user to do these steps (Claude cannot do them — they require a browser):

#### A. Open Apps Script
1. Go to the Google Sheet
2. Click **Extensions → Apps Script**

#### B. Replace Code.gs
1. Delete everything in the editor
2. Paste the full contents of `apps-script/Code.gs` from this repo
3. Save (Ctrl+S)

#### C. Set Script Properties
Click the **⚙️ gear icon → Project Settings → Script Properties → Add property**:

| Property | Value |
|----------|-------|
| `API_TOKEN` | `metro_miles_token_2025` |
| `DRIVE_FOLDER_ID` | ID of a Google Drive folder for photo uploads |

To get `DRIVE_FOLDER_ID`: go to Google Drive → create a folder called "MetroMiles Uploads" → open it → copy the ID from the URL: `drive.google.com/drive/folders/`**`COPY_THIS_PART`**

#### D. Run setupSeed()
1. In the Apps Script editor, select `setupSeed` from the function dropdown
2. Click **Run**
3. Click **Review Permissions → Allow** when prompted

This creates these accounts in the Sheet:
- Owner: `owner` / `Metro@Admin25`
- Driver: `driver1` / `Metro@Driver25`

#### E. Deploy as Web App
1. Click **Deploy → New deployment**
2. Set Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy**
6. Copy the URL (looks like `https://script.google.com/macros/s/.../exec`)

#### F. Set Vercel env vars
Go to [vercel.com](https://vercel.com) → Your Project → **Settings → Environment Variables** and add:

| Name | Value |
|------|-------|
| `JWT_SECRET` | `metro_miles_secret_2025_xyz` |
| `APPS_SCRIPT_URL` | The URL from Step E |
| `APPS_SCRIPT_TOKEN` | `metro_miles_token_2025` |

Select **Production + Preview + Development** for all three.

#### G. Redeploy on Vercel
Go to **Deployments → latest → ⋯ → Redeploy**

---

### 5. Test logins after deploy

Once redeployed, test these:

| Portal | URL | Username | Password |
|--------|-----|----------|----------|
| Owner | `/owner/login` | `owner` | `Metro@Admin25` |
| Driver | `/driver/login` | `driver1` | `Metro@Driver25` |

If login still fails, ask the user to:
1. Open browser DevTools → Network tab
2. Try logging in
3. Click the failed `/api/auth/owner/login` or `/api/auth/driver/login` request
4. Share the response body — it will show the exact error code

---

### 6. Common errors and fixes

| Error shown | Error code | Fix |
|-------------|-----------|-----|
| "Login failed." | `server_error` | `JWT_SECRET` not set on Vercel |
| "Login failed." | `invalid_credentials` | Wrong password, or Apps Script not seeded — run `setupSeed()` |
| "Could not create account." | `username_taken` | Email already registered — delete the row from the Drivers sheet and retry |
| "Could not create account." | `server_error` | `JWT_SECRET` not set on Vercel |
| Any error on all pages | — | `APPS_SCRIPT_URL` wrong or not set — check Vercel env vars |

---

### 7. After first owner login — activate drivers

New drivers who sign up via `/driver/signup` are created `active: false` by the Apps Script.
Owner must activate them:
1. Login to `/owner`
2. Go to **Drivers**
3. Find the driver → toggle Active → Save

Only then can that driver log in.
