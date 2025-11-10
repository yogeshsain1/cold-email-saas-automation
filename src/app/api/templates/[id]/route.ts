import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emailTemplates } from '@/db/schema';
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

    const template = await db
      .select()
      .from(emailTemplates)
      .where(
        and(
          eq(emailTemplates.id, parseInt(id)),
          eq(emailTemplates.userId, user.id)
        )
      )
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json(
        { error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(template[0], { status: 200 });
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

    const existingTemplate = await db
      .select()
      .from(emailTemplates)
      .where(
        and(
          eq(emailTemplates.id, parseInt(id)),
          eq(emailTemplates.userId, user.id)
        )
      )
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        { error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: any = {};

    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }

    if (body.subject !== undefined) {
      updates.subject = body.subject.trim();
    }

    if (body.htmlContent !== undefined) {
      updates.htmlContent = body.htmlContent.trim();
    }

    if (body.textContent !== undefined) {
      updates.textContent = body.textContent.trim();
    }

    if (body.variables !== undefined) {
      if (typeof body.variables === 'string') {
        try {
          JSON.parse(body.variables);
          updates.variables = body.variables;
        } catch (e) {
          return NextResponse.json(
            {
              error: 'Variables must be valid JSON',
              code: 'INVALID_JSON',
            },
            { status: 400 }
          );
        }
      } else if (typeof body.variables === 'object') {
        try {
          updates.variables = JSON.stringify(body.variables);
        } catch (e) {
          return NextResponse.json(
            {
              error: 'Variables must be valid JSON',
              code: 'INVALID_JSON',
            },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: 'Variables must be valid JSON',
            code: 'INVALID_JSON',
          },
          { status: 400 }
        );
      }
    }

    if (body.category !== undefined) {
      updates.category = body.category.trim();
    }

    if (body.isPublic !== undefined) {
      if (typeof body.isPublic !== 'boolean') {
        return NextResponse.json(
          {
            error: 'isPublic must be a boolean',
            code: 'INVALID_IS_PUBLIC',
          },
          { status: 400 }
        );
      }
      updates.isPublic = body.isPublic ? 1 : 0;
    }

    if (body.usageCount !== undefined) {
      const usageCount = parseInt(body.usageCount);
      if (isNaN(usageCount) || usageCount < 0) {
        return NextResponse.json(
          {
            error: 'usageCount must be a non-negative integer',
            code: 'INVALID_USAGE_COUNT',
          },
          { status: 400 }
        );
      }
      updates.usageCount = usageCount;
    }

    updates.updatedAt = new Date().toISOString();

    const updated = await db
      .update(emailTemplates)
      .set(updates)
      .where(
        and(
          eq(emailTemplates.id, parseInt(id)),
          eq(emailTemplates.userId, user.id)
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
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

    const existingTemplate = await db
      .select()
      .from(emailTemplates)
      .where(
        and(
          eq(emailTemplates.id, parseInt(id)),
          eq(emailTemplates.userId, user.id)
        )
      )
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        { error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(emailTemplates)
      .where(
        and(
          eq(emailTemplates.id, parseInt(id)),
          eq(emailTemplates.userId, user.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Template deleted successfully',
        id: parseInt(id),
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