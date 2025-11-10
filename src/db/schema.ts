import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Campaigns table
export const campaigns = sqliteTable('campaigns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull().default('draft'),
  scheduledAt: text('scheduled_at'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  totalEmails: integer('total_emails').notNull().default(0),
  sentEmails: integer('sent_emails').notNull().default(0),
  openedEmails: integer('opened_emails').notNull().default(0),
  clickedEmails: integer('clicked_emails').notNull().default(0),
  repliedEmails: integer('replied_emails').notNull().default(0),
  bouncedEmails: integer('bounced_emails').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// EmailLists table
export const emailLists = sqliteTable('email_lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  totalContacts: integer('total_contacts').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// EmailContacts table
export const emailContacts = sqliteTable('email_contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  listId: integer('list_id').notNull().references(() => emailLists.id),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  company: text('company'),
  position: text('position'),
  customFields: text('custom_fields', { mode: 'json' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// EmailTemplates table
export const emailTemplates = sqliteTable('email_templates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  htmlContent: text('html_content').notNull(),
  textContent: text('text_content'),
  variables: text('variables', { mode: 'json' }),
  category: text('category'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Emails table
export const emails = sqliteTable('emails', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  campaignId: integer('campaign_id').notNull().references(() => campaigns.id),
  contactId: integer('contact_id').notNull().references(() => emailContacts.id),
  templateId: integer('template_id').references(() => emailTemplates.id),
  recipientEmail: text('recipient_email').notNull(),
  subject: text('subject').notNull(),
  htmlContent: text('html_content').notNull(),
  status: text('status').notNull().default('pending'),
  sentAt: text('sent_at'),
  deliveredAt: text('delivered_at'),
  openedAt: text('opened_at'),
  clickedAt: text('clicked_at'),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// N8NWorkflows table
export const n8nWorkflows = sqliteTable('n8n_workflows', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  workflowId: text('workflow_id').notNull(),
  workflowName: text('workflow_name').notNull(),
  webhookUrl: text('webhook_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  config: text('config', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// EmailMetrics table
export const emailMetrics = sqliteTable('email_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  emailId: integer('email_id').notNull().references(() => emails.id),
  eventType: text('event_type').notNull(),
  eventData: text('event_data', { mode: 'json' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').notNull(),
});

// SMTPSettings table
export const smtpSettings = sqliteTable('smtp_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  provider: text('provider').notNull(),
  host: text('host').notNull(),
  port: integer('port').notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  fromEmail: text('from_email').notNull(),
  fromName: text('from_name').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});