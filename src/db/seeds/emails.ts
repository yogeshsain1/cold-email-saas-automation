import { db } from '@/db';
import { emails } from '@/db/schema';

async function main() {
    const now = new Date();
    
    // Helper function to create date offsets
    const daysAgo = (days: number, hours: number = 0, minutes: number = 0) => {
        const date = new Date(now);
        date.setDate(date.getDate() - days);
        date.setHours(date.getHours() - hours);
        date.setMinutes(date.getMinutes() - minutes);
        return date.toISOString();
    };

    // Helper function to add minutes to a timestamp
    const addMinutes = (timestamp: string, minutes: number) => {
        const date = new Date(timestamp);
        date.setMinutes(date.getMinutes() + minutes);
        return date.toISOString();
    };

    // Helper function to add hours to a timestamp
    const addHours = (timestamp: string, hours: number) => {
        const date = new Date(timestamp);
        date.setHours(date.getHours() + hours);
        return date.toISOString();
    };

    // Sample HTML content templates
    const coldOutreachHtml = (firstName: string, company: string) => `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Boost Your Marketing ROI by 40%</h2>
                    <p>Hi ${firstName},</p>
                    <p>I noticed ${company} is growing rapidly, and I wanted to reach out with something that could significantly impact your bottom line.</p>
                    <p>Our email automation platform has helped companies like yours increase their marketing ROI by an average of 40% within the first 90 days.</p>
                    <p>Here's what makes us different:</p>
                    <ul>
                        <li>AI-powered personalization at scale</li>
                        <li>Advanced analytics and A/B testing</li>
                        <li>Seamless CRM integration</li>
                        <li>24/7 expert support</li>
                    </ul>
                    <p><a href="https://example.com/schedule-demo" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Schedule a Free Demo</a></p>
                    <p>Would you be open to a quick 15-minute call next week?</p>
                    <p>Best regards,<br>Sarah Johnson<br>Customer Success Manager</p>
                </div>
            </body>
        </html>
    `;

    const enterpriseHtml = (firstName: string, company: string) => `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #059669;">Helping Startups Scale with Automation</h2>
                    <p>Hi ${firstName},</p>
                    <p>I've been following ${company}'s journey and I'm impressed by what you're building.</p>
                    <p>As startups scale, email marketing often becomes a bottleneck. We've helped over 500 startups automate their outreach while maintaining that personal touch.</p>
                    <p>Key benefits for growing teams:</p>
                    <ul>
                        <li>Save 20+ hours per week on email campaigns</li>
                        <li>3x higher response rates with AI personalization</li>
                        <li>Built-in compliance and deliverability tools</li>
                        <li>Dedicated onboarding and support</li>
                    </ul>
                    <p><a href="https://example.com/enterprise-demo" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px;">See It In Action</a></p>
                    <p>Happy to share case studies from similar companies in your space.</p>
                    <p>Best,<br>Michael Chen<br>Enterprise Solutions</p>
                </div>
            </body>
        </html>
    `;

    // Campaign 2 (COMPLETED) - 50 emails
    const campaign2Emails = [];

    // 28 opened emails
    for (let i = 0; i < 28; i++) {
        const contactId = i + 1;
        const sentAt = daysAgo(20 - Math.floor(i / 3), Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        const deliveredAt = addMinutes(sentAt, Math.floor(Math.random() * 5) + 1);
        const openedAt = addHours(deliveredAt, Math.floor(Math.random() * 48) + 1);
        
        campaign2Emails.push({
            campaignId: 2,
            contactId: contactId,
            templateId: i % 2 === 0 ? 1 : 2,
            recipientEmail: `contact${contactId}@company${contactId}.com`,
            subject: i % 3 === 0 
                ? 'Boost your marketing ROI by 40%' 
                : i % 3 === 1 
                ? 'Increase your marketing ROI by 40%' 
                : 'Transform your marketing ROI by 40%',
            htmlContent: coldOutreachHtml(`Contact${contactId}`, `Company${contactId}`),
            status: 'opened',
            sentAt: sentAt,
            deliveredAt: deliveredAt,
            openedAt: openedAt,
            clickedAt: null,
            errorMessage: null,
            createdAt: sentAt,
            updatedAt: openedAt,
        });
    }

    // 12 clicked emails
    for (let i = 28; i < 40; i++) {
        const contactId = i + 1;
        const sentAt = daysAgo(20 - Math.floor((i - 28) / 2), Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        const deliveredAt = addMinutes(sentAt, Math.floor(Math.random() * 5) + 1);
        const openedAt = addHours(deliveredAt, Math.floor(Math.random() * 48) + 1);
        const clickedAt = addHours(openedAt, Math.floor(Math.random() * 24) + 1);
        
        campaign2Emails.push({
            campaignId: 2,
            contactId: contactId,
            templateId: i % 2 === 0 ? 1 : 2,
            recipientEmail: `contact${contactId}@company${contactId}.com`,
            subject: i % 2 === 0 
                ? 'Boost your marketing ROI by 40%' 
                : 'Double your marketing efficiency today',
            htmlContent: coldOutreachHtml(`Contact${contactId}`, `Company${contactId}`),
            status: 'clicked',
            sentAt: sentAt,
            deliveredAt: deliveredAt,
            openedAt: openedAt,
            clickedAt: clickedAt,
            errorMessage: null,
            createdAt: sentAt,
            updatedAt: clickedAt,
        });
    }

    // 7 replied emails
    for (let i = 40; i < 47; i++) {
        const contactId = i + 1;
        const sentAt = daysAgo(20 - Math.floor((i - 40) / 2), Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        const deliveredAt = addMinutes(sentAt, Math.floor(Math.random() * 5) + 1);
        const openedAt = addHours(deliveredAt, Math.floor(Math.random() * 24) + 1);
        const clickedAt = addHours(openedAt, Math.floor(Math.random() * 12) + 1);
        
        campaign2Emails.push({
            campaignId: 2,
            contactId: contactId,
            templateId: i % 2 === 0 ? 1 : 2,
            recipientEmail: `contact${contactId}@company${contactId}.com`,
            subject: 'Boost your marketing ROI by 40%',
            htmlContent: coldOutreachHtml(`Contact${contactId}`, `Company${contactId}`),
            status: 'replied',
            sentAt: sentAt,
            deliveredAt: deliveredAt,
            openedAt: openedAt,
            clickedAt: clickedAt,
            errorMessage: null,
            createdAt: sentAt,
            updatedAt: clickedAt,
        });
    }

    // 2 bounced emails
    for (let i = 47; i < 49; i++) {
        const contactId = i + 1;
        const sentAt = daysAgo(20, Math.floor(Math.random() * 4), Math.floor(Math.random() * 60));
        
        campaign2Emails.push({
            campaignId: 2,
            contactId: contactId,
            templateId: i % 2 === 0 ? 1 : 2,
            recipientEmail: `contact${contactId}@company${contactId}.com`,
            subject: 'Boost your marketing ROI by 40%',
            htmlContent: coldOutreachHtml(`Contact${contactId}`, `Company${contactId}`),
            status: 'bounced',
            sentAt: sentAt,
            deliveredAt: null,
            openedAt: null,
            clickedAt: null,
            errorMessage: 'Mailbox does not exist',
            createdAt: sentAt,
            updatedAt: sentAt,
        });
    }

    // 1 failed email
    const failedContactId = 50;
    const failedSentAt = daysAgo(20, 2, 30);
    campaign2Emails.push({
        campaignId: 2,
        contactId: failedContactId,
        templateId: 1,
        recipientEmail: `contact${failedContactId}@company${failedContactId}.com`,
        subject: 'Boost your marketing ROI by 40%',
        htmlContent: coldOutreachHtml(`Contact${failedContactId}`, `Company${failedContactId}`),
        status: 'failed',
        sentAt: null,
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        errorMessage: 'SMTP error: Invalid recipient',
        createdAt: failedSentAt,
        updatedAt: failedSentAt,
    });

    // Campaign 1 (ACTIVE) - 15 emails
    const campaign1Emails = [];

    // 8 opened emails
    for (let i = 0; i < 8; i++) {
        const contactId = i + 51;
        const sentAt = daysAgo(7 - i, Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        const deliveredAt = addMinutes(sentAt, Math.floor(Math.random() * 5) + 1);
        const openedAt = addHours(deliveredAt, Math.floor(Math.random() * 48) + 1);
        
        campaign1Emails.push({
            campaignId: 1,
            contactId: contactId,
            templateId: 3,
            recipientEmail: `contact${contactId}@startup${contactId}.com`,
            subject: i % 3 === 0 
                ? 'Helping startups scale with automation' 
                : i % 3 === 1 
                ? 'Scale your startup with smart automation' 
                : 'Automation solutions for growing startups',
            htmlContent: enterpriseHtml(`Contact${contactId}`, `Startup${contactId}`),
            status: 'opened',
            sentAt: sentAt,
            deliveredAt: deliveredAt,
            openedAt: openedAt,
            clickedAt: null,
            errorMessage: null,
            createdAt: sentAt,
            updatedAt: openedAt,
        });
    }

    // 3 clicked emails
    for (let i = 8; i < 11; i++) {
        const contactId = i + 51;
        const sentAt = daysAgo(7 - Math.floor(i / 2), Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        const deliveredAt = addMinutes(sentAt, Math.floor(Math.random() * 5) + 1);
        const openedAt = addHours(deliveredAt, Math.floor(Math.random() * 36) + 1);
        const clickedAt = addHours(openedAt, Math.floor(Math.random() * 24) + 1);
        
        campaign1Emails.push({
            campaignId: 1,
            contactId: contactId,
            templateId: 3,
            recipientEmail: `contact${contactId}@startup${contactId}.com`,
            subject: 'Helping startups scale with automation',
            htmlContent: enterpriseHtml(`Contact${contactId}`, `Startup${contactId}`),
            status: 'clicked',
            sentAt: sentAt,
            deliveredAt: deliveredAt,
            openedAt: openedAt,
            clickedAt: clickedAt,
            errorMessage: null,
            createdAt: sentAt,
            updatedAt: clickedAt,
        });
    }

    // 2 replied emails
    for (let i = 11; i < 13; i++) {
        const contactId = i + 51;
        const sentAt = daysAgo(6 - (i - 11), Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
        const deliveredAt = addMinutes(sentAt, Math.floor(Math.random() * 5) + 1);
        const openedAt = addHours(deliveredAt, Math.floor(Math.random() * 24) + 1);
        const clickedAt = addHours(openedAt, Math.floor(Math.random() * 12) + 1);
        
        campaign1Emails.push({
            campaignId: 1,
            contactId: contactId,
            templateId: 3,
            recipientEmail: `contact${contactId}@startup${contactId}.com`,
            subject: 'Helping startups scale with automation',
            htmlContent: enterpriseHtml(`Contact${contactId}`, `Startup${contactId}`),
            status: 'replied',
            sentAt: sentAt,
            deliveredAt: deliveredAt,
            openedAt: openedAt,
            clickedAt: clickedAt,
            errorMessage: null,
            createdAt: sentAt,
            updatedAt: clickedAt,
        });
    }

    // 1 bounced email
    const bouncedContactId = 64;
    const bouncedSentAt = daysAgo(5, 3, 15);
    campaign1Emails.push({
        campaignId: 1,
        contactId: bouncedContactId,
        templateId: 3,
        recipientEmail: `contact${bouncedContactId}@startup${bouncedContactId}.com`,
        subject: 'Helping startups scale with automation',
        htmlContent: enterpriseHtml(`Contact${bouncedContactId}`, `Startup${bouncedContactId}`),
        status: 'bounced',
        sentAt: bouncedSentAt,
        deliveredAt: null,
        openedAt: null,
        clickedAt: null,
        errorMessage: 'User mailbox unavailable',
        createdAt: bouncedSentAt,
        updatedAt: bouncedSentAt,
    });

    // 1 sent email (not yet opened)
    const sentContactId = 65;
    const sentTimestamp = daysAgo(1, 8, 30);
    const deliveredTimestamp = addMinutes(sentTimestamp, 3);
    campaign1Emails.push({
        campaignId: 1,
        contactId: sentContactId,
        templateId: 3,
        recipientEmail: `contact${sentContactId}@startup${sentContactId}.com`,
        subject: 'Helping startups scale with automation',
        htmlContent: enterpriseHtml(`Contact${sentContactId}`, `Startup${sentContactId}`),
        status: 'sent',
        sentAt: sentTimestamp,
        deliveredAt: deliveredTimestamp,
        openedAt: null,
        clickedAt: null,
        errorMessage: null,
        createdAt: sentTimestamp,
        updatedAt: deliveredTimestamp,
    });

    // Combine all emails
    const allEmails = [...campaign2Emails, ...campaign1Emails];

    await db.insert(emails).values(allEmails);
    
    console.log('✅ Emails seeder completed successfully');
    console.log(`   - Campaign 2: 50 emails (28 opened, 12 clicked, 7 replied, 2 bounced, 1 failed)`);
    console.log(`   - Campaign 1: 15 emails (8 opened, 3 clicked, 2 replied, 1 bounced, 1 sent)`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});