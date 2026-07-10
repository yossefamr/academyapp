# 🐺 Lycans Fight Club — Convert Website to Android APK

Your site is now a **full PWA (Progressive Web App)**. This guide converts it into a
**signed, installable Android `.apk`** — **no Android Studio, no Flutter, no filters**.
You only need a computer with **Node.js 18+** and a browser.

Two methods are provided. **Method A (PWABuilder)** is the easiest (browser-only).
**Method B (Bubblewrap CLI)** gives you full control and a signed APK from the terminal.

---

## ✅ Prerequisites — your site is already PWA-ready

This project already includes everything an installable PWA / TWA needs:

| Requirement | Status in this project |
|---|---|
| `manifest.json` (name, icons, start_url, display: standalone) | ✅ `public/manifest.json` |
| Service worker (offline support) | ✅ `public/sw.js` |
| Icons 192px + 512px + maskable | ✅ `public/icons/` |
| HTTPS-served | ✅ required (use your live domain) |
| Responsive + mobile-friendly | ✅ Tailwind responsive |
| `themeColor` + `appleWebApp` meta | ✅ in `src/app/layout.tsx` |

> ⚠️ The PWA must be **deployed to a public HTTPS URL** (e.g. `https://lycansfightclub.com`)
> before generating the APK. Localhost will not work for the APK build.
> You can host the built Next.js app on **Vercel**, **Netlify**, **Cloudflare Pages**,
> or any static host + Node server.

---

## 🚀 Method A — PWABuilder (Easiest, browser-only, ~5 minutes)

**No installs. Generates a signed APK directly in your browser.**

1. **Deploy your site** to a public HTTPS URL (e.g. Vercel):
   ```bash
   # Push to GitHub, then import on https://vercel.com — done.
   # Or use the Vercel CLI:
   npm i -g vercel
   vercel --prod
   ```

2. **Open** 👉 **https://www.pwabuilder.com**

3. **Enter your deployed URL** (e.g. `https://lycansfightclub.com`) → click **Start**.

4. PWABuilder scores your PWA. You should see a high score (manifest + SW + icons all present).
   Click **Package For Stores**.

5. Choose **Android** → **Options**:
   - **Package ID:** `com.lycansfightclub.app` (or your preferred ID)
   - **App name:** `Lycans Fight Club`
   - **Short name:** `Lycans`
   - **Signing key:** let PWABuilder generate one (download the `.keystore` — **keep it safe**,
     you need the same key for all future updates)
   - **Version:** `1.0.0`

6. Click **Generate** → download the produced **`.apk`** (also an `.aab` for the Play Store).

7. **Install the APK on a phone:**
   - Copy the `.apk` to your Android phone (USB, Google Drive, email, etc.)
   - On the phone, open the file (Files app → tap the `.apk`)
   - Allow "Install from unknown sources" if prompted → **Install** → **Open** 🐺

> The PWABuilder APK wraps your site in a **Trusted Web Activity (TWA)** — it behaves like a
> native app (no browser address bar, splash screen, app icon on home screen, full offline support).

---

## 🛠️ Method B — Bubblewrap CLI (Terminal, full control, signed APK)

**Google's official TWA generator. No Android Studio. Produces a signed `.apk`.**

### Step 1 — Install Bubblewrap (one time)
```bash
npm install -g @bubblewrap/cli
```

### Step 2 — Initialize the Android project from your live manifest
```bash
bubblewrap init --manifest=https://lycansfightclub.com/manifest.json
```
Answer the prompts:
- **Application name:** `Lycans Fight Club`
- **Short name:** `Lycans`
- **Package ID:** `com.lycansfightclub.app`
- **Display mode:** `standalone`
- **Orientation:** `portrait`
- **Status bar color:** `#c8102e`
- **Navigation color:** `#0a0a0c`
- **Icon:** keep defaults (pulls from your manifest)
- **Signing key info:** fill your name/org; **save the passwords**.

This creates an `android/` project folder + a `twa-manifest.json`.

### Step 3 — Build the signed APK
```bash
bubblewrap build
```
- It downloads the Android SDK build tools **automatically** (no Android Studio needed).
- When prompted, enter the signing key password you set in Step 2.
- Output: **`app-release-signed.apk`** in the project folder. 🎉

### Step 4 — Install on your phone
```bash
# Option A — via ADB (if you have USB debugging on):
adb install app-release-signed.apk

# Option B — manual:
# Copy app-release-signed.apk to your phone, open it, tap Install.
```

### Updating the app later
Whenever you change the website, no APK rebuild is needed for content changes (the TWA loads
your live site). For app-level changes (icon, name, version), bump the version and re-run:
```bash
bubblewrap build
```

---

## 🧰 Quick reference — commands cheat sheet

```bash
# 1. Build the Next.js site for production
bun run build

# 2. Run PWA audits locally (optional, sanity check)
npx lighthouse http://localhost:3000 --view --only-categories=pwa

# 3. PWABuilder (browser)
#    → https://www.pwabuilder.com  →  enter URL  →  Package For Stores  →  Android

# 4. Bubblewrap (terminal)
npm i -g @bubblewrap/cli
bubblewrap init  --manifest=https://YOUR-DOMAIN/manifest.json
bubblewrap build
```

---

## 📋 What you get in the APK

- 🐺 **App icon** on the home screen (the Lycans crest)
- 🚀 **Splash screen** with theme color `#c8102e`
- 📱 **Standalone** window (no browser chrome)
- 🌙 **Offline support** (service worker caches the app shell)
- 🔄 **Auto-updates** (site changes appear instantly — no Play Store update needed for content)
- 📲 **Installable** from the APK file directly (sideload)

---

## ❓ FAQ

**Q: Do I need a Mac, Android Studio, or Flutter?**
A: No. Both methods work on Windows, macOS, or Linux with just Node.js + a browser.

**Q: Can I publish the APK to the Google Play Store?**
A: Yes. Use the `.aab` (Android App Bundle) from PWABuilder or `bubblewrap build --aab`.
   Create a Google Play Developer account ($25 one-time), upload the `.aab`, and publish.
   For sideloading (direct install), use the `.apk`.

**Q: Will camera/QR-scanning work in the APK?**
A: Yes — add these to your Android app's permissions (Bubblewrap asks during `init`):
   `android.permission.CAMERA`. The QR scanner in the coach panel works inside the TWA.

**Q: The site changes — do I rebuild the APK?**
A: No. The TWA loads your live HTTPS site, so content/chat/trainee updates appear instantly.
   Rebuild the APK only when you change the app icon, name, or version.

**Q: How do I sign the APK?**
A: Both PWABuilder and Bubblewrap generate and sign with a keystore during the build.
   **Back up the `.keystore` file + passwords** — you need the same key to publish updates.

---

🐺 **Lycans Fight Club — MMA Academy** · Fearless Fighters
www.lycansfightclub.com · +20 11 1792 3050
