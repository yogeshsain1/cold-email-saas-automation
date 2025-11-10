import axios, { AxiosInstance } from 'axios';

export interface N8NConfig {
  apiUrl: string;
  apiKey: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  startedAt: string;
  stoppedAt?: string;
  data?: any;
  error?: string;
}

export interface WorkflowTriggerData {
  campaignId: number;
  emailListId: number;
  templateId: number;
  emailData?: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    [key: string]: any;
  }>;
  sendRate?: number;
}

/**
 * Create N8N API client
 */
export function createN8NClient(config: N8NConfig): AxiosInstance {
  return axios.create({
    baseURL: config.apiUrl,
    headers: {
      'X-N8N-API-KEY': config.apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });
}

/**
 * List available workflows
 */
export async function listWorkflows(client: AxiosInstance): Promise<any[]> {
  try {
    const response = await client.get('/workflows');
    return response.data.data || response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to list workflows: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get workflow by ID
 */
export async function getWorkflow(client: AxiosInstance, workflowId: string): Promise<any> {
  try {
    const response = await client.get(`/workflows/${workflowId}`);
    return response.data.data || response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get workflow: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Execute workflow with data
 */
export async function executeWorkflow(
  client: AxiosInstance,
  workflowId: string,
  data: WorkflowTriggerData
): Promise<{ executionId: string; status: string }> {
  try {
    const response = await client.post(`/workflows/${workflowId}/execute`, data);
    
    return {
      executionId: response.data.data?.executionId || response.data.executionId,
      status: response.data.data?.status || response.data.status || 'running',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to execute workflow: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Get execution status
 */
export async function getExecutionStatus(
  client: AxiosInstance,
  executionId: string
): Promise<WorkflowExecution> {
  try {
    const response = await client.get(`/executions/${executionId}`);
    const execution = response.data.data || response.data;

    return {
      id: execution.id,
      workflowId: execution.workflowId,
      status: execution.finished ? (execution.error ? 'error' : 'success') : 'running',
      startedAt: execution.startedAt,
      stoppedAt: execution.stoppedAt,
      data: execution.data,
      error: execution.error?.message || execution.error,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get execution status: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Poll execution until completion with exponential backoff
 */
export async function pollExecution(
  client: AxiosInstance,
  executionId: string,
  maxAttempts: number = 60,
  onProgress?: (status: WorkflowExecution) => void
): Promise<WorkflowExecution> {
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    const status = await getExecutionStatus(client, executionId);
    
    if (onProgress) {
      onProgress(status);
    }

    if (status.status === 'success' || status.status === 'error') {
      return status;
    }

    // Exponential backoff: 2s, 4s, 8s, then stay at 8s
    const delay = Math.min(Math.pow(2, attempt + 1), 8) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    attempt++;
  }

  throw new Error('Execution polling timeout');
}

/**
 * Send webhook to N8N
 */
export async function sendWebhook(
  webhookUrl: string,
  data: any
): Promise<{ success: boolean; response?: any }> {
  try {
    const response = await axios.post(webhookUrl, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    return {
      success: true,
      response: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Webhook failed: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * List recent executions for a workflow
 */
export async function listExecutions(
  client: AxiosInstance,
  workflowId: string,
  limit: number = 10
): Promise<WorkflowExecution[]> {
  try {
    const response = await client.get(`/executions`, {
      params: {
        workflowId,
        limit,
      },
    });

    const executions = response.data.data || response.data || [];
    
    return executions.map((exec: any) => ({
      id: exec.id,
      workflowId: exec.workflowId,
      status: exec.finished ? (exec.error ? 'error' : 'success') : 'running',
      startedAt: exec.startedAt,
      stoppedAt: exec.stoppedAt,
      error: exec.error?.message,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to list executions: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Test N8N connection
 */
export async function testConnection(config: N8NConfig): Promise<boolean> {
  try {
    const client = createN8NClient(config);
    await listWorkflows(client);
    return true;
  } catch (error) {
    return false;
  }
}
