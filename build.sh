#!/bin/bash

# Build script for FastAppSpace
# This script generates config.js from template using environment variables

echo "🚀 Starting FastAppSpace build process..."

# Check if template exists
if [ ! -f "config.template.js" ]; then
    echo "❌ Error: config.template.js not found"
    exit 1
fi

# Generate config.js from template with environment variables
echo "📝 Generating config.js from template..."

# Use environment variables or defaults for local development
WEB3FORMS_ACCESS_KEY=${WEB3FORMS_ACCESS_KEY:-"YOUR_WEB3FORMS_ACCESS_KEY_HERE"}
EMAILJS_USER_ID=${EMAILJS_USER_ID:-"YOUR_EMAILJS_USER_ID_HERE"}
EMAILJS_SERVICE_ID=${EMAILJS_SERVICE_ID:-"YOUR_EMAILJS_SERVICE_ID_HERE"}
EMAILJS_TEMPLATE_ID=${EMAILJS_TEMPLATE_ID:-"YOUR_EMAILJS_TEMPLATE_ID_HERE"}

# Replace placeholders in template
sed -e "s/\${WEB3FORMS_ACCESS_KEY}/$WEB3FORMS_ACCESS_KEY/g" \
    -e "s/\${EMAILJS_USER_ID}/$EMAILJS_USER_ID/g" \
    -e "s/\${EMAILJS_SERVICE_ID}/$EMAILJS_SERVICE_ID/g" \
    -e "s/\${EMAILJS_TEMPLATE_ID}/$EMAILJS_TEMPLATE_ID/g" \
    config.template.js > config.js

echo "✅ config.js generated successfully"

# Validate that config.js was created
if [ ! -f "config.js" ]; then
    echo "❌ Error: Failed to generate config.js"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps for production deployment:"
echo "   1. Set your secrets in GitHub repository settings"
echo "   2. Push your changes to trigger GitHub Actions"
echo "   3. Your site will be deployed with injected secrets"