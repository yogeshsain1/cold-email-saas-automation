import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid campaign ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const campaignId = parseInt(id);

    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)))
      .limit(1);

    if (existingCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    const campaign = existingCampaign[0];

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return NextResponse.json(
        {
          error: 'Campaign must be in draft or scheduled status to launch',
          code: 'INVALID_CAMPAIGN_STATE',
          currentStatus: campaign.status
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const updatedCampaign = await db
      .update(campaigns)
      .set({
        status: 'active',
        startedAt: now,
        updatedAt: now
      })
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, user.id)))
      .returning();

    if (updatedCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Failed to launch campaign', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCampaign[0], { status: 200 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}