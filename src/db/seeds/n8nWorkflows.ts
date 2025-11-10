import { db } from '@/db';
import { n8nWorkflows } from '@/db/schema';

async function main() {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const sampleWorkflows = [
        {
            userId: 1,
            campaignId: 1,
            workflowId: 'wf_auto_followup_001',
            workflowName: 'Automatic Follow-up Sequence',
            webhookUrl: 'https://n8n.example.com/webhook/followup-automation',
            isActive: true,
            config: JSON.stringify({
                trigger: 'no_response_48h',
                followupDelay: 48,
                maxFollowups: 3,
                templates: [4, 5, 6],
                stopOnReply: true,
                workingHours: {
                    start: 9,
                    end: 17,
                    timezone: 'America/New_York'
                }
            }),
            createdAt: fifteenDaysAgo.toISOString(),
            updatedAt: twoDaysAgo.toISOString(),
        },
        {
            userId: 1,
            campaignId: null,
            workflowId: 'wf_lead_scoring_002',
            workflowName: 'Lead Scoring & Qualification',
            webhookUrl: 'https://n8n.example.com/webhook/lead-scoring',
            isActive: true,
            config: JSON.stringify({
                scoring: {
                    email_opened: 5,
                    link_clicked: 10,
                    replied: 25,
                    demo_booked: 50
                },
                qualificationThreshold: 40,
                actions: {
                    qualified: 'notify_sales',
                    hot_lead: 'immediate_alert'
                },
                integrations: ['slack', 'salesforce']
            }),
            createdAt: tenDaysAgo.toISOString(),
            updatedAt: oneDayAgo.toISOString(),
        }
    ];

    await db.insert(n8nWorkflows).values(sampleWorkflows);
    
    console.log('✅ N8N Workflows seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});