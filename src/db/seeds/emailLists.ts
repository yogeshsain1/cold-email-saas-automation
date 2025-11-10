import { db } from '@/db';
import { emailLists } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleEmailLists = [
        {
            userId: 1,
            name: 'Tech Startups Q1',
            description: 'Early-stage technology startups for Q1 outreach campaign',
            totalContacts: 0,
            createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 1,
            name: 'Marketing Leads',
            description: 'Marketing decision-makers from mid-size companies',
            totalContacts: 0,
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 1,
            name: 'Enterprise Prospects',
            description: 'Large enterprise contacts for product demos',
            totalContacts: 0,
            createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 2,
            name: 'SaaS Founders',
            description: 'B2B SaaS company founders',
            totalContacts: 0,
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 2,
            name: 'Product Managers',
            description: 'Product management professionals',
            totalContacts: 0,
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(emailLists).values(sampleEmailLists);
    
    console.log('✅ Email lists seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});