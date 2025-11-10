import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emailContacts, emailLists } from '@/db/schema';
import { eq, like, and, or, desc, sql } from 'drizzle-orm';

function isValidEmail(email: string): boolean {
  return email.includes('@') && email.length > 3;
}

function validateContactData(contact: any): { valid: boolean; error?: string } {
  if (!contact.email || typeof contact.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }

  const trimmedEmail = contact.email.trim();
  if (!isValidEmail(trimmedEmail)) {
    return { valid: false, error: `Invalid email format: ${trimmedEmail}` };
  }

  if (contact.firstName && typeof contact.firstName !== 'string') {
    return { valid: false, error: 'firstName must be a string' };
  }

  if (contact.lastName && typeof contact.lastName !== 'string') {
    return { valid: false, error: 'lastName must be a string' };
  }

  if (contact.company && typeof contact.company !== 'string') {
    return { valid: false, error: 'company must be a string' };
  }

  if (contact.position && typeof contact.position !== 'string') {
    return { valid: false, error: 'position must be a string' };
  }

  if (contact.customFields !== undefined) {
    if (typeof contact.customFields !== 'object' || Array.isArray(contact.customFields)) {
      return { valid: false, error: 'customFields must be a valid JSON object' };
    }
  }

  return { valid: true };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listId = params.id;

    if (!listId || isNaN(parseInt(listId))) {
      return NextResponse.json(
        { error: 'Valid list ID is required', code: 'INVALID_LIST_ID' },
        { status: 400 }
      );
    }

    const listIdInt = parseInt(listId);

    const existingList = await db
      .select()
      .from(emailLists)
      .where(eq(emailLists.id, listIdInt))
      .limit(1);

    if (existingList.length === 0) {
      return NextResponse.json(
        { error: 'Email list not found', code: 'LIST_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const contactsArray = Array.isArray(body) ? body : [body];

    if (contactsArray.length === 0) {
      return NextResponse.json(
        { error: 'At least one contact is required', code: 'NO_CONTACTS_PROVIDED' },
        { status: 400 }
      );
    }

    const validatedContacts = [];
    for (let i = 0; i < contactsArray.length; i++) {
      const contact = contactsArray[i];
      const validation = validateContactData(contact);

      if (!validation.valid) {
        return NextResponse.json(
          {
            error: `Contact at index ${i}: ${validation.error}`,
            code: 'VALIDATION_ERROR',
          },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();

      validatedContacts.push({
        listId: listIdInt,
        email: contact.email.trim().toLowerCase(),
        firstName: contact.firstName ? contact.firstName.trim() : null,
        lastName: contact.lastName ? contact.lastName.trim() : null,
        company: contact.company ? contact.company.trim() : null,
        position: contact.position ? contact.position.trim() : null,
        customFields: contact.customFields ? JSON.stringify(contact.customFields) : null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    const createdContacts = await db
      .insert(emailContacts)
      .values(validatedContacts)
      .returning();

    await db
      .update(emailLists)
      .set({
        totalContacts: sql`${emailLists.totalContacts} + ${createdContacts.length}`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(emailLists.id, listIdInt));

    const formattedContacts = createdContacts.map((contact) => ({
      ...contact,
      customFields: contact.customFields ? JSON.parse(contact.customFields) : null,
    }));

    return NextResponse.json(formattedContacts, { status: 201 });
  } catch (error: any) {
    console.error('POST contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listId = params.id;

    if (!listId || isNaN(parseInt(listId))) {
      return NextResponse.json(
        { error: 'Valid list ID is required', code: 'INVALID_LIST_ID' },
        { status: 400 }
      );
    }

    const listIdInt = parseInt(listId);

    const existingList = await db
      .select()
      .from(emailLists)
      .where(eq(emailLists.id, listIdInt))
      .limit(1);

    if (existingList.length === 0) {
      return NextResponse.json(
        { error: 'Email list not found', code: 'LIST_NOT_FOUND' },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '10'),
      100
    );
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');

    let query = db.select().from(emailContacts).$dynamic();

    const conditions = [eq(emailContacts.listId, listIdInt)];

    if (search) {
      const searchCondition = or(
        like(emailContacts.email, `%${search}%`),
        like(emailContacts.firstName, `%${search}%`),
        like(emailContacts.lastName, `%${search}%`),
        like(emailContacts.company, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      conditions.push(eq(emailContacts.isActive, isActiveValue));
    }

    query = query.where(and(...conditions));

    const results = await query
      .orderBy(desc(emailContacts.createdAt))
      .limit(limit)
      .offset(offset);

    const formattedResults = results.map((contact) => ({
      ...contact,
      customFields: contact.customFields ? JSON.parse(contact.customFields) : null,
    }));

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error: any) {
    console.error('GET contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}