import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    const hashedPassword = await bcrypt.hash('password123', 10);

    const sampleUsers = [
        {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedPassword,
            createdAt: thirtyDaysAgo.toISOString(),
            updatedAt: thirtyDaysAgo.toISOString(),
        },
        {
            email: 'user@example.com',
            name: 'Regular User',
            password: hashedPassword,
            createdAt: twentyDaysAgo.toISOString(),
            updatedAt: twentyDaysAgo.toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});