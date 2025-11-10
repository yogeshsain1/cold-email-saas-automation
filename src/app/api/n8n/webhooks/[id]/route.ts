import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { n8nWorkflows, emailMetrics } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate workflow ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid workflow ID is required',
          code: 'INVALID_WORKFLOW_ID'
        },
        { status: 400 }
      );
    }

    const workflowId = parseInt(id);

    // Check if workflow exists
    const workflow = await db
      .select()
      .from(n8nWorkflows)
      .where(eq(n8nWorkflows.id, workflowId))
      .limit(1);

    if (workflow.length === 0) {
      return NextResponse.json(
        {
          error: 'Workflow not found',
          code: 'WORKFLOW_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if workflow is active
    if (!workflow[0].isActive) {
      return NextResponse.json(
        {
          error: 'Workflow is not active',
          code: 'WORKFLOW_INACTIVE'
        },
        { status: 400 }
      );
    }

    // Parse webhook payload
    const payload = await request.json();

    // Extract optional fields from payload
    const { eventType, emailId, eventData, metadata, ...rest } = payload;

    // Extract IP address and user agent from headers
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      null;
    const userAgent = request.headers.get('user-agent') || null;

    // If emailId and eventType are provided, create emailMetrics entry
    if (emailId && eventType) {
      // Prepare event data - combine eventData field with rest of payload
      const fullEventData = {
        ...eventData,
        ...rest,
        metadata,
        timestamp: new Date().toISOString()
      };

      await db.insert(emailMetrics).values({
        emailId: parseInt(emailId),
        eventType,
        eventData: JSON.stringify(fullEventData),
        ipAddress,
        userAgent,
        createdAt: new Date().toISOString()
      });
    }

    // Log webhook data
    console.log('Webhook received:', {
      workflowId,
      eventType: eventType || 'unknown',
      eventData: payload,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        workflowId: workflowId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}