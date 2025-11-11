# 🎯 Simple Setup Instructions

## Current Status: Google OAuth Not Configured ⚠️

You tried to click "Connect with Google" but it failed because Google OAuth credentials are missing.

---

## 📌 You Have 2 Easy Options:

### Option 1: Skip OAuth for Now - Use App Password (5 minutes) ⚡

**Quickest way to start sending emails:**

1. **In the app, click "Gmail Manual Setup"** button (right next to "Connect with Google")
   - Gmail SMTP settings will auto-fill
   
2. **Get your Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Create new App Password (name it "Cold Email")
   - Copy the 16-character password

3. **Fill in Settings page:**
   ```
   Username: your-email@gmail.com
   Password: [paste 16-char App Password]
   From Email: your-email@gmail.com
   From Name: Your Full Name
   ```

4. **Click "Save Settings"** → **Test Connection** → **Done!** ✅

**Full guide:** `docs/GMAIL_SETUP_GUIDE.md`

---

### Option 2: Set Up Google OAuth (10-15 minutes) 🌟

**One-time setup, then "Connect with Google" works forever:**

#### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Email Automation"
3. Enable Gmail API:
   - APIs & Services → Library
   - Search "Gmail API" → Enable

4. Configure OAuth Consent Screen:
   - APIs & Services → OAuth consent screen
   - External → Create
   - App name: "Cold Email Automation"
   - Your email address
   - Save & Continue through all steps

5. Create Credentials:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Type: Web application
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Create
   - **Copy your Client ID and Client Secret**

#### Step 2: Add to .env File

Open your `.env` file and replace these lines:

```bash
# Find these lines (around line 20-23):
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Replace with your actual credentials:
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz456
```

#### Step 3: Restart the App

```powershell
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

#### Step 4: Connect Gmail

1. Go to Settings page
2. Click "Connect with Google"
3. Choose your Gmail account
4. Click "Allow"
5. Done! ✅

**Detailed guide:** `docs/EASY_GMAIL_SETUP.md` or `docs/GMAIL_OAUTH_SETUP.md`

---

## 🤔 Which Option Should I Choose?

| Choose | If You Want |
|--------|-------------|
| **Option 1** (App Password) | Start sending emails in 5 minutes |
| **Option 2** (OAuth) | Best long-term solution, more secure |

**Recommendation:** Start with Option 1 to test the system, then set up OAuth later for production use.

---

## 🆘 Need Help?

### Error: "Social provider google is missing clientId or clientSecret"

This means Google OAuth isn't configured. Use **Option 1** (App Password method) to start immediately!

### Where is the "Gmail Manual Setup" button?

In the app:
1. Go to **Settings** (left sidebar)
2. Look for "SMTP Configuration" tab
3. You'll see two buttons:
   - 🔵 "Connect with Google" (needs OAuth setup)
   - 📧 "Gmail Manual Setup" ← Click this one!

### I set up OAuth but it still doesn't work

Check:
- ✅ `.env` file has correct Client ID and Client Secret (no quotes, no spaces)
- ✅ You restarted the dev server after editing `.env`
- ✅ Redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- ✅ Gmail API is enabled in Google Cloud Console

---

## ⚡ Quick Commands

```powershell
# Restart the app
npm run dev

# Check if .env is loaded (run in another terminal)
node -e "console.log(process.env.GOOGLE_CLIENT_ID)"

# See all environment variables
npm run dev -- --debug
```

---

## 📚 Documentation

- **Gmail App Password Setup:** `docs/GMAIL_SETUP_GUIDE.md`
- **Google OAuth Setup:** `docs/EASY_GMAIL_SETUP.md`
- **Detailed OAuth Guide:** `docs/GMAIL_OAUTH_SETUP.md`
- **Send Your First Email:** `docs/QUICK_START_SEND_EMAILS.md`
- **Complete Guide:** `JOB_HUNTING_GUIDE.md`

---

## 🎯 Recommended Path for Beginners

```
1. Use Option 1 (App Password) → 5 minutes
2. Send test emails to verify it works
3. Create your first campaign
4. Later, set up OAuth for production (optional)
```

---

**Ready to start?** Choose Option 1 above and you'll be sending emails in 5 minutes! 🚀
