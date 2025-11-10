import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emailTemplates } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');
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

      const template = await db.select()
        .from(emailTemplates)
        .where(eq(emailTemplates.id, parseInt(id)))
        .limit(1);

      if (template.length === 0) {
        return NextResponse.json({ 
          error: 'Template not found',
          code: "TEMPLATE_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(template[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(emailTemplates);
    const conditions = [];

    // Filter by userId
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(emailTemplates.userId, parseInt(userId)));
    }

    // Filter by category
    if (category) {
      conditions.push(eq(emailTemplates.category, category));
    }

    // Filter by isPublic
    if (isPublic !== null) {
      const isPublicBool = isPublic === 'true';
      conditions.push(eq(emailTemplates.isPublic, isPublicBool));
    }

    // Search across name, subject, category
    if (search) {
      const searchCondition = or(
        like(emailTemplates.name, `%${search}%`),
        like(emailTemplates.subject, `%${search}%`),
        like(emailTemplates.category, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(emailTemplates.createdAt))
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
    const { userId, name, subject, htmlContent, textContent, variables, category, isPublic } = body;

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

    if (!subject) {
      return NextResponse.json({ 
        error: "subject is required",
        code: "MISSING_SUBJECT" 
      }, { status: 400 });
    }

    if (!htmlContent) {
      return NextResponse.json({ 
        error: "htmlContent is required",
        code: "MISSING_HTML_CONTENT" 
      }, { status: 400 });
    }

    // Validate userId is a valid integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt)) {
      return NextResponse.json({ 
        error: "userId must be a valid integer",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Validate variables is valid JSON if provided
    let parsedVariables = null;
    if (variables) {
      try {
        if (typeof variables === 'string') {
          parsedVariables = JSON.parse(variables);
        } else {
          parsedVariables = variables;
        }
      } catch (e) {
        return NextResponse.json({ 
          error: "variables must be valid JSON",
          code: "INVALID_VARIABLES_JSON" 
        }, { status: 400 });
      }
    }

    // Sanitize string inputs
    const sanitizedName = name.trim();
    const sanitizedSubject = subject.trim();
    const sanitizedHtmlContent = htmlContent.trim();
    const sanitizedTextContent = textContent ? textContent.trim() : null;
    const sanitizedCategory = category ? category.trim() : null;

    // Prepare insert data with defaults
    const now = new Date().toISOString();
    const insertData: any = {
      userId: userIdInt,
      name: sanitizedName,
      subject: sanitizedSubject,
      htmlContent: sanitizedHtmlContent,
      textContent: sanitizedTextContent,
      variables: parsedVariables ? JSON.stringify(parsedVariables) : null,
      category: sanitizedCategory,
      isPublic: isPublic !== undefined ? Boolean(isPublic) : false,
      usageCount: 0,
      createdAt: now,
      updatedAt: now
    };

    // Insert and return the created template
    const newTemplate = await db.insert(emailTemplates)
      .values(insertData)
      .returning();

    return NextResponse.json(newTemplate[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID is provided and valid
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const templateId = parseInt(id);
    const body = await request.json();

    // Check if template exists
    const existing = await db.select()
      .from(emailTemplates)
      .where(eq(emailTemplates.id, templateId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Template not found',
        code: "TEMPLATE_NOT_FOUND" 
      }, { status: 404 });
    }

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate and add userId if provided
    if (body.userId !== undefined) {
      const userIdInt = parseInt(body.userId);
      if (isNaN(userIdInt)) {
        return NextResponse.json({ 
          error: "userId must be a valid integer",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      updates.userId = userIdInt;
    }

    // Validate and add name if provided
    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }

    // Validate and add subject if provided
    if (body.subject !== undefined) {
      updates.subject = body.subject.trim();
    }

    // Validate and add htmlContent if provided
    if (body.htmlContent !== undefined) {
      updates.htmlContent = body.htmlContent.trim();
    }

    // Validate and add textContent if provided
    if (body.textContent !== undefined) {
      updates.textContent = body.textContent ? body.textContent.trim() : null;
    }

    // Validate and add variables if provided
    if (body.variables !== undefined) {
      try {
        let parsedVariables;
        if (typeof body.variables === 'string') {
          parsedVariables = JSON.parse(body.variables);
        } else {
          parsedVariables = body.variables;
        }
        updates.variables = JSON.stringify(parsedVariables);
      } catch (e) {
        return NextResponse.json({ 
          error: "variables must be valid JSON",
          code: "INVALID_VARIABLES_JSON" 
        }, { status: 400 });
      }
    }

    // Validate and add category if provided
    if (body.category !== undefined) {
      updates.category = body.category ? body.category.trim() : null;
    }

    // Validate and add isPublic if provided
    if (body.isPublic !== undefined) {
      updates.isPublic = Boolean(body.isPublic);
    }

    // Validate and add usageCount if provided
    if (body.usageCount !== undefined) {
      const usageCountInt = parseInt(body.usageCount);
      if (isNaN(usageCountInt) || usageCountInt < 0) {
        return NextResponse.json({ 
          error: "usageCount must be a non-negative integer",
          code: "INVALID_USAGE_COUNT" 
        }, { status: 400 });
      }
      updates.usageCount = usageCountInt;
    }

    // Update and return the updated template
    const updated = await db.update(emailTemplates)
      .set(updates)
      .where(eq(emailTemplates.id, templateId))
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID is provided and valid
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const templateId = parseInt(id);

    // Check if template exists before deleting
    const existing = await db.select()
      .from(emailTemplates)
      .where(eq(emailTemplates.id, templateId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Template not found',
        code: "TEMPLATE_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete and return the deleted template
    const deleted = await db.delete(emailTemplates)
      .where(eq(emailTemplates.id, templateId))
      .returning();

    return NextResponse.json({
      message: 'Template deleted successfully',
      template: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}