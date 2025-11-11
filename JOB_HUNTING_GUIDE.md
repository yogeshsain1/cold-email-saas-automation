# Cold Email Automation for Job Applications

A powerful cold email automation system designed to help job seekers reach out to HR professionals and hiring managers at scale. Send personalized job application emails, track responses, and manage your job search campaign efficiently.

## 🎯 Perfect For

- **Job Seekers**: Apply to multiple companies efficiently
- **Career Coaches**: Help clients reach more opportunities
- **Recruitment Agencies**: Connect candidates with employers
- **Fresh Graduates**: Reach companies beyond job boards
- **Career Changers**: Network with hiring managers directly

## ✨ Key Features

- 📧 **Personalized Cold Emails**: Send customized emails to HR contacts
- 📎 **Resume Attachments**: Automatically attach resumes and portfolios
- 📊 **Campaign Analytics**: Track opens, clicks, and responses
- 📝 **Template Management**: Create reusable email templates
- 👥 **Contact Management**: Upload and manage HR contact lists
- 🔄 **SMTP Integration**: Use any email provider
- 📈 **Real-time Tracking**: Monitor campaign performance
- 🚫 **Unsubscribe Handling**: Professional opt-out management

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- A Turso account (free at [turso.tech](https://turso.tech))
- An SMTP email provider (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yogeshsain1/cold-email-saas-automation.git
   cd cold-email-saas-automation
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   TURSO_CONNECTION_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Step-by-Step Usage Guide

### 1. Register and Login

- Go to `http://localhost:3000/register`
- Create your account
- Login with your credentials

### 2. Configure SMTP Settings

- Navigate to **Settings** page
- Fill in your SMTP provider details:
  - **Provider Name**: Gmail, SendGrid, etc.
  - **SMTP Host**: smtp.gmail.com (for Gmail)
  - **SMTP Port**: 587
  - **Username**: Your email address
  - **Password**: Your email password or app password
  - **From Email**: Your sending email
  - **From Name**: Your name
- Click **Save Settings**

**Popular SMTP Providers:**

| Provider | Host | Port | Notes |
|----------|------|------|-------|
| Gmail | smtp.gmail.com | 587 | Use App Password |
| SendGrid | smtp.sendgrid.net | 587 | Free 100 emails/day |
| Mailgun | smtp.mailgun.org | 587 | Free 5,000 emails/month |
| AWS SES | email-smtp.[region].amazonaws.com | 587 | Pay as you go |

### 3. Create Email Templates

- Go to **Templates** page
- Click **Create New Template**
- Choose a template type or create custom
- Use variables for personalization:

**Available Variables:**
```
{candidateName}     - Your name
{email}             - Your email
{phone}             - Your phone number
{linkedinUrl}       - LinkedIn profile
{portfolioUrl}      - Portfolio website
{position}          - Target job title
{experience}        - Years of experience
{skills}            - Your skills
{companyName}       - Company name
{hrName}            - HR person's name
{achievement1-3}    - Your achievements
```

**Example Template:**
```
Subject: Experienced {position} Seeking Opportunities at {companyName}

Dear {hrName},

I am {candidateName}, a {position} with {experience} years of experience.
I'm impressed by {companyName} and would love to contribute to your team.

Key skills: {skills}

Please find my resume attached. I'd appreciate the opportunity to discuss
how I can add value to your organization.

Best regards,
{candidateName}
{phone} | {email}
{linkedinUrl}
```

### 4. Prepare Your HR Contact List

Create a CSV file with the following columns:

**Required Columns:**
- `email` - HR email address (required)
- `companyName` - Company name
- `hrName` - HR person's name

**Optional but Recommended:**
- `position` - Job title you're targeting
- `industry` - Company industry
- `companyWebsite` - Company URL
- `companySize` - Number of employees
- `location` - Company location

**Sample CSV:**
```csv
email,companyName,hrName,position,industry
hr@techcorp.com,TechCorp Inc,Sarah Johnson,Software Engineer,Technology
jobs@startup.com,StartupXYZ,Mike Chen,Full Stack Dev,SaaS
```

See `docs/hr_contacts_sample.csv` for a complete example.

### 5. Upload Contact List

- Go to **Email Lists** page
- Click **Upload CSV**
- Select your HR contacts CSV file
- Map CSV columns to system fields
- Click **Import**

### 6. Create a Campaign

- Navigate to **Campaigns** page
- Click **Create New Campaign**
- Fill in campaign details:
  - **Campaign Name**: "Software Engineer Applications - Tech Companies"
  - **Select Template**: Choose your email template
  - **Select Email List**: Choose your HR contacts list
  - **Schedule**: Send immediately or schedule for later
- Attach your resume (PDF recommended)
- Preview emails to ensure variables are populated correctly
- Click **Launch Campaign**

### 7. Monitor Performance

- View campaign dashboard to see:
  - Total emails sent
  - Open rate
  - Click-through rate
  - Bounce rate
  - Response tracking
- Click on individual campaigns for detailed analytics
- Export reports for your records

## 📁 Project Structure

```
cold-email-saas-automation/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── campaigns/         # Campaign management
│   │   ├── templates/         # Template editor
│   │   ├── settings/          # SMTP configuration
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── db/                    # Database schema
│   └── lib/                   # Utilities
├── docs/                      # Documentation
│   ├── EMAIL_TEMPLATES_SAMPLES.md
│   └── hr_contacts_sample.csv
├── .env.example               # Environment template
└── package.json
```

## 🛠️ Configuration

### Email Provider Setup

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: Google Account → Security → App Passwords
3. Use app password in SMTP settings

#### SendGrid Setup
1. Sign up at sendgrid.com
2. Create API key
3. Use API key as SMTP password
4. Verify sender email

### Database Setup (Turso)

1. Sign up at [turso.tech](https://turso.tech)
2. Create a new database
3. Copy connection URL and auth token
4. Add to `.env` file

## 📊 Best Practices for Job Applications

### Email Strategy

1. **Personalization is Key**
   - Research each company
   - Customize emails with specific details
   - Reference recent company news or projects

2. **Timing Matters**
   - Send emails Tuesday-Thursday
   - Avoid Mondays (busy) and Fridays (weekend mode)
   - Send between 9-11 AM or 2-4 PM local time

3. **Follow-Up Protocol**
   - Wait 5-7 business days before first follow-up
   - Send maximum 2 follow-ups
   - Be polite and professional

4. **Subject Line Tips**
   - Keep under 50 characters
   - Be specific about position
   - Include your key qualification
   - Examples:
     - "Experienced Full Stack Developer Seeking Opportunities"
     - "Software Engineer | 5 Years | Available Immediately"

5. **Email Content**
   - Keep under 200 words
   - Lead with value proposition
   - Highlight 2-3 key achievements
   - Include clear call-to-action
   - Attach resume as PDF

### Legal Compliance

- ✅ Include unsubscribe link (automatically added)
- ✅ Use your real name and contact info
- ✅ Don't misrepresent yourself
- ✅ Respect opt-out requests immediately
- ✅ Follow CAN-SPAM and GDPR guidelines

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
```bash
# If you get dependency conflicts
npm install --legacy-peer-deps

# If build fails
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

**SMTP Connection Failed**
- Verify SMTP credentials
- Check if 2FA is enabled (use app password)
- Ensure port 587 is not blocked
- Try port 465 with SSL if 587 fails

**Emails Going to Spam**
- Warm up your email account (send 10-20/day initially)
- Use a custom domain (not Gmail for bulk sending)
- Include unsubscribe link
- Avoid spam trigger words
- Personalize each email

**Database Connection Issues**
- Verify Turso credentials in `.env`
- Check internet connection
- Ensure database exists in Turso dashboard

## 📈 Scaling Your Job Search

### Free Tier Limits

| Provider | Daily Limit | Monthly Limit |
|----------|-------------|---------------|
| Gmail | 100-500 | Limited |
| SendGrid | 100 | 100 emails/day forever free |
| Mailgun | 100 | 5,000/month (first 3 months) |

### Recommended Approach

1. **Start Small**: 10-20 emails/day for first week
2. **Monitor Results**: Track open and response rates
3. **Refine Templates**: Update based on what works
4. **Scale Gradually**: Increase to 50-100/day
5. **Rotate Providers**: Use multiple SMTP accounts if needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Success

1. **Quality Over Quantity**: 50 personalized emails > 500 generic ones
2. **Research Companies**: Show genuine interest
3. **Track Everything**: Use analytics to improve
4. **A/B Test Templates**: Try different approaches
5. **Be Patient**: Response rates vary (expect 2-10%)
6. **Follow Up**: Many jobs come from follow-ups
7. **Stay Professional**: Every email represents your brand
8. **Network**: Connect on LinkedIn after emailing
9. **Timing**: Be strategic about when you send
10. **Improve**: Continuously refine your approach

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review sample templates and CSV format

## 🎓 Resources

- [Email Template Samples](./docs/EMAIL_TEMPLATES_SAMPLES.md)
- [HR Contacts CSV Sample](./docs/hr_contacts_sample.csv)
- [Environment Variables Guide](./.env.example)

---

**Good luck with your job search! 🚀**

Remember: Cold emailing is a numbers game combined with quality outreach. Stay persistent, professional, and positive!
