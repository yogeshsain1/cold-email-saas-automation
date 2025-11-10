import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns, emailContacts, emailTemplates, smtpSettings, emails } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import {
  createTransporter,
  personalizeTemplate,
  addComplianceFooter,
  sendBulkEmails,
  type SMTPConfig,
} from '@/lib/email-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = params;
    const campaignId = parseInt(id);

    if (isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { emailListId, templateId, rateLimit = 300 } = body;

    // Validate required fields
    if (!emailListId || !templateId) {
      return NextResponse.json(
        { error: 'emailListId and templateId are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Get campaign
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)))
      .limit(1);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get email template
    const [template] = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.id, templateId))
      .limit(1);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get SMTP settings
    const [smtp] = await db
      .select()
      .from(smtpSettings)
      .where(and(eq(smtpSettings.userId, user.id), eq(smtpSettings.isDefault, true)))
      .limit(1);

    if (!smtp) {
      return NextResponse.json(
        { error: 'SMTP settings not configured', code: 'SMTP_NOT_CONFIGURED' },
        { status: 400 }
      );
    }

    // Get contacts from email list
    const contacts = await db
      .select()
      .from(emailContacts)
      .where(and(eq(emailContacts.listId, emailListId), eq(emailContacts.isActive, true)));

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: 'No active contacts in email list', code: 'NO_CONTACTS' },
        { status: 400 }
      );
    }

    // Create SMTP transporter
    const smtpConfig: SMTPConfig = {
      host: smtp.host,
      port: smtp.port,
      username: smtp.username,
      password: smtp.password,
      fromEmail: smtp.fromEmail,
      fromName: smtp.fromName,
    };

    const transporter = await createTransporter(smtpConfig);

    // Update campaign status
    await db
      .update(campaigns)
      .set({
        status: 'active',
        totalEmails: contacts.length,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(campaigns.id, campaignId));

    // Prepare emails with personalization
    const emailsToSend = contacts.map((contact) => {
      const personalizationData = {
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        company: contact.company || '',
        email: contact.email,
        ...((contact.customFields as any) || {}),
      };

      let personalizedHtml = personalizeTemplate(template.htmlContent, personalizationData);
      personalizedHtml = addComplianceFooter(personalizedHtml, campaignId, contact.email);

      const personalizedSubject = personalizeTemplate(campaign.subject, personalizationData);

      return {
        to: contact.email,
        subject: personalizedSubject,
        html: personalizedHtml,
        contactId: contact.id,
      };
    });

    // Send emails in background (don't await)
    (async () => {
      const results = await sendBulkEmails(
        transporter,
        emailsToSend.map(e => ({ to: e.to, subject: e.subject, html: e.html })),
        { email: smtp.fromEmail, name: smtp.fromName },
        rateLimit,
        async (sent, total) => {
          // Update progress
          await db
            .update(campaigns)
            .set({
              sentEmails: sent,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(campaigns.id, campaignId));
        }
      );

      // Save email records
      const timestamp = new Date().toISOString();
      const emailRecords = results.results.map((result, idx) => ({
        campaignId,
        contactId: emailsToSend[idx].contactId,
        templateId,
        recipientEmail: result.email,
        subject: emailsToSend[idx].subject,
        htmlContent: emailsToSend[idx].html,
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? timestamp : null,
        errorMessage: result.error || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      }));

      await db.insert(emails).values(emailRecords);

      // Update final campaign status
      await db
        .update(campaigns)
        .set({
          status: 'completed',
          sentEmails: results.sent,
          bouncedEmails: results.failed,
          completedAt: timestamp,
          updatedAt: timestamp,
        })
        .where(eq(campaigns.id, campaignId));
    })();

    return NextResponse.json(
      {
        message: 'Email sending started',
        campaignId,
        totalContacts: contacts.length,
        estimatedTime: Math.ceil((contacts.length / rateLimit) * 60),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
