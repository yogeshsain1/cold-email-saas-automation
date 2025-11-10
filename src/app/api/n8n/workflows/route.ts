import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createN8NClient, listWorkflows, executeWorkflow } from '@/lib/n8n-service';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const n8nApiUrl = process.env.N8N_API_URL;
    const n8nApiKey = process.env.N8N_API_KEY;

    if (!n8nApiUrl || !n8nApiKey) {
      return NextResponse.json(
        { error: 'N8N not configured', code: 'N8N_NOT_CONFIGURED' },
        { status: 400 }
      );
    }

    const client = createN8NClient({
      apiUrl: n8nApiUrl,
      apiKey: n8nApiKey,
    });

    const workflows = await listWorkflows(client);

    return NextResponse.json(workflows, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch workflows: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'FETCH_FAILED',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workflowId, data } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required', code: 'MISSING_WORKFLOW_ID' },
        { status: 400 }
      );
    }

    const n8nApiUrl = process.env.N8N_API_URL;
    const n8nApiKey = process.env.N8N_API_KEY;

    if (!n8nApiUrl || !n8nApiKey) {
      return NextResponse.json(
        { error: 'N8N not configured', code: 'N8N_NOT_CONFIGURED' },
        { status: 400 }
      );
    }

    const client = createN8NClient({
      apiUrl: n8nApiUrl,
      apiKey: n8nApiKey,
    });

    const result = await executeWorkflow(client, workflowId, data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute workflow: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'EXECUTION_FAILED',
      },
      { status: 500 }
    );
  }
}