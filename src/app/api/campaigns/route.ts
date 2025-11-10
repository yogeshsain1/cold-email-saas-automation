import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { campaigns } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

const VALID_STATUSES = ['draft', 'scheduled', 'active', 'paused', 'completed'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record fetch by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const campaign = await db.select()
        .from(campaigns)
        .where(eq(campaigns.id, parseInt(id)))
        .limit(1);

      if (campaign.length === 0) {
        return NextResponse.json({ 
          error: 'Campaign not found',
          code: "CAMPAIGN_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(campaign[0], { status: 200 });
    }

    // Build query with filters
    let query = db.select().from(campaigns);
    const conditions = [];

    // Filter by userId
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(campaigns.userId, parseInt(userId)));
    }

    // Filter by status
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ 
          error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      conditions.push(eq(campaigns.status, status));
    }

    // Search in name and subject
    if (search) {
      const searchCondition = or(
        like(campaigns.name, `%${search}%`),
        like(campaigns.subject, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply pagination and sorting
    const results = await query
      .orderBy(desc(campaigns.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      name, 
      subject, 
      status = 'draft',
      scheduledAt,
      totalEmails = 0,
      sentEmails = 0,
      openedEmails = 0,
      clickedEmails = 0,
      repliedEmails = 0,
      bouncedEmails = 0
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (typeof userId !== 'number' || isNaN(userId)) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json({ 
        error: "subject is required and must be a non-empty string",
        code: "MISSING_SUBJECT" 
      }, { status: 400 });
    }

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate metric fields are non-negative integers
    const metrics = { totalEmails, sentEmails, openedEmails, clickedEmails, repliedEmails, bouncedEmails };
    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value !== 'number' || value < 0 || !Number.isInteger(value)) {
        return NextResponse.json({ 
          error: `${key} must be a non-negative integer`,
          code: "INVALID_METRIC" 
        }, { status: 400 });
      }
    }

    // Validate scheduledAt if provided
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json({ 
          error: "scheduledAt must be a valid ISO date string",
          code: "INVALID_SCHEDULED_AT" 
        }, { status: 400 });
      }
    }

    // Create campaign
    const now = new Date().toISOString();
    const newCampaign = await db.insert(campaigns)
      .values({
        userId,
        name: name.trim(),
        subject: subject.trim(),
        status,
        scheduledAt: scheduledAt || null,
        startedAt: null,
        completedAt: null,
        totalEmails,
        sentEmails,
        openedEmails,
        clickedEmails,
        repliedEmails,
        bouncedEmails,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newCampaign[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if campaign exists
    const existing = await db.select()
      .from(campaigns)
      .where(eq(campaigns.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Campaign not found',
        code: "CAMPAIGN_NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and prepare updates
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return NextResponse.json({ 
          error: "name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if (body.subject !== undefined) {
      if (typeof body.subject !== 'string' || body.subject.trim().length === 0) {
        return NextResponse.json({ 
          error: "subject must be a non-empty string",
          code: "INVALID_SUBJECT" 
        }, { status: 400 });
      }
      updates.subject = body.subject.trim();
    }

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ 
          error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      updates.status = body.status;
    }

    // Validate date fields
    const dateFields = ['scheduledAt', 'startedAt', 'completedAt'];
    for (const field of dateFields) {
      if (body[field] !== undefined) {
        if (body[field] === null) {
          updates[field] = null;
        } else {
          const date = new Date(body[field]);
          if (isNaN(date.getTime())) {
            return NextResponse.json({ 
              error: `${field} must be a valid ISO date string or null`,
              code: "INVALID_DATE" 
            }, { status: 400 });
          }
          updates[field] = body[field];
        }
      }
    }

    // Validate metric fields
    const metricFields = ['totalEmails', 'sentEmails', 'openedEmails', 'clickedEmails', 'repliedEmails', 'bouncedEmails'];
    for (const field of metricFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== 'number' || body[field] < 0 || !Number.isInteger(body[field])) {
          return NextResponse.json({ 
            error: `${field} must be a non-negative integer`,
            code: "INVALID_METRIC" 
          }, { status: 400 });
        }
        updates[field] = body[field];
      }
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db.update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if campaign exists
    const existing = await db.select()
      .from(campaigns)
      .where(eq(campaigns.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Campaign not found',
        code: "CAMPAIGN_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(campaigns)
      .where(eq(campaigns.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Campaign deleted successfully',
      campaign: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}