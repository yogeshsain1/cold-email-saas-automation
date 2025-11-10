import nodemailer from 'nodemailer';

export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PersonalizationData {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  [key: string]: any;
}

/**
 * Personalize email template by replacing {{variables}} with actual data
 */
export function personalizeTemplate(
  template: string,
  data: PersonalizationData,
  fallbacks: Record<string, string> = {}
): string {
  let result = template;
  
  // Replace {{variable}} patterns
  const variablePattern = /\{\{(\w+)\}\}/g;
  result = result.replace(variablePattern, (match, key) => {
    if (data[key] !== undefined && data[key] !== null) {
      return String(data[key]);
    }
    if (fallbacks[key]) {
      return fallbacks[key];
    }
    // Default fallbacks
    const defaultFallbacks: Record<string, string> = {
      firstName: 'there',
      name: 'Valued Customer',
      company: 'your company',
    };
    return defaultFallbacks[key] || match;
  });

  return result;
}

/**
 * Add compliance footer with unsubscribe link and physical address
 */
export function addComplianceFooter(html: string, campaignId: number, recipientEmail: string): string {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?campaign=${campaignId}&email=${encodeURIComponent(recipientEmail)}`;
  
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0 0 10px 0;">
        You received this email because you signed up for our mailing list.
      </p>
      <p style="margin: 0 0 10px 0;">
        <a href="${unsubscribeUrl}" style="color: #2563eb; text-decoration: underline;">Unsubscribe from this list</a>
      </p>
      <p style="margin: 0;">
        © ${new Date().getFullYear()} Your Company Name. All rights reserved.<br>
        123 Business Street, Suite 100, City, State 12345, USA
      </p>
    </div>
  `;

  // Insert before closing body tag, or append if no body tag
  if (html.includes('</body>')) {
    return html.replace('</body>', `${footer}</body>`);
  }
  return html + footer;
}

/**
 * Create SMTP transporter with configuration
 */
export async function createTransporter(config: SMTPConfig) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.username,
      pass: config.password,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  // Verify connection
  try {
    await transporter.verify();
    return transporter;
  } catch (error) {
    throw new Error(`SMTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Send single email with retry logic
 */
export async function sendEmail(
  transporter: nodemailer.Transporter,
  emailData: EmailData,
  fromConfig: { email: string; name: string },
  maxRetries: number = 3
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"${fromConfig.name}" <${fromConfig.email}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      lastError = error as Error;
      
      // Exponential backoff: 2s, 4s, 8s
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Unknown error',
  };
}

/**
 * Send bulk emails with rate limiting
 */
export async function sendBulkEmails(
  transporter: nodemailer.Transporter,
  emails: EmailData[],
  fromConfig: { email: string; name: string },
  rateLimit: number = 300, // emails per hour
  onProgress?: (sent: number, total: number) => void
): Promise<{
  sent: number;
  failed: number;
  results: Array<{ email: string; success: boolean; error?: string }>;
}> {
  const results: Array<{ email: string; success: boolean; error?: string }> = [];
  let sent = 0;
  let failed = 0;

  // Calculate delay between emails to respect rate limit
  const delayMs = (3600 * 1000) / rateLimit;

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    
    const result = await sendEmail(transporter, email, fromConfig);
    
    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    results.push({
      email: email.to,
      success: result.success,
      error: result.error,
    });

    if (onProgress) {
      onProgress(i + 1, emails.length);
    }

    // Rate limiting delay (except for last email)
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return { sent, failed, results };
}

/**
 * Extract variables from template
 */
export function extractTemplateVariables(template: string): string[] {
  const variablePattern = /\{\{(\w+)\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * Validate email address
 */
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
