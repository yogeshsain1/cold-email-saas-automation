/**
 * Export utilities for generating CSV and PDF reports
 */

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: ExportData): string {
  const { headers, rows } = data;
  
  const escapeCSV = (value: string | number): string => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = headers.map(escapeCSV).join(',');
  const dataRows = rows.map(row => row.map(escapeCSV).join(',')).join('\n');
  
  return `${headerRow}\n${dataRows}`;
}

/**
 * Download CSV file
 */
export function downloadCSV(filename: string, data: ExportData): void {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Download JSON file
 */
export function downloadJSON(filename: string, data: any): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Format campaign data for export
 */
export function formatCampaignDataForExport(campaigns: any[]): ExportData {
  const headers = [
    'Campaign Name',
    'Status',
    'Total Emails',
    'Sent',
    'Opened',
    'Clicked',
    'Replied',
    'Bounced',
    'Open Rate',
    'Click Rate',
    'Created At',
  ];

  const rows = campaigns.map(campaign => [
    campaign.name,
    campaign.status,
    campaign.totalEmails || 0,
    campaign.sentEmails || 0,
    campaign.openedEmails || 0,
    campaign.clickedEmails || 0,
    campaign.repliedEmails || 0,
    campaign.bouncedEmails || 0,
    campaign.sentEmails > 0 
      ? `${((campaign.openedEmails / campaign.sentEmails) * 100).toFixed(2)}%`
      : '0%',
    campaign.sentEmails > 0
      ? `${((campaign.clickedEmails / campaign.sentEmails) * 100).toFixed(2)}%`
      : '0%',
    new Date(campaign.createdAt).toLocaleDateString(),
  ]);

  return { headers, rows };
}

/**
 * Format analytics data for export
 */
export function formatAnalyticsDataForExport(stats: any): ExportData {
  const headers = ['Metric', 'Value'];
  
  const rows = [
    ['Total Campaigns', stats.totalCampaigns || 0],
    ['Active Campaigns', stats.activeCampaigns || 0],
    ['Total Emails Sent', stats.totalEmailsSent || 0],
    ['Total Contacts', stats.totalContacts || 0],
    ['Total Email Lists', stats.totalEmailLists || 0],
    ['Average Open Rate', `${stats.averageOpenRate || 0}%`],
    ['Average Click Rate', `${stats.averageClickRate || 0}%`],
    ['Total Emails Opened', stats.totalEmailsOpened || 0],
    ['Total Emails Clicked', stats.totalEmailsClicked || 0],
    ['Total Emails Replied', stats.totalEmailsReplied || 0],
    ['Total Emails Bounced', stats.totalEmailsBounced || 0],
  ];

  return { headers, rows };
}
