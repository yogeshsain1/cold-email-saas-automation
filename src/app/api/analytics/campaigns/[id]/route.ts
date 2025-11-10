import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns, emails, emailMetrics } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    // Validate ID
    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const campaignId = parseInt(id);

    // Fetch campaign data with user scope
    const campaign = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)))
      .limit(1);

    if (campaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    const campaignData = campaign[0];

    // Calculate basic metrics from campaign data
    const totalEmails = campaignData.totalEmails || 0;
    const sentEmails = campaignData.sentEmails || 0;
    const openedEmails = campaignData.openedEmails || 0;
    const clickedEmails = campaignData.clickedEmails || 0;
    const repliedEmails = campaignData.repliedEmails || 0;
    const bouncedEmails = campaignData.bouncedEmails || 0;

    // Calculate rates (handle division by zero)
    const openRate = sentEmails > 0 
      ? Math.round((openedEmails / sentEmails) * 100 * 100) / 100 
      : 0;
    const clickRate = sentEmails > 0 
      ? Math.round((clickedEmails / sentEmails) * 100 * 100) / 100 
      : 0;
    const replyRate = sentEmails > 0 
      ? Math.round((repliedEmails / sentEmails) * 100 * 100) / 100 
      : 0;
    const bounceRate = sentEmails > 0 
      ? Math.round((bouncedEmails / sentEmails) * 100 * 100) / 100 
      : 0;

    // Get email breakdown by status
    const emailsByStatusQuery = await db
      .select({
        status: emails.status,
        count: sql<number>`count(*)`,
      })
      .from(emails)
      .where(eq(emails.campaignId, campaignId))
      .groupBy(emails.status);

    // Initialize status counts
    const emailsByStatus = {
      pending: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      failed: 0,
    };

    // Populate status counts from query results
    emailsByStatusQuery.forEach((row) => {
      const status = row.status as keyof typeof emailsByStatus;
      if (status in emailsByStatus) {
        emailsByStatus[status] = Number(row.count);
      }
    });

    // Get recent email metrics (last 10 events)
    const recentEventsQuery = await db
      .select({
        id: emailMetrics.id,
        emailId: emailMetrics.emailId,
        eventType: emailMetrics.eventType,
        eventData: emailMetrics.eventData,
        ipAddress: emailMetrics.ipAddress,
        userAgent: emailMetrics.userAgent,
        createdAt: emailMetrics.createdAt,
      })
      .from(emailMetrics)
      .innerJoin(emails, eq(emailMetrics.emailId, emails.id))
      .where(eq(emails.campaignId, campaignId))
      .orderBy(desc(emailMetrics.createdAt))
      .limit(10);

    // Build analytics response
    const analytics = {
      campaign: campaignData,
      metrics: {
        totalEmails,
        sentEmails,
        openedEmails,
        clickedEmails,
        repliedEmails,
        bouncedEmails,
        openRate,
        clickRate,
        replyRate,
        bounceRate,
      },
      emailsByStatus,
      recentEvents: recentEventsQuery,
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('GET campaign analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}