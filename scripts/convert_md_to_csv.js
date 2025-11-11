const fs = require('fs');
const path = require('path');

// Read the markdown file
const mdFile = path.join(__dirname, '..', 'docs', 'jaipur-500-hr-emails.md');
const csvFile = path.join(__dirname, '..', 'docs', 'jaipur-hr-contacts.csv');

const content = fs.readFileSync(mdFile, 'utf-8');

// Extract all email addresses
const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
const allEmails = content.match(emailRegex) || [];

// Remove duplicates
const uniqueEmails = [...new Set(allEmails)];

// Function to extract company name from email
function extractCompanyFromEmail(email) {
    const domain = email.split('@')[1];
    const company = domain.split('.')[0];
    // Clean up company name
    return company.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Create CSV data
const csvData = [];
csvData.push(['email', 'companyName', 'hrName', 'position', 'industry', 'companyType', 'location', 'companyWebsite']);

uniqueEmails.forEach(email => {
    const companyName = extractCompanyFromEmail(email);
    const emailPrefix = email.split('@')[0].toLowerCase();
    
    let hrName;
    if (emailPrefix.includes('hr')) {
        hrName = 'HR Manager';
    } else if (emailPrefix.includes('career') || emailPrefix.includes('recruit')) {
        hrName = 'Recruitment Team';
    } else {
        hrName = 'Hiring Manager';
    }
    
    const position = 'Software Developer';
    const industry = 'Information Technology';
    const companyType = 'Technology Company';
    const location = 'Jaipur, Rajasthan';
    const domain = email.split('@')[1];
    const website = `https://${domain}`;
    
    csvData.push([
        email,
        companyName,
        hrName,
        position,
        industry,
        companyType,
        location,
        website
    ]);
});

// Write to CSV
const csvContent = csvData.map(row => row.join(',')).join('\n');
fs.writeFileSync(csvFile, csvContent, 'utf-8');

console.log(`✓ Converted ${uniqueEmails.length} unique emails to CSV`);
console.log(`✓ Output file: ${csvFile}`);
