# HomeBudget — Setup Instructions

## What you have
A complete household budget tracker with:
- Google + email sign-in
- Real-time sync via Firebase (you and your partner see the same data)
- Shared, personal, and summary tabs
- Colour themes, charts, and category breakdowns

---

## How to deploy (no terminal needed)

### Step 1 — Go to CodeSandbox
1. Go to https://codesandbox.io
2. Sign in (use your Google account)
3. Click **"+ New Sandbox"**
4. Click **"Import from ZIP"** (or drag and drop the ZIP file)

### Step 2 — Wait for it to build
CodeSandbox will install dependencies and start the app automatically.
This takes about 1–2 minutes the first time.

### Step 3 — Deploy to Netlify
1. Go to https://netlify.com and sign up (free)
2. From your CodeSandbox project, click **"Share"** → **"Export ZIP"**
3. On Netlify, go to **"Sites"** → drag and drop the ZIP file onto the page
4. Wait ~1 minute — Netlify will give you a live URL like `https://abc123.netlify.app`

### Step 4 — Add to your phone home screen
**iPhone:** Open the URL in Safari → tap the Share icon → "Add to Home Screen"
**Android:** Open the URL in Chrome → tap the menu (⋮) → "Add to Home Screen"

### Step 5 — Share with your partner
Send your partner the Netlify URL. They sign up with their own Google account or email.

---

## Important — Allow your domain in Firebase

Once you have your Netlify URL, you need to whitelist it in Firebase:

1. Go to https://console.firebase.google.com
2. Open your project → **Authentication** → **Settings** → **Authorised domains**
3. Click **"Add domain"** and paste your Netlify URL (without https://)
   e.g. `abc123.netlify.app`

Without this step, Google sign-in won't work on the live URL.

---

## Sharing with friends (separate households)
Each household needs their own Firebase project and their own deployment.
Contact the person who built this app to set up a new instance.
