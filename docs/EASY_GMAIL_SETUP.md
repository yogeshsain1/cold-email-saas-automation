# 🚀 Super Easy Gmail Setup - 3 Steps!

Want to send emails through Gmail? Here's the **easiest way ever** - no App Passwords needed!

---

## ⚡ Quick Setup (10 minutes first time, 30 seconds after)

### Step 1: Google Cloud Setup (One-Time)

1. **Go to:** https://console.cloud.google.com/
2. **Create new project:** "Email Automation"
3. **Enable Gmail API:** Go to "APIs & Services" → "Library" → Search "Gmail API" → Enable
4. **Create OAuth credentials:**
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: Web application
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy your **Client ID** and **Client Secret**

📹 **Video Tutorial:** [Watch 2-minute setup guide](#) (coming soon)

---

### Step 2: Add to Your .env File

Create `.env` file (copy from `.env.example`):

```bash
# Database
TURSO_CONNECTION_URL=your-turso-url
TURSO_AUTH_TOKEN=your-token

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Gmail OAuth (paste your credentials here)
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

**Restart your app:**
```powershell
npm run dev
```

---

### Step 3: Connect Gmail (30 seconds!)

1. Open http://localhost:3000
2. Login to your account
3. Go to **Settings** page
4. Click **"Connect with Google"** button
5. Choose your Gmail account
6. Click **"Allow"**
7. **Done!** ✅

---

## 🎯 That's It!

You can now:
- ✅ Send emails through Gmail
- ✅ No App Password needed
- ✅ No manual SMTP config
- ✅ Auto-refreshing tokens
- ✅ More secure

**Start sending:** Go to Templates → Create template → Launch campaign!

---

## 📌 Gmail Limits

- **Free Gmail:** 500 emails/day
- **Google Workspace:** 2,000 emails/day

For your 300 Jaipur HR contacts:
- Will take **2-3 days** with free Gmail (sending at 20 emails/hour)
- Or get Google Workspace for ₹125/month and send all in 1 day

---

## 🤔 Prefer Traditional Method?

If you want to use App Password instead:

1. Click **"Gmail Manual Setup"** in Settings
2. Enter your email
3. Create App Password: https://myaccount.google.com/apppasswords
4. Paste 16-character password
5. Save

**Full guide:** See `docs/GMAIL_SETUP_GUIDE.md`

---

## 🆘 Need Help?

**Common Issues:**

❓ **"Connect with Google" button not showing**
- Check you added credentials to `.env` file
- Restart the app: `npm run dev`

❓ **"Redirect URI mismatch" error**
- Check your redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- No spaces, no trailing slash!

❓ **"This app hasn't been verified" warning**
- Click "Advanced" → "Go to [App Name] (unsafe)"
- This is normal for apps in testing mode
- Safe to proceed

**More help:** `docs/GMAIL_OAUTH_SETUP.md` (detailed guide with screenshots)

---

## 🎓 For Detailed Setup

See comprehensive guides:
- **OAuth2 Setup:** `docs/GMAIL_OAUTH_SETUP.md` (with troubleshooting)
- **Traditional Setup:** `docs/GMAIL_SETUP_GUIDE.md` (App Password method)
- **Email Templates:** `docs/EMAIL_TEMPLATES_SAMPLES.md`
- **Complete Guide:** `JOB_HUNTING_GUIDE.md`

---

**Ready? Click "Connect with Google" and start sending! 🚀**
