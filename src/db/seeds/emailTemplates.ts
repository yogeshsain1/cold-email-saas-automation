import { db } from '@/db';
import { emailTemplates } from '@/db/schema';

async function main() {
    const now = new Date();
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    const sampleTemplates = [
        // Cold Outreach Templates - userId 1
        {
            userId: 1,
            name: 'Tech Startup Introduction',
            subject: 'Quick question about {{company_name}}\'s growth plans',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>I noticed {{company_name}} recently {{achievement}}. Congrats on the milestone!</p>
    
    <p>I'm reaching out because we help companies like yours {{value_proposition}}.</p>
    
    <p>Would you be open to a quick 15-minute call next week?</p>
    
    <p>Best,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

I noticed {{company_name}} recently {{achievement}}. Congrats on the milestone!

I'm reaching out because we help companies like yours {{value_proposition}}.

Would you be open to a quick 15-minute call next week?

Best,
{{sender_name}}`,
            variables: JSON.stringify(['company_name', 'first_name', 'achievement', 'value_proposition', 'sender_name']),
            category: 'Cold Outreach',
            isPublic: false,
            usageCount: 25,
            createdAt: daysAgo(30),
            updatedAt: daysAgo(5),
        },
        {
            userId: 1,
            name: 'B2B SaaS Intro',
            subject: '{{company_name}} + {{our_company}} - Partnership opportunity',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>I've been following {{company_name}}'s journey and I'm impressed with what you've built.</p>
    
    <p>We're {{our_company}}, and we specialize in helping B2B SaaS companies overcome {{pain_point}}.</p>
    
    <p>I think there could be a great partnership opportunity here. Would you be interested in exploring how we could work together?</p>
    
    <p>I'd love to schedule a brief call to discuss this further.</p>
    
    <p>Looking forward to your response,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

I've been following {{company_name}}'s journey and I'm impressed with what you've built.

We're {{our_company}}, and we specialize in helping B2B SaaS companies overcome {{pain_point}}.

I think there could be a great partnership opportunity here. Would you be interested in exploring how we could work together?

I'd love to schedule a brief call to discuss this further.

Looking forward to your response,
{{sender_name}}`,
            variables: JSON.stringify(['company_name', 'our_company', 'first_name', 'pain_point', 'sender_name']),
            category: 'Cold Outreach',
            isPublic: false,
            usageCount: 18,
            createdAt: daysAgo(28),
            updatedAt: daysAgo(8),
        },
        {
            userId: 1,
            name: 'Enterprise Outreach',
            subject: 'Helping {{company_name}} achieve {{goal}}',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Dear {{first_name}},</p>
    
    <p>I understand that {{company_name}} is focused on achieving {{goal}} this quarter.</p>
    
    <p>We recently helped a similar enterprise client achieve remarkable results. {{case_study}}</p>
    
    <p>I'd like to share how we can help {{company_name}} reach your objectives faster and more efficiently.</p>
    
    <p>Would you have 20 minutes next week for a strategic discussion?</p>
    
    <p>Best regards,<br>
    {{sender_name}}<br>
    {{sender_title}}</p>
</body>
</html>`,
            textContent: `Dear {{first_name}},

I understand that {{company_name}} is focused on achieving {{goal}} this quarter.

We recently helped a similar enterprise client achieve remarkable results. {{case_study}}

I'd like to share how we can help {{company_name}} reach your objectives faster and more efficiently.

Would you have 20 minutes next week for a strategic discussion?

Best regards,
{{sender_name}}
{{sender_title}}`,
            variables: JSON.stringify(['company_name', 'first_name', 'goal', 'case_study', 'sender_name', 'sender_title']),
            category: 'Cold Outreach',
            isPublic: false,
            usageCount: 12,
            createdAt: daysAgo(25),
            updatedAt: daysAgo(10),
        },
        // Follow-up Templates - userId 1
        {
            userId: 1,
            name: 'First Follow-up',
            subject: 'Re: {{original_subject}}',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>I wanted to follow up on my previous email about {{company_name}}.</p>
    
    <p>I understand you're busy, but I believe this could be valuable for your team.</p>
    
    <p>Would you have 10 minutes this week for a quick chat?</p>
    
    <p>Best,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

I wanted to follow up on my previous email about {{company_name}}.

I understand you're busy, but I believe this could be valuable for your team.

Would you have 10 minutes this week for a quick chat?

Best,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'original_subject', 'company_name', 'sender_name']),
            category: 'Follow-up',
            isPublic: false,
            usageCount: 42,
            createdAt: daysAgo(20),
            updatedAt: daysAgo(2),
        },
        {
            userId: 1,
            name: 'Second Follow-up',
            subject: 'Circling back - {{topic}}',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>I wanted to circle back one more time about {{topic}}.</p>
    
    <p>I thought you might find this resource helpful: <a href="{{resource_link}}" style="color: #0066cc;">{{resource_link}}</a></p>
    
    <p>If now isn't the right time, I completely understand. Just let me know if you'd like to reconnect in the future.</p>
    
    <p>Thanks,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

I wanted to circle back one more time about {{topic}}.

I thought you might find this resource helpful: {{resource_link}}

If now isn't the right time, I completely understand. Just let me know if you'd like to reconnect in the future.

Thanks,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'topic', 'resource_link', 'sender_name']),
            category: 'Follow-up',
            isPublic: false,
            usageCount: 28,
            createdAt: daysAgo(18),
            updatedAt: daysAgo(4),
        },
        {
            userId: 1,
            name: 'Break-up Email',
            subject: 'Should I close your file?',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>I've reached out a few times about partnering with {{company_name}}, but haven't heard back.</p>
    
    <p>I understand timing might not be right, or perhaps this isn't a priority for you right now.</p>
    
    <p>Should I close your file? Or would you prefer I check back in a few months?</p>
    
    <p>Either way, I appreciate your time.</p>
    
    <p>Best,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

I've reached out a few times about partnering with {{company_name}}, but haven't heard back.

I understand timing might not be right, or perhaps this isn't a priority for you right now.

Should I close your file? Or would you prefer I check back in a few months?

Either way, I appreciate your time.

Best,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'company_name', 'sender_name']),
            category: 'Follow-up',
            isPublic: false,
            usageCount: 15,
            createdAt: daysAgo(15),
            updatedAt: daysAgo(6),
        },
        // Introduction Templates - userId 2
        {
            userId: 2,
            name: 'Warm Introduction',
            subject: '{{introducer_name}} suggested we connect',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>{{introducer_name}} mentioned that we should connect given our mutual interest in {{mutual_connection}}.</p>
    
    <p>I wanted to reach out personally to introduce myself and share how {{value_prop}}.</p>
    
    <p>Would you be open to a brief introductory call next week?</p>
    
    <p>Looking forward to connecting,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

{{introducer_name}} mentioned that we should connect given our mutual interest in {{mutual_connection}}.

I wanted to reach out personally to introduce myself and share how {{value_prop}}.

Would you be open to a brief introductory call next week?

Looking forward to connecting,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'introducer_name', 'mutual_connection', 'value_prop', 'sender_name']),
            category: 'Introduction',
            isPublic: true,
            usageCount: 8,
            createdAt: daysAgo(12),
            updatedAt: daysAgo(3),
        },
        {
            userId: 2,
            name: 'Event Follow-up',
            subject: 'Great meeting you at {{event_name}}',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>It was great meeting you at {{event_name}} yesterday! I really enjoyed our conversation about {{discussion_topic}}.</p>
    
    <p>As promised, I wanted to follow up and continue our discussion.</p>
    
    <p>Would you be available for a coffee chat next week to explore this further?</p>
    
    <p>Best regards,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

It was great meeting you at {{event_name}} yesterday! I really enjoyed our conversation about {{discussion_topic}}.

As promised, I wanted to follow up and continue our discussion.

Would you be available for a coffee chat next week to explore this further?

Best regards,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'event_name', 'discussion_topic', 'sender_name']),
            category: 'Introduction',
            isPublic: true,
            usageCount: 10,
            createdAt: daysAgo(10),
            updatedAt: daysAgo(2),
        },
        // Product Demo Templates - userId 2
        {
            userId: 2,
            name: 'Demo Invitation',
            subject: 'See {{product_name}} in action - {{benefit}}',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>Thank you for your interest in {{product_name}}!</p>
    
    <p>I'd love to show you how {{product_name}} can help you {{benefit}}.</p>
    
    <p>In our 30-minute demo, you'll see:</p>
    <ul style="margin: 15px 0;">
        <li>How {{product_name}} works</li>
        <li>Key features that drive results</li>
        <li>Real customer success stories</li>
        <li>Custom solutions for your use case</li>
    </ul>
    
    <p>Book your preferred time here: <a href="{{calendar_link}}" style="color: #0066cc;">{{calendar_link}}</a></p>
    
    <p>Looking forward to showing you {{product_name}}!</p>
    
    <p>Best,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

Thank you for your interest in {{product_name}}!

I'd love to show you how {{product_name}} can help you {{benefit}}.

In our 30-minute demo, you'll see:
- How {{product_name}} works
- Key features that drive results
- Real customer success stories
- Custom solutions for your use case

Book your preferred time here: {{calendar_link}}

Looking forward to showing you {{product_name}}!

Best,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'product_name', 'benefit', 'calendar_link', 'sender_name']),
            category: 'Product Demo',
            isPublic: false,
            usageCount: 22,
            createdAt: daysAgo(8),
            updatedAt: daysAgo(1),
        },
        {
            userId: 2,
            name: 'Post-Demo Follow-up',
            subject: 'Thanks for checking out {{product_name}}',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hi {{first_name}},</p>
    
    <p>Thank you for taking the time to see {{product_name}} in action on {{demo_date}}!</p>
    
    <p>As discussed, here are the next steps:</p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        {{next_steps}}
    </div>
    
    <p>I've also attached the resources we discussed during the demo.</p>
    
    <p>Do you have any questions or would you like to schedule a follow-up call?</p>
    
    <p>Best regards,<br>
    {{sender_name}}</p>
</body>
</html>`,
            textContent: `Hi {{first_name}},

Thank you for taking the time to see {{product_name}} in action on {{demo_date}}!

As discussed, here are the next steps:

{{next_steps}}

I've also attached the resources we discussed during the demo.

Do you have any questions or would you like to schedule a follow-up call?

Best regards,
{{sender_name}}`,
            variables: JSON.stringify(['first_name', 'product_name', 'demo_date', 'next_steps', 'sender_name']),
            category: 'Product Demo',
            isPublic: false,
            usageCount: 16,
            createdAt: daysAgo(7),
            updatedAt: daysAgo(1),
        },
    ];

    await db.insert(emailTemplates).values(sampleTemplates);
    
    console.log('✅ Email templates seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});