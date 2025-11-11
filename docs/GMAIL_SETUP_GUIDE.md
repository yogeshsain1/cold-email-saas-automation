# Gmail Setup Guide for Cold Email Automation

This guide will help you configure Gmail to send emails through your cold email automation platform.

## Important Notes

⚠️ **Gmail Sending Limits:**
- Free Gmail accounts: **500 emails per day** (24-hour period)
- Google Workspace accounts: **2,000 emails per day**
- These limits are cumulative across all applications using your account

⚠️ **Best Practices:**
- Start with small test batches (10-20 emails) to verify deliverability
- Use Google Workspace (paid) for professional job applications
- Consider using multiple Gmail accounts or a dedicated email service provider for larger campaigns

---

## Step 1: Enable 2-Factor Authentication

Gmail requires 2-Factor Authentication (2FA) before you can create App Passwords.

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to set up 2FA using your phone

---

## Step 2: Generate Gmail App Password

You **cannot** use your regular Gmail password for SMTP. You must create an App Password.

### Instructions:

1. Go to https://myaccount.google.com/apppasswords
   - OR: Google Account → Security → 2-Step Verification → App passwords (at the bottom)

2. You might need to sign in again

3. In the "App passwords" page:
   - **Select app:** Choose "Mail"
   - **Select device:** Choose "Other (Custom name)"
   - Enter a name: "Cold Email Automation" or "Job Application Mailer"
   - Click **Generate**

