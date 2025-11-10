import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// In-memory storage for drafts (use database in production)
const drafts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, draftId, data } = body;

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
      }, { status: 400 });
    }

    const key = `draft_${userId}_${draftId || 'default'}`;
    
    // Store draft
    drafts.set(key, {
      ...data,
      savedAt: new Date().toISOString(),
    });

    logger.info('Draft saved', { userId, draftId });

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    logger.error('Error saving draft', error as Error);
    return NextResponse.json({
      error: 'Failed to save draft',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const draftId = searchParams.get('draftId');

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
      }, { status: 400 });
    }

    const key = `draft_${userId}_${draftId || 'default'}`;
    const draft = drafts.get(key);

    if (!draft) {
      return NextResponse.json({
        draft: null,
      }, { status: 200 });
    }

    return NextResponse.json({
      draft,
    }, { status: 200 });
  } catch (error) {
    logger.error('Error loading draft', error as Error);
    return NextResponse.json({
      error: 'Failed to load draft',
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const draftId = searchParams.get('draftId');

    if (!userId) {
      return NextResponse.json({
        error: 'userId is required',
      }, { status: 400 });
    }

    const key = `draft_${userId}_${draftId || 'default'}`;
    drafts.delete(key);

    logger.info('Draft deleted', { userId, draftId });

    return NextResponse.json({
      success: true,
    }, { status: 200 });
  } catch (error) {
    logger.error('Error deleting draft', error as Error);
    return NextResponse.json({
      error: 'Failed to delete draft',
    }, { status: 500 });
  }
}
