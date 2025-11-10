/**
 * Structured logging utility
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  private formatEntry(entry: LogEntry): string {
    return JSON.stringify(entry, null, 2);
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createEntry(LogLevel.DEBUG, message, context);
    console.debug(this.formatEntry(entry));
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createEntry(LogLevel.INFO, message, context);
    console.info(this.formatEntry(entry));
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createEntry(LogLevel.WARN, message, context);
    console.warn(this.formatEntry(entry));
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.createEntry(LogLevel.ERROR, message, context, error);
    console.error(this.formatEntry(entry));
    
    // Send to error tracking service here (e.g., Sentry)
    // this.sendToErrorTracking(entry);
  }

  // Helper methods for common scenarios
  apiRequest(method: string, path: string, userId?: string): void {
    this.info('API Request', {
      method,
      path,
      userId,
    });
  }

  apiError(method: string, path: string, error: Error, userId?: string): void {
    this.error('API Error', error, {
      method,
      path,
      userId,
    });
  }

  emailSent(campaignId: number, recipientEmail: string, success: boolean): void {
    this.info('Email Sent', {
      campaignId,
      recipientEmail,
      success,
    });
  }

  emailFailed(campaignId: number, recipientEmail: string, error: string): void {
    this.error('Email Failed', new Error(error), {
      campaignId,
      recipientEmail,
    });
  }

  databaseQuery(query: string, duration: number, success: boolean): void {
    this.debug('Database Query', {
      query: query.slice(0, 100), // Truncate long queries
      duration,
      success,
    });
  }
}

// Export singleton instance
export const logger = new Logger(
  process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
);
