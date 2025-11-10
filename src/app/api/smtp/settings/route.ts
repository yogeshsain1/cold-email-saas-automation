import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { smtpSettings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Helper function to mask password in response
function maskPassword(setting: any) {
  return {
    ...setting,
    password: '********'
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const isDefault = searchParams.get('isDefault');
    const isActive = searchParams.get('isActive');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const setting = await db
        .select()
        .from(smtpSettings)
        .where(eq(smtpSettings.id, parseInt(id)))
        .limit(1);

      if (setting.length === 0) {
        return NextResponse.json(
          { error: 'SMTP setting not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(maskPassword(setting[0]), { status: 200 });
    }

    // Build query with filters
    let conditions = [];

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(smtpSettings.userId, parseInt(userId)));
    }

    if (isDefault !== null && isDefault !== undefined) {
      conditions.push(eq(smtpSettings.isDefault, isDefault === 'true'));
    }

    if (isActive !== null && isActive !== undefined) {
      conditions.push(eq(smtpSettings.isActive, isActive === 'true'));
    }

    let query = db.select().from(smtpSettings);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;

    // Mask passwords in all results
    const maskedResults = results.map(maskPassword);

    return NextResponse.json(maskedResults, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      provider,
      host,
      port,
      username,
      password,
      fromEmail,
      fromName,
      isDefault,
      isActive
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!provider || typeof provider !== 'string' || !provider.trim()) {
      return NextResponse.json(
        { error: 'provider is required', code: 'MISSING_PROVIDER' },
        { status: 400 }
      );
    }

    if (!host || typeof host !== 'string' || !host.trim()) {
      return NextResponse.json(
        { error: 'host is required', code: 'MISSING_HOST' },
        { status: 400 }
      );
    }

    if (!port) {
      return NextResponse.json(
        { error: 'port is required', code: 'MISSING_PORT' },
        { status: 400 }
      );
    }

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { error: 'username is required', code: 'MISSING_USERNAME' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        { error: 'password is required', code: 'MISSING_PASSWORD' },
        { status: 400 }
      );
    }

    if (!fromEmail || typeof fromEmail !== 'string' || !fromEmail.trim()) {
      return NextResponse.json(
        { error: 'fromEmail is required', code: 'MISSING_FROM_EMAIL' },
        { status: 400 }
      );
    }

    if (!fromName || typeof fromName !== 'string' || !fromName.trim()) {
      return NextResponse.json(
        { error: 'fromName is required', code: 'MISSING_FROM_NAME' },
        { status: 400 }
      );
    }

    // Validate userId is valid integer
    if (isNaN(parseInt(userId.toString()))) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Validate port is valid integer
    const portNumber = parseInt(port.toString());
    if (isNaN(portNumber)) {
      return NextResponse.json(
        { error: 'port must be a valid integer', code: 'INVALID_PORT' },
        { status: 400 }
      );
    }

    // Validate fromEmail format (basic check for @ symbol)
    const trimmedFromEmail = fromEmail.trim();
    if (!trimmedFromEmail.includes('@')) {
      return NextResponse.json(
        { error: 'fromEmail must be a valid email address', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedProvider = provider.trim();
    const sanitizedHost = host.trim();
    const sanitizedUsername = username.trim();
    const sanitizedPassword = password.trim();
    const sanitizedFromEmail = trimmedFromEmail.toLowerCase();
    const sanitizedFromName = fromName.trim();

    const finalIsDefault = isDefault === true || isDefault === 'true';
    const finalIsActive = isActive === false || isActive === 'false' ? false : true;

    const now = new Date().toISOString();

    // Business logic: if isDefault=true, set all other SMTP settings for this userId to isDefault=false
    if (finalIsDefault) {
      await db
        .update(smtpSettings)
        .set({ isDefault: false, updatedAt: now })
        .where(eq(smtpSettings.userId, parseInt(userId.toString())));
    }

    // Create new SMTP setting
    const newSetting = await db
      .insert(smtpSettings)
      .values({
        userId: parseInt(userId.toString()),
        provider: sanitizedProvider,
        host: sanitizedHost,
        port: portNumber,
        username: sanitizedUsername,
        password: sanitizedPassword,
        fromEmail: sanitizedFromEmail,
        fromName: sanitizedFromName,
        isDefault: finalIsDefault,
        isActive: finalIsActive,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Return created setting with masked password
    return NextResponse.json(maskPassword(newSetting[0]), { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}