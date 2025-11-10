/**
 * Standardized API response helpers
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: Record<string, any>
): Response {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
): Response {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  // Client errors (4xx)
  badRequest: (message: string = 'Bad request', details?: any) =>
    createErrorResponse('BAD_REQUEST', message, 400, details),

  unauthorized: (message: string = 'Unauthorized') =>
    createErrorResponse('UNAUTHORIZED', message, 401),

  forbidden: (message: string = 'Forbidden') =>
    createErrorResponse('FORBIDDEN', message, 403),

  notFound: (resource: string = 'Resource') =>
    createErrorResponse('NOT_FOUND', `${resource} not found`, 404),

  conflict: (message: string = 'Resource already exists') =>
    createErrorResponse('CONFLICT', message, 409),

  validationError: (details: any) =>
    createErrorResponse('VALIDATION_ERROR', 'Validation failed', 422, details),

  rateLimitExceeded: (resetTime: number) =>
    createErrorResponse(
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again later.',
      429,
      { resetTime }
    ),

  // Server errors (5xx)
  internalError: (message: string = 'Internal server error') =>
    createErrorResponse('INTERNAL_ERROR', message, 500),

  serviceUnavailable: (message: string = 'Service temporarily unavailable') =>
    createErrorResponse('SERVICE_UNAVAILABLE', message, 503),
};

/**
 * Wrap API handler with error catching
 */
export function withErrorHandling(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);
      
      // Log error to monitoring service here
      
      return ErrorResponses.internalError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  };
}
