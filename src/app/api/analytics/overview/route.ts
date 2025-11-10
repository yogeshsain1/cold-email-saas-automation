import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns, emailLists, emailContacts, emailTemplates, emails } from '@/db/schema';
import { eq, count, sum, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');

    // Validate userId if provided
    let userId: number | null = null;
    if (userIdParam) {
      const parsedUserId = parseInt(userIdParam);
      if (isNaN(parsedUserId)) {
        return NextResponse.json(
          { error: 'Invalid userId parameter', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      userId = parsedUserId;
    }

    // Build where condition for userId filtering
    const userFilter = userId !== null;

    // Calculate total campaigns
    const campaignsQuery = userFilter
      ? db.select({ count: count() }).from(campaigns).where(eq(campaigns.userId, userId!))
      : db.select({ count: count() }).from(campaigns);
    const totalCampaignsResult = await campaignsQuery;
    const totalCampaigns = totalCampaignsResult[0]?.count || 0;

    // Calculate active campaigns
    const activeCampaignsQuery = userFilter
      ? db
          .select({ count: count() })
          .from(campaigns)
          .where(and(eq(campaigns.userId, userId!), eq(campaigns.status, 'active')))
      : db.select({ count: count() }).from(campaigns).where(eq(campaigns.status, 'active'));
    const activeCampaignsResult = await activeCampaignsQuery;
    const activeCampaigns = activeCampaignsResult[0]?.count || 0;

    // Calculate email statistics from campaigns
    const campaignStatsQuery = userFilter
      ? db
          .select({
            totalSent: sum(campaigns.sentEmails),
            totalOpened: sum(campaigns.openedEmails),
            totalClicked: sum(campaigns.clickedEmails),
          })
          .from(campaigns)
          .where(eq(campaigns.userId, userId!))
      : db.select({
          totalSent: sum(campaigns.sentEmails),
          totalOpened: sum(campaigns.openedEmails),
          totalClicked: sum(campaigns.clickedEmails),
        }).from(campaigns);

    const campaignStatsResult = await campaignStatsQuery;
    const totalEmailsSent = Number(campaignStatsResult[0]?.totalSent) || 0;
    const totalEmailsOpened = Number(campaignStatsResult[0]?.totalOpened) || 0;
    const totalEmailsClicked = Number(campaignStatsResult[0]?.totalClicked) || 0;

    // Calculate average rates
    const averageOpenRate = totalEmailsSent > 0 
      ? Math.round((totalEmailsOpened / totalEmailsSent) * 100 * 100) / 100
      : 0;
    const averageClickRate = totalEmailsSent > 0
      ? Math.round((totalEmailsClicked / totalEmailsSent) * 100 * 100) / 100
      : 0;

    // Calculate total email lists
    const emailListsQuery = userFilter
      ? db.select({ count: count() }).from(emailLists).where(eq(emailLists.userId, userId!))
      : db.select({ count: count() }).from(emailLists);
    const totalEmailListsResult = await emailListsQuery;
    const totalEmailLists = totalEmailListsResult[0]?.count || 0;

    // Calculate total contacts from emailLists
    const totalContactsQuery = userFilter
      ? db
          .select({ total: sum(emailLists.totalContacts) })
          .from(emailLists)
          .where(eq(emailLists.userId, userId!))
      : db.select({ total: sum(emailLists.totalContacts) }).from(emailLists);
    const totalContactsResult = await totalContactsQuery;
    const totalContacts = Number(totalContactsResult[0]?.total) || 0;

    // Calculate active contacts from emailContacts
    let activeContactsQuery;
    if (userFilter) {
      activeContactsQuery = db
        .select({ count: count() })
        .from(emailContacts)
        .innerJoin(emailLists, eq(emailContacts.listId, emailLists.id))
        .where(and(eq(emailLists.userId, userId!), eq(emailContacts.isActive, true)));
    } else {
      activeContactsQuery = db
        .select({ count: count() })
        .from(emailContacts)
        .where(eq(emailContacts.isActive, true));
    }
    const activeContactsResult = await activeContactsQuery;
    const activeContacts = activeContactsResult[0]?.count || 0;

    // Calculate total templates
    const templatesQuery = userFilter
      ? db.select({ count: count() }).from(emailTemplates).where(eq(emailTemplates.userId, userId!))
      : db.select({ count: count() }).from(emailTemplates);
    const totalTemplatesResult = await templatesQuery;
    const totalTemplates = totalTemplatesResult[0]?.count || 0;

    // Get recent campaigns
    const recentCampaignsQuery = userFilter
      ? db
          .select()
          .from(campaigns)
          .where(eq(campaigns.userId, userId!))
          .orderBy(desc(campaigns.createdAt))
          .limit(5)
      : db.select().from(campaigns).orderBy(desc(campaigns.createdAt)).limit(5);
    const recentCampaigns = await recentCampaignsQuery;

    // Build and return overview object
    const overview = {
      totalCampaigns,
      activeCampaigns,
      totalEmailsSent,
      totalEmailsOpened,
      totalEmailsClicked,
      averageOpenRate,
      averageClickRate,
      totalEmailLists,
      totalContacts,
      activeContacts,
      totalTemplates,
      recentCampaigns,
    };

    return NextResponse.json(overview, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}