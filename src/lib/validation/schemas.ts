/**
 * Validation schemas for API requests
 */

export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Password validation
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Campaign validation schema
 */
export function validateCampaign(data: any): ValidationResult {
  const errors: Record<string, string[]> = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.name = ['Campaign name is required'];
  } else if (data.name.trim().length < 3) {
    errors.name = ['Campaign name must be at least 3 characters'];
  } else if (data.name.length > 100) {
    errors.name = ['Campaign name must not exceed 100 characters'];
  }
  
  // Subject validation
  if (!data.subject || typeof data.subject !== 'string') {
    errors.subject = ['Email subject is required'];
  } else if (data.subject.trim().length < 3) {
    errors.subject = ['Email subject must be at least 3 characters'];
  } else if (data.subject.length > 200) {
    errors.subject = ['Email subject must not exceed 200 characters'];
  }
  
  // User ID validation
  if (!data.userId || typeof data.userId !== 'number') {
    errors.userId = ['Valid user ID is required'];
  }
  
  // Status validation
  const validStatuses = ['draft', 'scheduled', 'active', 'paused', 'completed'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = [`Status must be one of: ${validStatuses.join(', ')}`];
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Email list validation schema
 */
export function validateEmailList(data: any): ValidationResult {
  const errors: Record<string, string[]> = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.name = ['List name is required'];
  } else if (data.name.trim().length < 3) {
    errors.name = ['List name must be at least 3 characters'];
  }
  
  // User ID validation
  if (!data.userId || typeof data.userId !== 'number') {
    errors.userId = ['Valid user ID is required'];
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Email template validation schema
 */
export function validateEmailTemplate(data: any): ValidationResult {
  const errors: Record<string, string[]> = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.name = ['Template name is required'];
  } else if (data.name.trim().length < 3) {
    errors.name = ['Template name must be at least 3 characters'];
  }
  
  // Subject validation
  if (!data.subject || typeof data.subject !== 'string') {
    errors.subject = ['Subject is required'];
  }
  
  // HTML content validation
  if (!data.htmlContent || typeof data.htmlContent !== 'string') {
    errors.htmlContent = ['HTML content is required'];
  } else if (data.htmlContent.trim().length < 10) {
    errors.htmlContent = ['HTML content must be at least 10 characters'];
  }
  
  // User ID validation
  if (!data.userId || typeof data.userId !== 'number') {
    errors.userId = ['Valid user ID is required'];
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Pagination validation
 */
export function validatePagination(params: URLSearchParams): {
  limit: number;
  offset: number;
  errors?: string[];
} {
  const errors: string[] = [];
  let limit = parseInt(params.get('limit') || '10');
  let offset = parseInt(params.get('offset') || '0');
  
  if (isNaN(limit) || limit < 1) {
    errors.push('Limit must be a positive number');
    limit = 10;
  }
  
  if (limit > 100) {
    errors.push('Limit cannot exceed 100');
    limit = 100;
  }
  
  if (isNaN(offset) || offset < 0) {
    errors.push('Offset must be a non-negative number');
    offset = 0;
  }
  
  return {
    limit,
    offset,
    errors: errors.length > 0 ? errors : undefined,
  };
}
