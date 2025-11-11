# Quick Start: Sending Emails with Templates

This guide will walk you through creating email templates and sending your first campaign.

---

## Step-by-Step Process

### 1. Start the Application

```powershell
# Make sure you're in the project directory
cd C:\Users\yoges\OneDrive\Desktop\portfolio\cold-email-saas-automation

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will open at **http://localhost:3000**

---

### 2. Register & Login

1. Go to http://localhost:3000
2. Click **"Register"** if you don't have an account
3. Create your account with email and password
4. Login to access the dashboard

---

### 3. Configure SMTP (Gmail)

Before sending emails, configure your SMTP settings:

1. **Click "Settings"** in the sidebar
2. **Fill in Gmail SMTP details:**
   ```
   SMTP Host:     smtp.gmail.com
   SMTP Port:     587
   Username:      your-email@gmail.com
   Password:      [Your Gmail App Password]
   From Email:    your-email@gmail.com
   From Name:     Your Full Name
   ```
3. **Click "Test Connection"** to verify
4. **Save Settings**

> **Don't have App Password?** Follow `docs/GMAIL_SETUP_GUIDE.md` to generate one.

---

### 4. Create Your Email Template

#### Option A: Use Pre-Made Template (Quick Start)

I'll create a ready-to-use template below. You can copy it directly!

#### Option B: Create in UI

1. **Click "Templates"** in the sidebar
2. **Click "New Template"** button
3. **Fill in the form:**
   - **Template Name:** "Software Developer Job Application"
   - **Subject:** "Application for {{position}} Role - {{candidateName}}"
   - **Email Body:** (See template below)
4. **Click "Save Template"**

---

## Ready-to-Use Template

Copy this professional template:

### Template Details:

- **Name:** Software Developer Job Application
- **Subject:** `Application for Software Developer Role - {{candidateName}}`

### Email Body (HTML):

```html
<p>Dear {{hrName}},</p>

<p>
  I hope this email finds you well. My name is {{candidateName}}, and I am
  writing to express my strong interest in software development opportunities at
  {{companyName}}.
</p>

<p><strong>About Me:</strong></p>
<ul>
  <li>{{yearsOfExperience}} years of experience in {{primarySkill}}</li>
  <li>Proficient in {{technicalSkills}}</li>
  <li>
    Successfully delivered {{numberOfProjects}}+ projects across {{domains}}
  </li>
  <li>{{education}} from {{collegeName}}</li>
</ul>

<p><strong>Why {{companyName}}?</strong></p>
<p>
  I am particularly impressed by {{companyName}}'s work in {{companyFocus}}, and
  I believe my expertise in {{relevantSkill}} would be a valuable addition to
  your team.
</p>

<p><strong>Key Achievements:</strong></p>
<ul>
  <li>{{achievement1}}</li>
  <li>{{achievement2}}</li>
  <li>{{achievement3}}</li>
</ul>

<p>
  I have attached my resume for your review. I would welcome the opportunity to
  discuss how my skills and experience align with {{companyName}}'s needs.
</p>

<p>
  Would you be available for a brief conversation this week or next? I am
  flexible with timing and would be happy to work around your schedule.
</p>

<p>
  Thank you for considering my application. I look forward to hearing from you.
</p>

<p>
  Best regards,<br />
  {{candidateName}}<br />
  {{phoneNumber}}<br />
  {{email}}<br />
  {{linkedinProfile}}<br />
  {{portfolioWebsite}}
