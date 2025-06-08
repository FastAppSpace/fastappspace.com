# CLAUDE.md - HoneyLingo Directory

This directory contains legal documents for the HoneyLingo mobile application, a product developed by FastAppSpace.

## Files Overview

- **privacy_policy.html**: Privacy policy for HoneyLingo app
- **terms_and_conditions.html**: Terms and conditions for HoneyLingo app

## Document Structure

### HTML Template Pattern
Both documents follow a consistent structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Document Type] - HoneyLingo</title>
    <style>
        /* Inline CSS for standalone documents */
    </style>
</head>
<body>
    <h1>[Document Title]</h1>
    <!-- Content sections -->
    <div class="footer">
        <!-- Attribution/generation info -->
    </div>
</body>
</html>
```

### Styling Approach
- **Inline CSS**: Self-contained documents with embedded styles
- **Typography**: Clean, readable Arial/sans-serif font stack
- **Layout**: Centered content with max-width container
- **Colors**: Professional blue/gray color scheme
- **Responsive**: Mobile-friendly with viewport meta tag

## Content Guidelines

### Privacy Policy Structure
Standard sections for mobile app privacy policies:

1. **Information Collection and Use**: What data is collected
2. **Third Party Access**: External services and data sharing
3. **Opt-Out Rights**: How users can control data collection
4. **Data Retention**: How long data is stored
5. **Security**: How data is protected
6. **Contact Information**: How to reach the developer

### Terms and Conditions Structure
Essential sections for app terms:

1. **Service Description**: What the app does and provides
2. **User Responsibilities**: What users must/cannot do
3. **Intellectual Property**: Ownership and usage rights
4. **Liability Limitations**: Developer responsibility limits
5. **Service Availability**: Uptime and feature guarantees
6. **Termination**: How service can be ended
7. **Changes to Terms**: How updates are communicated

## Legal Compliance

### Required Disclosures
- **Data Collection**: Clear description of what data is gathered
- **Third-Party Services**: Links to Google/Firebase privacy policies
- **User Rights**: How to opt-out, delete data, contact support
- **Age Restrictions**: Compliance with COPPA if applicable

### Third-Party Service References
Current integrations requiring disclosure:
- Google Play Services
- Google Analytics for Firebase  
- Firebase Crashlytics

### Contact Information
- **Developer**: Artem Senenko
- **Email**: slima4.u8@gmail.com (as shown in terms)
- **Business**: FastAppSpace

## Maintenance Guidelines

### When to Update
- **New Features**: App functionality changes requiring privacy updates
- **New Integrations**: Additional third-party services added
- **Legal Changes**: GDPR, CCPA, or other privacy law updates
- **Contact Changes**: Developer or business contact information updates

### Update Process
1. **Review content changes** needed for app updates
2. **Update effective date** at bottom of documents
3. **Notify users** of significant changes via app update
4. **Archive previous versions** for compliance records

### Legal Review
- Consult legal counsel for significant changes
- Use privacy policy generators as starting templates only
- Ensure compliance with app store requirements
- Review annually even without app changes

## Template Reuse

### For New Apps
These documents can serve as templates for other FastAppSpace apps:

1. **Copy files** to new app directory
2. **Find and replace** "HoneyLingo" with new app name
3. **Update contact information** if different
4. **Review third-party integrations** and update accordingly
5. **Customize content** for app-specific features

### Customization Points
- App name and description
- Data collection specifics
- Third-party service integrations
- Contact information
- Effective dates

## File Hosting

### Standalone Documents
- Self-contained HTML files with inline CSS
- No external dependencies (CSS, JS, images)
- Can be hosted anywhere or served statically
- Mobile-responsive for in-app viewing

### Integration Options
- Link from app settings/about screen
- Include in app store listings
- Host on FastAppSpace website subdirectory
- Embed in mobile app using WebView component