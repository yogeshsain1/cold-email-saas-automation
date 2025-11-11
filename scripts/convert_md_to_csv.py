"""
Script to convert jaipur-500-hr-emails.md to importable CSV format
"""
import re
import csv

def parse_markdown_to_csv(md_file, csv_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all email addresses
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', content)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_emails = []
    for email in emails:
        if email not in seen:
            seen.add(email)
            unique_emails.append(email)
    
    # Extract company name from email domain
    def extract_company_from_email(email):
        domain = email.split('@')[1]
        company = domain.split('.')[0]
        # Clean up company name
        company = company.replace('-', ' ').title()
        return company
    
    # Determine tier based on section in markdown
    tiers = {
        'Tier-1: Large National IT Companies': 'Large Enterprise',
        'Tier-2: Mid-Size Established Tech Companies': 'Mid-Size Company',
        'Tier-3: Growing Startups & Specialized Companies': 'Startup/Growing',
        'Tier-4: Web Design & Development Companies': 'Web/App Development',
        'Tier-5: Mobile App Development Companies': 'Mobile Development',
        'Tier-6: Software Consulting Firms': 'Consulting',
        'Tier-7: Product-Based Tech Companies': 'Product Company',
        'Tier-8: E-commerce & Digital Marketing': 'E-commerce/Marketing',
    }
    
    # Create CSV data
    csv_data = []
    csv_data.append(['email', 'companyName', 'hrName', 'position', 'industry', 'companyType', 'location', 'companyWebsite'])
    
    for email in unique_emails:
        company_name = extract_company_from_email(email)
        company_type = 'Technology Company'
        
        # Determine if it's hr@ or careers@ or other
        email_prefix = email.split('@')[0]
        if 'hr' in email_prefix.lower():
            hr_name = 'HR Manager'
        elif 'career' in email_prefix.lower() or 'recruit' in email_prefix.lower():
            hr_name = 'Recruitment Team'
        else:
            hr_name = 'Hiring Manager'
        
        # Default position to target
        position = 'Software Developer'
        
        # Industry
        industry = 'Information Technology'
        
        # Location - Jaipur
        location = 'Jaipur, Rajasthan'
        
        # Company website (derived from email)
        domain = email.split('@')[1]
        website = f'https://{domain}'
        
        csv_data.append([
            email,
            company_name,
            hr_name,
            position,
            industry,
            company_type,
            location,
            website
        ])
    
    # Write to CSV
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(csv_data)
    
    print(f'✓ Converted {len(unique_emails)} unique emails to CSV')
    print(f'✓ Output file: {csv_file}')

if __name__ == '__main__':
    parse_markdown_to_csv(
        'docs/jaipur-500-hr-emails.md',
        'docs/jaipur-hr-contacts.csv'
    )