</p>
```

### Template Variables Used:

- `{{hrName}}` - HR person's name
- `{{candidateName}}` - Your name
- `{{companyName}}` - Company name
- `{{position}}` - Job position
- `{{yearsOfExperience}}` - Your experience
- `{{primarySkill}}` - Main skill (e.g., "Full Stack Development")
- `{{technicalSkills}}` - Tech stack (e.g., "React, Node.js, Python, AWS")
- `{{numberOfProjects}}` - Number of projects
- `{{domains}}` - Industry domains
- `{{education}}` - Degree (e.g., "B.Tech in Computer Science")
- `{{collegeName}}` - Your college
- `{{companyFocus}}` - What the company does
- `{{relevantSkill}}` - Skill relevant to company
- `{{achievement1}}`, `{{achievement2}}`, `{{achievement3}}` - Your achievements
- `{{phoneNumber}}` - Your phone
- `{{email}}` - Your email
- `{{linkedinProfile}}` - LinkedIn URL
- `{{portfolioWebsite}}` - Portfolio URL

---

### 5. Prepare Your Email List (CSV)

You already have **`docs/jaipur-hr-contacts.csv`** with 300 HR contacts!

If you want to add personalization data, update the CSV:

```csv
email,companyName,hrName,position,industry,companyWebsite,companySize,location,candidateName,yearsOfExperience,primarySkill,technicalSkills,numberOfProjects,domains,education,collegeName,companyFocus,relevantSkill,achievement1,achievement2,achievement3,phoneNumber,linkedinProfile,portfolioWebsite
hr@tcs.com,TCS,HR Team,Software Developer,IT Services,https://www.tcs.com,Large,Jaipur,Yogesh Sain,3,Full Stack Development,"React, Node.js, Python, PostgreSQL",15,"E-commerce, FinTech, SaaS",B.Tech in Computer Science,IIT Delhi,Enterprise Solutions,Cloud Architecture,Built scalable SaaS platform serving 10k+ users,Reduced API response time by 40%,Led team of 5 developers,+91-9876543210,https://linkedin.com/in/yogeshsain,https://yogeshsain.com
```

**Simplified Version (if you don't want to add all variables):**

Keep the existing CSV as-is, and the template will use default values or skip variables.

---

### 6. Import Email List

1. **Click "Email Lists"** in the sidebar
2. **Click "Import List"** or "New List"
3. **Upload `docs/jaipur-hr-contacts.csv`**
4. **Name your list:** "Jaipur HR Contacts - Tech Companies"
5. **Map CSV columns** to template variables (auto-detected)
6. **Click "Import"**

The system will:

- Import all 300 contacts
- Validate email addresses
- Show you a preview

---

### 7. Create Your Campaign

1. **Click "Campaigns"** in the sidebar
2. **Click "New Campaign"**
3. **Fill in campaign details:**

   ```
   Campaign Name:        Job Application - Jaipur Tech Companies
   Template:             [Select "Software Developer Job Application"]
   Email List:           [Select "Jaipur HR Contacts"]

   Sending Options:
   - Emails per hour:    20-25 (for free Gmail)
   - Start immediately:  Yes
   - Track opens:        Yes
   - Track clicks:       Yes
   ```

4. **Review preview** - Check how your email looks with real data
5. **Send test email** to yourself first!
6. **Launch campaign**

---

### 8. Monitor Your Campaign

After launching:

1. **Go to Campaign Dashboard**
2. **Track metrics in real-time:**
   - Emails sent
   - Delivery rate
   - Open rate
   - Click rate
   - Bounce rate
   - Unsubscribes

3. **View detailed analytics:**
   - Click on campaign name
   - See per-recipient status
   - Export results to CSV

---

## Example: Personalized Email Output

**Input CSV:**

```csv
email,companyName,hrName
hr@tcs.com,TCS,Priya Sharma
```

**Subject Line:**

```
Application for Software Developer Role - Yogesh Sain
```

**Email Body:**

```
Dear Priya Sharma,

I hope this email finds you well. My name is Yogesh Sain, and I am writing
to express my strong interest in software development opportunities at TCS.

About Me:
• 3 years of experience in Full Stack Development
• Proficient in React, Node.js, Python, PostgreSQL
• Successfully delivered 15+ projects across E-commerce, FinTech, SaaS
• B.Tech in Computer Science from IIT Delhi

Why TCS?
I am particularly impressed by TCS's work in Enterprise Solutions, and I
believe my expertise in Cloud Architecture would be a valuable addition
to your team.

Key Achievements:
• Built scalable SaaS platform serving 10k+ users
• Reduced API response time by 40%
• Led team of 5 developers

I have attached my resume for your review. I would welcome the opportunity
to discuss how my skills and experience align with TCS's needs.

Would you be available for a brief conversation this week or next?

Best regards,
Yogesh Sain
+91-9876543210
yogesh@example.com
https://linkedin.com/in/yogeshsain
https://yogeshsain.com
```

---

## Simplified Quick Start (Minimal Personalization)

If you want to start quickly without adding all variables:

### Simpler Template:

**Subject:** `Job Application - {{candidateName}}`

**Body:**

```html
<p>Dear Hiring Manager,</p>

<p>
  I hope this email finds you well. My name is {{candidateName}}, and I am
  writing to express my interest in software development opportunities at
  {{companyName}}.
</p>

<p>
  I am a software developer with experience in full-stack development,
  specializing in modern web technologies including React, Node.js, and cloud
  platforms.
</p>

<p><strong>My Background:</strong></p>
<ul>
  <li>3+ years of professional development experience</li>
  <li>Expertise in JavaScript, TypeScript, Python</li>
  <li>Successfully delivered multiple production applications</li>
  <li>Strong problem-solving and team collaboration skills</li>
</ul>

<p>
  I am particularly interested in {{companyName}} because of your reputation in
  the Jaipur tech ecosystem. I believe my skills would be a great fit for your
  team.
</p>

<p>
  I have attached my resume for your review. I would love to discuss potential
  opportunities with your team.
</p>

<p>Thank you for your time and consideration.</p>

<p>
  Best regards,<br />
  {{candidateName}}<br />
  {{email}}<br />
  {{phoneNumber}}
