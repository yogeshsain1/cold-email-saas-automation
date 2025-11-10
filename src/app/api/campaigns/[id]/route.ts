import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const campaign = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, user.id)))
      .limit(1);

    if (campaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign[0], { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, user.id)))
      .limit(1);

    if (existingCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    const validStatuses = ['draft', 'scheduled', 'active', 'paused', 'completed'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    const metricFields = [
      'totalEmails',
      'sentEmails',
      'openedEmails',
      'clickedEmails',
      'repliedEmails',
      'bouncedEmails',
    ];

    for (const field of metricFields) {
      if (field in body) {
        const value = parseInt(body[field]);
        if (isNaN(value) || value < 0) {
          return NextResponse.json(
            {
              error: `${field} must be a non-negative integer`,
              code: 'INVALID_METRIC',
            },
            { status: 400 }
          );
        }
      }
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }

    if (body.subject !== undefined) {
      updates.subject = body.subject.trim();
    }

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.scheduledAt !== undefined) {
      updates.scheduledAt = body.scheduledAt;
    }

    if (body.startedAt !== undefined) {
      updates.startedAt = body.startedAt;
    }

    if (body.completedAt !== undefined) {
      updates.completedAt = body.completedAt;
    }

    for (const field of metricFields) {
      if (body[field] !== undefined) {
        updates[field] = parseInt(body[field]);
      }
    }

    const updated = await db
      .update(campaigns)
      .set(updates)
      .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, user.id)))
      .limit(1);

    if (existingCampaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(campaigns)
      .where(and(eq(campaigns.id, parseInt(id)), eq(campaigns.userId, user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found', code: 'CAMPAIGN_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Campaign deleted successfully',
        id: deleted[0].id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}