4. Google will display a **16-character password** (looks like: `xxxx xxxx xxxx xxxx`)
   - **Copy this password immediately** - you won't be able to see it again!
   - Store it securely (you'll need it for SMTP configuration)

---

## Step 3: Configure SMTP Settings in Your Application

After starting your application (`npm run dev`), configure Gmail SMTP:

1. **Login to your application** at http://localhost:3000

2. **Navigate to Settings** (click Settings in the sidebar)

3. **Fill in SMTP Configuration:**

   ```
   SMTP Host:     smtp.gmail.com
   SMTP Port:     587
   Username:      your-email@gmail.com
   Password:      [Your 16-character App Password]
   From Email:    your-email@gmail.com
   From Name:     Your Full Name
   ```

   **Important Details:**
   - **SMTP Host:** Must be `smtp.gmail.com`
   - **SMTP Port:** Use `587` (TLS) - this is the standard secure port
   - **Username:** Your full Gmail address (e.g., `yogesh.developer@gmail.com`)
   - **Password:** The 16-character App Password you generated (remove spaces)
   - **From Email:** Same as your Gmail address
   - **From Name:** Your professional name (e.g., "Yogesh Sain" or "John Doe")

4. **Test Configuration:**
   - Click "Test SMTP Connection" button
   - You should see a success message
   - If it fails, double-check your App Password and settings

---

## Step 4: Gmail-Specific Recommendations

### For Job Applications:

1. **Use Google Workspace ($6/month per user)**
   - Benefits:
     - 2,000 emails/day limit (vs 500 for free Gmail)
     - Custom domain (yourname@yourdomain.com) looks more professional
     - Better deliverability and reputation
     - More professional appearance to HR departments

2. **Warm Up Your Account:**
   - If using a new Gmail account, send 10-20 manual emails first
   - Wait 2-3 days before starting automated campaigns
   - Gradually increase volume over the first week

3. **Content Best Practices:**
   - Avoid spam trigger words: "free", "guaranteed", "act now"
   - Keep emails personalized and professional
   - Include your full signature with LinkedIn profile
   - Use plain text or minimal HTML formatting

4. **Sending Schedule:**
   - **Free Gmail (500/day):** Send 200-300 emails per day max (leave buffer)
   - **Google Workspace (2,000/day):** Send 800-1,000 emails per day max
   - Spread emails throughout the day (not all at once)
   - Best sending times: 8-11 AM or 2-4 PM IST (workday hours)

---

## Step 5: Monitor Your Gmail Account

### Check for Warnings:

1. **Check Gmail's Postmaster Tools:**
   - Visit: https://postmaster.google.com/
   - Verify your domain to monitor reputation
   - Track spam rate, IP reputation, feedback loops

2. **Monitor Bounce Rates:**
   - If bounce rate exceeds 5%, pause campaigns
   - Clean your email list regularly
   - Remove invalid emails immediately

3. **Watch for Account Suspension:**
   - Gmail may temporarily suspend sending if:
     - Too many spam complaints
     - High bounce rate (>10%)
     - Suspicious sending patterns
   - If suspended, reduce volume and improve content quality

---

## Step 6: Rate Limiting Configuration

When creating campaigns in the application:

### For Free Gmail (500/day limit):
```
Emails per hour: 20-25
Daily limit: 400-450
Campaign duration: Multiple days for 300 emails
```

### For Google Workspace (2,000/day limit):
```
Emails per hour: 80-100
Daily limit: 1,600-1,800
Campaign duration: Same day possible for 300 emails
```

**Application Settings:**
- The system will automatically rate-limit based on your configured "emails per hour"
- Default setting: 300 emails/hour (too high for Gmail!)
- **Recommended Gmail setting:** 20-25 emails/hour for free Gmail

---

## Troubleshooting Common Issues

### Issue 1: "Authentication Failed" Error

**Solutions:**
- Verify 2FA is enabled on your Google account
- Regenerate a new App Password
- Ensure you're using port 587 (not 465 or 25)
- Remove spaces from your App Password
- Try your full email address as username

### Issue 2: "Daily Sending Quota Exceeded"

**Solutions:**
- You've hit Gmail's 500/day limit (or 2,000 for Workspace)
- Wait 24 hours for the quota to reset
- Reduce your campaign sending rate
- Consider using multiple Gmail accounts or a dedicated ESP

### Issue 3: Emails Going to Spam

**Solutions:**
- Improve email content (remove spam trigger words)
- Add personalization (use {{firstName}}, {{companyName}})
- Include an unsubscribe link (automatically added by the system)
- Warm up your account gradually
- Ask initial recipients to mark as "Not Spam"
- Set up SPF, DKIM, and DMARC records (for custom domains)

### Issue 4: "Less Secure App Access" Warning

**Solution:**
- Google deprecated this setting in May 2022
- You **must** use App Passwords now (no way around it)
- Follow Step 2 above to generate an App Password

### Issue 5: Connection Timeout

**Solutions:**
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try port 465 with SSL (change in SMTP settings)
- Temporarily disable antivirus/firewall to test

---

## Alternative: Using Gmail with OAuth2 (Advanced)

For production applications, consider using OAuth2 instead of App Passwords:

### Benefits:
- More secure (no password storage)
- Better for team environments
- Automatic token refresh
- Required for some Google Workspace domains

### Setup (Beyond Scope):
- Create project in Google Cloud Console
- Enable Gmail API
- Configure OAuth consent screen
- Generate client ID and secret
- Implement OAuth2 flow in the application

**Note:** The current application uses App Passwords for simplicity. OAuth2 setup requires code modifications.

---

## Recommended Gmail Setup for Your Job Hunt

Based on your 300 Jaipur HR contacts:

### Option A: Free Gmail (Budget-Friendly)
```
Cost: Free
Daily sends: 400 emails max
Timeline: 1 email per contact = 1 day campaign
From Email: your-name@gmail.com
```

**Pros:** Free, easy setup
**Cons:** Less professional, 500/day limit, potential spam issues

### Option B: Google Workspace (Recommended)
```
Cost: ₹125/month (~$1.50/month)
Daily sends: 1,600 emails max
Timeline: 1 email per contact = same day possible
From Email: your-name@yourdomain.com (e.g., yogesh@yogeshsain.com)
```

**Pros:** 
- Professional custom domain
- 4x higher sending limit
- Better deliverability
- Looks more professional to recruiters

**Cons:** Monthly cost

---

## Quick Start Checklist

- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate Gmail App Password
- [ ] Start the application (`npm run dev`)
- [ ] Login and go to Settings page
- [ ] Configure SMTP with Gmail settings (host: smtp.gmail.com, port: 587)
- [ ] Test SMTP connection
- [ ] Set rate limit to 20-25 emails/hour
- [ ] Send test email to yourself
- [ ] Verify test email arrived (check spam folder too)
- [ ] Create your first campaign with 5-10 test emails
- [ ] Monitor deliverability before scaling up

---

## Expected Results for Your 300-Email Campaign

### Timeline (Free Gmail):
- **Day 1:** 50-100 test emails to verify deliverability
- **Day 2-3:** Remaining 200-250 emails
- **Total:** 2-3 days for complete campaign

### Timeline (Google Workspace):
- **Day 1:** All 300 emails in one day
- **Rate:** 25-30 emails per hour = 12 hours total

### Response Rate Expectations:
- **Open Rate:** 30-50% (tracking via campaign analytics)
- **Response Rate:** 2-5% (6-15 responses from 300 emails)
- **Interview Calls:** 1-3% (3-9 potential interviews)

**Key Success Factors:**
- Professional email content
- Personalized subject lines
- Relevant experience highlighted
- Clear call-to-action
- Follow-up sequence (follow up after 3-5 days with non-responders)

---

## Support & Resources

- **Gmail Help:** https://support.google.com/mail/
- **App Passwords:** https://support.google.com/accounts/answer/185833
- **Google Workspace:** https://workspace.google.com/
- **Email Deliverability Best Practices:** https://postmaster.google.com/

---

## Security Reminders

🔒 **Never share your App Password with anyone**
🔒 **Never commit your App Password to GitHub**
🔒 **Store credentials in `.env` file only (not `.env.example`)**
🔒 **Revoke unused App Passwords from Google Account settings**
🔒 **Use different App Passwords for different applications**

---

**Good luck with your job hunt! 🚀**

For questions or issues, refer to the main `JOB_HUNTING_GUIDE.md` or open an issue in the GitHub repository.
