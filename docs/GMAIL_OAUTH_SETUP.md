# Easy Gmail Setup with OAuth2 (One-Click Connection)

This guide shows you how to set up the **easiest way** to use Gmail for sending emails - just click "Connect with Google" and you're done! No App Passwords needed.

---

## 🎯 Two Ways to Use Gmail

### Option 1: OAuth2 (Recommended - Super Easy! ✨)
- **Pros:** One-click setup, no App Passwords, more secure, auto-refreshes
- **Cons:** Requires Google Cloud setup (one-time, 10 minutes)
- **Best for:** Everyone! This is the modern, user-friendly way

### Option 2: App Password (Traditional)
- **Pros:** No Google Cloud setup needed
- **Cons:** Manual config, need to create App Passwords, less secure
- **Best for:** Quick testing or if you can't use OAuth2

---

## 🚀 Option 1: One-Click Gmail OAuth2 Setup (Recommended)

### Part A: Google Cloud Console Setup (One-Time, 10 minutes)

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. **Project name:** "Cold Email Automation" (or any name)
4. Click **"Create"**
5. Wait for project to be created (~30 seconds)

#### Step 2: Enable Gmail API

1. In your new project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Gmail API"**
3. Click on it, then click **"Enable"**
4. Wait for it to enable (~10 seconds)

#### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Click **"Create"**

**Fill in the form:**
```
App name: Cold Email Automation
User support email: [Your email]
App logo: [Optional - skip for now]
App domain: [Skip for now]
Authorized domains: [Leave empty for localhost testing]
Developer contact information: [Your email]
```

4. Click **"Save and Continue"**

**Scopes page:**
1. Click **"Add or Remove Scopes"**
2. Filter for "Gmail API"
3. Select these scopes:
   - ✅ `.../auth/gmail.send` - Send email on your behalf
   - ✅ `.../auth/userinfo.email` - See your email address
   - ✅ `.../auth/userinfo.profile` - See your personal info
4. Click **"Update"** → **"Save and Continue"**

