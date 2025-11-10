import { db } from '@/db';
import { emailMetrics } from '@/db/schema';

async function main() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  ];

  const ipAddresses = [
    '192.168.1.100',
    '203.0.113.45',
    '198.51.100.78',
    '172.16.254.12',
    '10.0.0.234',
    '8.8.8.8',
    '1.1.1.1',
    '208.67.222.222',
  ];

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Denver, CO',
  ];

  const devices = ['desktop', 'mobile', 'tablet'];

  const sampleMetrics = [
    // Campaign 2 - Opened emails (28 opened emails from ids 1-50)
    {
      emailId: 1,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'San Francisco, CA',
        device: 'desktop',
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-10T09:15:00Z').toISOString(),
    },
    {
      emailId: 2,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[1],
        location: 'New York, NY',
        device: 'desktop',
      }),
      ipAddress: '203.0.113.45',
      userAgent: userAgents[1],
      createdAt: new Date('2024-01-10T10:30:00Z').toISOString(),
    },
    {
      emailId: 3,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[4],
        location: 'Los Angeles, CA',
        device: 'mobile',
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-10T11:45:00Z').toISOString(),
    },
    {
      emailId: 4,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[2],
        location: 'Chicago, IL',
        device: 'desktop',
      }),
      ipAddress: '172.16.254.12',
      userAgent: userAgents[2],
      createdAt: new Date('2024-01-10T13:20:00Z').toISOString(),
    },
    {
      emailId: 5,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[3],
        location: 'Austin, TX',
        device: 'desktop',
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-10T14:10:00Z').toISOString(),
    },
    {
      emailId: 6,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[5],
        location: 'Seattle, WA',
        device: 'mobile',
      }),
      ipAddress: '8.8.8.8',
      userAgent: userAgents[5],
      createdAt: new Date('2024-01-10T15:30:00Z').toISOString(),
    },
    {
      emailId: 7,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'Boston, MA',
        device: 'desktop',
      }),
      ipAddress: '1.1.1.1',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-10T16:45:00Z').toISOString(),
    },
    {
      emailId: 8,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[6],
        location: 'Denver, CO',
        device: 'tablet',
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[6],
      createdAt: new Date('2024-01-11T08:20:00Z').toISOString(),
    },
    {
      emailId: 9,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[1],
        location: 'San Francisco, CA',
        device: 'desktop',
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[1],
      createdAt: new Date('2024-01-11T09:35:00Z').toISOString(),
    },
    {
      emailId: 10,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[4],
        location: 'New York, NY',
        device: 'mobile',
      }),
      ipAddress: '203.0.113.45',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-11T10:50:00Z').toISOString(),
    },
    {
      emailId: 11,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[2],
        location: 'Los Angeles, CA',
        device: 'desktop',
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[2],
      createdAt: new Date('2024-01-11T12:15:00Z').toISOString(),
    },
    {
      emailId: 12,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[3],
        location: 'Chicago, IL',
        device: 'desktop',
      }),
      ipAddress: '172.16.254.12',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-11T13:30:00Z').toISOString(),
    },
    {
      emailId: 13,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'Austin, TX',
        device: 'desktop',
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-11T14:45:00Z').toISOString(),
    },
    {
      emailId: 14,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[5],
        location: 'Seattle, WA',
        device: 'mobile',
      }),
      ipAddress: '8.8.8.8',
      userAgent: userAgents[5],
      createdAt: new Date('2024-01-11T16:00:00Z').toISOString(),
    },
    {
      emailId: 15,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[1],
        location: 'Boston, MA',
        device: 'desktop',
      }),
      ipAddress: '1.1.1.1',
      userAgent: userAgents[1],
      createdAt: new Date('2024-01-12T08:30:00Z').toISOString(),
    },
    {
      emailId: 16,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[6],
        location: 'Denver, CO',
        device: 'tablet',
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[6],
      createdAt: new Date('2024-01-12T09:45:00Z').toISOString(),
    },
    {
      emailId: 17,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[4],
        location: 'San Francisco, CA',
        device: 'mobile',
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-12T11:00:00Z').toISOString(),
    },
    {
      emailId: 18,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[2],
        location: 'New York, NY',
        device: 'desktop',
      }),
      ipAddress: '203.0.113.45',
      userAgent: userAgents[2],
      createdAt: new Date('2024-01-12T12:15:00Z').toISOString(),
    },
    {
      emailId: 19,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'Los Angeles, CA',
        device: 'desktop',
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-12T13:30:00Z').toISOString(),
    },
    {
      emailId: 20,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[3],
        location: 'Chicago, IL',
        device: 'desktop',
      }),
      ipAddress: '172.16.254.12',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-12T14:45:00Z').toISOString(),
    },
    {
      emailId: 21,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[5],
        location: 'Austin, TX',
        device: 'mobile',
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[5],
      createdAt: new Date('2024-01-12T16:00:00Z').toISOString(),
    },
    {
      emailId: 22,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[1],
        location: 'Seattle, WA',
        device: 'desktop',
      }),
      ipAddress: '8.8.8.8',
      userAgent: userAgents[1],
      createdAt: new Date('2024-01-13T08:15:00Z').toISOString(),
    },
    {
      emailId: 23,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[6],
        location: 'Boston, MA',
        device: 'tablet',
      }),
      ipAddress: '1.1.1.1',
      userAgent: userAgents[6],
      createdAt: new Date('2024-01-13T09:30:00Z').toISOString(),
    },
    {
      emailId: 24,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[4],
        location: 'Denver, CO',
        device: 'mobile',
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-13T10:45:00Z').toISOString(),
    },
    {
      emailId: 25,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[2],
        location: 'San Francisco, CA',
        device: 'desktop',
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[2],
      createdAt: new Date('2024-01-13T12:00:00Z').toISOString(),
    },
    {
      emailId: 26,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'New York, NY',
        device: 'desktop',
      }),
      ipAddress: '203.0.113.45',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-13T13:15:00Z').toISOString(),
    },
    {
      emailId: 27,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[3],
        location: 'Los Angeles, CA',
        device: 'desktop',
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-13T14:30:00Z').toISOString(),
    },
    {
      emailId: 28,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[5],
        location: 'Chicago, IL',
        device: 'mobile',
      }),
      ipAddress: '172.16.254.12',
      userAgent: userAgents[5],
      createdAt: new Date('2024-01-13T15:45:00Z').toISOString(),
    },

    // Campaign 2 - Clicked emails (12 clicked emails)
    {
      emailId: 1,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/demo',
        linkText: 'Book a demo',
        userAgent: userAgents[0],
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-10T09:30:00Z').toISOString(),
    },
    {
      emailId: 3,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/pricing',
        linkText: 'View pricing',
        userAgent: userAgents[4],
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-10T12:00:00Z').toISOString(),
    },
    {
      emailId: 5,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/features',
        linkText: 'Learn more',
        userAgent: userAgents[3],
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-10T14:25:00Z').toISOString(),
    },
    {
      emailId: 8,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/contact',
        linkText: 'Contact sales',
        userAgent: userAgents[6],
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[6],
      createdAt: new Date('2024-01-11T08:35:00Z').toISOString(),
    },
    {
      emailId: 11,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/demo',
        linkText: 'Book a demo',
        userAgent: userAgents[2],
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[2],
      createdAt: new Date('2024-01-11T12:30:00Z').toISOString(),
    },
    {
      emailId: 13,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/signup',
        linkText: 'Get started',
        userAgent: userAgents[0],
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-11T15:00:00Z').toISOString(),
    },
    {
      emailId: 16,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/case-studies',
        linkText: 'View case studies',
        userAgent: userAgents[6],
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[6],
      createdAt: new Date('2024-01-12T10:00:00Z').toISOString(),
    },
    {
      emailId: 19,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/webinar',
        linkText: 'Register for webinar',
        userAgent: userAgents[0],
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-12T13:45:00Z').toISOString(),
    },
    {
      emailId: 22,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/resources',
        linkText: 'Download resources',
        userAgent: userAgents[1],
      }),
      ipAddress: '8.8.8.8',
      userAgent: userAgents[1],
      createdAt: new Date('2024-01-13T08:30:00Z').toISOString(),
    },
    {
      emailId: 24,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/demo',
        linkText: 'Book a demo',
        userAgent: userAgents[4],
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-13T11:00:00Z').toISOString(),
    },
    {
      emailId: 26,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/trial',
        linkText: 'Start free trial',
        userAgent: userAgents[0],
      }),
      ipAddress: '203.0.113.45',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-13T13:30:00Z').toISOString(),
    },
    {
      emailId: 28,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/pricing',
        linkText: 'View pricing',
        userAgent: userAgents[5],
      }),
      ipAddress: '172.16.254.12',
      userAgent: userAgents[5],
      createdAt: new Date('2024-01-13T16:00:00Z').toISOString(),
    },

    // Campaign 2 - Replied emails (7 replied emails)
    {
      emailId: 1,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 245,
        sentiment: 'positive',
        keywords: ['demo', 'interested', 'schedule'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-10T15:30:00Z').toISOString(),
    },
    {
      emailId: 3,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 312,
        sentiment: 'interested',
        keywords: ['pricing', 'features', 'questions'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-10T18:00:00Z').toISOString(),
    },
    {
      emailId: 8,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 178,
        sentiment: 'positive',
        keywords: ['sales', 'meeting', 'next week'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-11T14:35:00Z').toISOString(),
    },
    {
      emailId: 13,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 421,
        sentiment: 'interested',
        keywords: ['trial', 'enterprise', 'requirements'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-12T09:00:00Z').toISOString(),
    },
    {
      emailId: 19,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 289,
        sentiment: 'positive',
        keywords: ['webinar', 'attending', 'team'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-12T20:45:00Z').toISOString(),
    },
    {
      emailId: 24,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 356,
        sentiment: 'interested',
        keywords: ['demo', 'availability', 'calendar'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-13T17:00:00Z').toISOString(),
    },
    {
      emailId: 28,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 198,
        sentiment: 'positive',
        keywords: ['pricing', 'budget', 'approved'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-14T10:00:00Z').toISOString(),
    },

    // Campaign 2 - Bounced emails (2 bounced emails)
    {
      emailId: 29,
      eventType: 'bounced',
      eventData: JSON.stringify({
        bounceType: 'hard',
        reason: 'Invalid recipient',
        smtpCode: 550,
      }),
      ipAddress: null,
      userAgent: null,
      createdAt: new Date('2024-01-10T08:05:00Z').toISOString(),
    },
    {
      emailId: 30,
      eventType: 'bounced',
      eventData: JSON.stringify({
        bounceType: 'soft',
        reason: 'Mailbox full',
        smtpCode: 552,
      }),
      ipAddress: null,
      userAgent: null,
      createdAt: new Date('2024-01-10T08:05:00Z').toISOString(),
    },

    // Campaign 1 - Opened emails (8 opened emails from ids 51-65)
    {
      emailId: 51,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'San Francisco, CA',
        device: 'desktop',
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-16T09:15:00Z').toISOString(),
    },
    {
      emailId: 52,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[1],
        location: 'New York, NY',
        device: 'desktop',
      }),
      ipAddress: '203.0.113.45',
      userAgent: userAgents[1],
      createdAt: new Date('2024-01-16T10:30:00Z').toISOString(),
    },
    {
      emailId: 53,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[4],
        location: 'Los Angeles, CA',
        device: 'mobile',
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-17T11:45:00Z').toISOString(),
    },
    {
      emailId: 54,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[2],
        location: 'Chicago, IL',
        device: 'desktop',
      }),
      ipAddress: '172.16.254.12',
      userAgent: userAgents[2],
      createdAt: new Date('2024-01-17T13:20:00Z').toISOString(),
    },
    {
      emailId: 55,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[3],
        location: 'Austin, TX',
        device: 'desktop',
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-18T14:10:00Z').toISOString(),
    },
    {
      emailId: 56,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[5],
        location: 'Seattle, WA',
        device: 'mobile',
      }),
      ipAddress: '8.8.8.8',
      userAgent: userAgents[5],
      createdAt: new Date('2024-01-19T15:30:00Z').toISOString(),
    },
    {
      emailId: 57,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[0],
        location: 'Boston, MA',
        device: 'desktop',
      }),
      ipAddress: '1.1.1.1',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-20T16:45:00Z').toISOString(),
    },
    {
      emailId: 58,
      eventType: 'opened',
      eventData: JSON.stringify({
        userAgent: userAgents[6],
        location: 'Denver, CO',
        device: 'tablet',
      }),
      ipAddress: '208.67.222.222',
      userAgent: userAgents[6],
      createdAt: new Date('2024-01-21T08:20:00Z').toISOString(),
    },

    // Campaign 1 - Clicked emails (3 clicked emails)
    {
      emailId: 51,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/demo',
        linkText: 'Book a demo',
        userAgent: userAgents[0],
      }),
      ipAddress: '192.168.1.100',
      userAgent: userAgents[0],
      createdAt: new Date('2024-01-16T09:30:00Z').toISOString(),
    },
    {
      emailId: 53,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/pricing',
        linkText: 'View pricing',
        userAgent: userAgents[4],
      }),
      ipAddress: '198.51.100.78',
      userAgent: userAgents[4],
      createdAt: new Date('2024-01-17T12:00:00Z').toISOString(),
    },
    {
      emailId: 55,
      eventType: 'clicked',
      eventData: JSON.stringify({
        link: 'https://example.com/features',
        linkText: 'Learn more',
        userAgent: userAgents[3],
      }),
      ipAddress: '10.0.0.234',
      userAgent: userAgents[3],
      createdAt: new Date('2024-01-18T14:25:00Z').toISOString(),
    },

    // Campaign 1 - Replied emails (2 replied emails)
    {
      emailId: 51,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 267,
        sentiment: 'positive',
        keywords: ['demo', 'interested', 'availability'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-16T15:30:00Z').toISOString(),
    },
    {
      emailId: 53,
      eventType: 'replied',
      eventData: JSON.stringify({
        replyLength: 334,
        sentiment: 'interested',
        keywords: ['pricing', 'enterprise', 'details'],
      }),
      ipAddress: null,
      userAgent: 'Email Client',
      createdAt: new Date('2024-01-17T18:00:00Z').toISOString(),
    },

    // Campaign 1 - Bounced email (1 bounced email)
    {
      emailId: 59,
      eventType: 'bounced',
      eventData: JSON.stringify({
        bounceType: 'hard',
        reason: 'User unknown',
        smtpCode: 550,
      }),
      ipAddress: null,
      userAgent: null,
      createdAt: new Date('2024-01-16T08:05:00Z').toISOString(),
    },
  ];

  await db.insert(emailMetrics).values(sampleMetrics);

  console.log('✅ Email metrics seeder completed successfully');
}

main().catch((error) => {
  console.error('❌ Seeder failed:', error);
});