</p>
```

**Variables needed (minimum):**

- `candidateName` - Your name
- `companyName` - From CSV
- `email` - Your email
- `phoneNumber` - Your phone

---

## Testing Before Full Campaign

**Always test first!** Here's how:

1. **Create a test list** with 5 emails:
   - Your personal email
   - A friend's email
   - Test accounts

2. **Send test campaign:**

   ```
   Campaign: Test Campaign
   Recipients: 5 test emails
   Emails per hour: 60 (faster for testing)
   ```

3. **Check results:**
   - Did emails arrive?
   - Is formatting correct?
   - Are variables replaced properly?
   - Did emails go to spam?

4. **Adjust and improve:**
   - Fix any issues
   - Refine template
   - Update CSV data

5. **Launch full campaign** with confidence!

---

## Rate Limiting Recommendations

### For Free Gmail (500/day limit):

**Conservative (Recommended for first campaign):**

```
Emails per hour: 20
Daily total: 400
Timeline for 300 emails: 15 hours (1 day)
```

**Aggressive (After successful tests):**

```
Emails per hour: 25
Daily total: 480
Timeline for 300 emails: 12 hours (1 day)
```

### For Google Workspace (2,000/day limit):

```
Emails per hour: 80-100
Daily total: 1,600
Timeline for 300 emails: 3-4 hours (same day)
```

---

## Common Issues & Solutions

### Issue: Variables not replaced (showing {{variable}})

**Solution:**

- Check CSV column names match template variables exactly
- Map columns during import
- Ensure CSV has data in those columns

### Issue: Emails going to spam

**Solution:**

- Remove spam trigger words ("free", "guaranteed", "act now")
- Add personalization (use recipient's name)
- Warm up your Gmail account (send manual emails first)
- Ask test recipients to mark as "Not Spam"
- Include unsubscribe link (auto-added by system)

### Issue: SMTP authentication failed

**Solution:**

- Verify you're using App Password (not regular password)
- Check 2FA is enabled on Gmail
- Ensure port 587 is used
- Try regenerating App Password

### Issue: Emails not sending

**Solution:**

- Check SMTP configuration in Settings
- Verify Gmail hasn't suspended your account
- Check you haven't exceeded daily limit (500 for free Gmail)
- Test SMTP connection in Settings page

---

## Expected Timeline

**Full Campaign (300 emails) with Free Gmail:**

```
Day 0: Setup (2-3 hours)
- Configure SMTP
- Create template
- Import CSV
- Send 5-10 test emails

Day 1: Main Campaign (15 hours)
- Send 200-250 emails at 20/hour
- Monitor deliverability
- Track open rates

Day 2: Remainder + Follow-up
- Send remaining 50-100 emails
- Monitor responses
- Reply to interested recruiters

Day 5-7: Follow-up Campaign
- Create follow-up template
- Send to non-responders
- Track improved response rate
```

---

## Success Metrics

**Good Campaign Performance:**

- Delivery Rate: >95% (less than 5% bounces)
- Open Rate: 30-50%
- Click Rate: 5-15%
- Response Rate: 2-5%
- Interviews: 1-3% of total sends

**For 300 emails:**

- Expected Opens: 90-150 people
- Expected Responses: 6-15 replies
- Expected Interviews: 3-9 calls

---

## Next Steps After Launch

1. **Monitor first 50 emails:**
   - Check open rates
   - Watch for bounces
   - Look for spam complaints

2. **Adjust if needed:**
   - If open rate <20%, improve subject line
   - If bounce rate >10%, clean email list
   - If spam rate >1%, revise content

3. **Continue campaign:**
   - If metrics look good, continue
   - Maintain consistent sending schedule
   - Don't exceed daily limits

4. **Follow up:**
   - After 5-7 days, send follow-up to non-responders
   - Use different subject line
   - Reference previous email

5. **Respond quickly:**
   - Reply to interested recruiters within 24 hours
   - Have your resume ready
   - Be professional and enthusiastic

---

## Quick Reference Commands

```powershell
# Start the application
npm run dev

# Check logs
npm run dev -- --turbo

# Build for production
npm run build

# Run database migrations
npx drizzle-kit push

# Check database
npx drizzle-kit studio
```

---

## Resources

- **Email Templates:** `docs/EMAIL_TEMPLATES_SAMPLES.md` (5 pre-made templates)
- **Gmail Setup:** `docs/GMAIL_SETUP_GUIDE.md` (detailed Gmail configuration)
- **HR Contacts:** `docs/jaipur-hr-contacts.csv` (300 Jaipur tech companies)
- **Complete Guide:** `JOB_HUNTING_GUIDE.md` (comprehensive documentation)

---

## Support

If you encounter issues:

1. Check `docs/GMAIL_SETUP_GUIDE.md` troubleshooting section
2. Review `JOB_HUNTING_GUIDE.md` for detailed instructions
3. Check campaign logs in the dashboard
4. Test SMTP connection in Settings page
5. Open an issue on GitHub repository

---

**Ready to send your first campaign? Let's get started! 🚀**

Good luck with your job hunt!
