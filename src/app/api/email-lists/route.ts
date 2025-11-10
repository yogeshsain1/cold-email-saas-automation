import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emailLists } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(emailLists)
        .where(eq(emailLists.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Email list not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(emailLists);
    const conditions = [];

    // Filter by userId
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(emailLists.userId, parseInt(userId)));
    }

    // Search in name and description
    if (search) {
      const searchTerm = search.trim();
      conditions.push(
        or(
          like(emailLists.name, `%${searchTerm}%`),
          like(emailLists.description, `%${searchTerm}%`)
        )
      );
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(emailLists.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ 
        error: "name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    // Validate userId is a valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "userId must be a valid integer",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedDescription = description ? description.trim() : null;

    // Validate name is not empty after trimming
    if (!sanitizedName) {
      return NextResponse.json({ 
        error: "name cannot be empty",
        code: "EMPTY_NAME" 
      }, { status: 400 });
    }

    // Create new email list
    const timestamp = new Date().toISOString();
    const newEmailList = await db.insert(emailLists)
      .values({
        userId: parseInt(userId),
        name: sanitizedName,
        description: sanitizedDescription,
        totalContacts: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      .returning();

    return NextResponse.json(newEmailList[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(emailLists)
      .where(eq(emailLists.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Email list not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, totalContacts } = body;

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) {
      const sanitizedName = name.trim();
      if (!sanitizedName) {
        return NextResponse.json({ 
          error: "name cannot be empty",
          code: "EMPTY_NAME" 
        }, { status: 400 });
      }
      updates.name = sanitizedName;
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : null;
    }

    if (totalContacts !== undefined) {
      const contactCount = parseInt(totalContacts);
      if (isNaN(contactCount) || contactCount < 0) {
        return NextResponse.json({ 
          error: "totalContacts must be a non-negative integer",
          code: "INVALID_TOTAL_CONTACTS" 
        }, { status: 400 });
      }
      updates.totalContacts = contactCount;
    }

    // Update the record
    const updatedRecord = await db.update(emailLists)
      .set(updates)
      .where(eq(emailLists.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedRecord[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(emailLists)
      .where(eq(emailLists.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Email list not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete the record
    const deleted = await db.delete(emailLists)
      .where(eq(emailLists.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Email list deleted successfully',
      deletedRecord: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}