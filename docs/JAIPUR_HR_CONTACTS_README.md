# Jaipur HR Contacts - Ready to Import

This CSV file contains **300 unique HR email contacts** from tech companies in Jaipur, Rajasthan, extracted from `jaipur-500-hr-emails.md`.

## 📊 Dataset Overview

- **Total Contacts**: 300 unique email addresses
- **Location**: Jaipur, Rajasthan (all companies)
- **Industry**: Information Technology
- **Target Position**: Software Developer roles
- **Company Types**: Large enterprises, mid-size firms, startups, web/app development companies

## 📁 File Information

- **Filename**: `jaipur-hr-contacts.csv`
- **Format**: CSV (Comma-Separated Values)
- **Encoding**: UTF-8
- **Rows**: 301 (including header)

## 📋 CSV Columns

| Column | Description | Example |
|--------|-------------|---------|
| `email` | HR email address | hr@tcs.co.in |
| `companyName` | Company name | Tcs |
| `hrName` | HR contact person | HR Manager |
| `position` | Target job position | Software Developer |
| `industry` | Company industry | Information Technology |
| `companyType` | Type of company | Technology Company |
| `location` | Company location | Jaipur, Rajasthan |
| `companyWebsite` | Company website | https://tcs.co.in |

## 🚀 How to Use This File

### Option 1: Direct Import (Recommended)

1. Open your cold email automation app
2. Go to **Email Lists** page
3. Click **Upload CSV** or **Import Contacts**
4. Select `jaipur-hr-contacts.csv`
5. Map the columns (should auto-detect)
6. Click **Import**

### Option 2: Customize Before Import

If you want to personalize the data:

1. Open `jaipur-hr-contacts.csv` in Excel or Google Sheets
2. Modify columns as needed:
   - Update `position` if targeting different roles
   - Update `hrName` with actual names (if you have them)
   - Add custom columns for template variables
3. Save as CSV
4. Import into the application

## ✏️ Customization Tips

### Adding Your Information

Add these columns for better personalization:

```csv
candidateName,candidateEmail,candidatePhone,linkedinUrl,skills,experience
John Doe,john@example.com,+91-9876543210,linkedin.com/in/johndoe,Python|React|Node.js,3 years
```

### Targeting Specific Roles

Change the `position` column based on your target role:
- Full Stack Developer
- Frontend Developer
- Backend Developer
- React Native Developer
- Python Developer
- Java Developer
- DevOps Engineer
- Mobile App Developer

### Company Tiers in Dataset

The 300 contacts include companies from different tiers:

1. **Large National IT** (30 emails): TCS, Wipro, Infosys, HCL, Tech Mahindra, etc.
2. **Mid-Size Established** (80 emails): Metacube, Webkul, Geekyants, Yudiz, etc.
3. **Growing Startups** (100 emails): Various emerging tech companies
4. **Specialized Firms** (90 emails): Web/app development, consulting firms

## 📧 Sample Email Template for This Dataset

Since all contacts are from Jaipur tech companies, use this template structure:

```
Subject: {position} | {experience} Years Experience | Available for {companyName}

Dear {hrName},

I am {candidateName}, a {position} with {experience} years of experience,
currently seeking opportunities in Jaipur's tech ecosystem.

I'm particularly interested in {companyName} because of your presence in 
Jaipur's growing IT sector. I believe my skills in {skills} would be 
valuable to your team.

Key highlights:
• {achievement1}
• {achievement2}
• {achievement3}

My resume is attached for your review. I would love to discuss how I can 
contribute to {companyName}'s success.

Best regards,
{candidateName}
{candidatePhone}
{candidateEmail}
{linkedinUrl}
```

## ⚠️ Important Notes

### Data Accuracy

- Email addresses are extracted from the source document
- Company names are derived from email domains
- HR names are generic (HR Manager, Recruitment Team, etc.)
- **Recommendation**: Research companies before sending and update HR names if possible

### Best Practices

1. **Don't Send to All at Once**: Start with 20-50 emails/day
2. **Personalize**: Research each company and customize your message
3. **Follow Up**: Send follow-ups after 5-7 days to non-responders
4. **Track Results**: Monitor open rates and adjust your approach
5. **Be Professional**: Every email represents your personal brand

### Legal Compliance

- These are business email addresses
- Include unsubscribe link (automatically added by the system)
- Respect opt-out requests immediately
- Follow CAN-SPAM and IT Act guidelines

## 🎯 Recommended Campaign Strategy

### Phase 1: Large Companies (Week 1)
- Target: 30 emails from Tier-1 companies
- Send: 5-10 emails/day
- Template: Professional, emphasize experience

### Phase 2: Mid-Size Companies (Week 2-3)
- Target: 80 emails from Tier-2 companies
- Send: 10-15 emails/day
- Template: Highlight skills and cultural fit

### Phase 3: Startups & Specialized (Week 4-5)
- Target: Remaining 190 emails
- Send: 15-20 emails/day
- Template: Emphasize adaptability and learning

### Follow-Up Strategy

- **Day 5-7**: First follow-up to non-openers
- **Day 12-14**: Second follow-up (final)
- **Track**: Which companies show interest
- **Adjust**: Refine templates based on response rates

## 📊 Expected Results

Based on industry averages for cold email job applications:

- **Open Rate**: 20-30%
- **Response Rate**: 2-5%
- **Interview Rate**: 1-3%
- **Expected Responses**: 6-15 responses from 300 emails
- **Expected Interviews**: 3-9 interviews

## 🔄 Updating the Dataset

To get the latest emails or add more companies:

1. Edit `docs/jaipur-500-hr-emails.md` with new emails
2. Run: `node scripts/convert_md_to_csv.js`
3. New CSV will be generated with updated contacts

## 💡 Pro Tips

1. **Timing**: Send emails Tuesday-Thursday, 9-11 AM IST
2. **Subject Lines**: Keep under 50 characters, be specific
3. **Email Length**: Under 150 words for cold emails
4. **Attachments**: Always attach resume as PDF (max 2MB)
5. **Links**: Include LinkedIn profile in signature
6. **Follow-ups**: Change subject line slightly for follow-ups
7. **A/B Testing**: Try 2-3 different templates and compare results

## 📞 Support

For issues or questions:
- Check the main documentation: `JOB_HUNTING_GUIDE.md`
- Review template samples: `docs/EMAIL_TEMPLATES_SAMPLES.md`
- Original source: `docs/jaipur-500-hr-emails.md`

---

**Good luck with your Jaipur tech job search! 🚀**

*Last Updated: November 11, 2025*
