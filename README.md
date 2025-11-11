# 🚀 Cold Email SaaS Automation

A modern, powerful cold email automation platform built with Next.js 15, designed specifically for job hunting and business outreach.

## ✨ Features

- 📧 **Easy Gmail Integration** - One-click OAuth2 setup (no App Passwords!)
- 📝 **Template System** - Create personalized email templates with variables
- 📊 **Campaign Management** - Launch and track email campaigns
- 📈 **Real-time Analytics** - Monitor opens, clicks, and responses
- 🎯 **Smart Rate Limiting** - Respects Gmail's sending limits
- 🔒 **Compliance Built-in** - Auto-adds unsubscribe links
- 💾 **CSV Import** - Bulk import contacts easily
- 🎨 **Beautiful UI** - Modern glassmorphic design

## 🎯 Perfect For

- 🎓 Job seekers reaching out to HR departments
- 💼 Freelancers finding new clients
- 🚀 Startups building B2B relationships
- 📣 Marketers running outreach campaigns

## ⚡ Super Simple Setup (5 minutes)

### 1. Install & Run

```bash
npm install
npm run dev
```

### 2. Get Gmail App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Create password → Name it "Cold Email"
3. Copy the 16-character password

### 3. Configure in App

1. Open http://localhost:3000
2. Register/Login
3. Go to **Settings**
4. Click **"Setup Gmail in 30 Seconds"**
5. Enter: Gmail address + App Password + Your name
6. Save!

### 4. Send Emails!

Templates → Create → Email Lists → Upload CSV → Campaigns → Launch! 🚀

**📖 Complete guide:** [SIMPLE_SETUP.md](SIMPLE_SETUP.md) (3 minutes read)

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| **[SIMPLE_SETUP.md](SIMPLE_SETUP.md)** ⭐ | **Start here! 3-step setup** |
| [Email Templates](docs/EMAIL_TEMPLATES_SAMPLES.md) | 5 ready-to-use templates |
| [Job Hunting Guide](JOB_HUNTING_GUIDE.md) | Complete workflow |
| [Gmail Setup Details](docs/GMAIL_SETUP_GUIDE.md) | Detailed App Password guide |

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (React 19)
- **Database:** Turso (LibSQL)
- **ORM:** Drizzle
- **Auth:** Better-auth (with Google OAuth2)
- **Email:** Nodemailer + Gmail API
- **UI:** Tailwind CSS, Framer Motion, Radix UI
- **Hosting:** Vercel

## 🎓 For Job Seekers

This project includes everything you need for your job search:

- ✅ 300 Jaipur HR contacts (pre-loaded CSV)
- ✅ 5 professional email templates
- ✅ Complete job hunting strategy guide
- ✅ Expected response rates and timeline
- ✅ Follow-up automation

**Get started:** [Job Hunting Guide](JOB_HUNTING_GUIDE.md)

## ⚙️ Environment Setup

Create `.env` file (copy from `.env.example`):

```bash
# Database (Required)
TURSO_CONNECTION_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Gmail OAuth2 (Recommended)
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# N8N Integration (Optional)
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your-api-key
```

## 📊 Gmail Sending Limits

| Account Type | Daily Limit | Recommended Rate | Cost |
|--------------|-------------|------------------|------|
| Free Gmail | 500 emails | 20-25/hour | Free |
| Google Workspace | 2,000 emails | 80-100/hour | ₹125/month |

For 300 contacts:
- **Free Gmail:** 2-3 days
- **Workspace:** Same day

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup database
npx drizzle-kit push

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 Step-by-Step Usage

1. **Register** - Create your account
2. **Connect Gmail** - One-click OAuth or manual SMTP
3. **Create Template** - Use variables like {{name}}, {{company}}
4. **Import Contacts** - Upload CSV with HR emails
5. **Launch Campaign** - Set rate limit and send
6. **Monitor Results** - Track opens, clicks, responses

**Detailed guide:** [Quick Start: Send Emails](docs/QUICK_START_SEND_EMAILS.md)

## 🎨 UI Features

- 🌓 Dark/Light mode
- 📱 Fully responsive
- ✨ Glassmorphic design
- 🎭 Smooth animations
- 📊 Interactive charts
- 🔔 Real-time notifications

## 🔒 Security & Compliance

- ✅ GDPR compliant
- ✅ CAN-SPAM compliant
- ✅ Auto-unsubscribe links
- ✅ OAuth2 token encryption
- ✅ Rate limiting protection
- ✅ Bounce handling

## 📈 Expected Results

Based on 300-email campaign:

- **Open Rate:** 30-50% (90-150 opens)
- **Response Rate:** 2-5% (6-15 responses)
- **Interview Calls:** 1-3% (3-9 calls)

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

- 📚 Check [documentation](docs/)
- 🐛 Open an [issue](https://github.com/yogeshsain1/cold-email-saas-automation/issues)
- 💬 Join our community discussions

## ⭐ Show Your Support

If this project helped you land a job or grow your business, please give it a star! ⭐

---

**Made with ❤️ for job seekers and entrepreneurs**

**Ready to send your first campaign?** → [Easy Gmail Setup](docs/EASY_GMAIL_SETUP.md)
