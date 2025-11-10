import { db } from '@/db';
import { campaigns } from '@/db/schema';

async function main() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
    const twentyFiveDaysAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysInFuture = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const sampleCampaigns = [
        {
            userId: 1,
            name: 'Q1 Tech Startups Outreach',
            subject: 'Helping startups scale with automation',
            status: 'active',
            scheduledAt: null,
            startedAt: sevenDaysAgo.toISOString(),
            completedAt: null,
            totalEmails: 30,
            sentEmails: 15,
            openedEmails: 8,
            clickedEmails: 3,
            repliedEmails: 2,
            bouncedEmails: 1,
            createdAt: tenDaysAgo.toISOString(),
            updatedAt: oneHourAgo.toISOString(),
        },
        {
            userId: 1,
            name: 'Marketing Directors Campaign',
            subject: 'Boost your marketing ROI by 40%',
            status: 'completed',
            scheduledAt: null,
            startedAt: twentyDaysAgo.toISOString(),
            completedAt: fiveDaysAgo.toISOString(),
            totalEmails: 50,
            sentEmails: 50,
            openedEmails: 28,
            clickedEmails: 12,
            repliedEmails: 7,
            bouncedEmails: 2,
            createdAt: twentyFiveDaysAgo.toISOString(),
            updatedAt: fiveDaysAgo.toISOString(),
        },
        {
            userId: 2,
            name: 'SaaS Founders Product Demo Campaign',
            subject: 'See how {{product_name}} can transform your workflow',
            status: 'draft',
            scheduledAt: threeDaysInFuture.toISOString(),
            startedAt: null,
            completedAt: null,
            totalEmails: 25,
            sentEmails: 0,
            openedEmails: 0,
            clickedEmails: 0,
            repliedEmails: 0,
            bouncedEmails: 0,
            createdAt: threeDaysAgo.toISOString(),
            updatedAt: oneDayAgo.toISOString(),
        }
    ];

    await db.insert(campaigns).values(sampleCampaigns);
    
    console.log('✅ Campaigns seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});