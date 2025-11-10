import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emailContacts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, email } = body;

    if (!campaignId || !email) {
      return NextResponse.json(
        { error: 'campaignId and email are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Deactivate contact
    const updated = await db
      .update(emailContacts)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(emailContacts.email, email.toLowerCase()))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Email not found in our system', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed', email },
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
