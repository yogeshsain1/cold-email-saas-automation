import { db } from '@/db';
import { smtpSettings } from '@/db/schema';

async function main() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    const sampleSmtpSettings = [
        {
            userId: 1,
            provider: 'SendGrid',
            host: 'smtp.sendgrid.net',
            port: 587,
            username: 'apikey',
            password: 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            fromEmail: 'admin@example.com',
            fromName: 'Admin User',
            isDefault: true,
            isActive: true,
            createdAt: thirtyDaysAgo.toISOString(),
            updatedAt: thirtyDaysAgo.toISOString(),
        },
        {
            userId: 2,
            provider: 'Mailgun',
            host: 'smtp.mailgun.org',
            port: 587,
            username: 'postmaster@sandbox.mailgun.org',
            password: 'mg_api_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            fromEmail: 'user@example.com',
            fromName: 'Regular User',
            isDefault: true,
            isActive: true,
            createdAt: twentyDaysAgo.toISOString(),
            updatedAt: twentyDaysAgo.toISOString(),
        },
    ];

    await db.insert(smtpSettings).values(sampleSmtpSettings);
    
    console.log('✅ SMTP settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});