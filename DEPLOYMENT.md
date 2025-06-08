# 🚀 FastAppSpace Deployment Guide

This guide explains how to securely deploy FastAppSpace to GitHub Pages with environment variables.

## 🔐 Security Setup

This project uses GitHub Secrets to securely inject API keys during deployment, ensuring sensitive information never appears in your public repository.

## 📋 Setup Instructions

### 1. **Add GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Description | Where to get it |
|-------------|-------------|-----------------|
| `WEB3FORMS_ACCESS_KEY` | Your Web3Forms API key | [Web3Forms Dashboard](https://web3forms.com/) |
| `EMAILJS_USER_ID` | Your EmailJS User ID | [EmailJS Dashboard](https://www.emailjs.com/) |
| `EMAILJS_SERVICE_ID` | Your EmailJS Service ID | EmailJS Dashboard |
| `EMAILJS_TEMPLATE_ID` | Your EmailJS Template ID | EmailJS Dashboard |

### 2. **Enable GitHub Pages**

1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. The workflow will automatically deploy on push to main/master

### 3. **Local Development**

For local development, create a `config.js` file in the root:

```javascript
const config = {
    web3forms: {
        accessKey: 'your-local-web3forms-key'
    },
    emailjs: {
        userId: 'your-local-emailjs-user-id',
        serviceId: 'your-local-service-id',
        templateId: 'your-local-template-id'
    }
};
```

**Note**: This file is gitignored and won't be committed.

### 4. **Testing Locally**

Run the build script to test secret injection:

```bash
# Set environment variables
export WEB3FORMS_ACCESS_KEY="your-key"
export EMAILJS_USER_ID="your-id"
export EMAILJS_SERVICE_ID="your-service-id"
export EMAILJS_TEMPLATE_ID="your-template-id"

# Run build
./build.sh

# Start local server
python3 -m http.server 3000
```

## 🔄 Deployment Process

1. **Push to GitHub**: Changes to main/master branch trigger deployment
2. **GitHub Actions**: Runs the workflow with your secrets
3. **Build Step**: Injects secrets into config.js using build.sh
4. **Deploy**: Deploys the built site to GitHub Pages

## 🛡️ Security Features

- ✅ **No secrets in source code**: All sensitive data in GitHub Secrets
- ✅ **Secure injection**: Secrets injected only during build
- ✅ **gitignored config**: Local config.js never committed
- ✅ **Template system**: Clean separation of template and secrets

## 🔧 How It Works

1. **config.template.js**: Template with placeholders like `${WEB3FORMS_ACCESS_KEY}`
2. **build.sh**: Replaces placeholders with actual secret values
3. **GitHub Actions**: Provides secrets as environment variables
4. **Generated config.js**: Contains real values, deployed but not committed

## 📞 Getting API Keys

### Web3Forms
1. Visit [web3forms.com](https://web3forms.com/)
2. Sign up for free account
3. Create a new form
4. Copy the Access Key

### EmailJS
1. Visit [emailjs.com](https://www.emailjs.com/)
2. Create account and email service
3. Set up email template
4. Get User ID, Service ID, and Template ID

## 🆘 Troubleshooting

**Forms not working?**
- Check GitHub Secrets are set correctly
- Verify secret names match exactly
- Check GitHub Actions logs for errors

**Local development issues?**
- Create local config.js with your test keys
- Run `./build.sh` to test secret injection
- Check browser console for JavaScript errors

**Deployment fails?**
- Check GitHub Actions permissions
- Verify all required secrets are set
- Review deployment logs in Actions tab