**Test users page:**
1. Click **"Add Users"**
2. Add your Gmail address (the one you'll use for sending)
3. Click **"Add"** → **"Save and Continue"**

4. Review summary and click **"Back to Dashboard"**

#### Step 4: Create OAuth2 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type:** Web application
4. **Name:** "Cold Email SaaS"

**Authorized redirect URIs - IMPORTANT:**
```
http://localhost:3000/api/auth/callback/google
```

For production, also add:
```
https://your-domain.com/api/auth/callback/google
```

5. Click **"Create"**

**Copy your credentials:**
```
Client ID: something.apps.googleusercontent.com
Client Secret: something_secret
```

🔒 **Keep these safe!** You'll need them next.

---

### Part B: Add Credentials to Your App (2 minutes)

#### Step 1: Create `.env` File

1. In your project folder, copy `.env.example` to `.env`:
   ```powershell
   cp .env.example .env
   ```

2. Open `.env` and add your Google credentials:
   ```bash
   # Database (required)
   TURSO_CONNECTION_URL=your-turso-url
   TURSO_AUTH_TOKEN=your-turso-token
   
   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Google OAuth2 (for Gmail)
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

3. **Save the file**

#### Step 2: Restart Your App

```powershell
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

### Part C: Connect Gmail (30 seconds!)

#### In Your Application:

1. **Open** http://localhost:3000
2. **Login** to your account
3. **Go to Settings** page
4. **Click "Connect with Google"** button (big blue button at top)
5. **Select your Gmail account**
6. **Review permissions:**
   - Send emails on your behalf ✅
   - View your email address ✅
   - View your basic profile info ✅
7. **Click "Allow"**
8. **Done!** ✨

You'll see: "Gmail connected successfully!"

Now you can send emails through Gmail without any manual SMTP configuration!

---

## 📧 How It Works

### Behind the Scenes:

1. **You click "Connect with Google"**
2. Google asks you to login and approve permissions
3. Google gives your app an **access token** and **refresh token**
4. Your app stores these tokens securely in the database
5. When sending emails:
   - App uses the access token to send via Gmail API
   - If token expires, app automatically refreshes it
   - You never see or manage tokens - it just works!

### Benefits Over App Passwords:

| Feature | OAuth2 | App Password |
|---------|--------|--------------|
| Setup clicks | 1 click | 10+ steps |
| Security | Very secure | Less secure |
| Auto-refresh | Yes | No |
| Gmail limits | 500/day free | 500/day free |
| Revoke access | One click in Google Account | Manual deletion |
| User experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 Option 2: Traditional Gmail App Password Setup

If you prefer the traditional method or can't set up OAuth2:

### Quick Steps:

1. Go to **Settings** page
2. Click **"Gmail Manual Setup"** button
3. Gmail settings will be pre-filled:
   ```
   Host: smtp.gmail.com
   Port: 587
   Provider: Gmail
   ```
4. Add your **email** and **App Password**
5. Click **"Save Settings"**

**To get your App Password:**
1. Enable 2FA: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" → "Other" → Name it "Cold Email"
4. Copy the 16-character password
5. Paste it in the password field (remove spaces)

**Full instructions:** See `docs/GMAIL_SETUP_GUIDE.md`

---

## 🔍 Troubleshooting

### Issue: "Connect with Google" button not showing

**Solution:**
- Check `.env` file has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Restart dev server: `npm run dev`
- Clear browser cache and reload

### Issue: "Redirect URI mismatch" error

**Solution:**
- Go to Google Cloud Console → Credentials
- Check your redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`
- No trailing slash!
- For production: use `https://your-domain.com/api/auth/callback/google`

### Issue: "Access blocked: This app's request is invalid"

**Solution:**
- Ensure Gmail API is enabled in Google Cloud Console
- Check OAuth consent screen is configured
- Make sure you added your email as a test user
- Verify all required scopes are added (gmail.send, userinfo.email, userinfo.profile)

### Issue: "This app hasn't been verified by Google"

**Solution:**
- Click **"Advanced"** → **"Go to [App Name] (unsafe)"**
- This is normal for apps in testing mode
- Once you publish to production, submit for Google verification
- For personal use, staying in testing mode is fine

### Issue: Connected but emails not sending

**Solution:**
- Check Gmail sending limits (500/day for free Gmail)
- Verify OAuth consent screen has `gmail.send` scope
- Check if token is being refreshed (check browser console)
- Try disconnecting and reconnecting

### Issue: Token expired errors

**Solution:**
- OAuth2 automatically refreshes tokens
- If manual refresh fails, disconnect and reconnect
- Check app has offline access permission

---

## 🔒 Security Best Practices

### For OAuth2:

✅ **DO:**
- Keep `GOOGLE_CLIENT_SECRET` in `.env` file (never commit!)
- Use environment variables for production
- Set up proper redirect URIs for each environment
- Review connected apps regularly: https://myaccount.google.com/permissions

❌ **DON'T:**
- Commit `.env` file to GitHub
- Share your Client Secret publicly
- Use the same OAuth app for dev and production
- Give OAuth access to untrusted applications

### Token Storage:

- Access tokens are stored encrypted in your database
- Refresh tokens allow automatic token renewal
- Tokens are tied to your user account
- Disconnecting revokes all tokens immediately

---

## 📊 Gmail Sending Limits with OAuth2

Same limits as App Password method:

| Account Type | Limit | Recommendation |
|--------------|-------|----------------|
| Free Gmail | 500/day | Use 20-25 emails/hour |
| Google Workspace | 2,000/day | Use 80-100 emails/hour |

**For 300 Jaipur contacts:**
- Free Gmail: 2-3 days at 20/hour
- Workspace: Same day at 30/hour

---

## 🚀 Quick Start Summary

### For First-Time Users:

**1. One-Time Setup (10 min):**
```
→ Create Google Cloud project
→ Enable Gmail API
→ Configure OAuth consent screen
→ Create OAuth credentials
→ Add credentials to .env file
```

**2. Every Time You Use (30 sec):**
```
→ Open app
→ Go to Settings
→ Click "Connect with Google"
→ Approve permissions
→ Start sending emails!
```

**3. Send Your First Campaign:**
```
→ Create template
→ Import HR contacts CSV
→ Create campaign
→ Monitor results
```

---

## 🎓 For Developers

### API Endpoints:

```typescript
// Initiate Google OAuth flow
GET /api/auth/signin/google

// OAuth callback (automatic)
GET /api/auth/callback/google

// Check connection status
GET /api/gmail/status

// Disconnect Gmail
POST /api/gmail/disconnect
```

### Database Schema:

OAuth tokens are stored in the `accounts` table (via better-auth):

```typescript
{
  userId: number,
  provider: "google",
  accessToken: string,      // Encrypted
  refreshToken: string,     // Encrypted
  expiresAt: timestamp,
  scope: string,
}
```

### Sending Email Flow:

```typescript
// 1. Check if user has Google OAuth connected
const hasGoogleOAuth = await checkGoogleConnection(userId);

// 2. If yes, use Gmail API
if (hasGoogleOAuth) {
  await sendViaGmailAPI(email, accessToken);
}

// 3. If no, fall back to SMTP
else {
  await sendViaSMTP(email, smtpConfig);
}
```

---

## 🎉 Success!

Once connected, you'll see in Settings:

```
✅ Gmail connected successfully!
   Connected as: your-email@gmail.com
   Daily limit: 500 emails (Free Gmail)
   Status: Active
   
   [Disconnect] [Test Send]
```

You're now ready to send emails! No more App Passwords, no manual SMTP config - just works! 🚀

---

## 📚 Additional Resources

- **Google OAuth2 Docs:** https://developers.google.com/identity/protocols/oauth2
- **Gmail API Docs:** https://developers.google.com/gmail/api
- **Better Auth Docs:** https://better-auth.com/docs
- **Project Guide:** `JOB_HUNTING_GUIDE.md`
- **Email Templates:** `docs/EMAIL_TEMPLATES_SAMPLES.md`

---

## 💡 Pro Tips

1. **Use OAuth2 for production** - More reliable and secure
2. **Keep test users limited** - Only add emails you control
3. **Monitor token usage** - Check if tokens are refreshing properly
4. **Set up error logging** - Track OAuth failures
5. **Have a fallback** - Keep App Password method as backup

---

**Questions?** Check the main documentation or open an issue on GitHub!

**Ready to send emails?** Just click "Connect with Google" and start! 🎯
