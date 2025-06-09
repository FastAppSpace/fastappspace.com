# FastAppSpace - Personal Portfolio Website

A modern, responsive personal portfolio website built with HTML, Tailwind CSS, and JavaScript. This website showcases mobile app development services and projects.

## 🌟 Features

- **Modern Design**: Clean and professional design with smooth animations
- **Fully Responsive**: Optimized for all devices and screen sizes
- **Performance Optimized**: Fast loading times and optimized assets
- **SEO Friendly**: Proper meta tags and structured data
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Interactive Elements**: 
  - Smooth scrolling
  - Form validation
  - Cookie consent management
  - Loading states
  - Error handling

## 🛠️ Technologies Used

- HTML5
- Tailwind CSS
- JavaScript (Vanilla)
- Font Awesome Icons
- Google Fonts (Inter)

## 📦 Project Structure

```
fastappspace.com/
├── index.html              # Main HTML file
├── error-handler.js        # Error handling utility
├── assets/
│   ├── icons/              # Favicon and app icons
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   └── rocket.svg
│   ├── css/                # CSS styles
│   ├── js/                 # JavaScript modules
├── site.webmanifest        # PWA manifest file
├── robots.txt              # Search engine crawler rules
├── sitemap.xml             # XML sitemap
├── config.template.js      # Configuration template
└── build.sh                # Build script for configuration
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fastappspace.com.git
   ```

2. Navigate to the project directory:
   ```bash
   cd fastappspace.com
   ```

3. Set up configuration (see [Security Setup](#security-setup) below)

4. Start a local server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve
   ```

5. Visit `http://localhost:3000` in your browser

## 🔐 Security Setup

This project uses GitHub Secrets to securely inject API keys during deployment, ensuring sensitive information never appears in your public repository.

### Local Development

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

### Testing Build Process Locally

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

## 🚀 Deployment

### Production (GitHub Pages)

1. **Add GitHub Secrets**:
   - Go to repository Settings → Secrets and variables → Actions → New repository secret
   - Add the following secrets:
     - `WEB3FORMS_ACCESS_KEY`: Your Web3Forms API key
     - `EMAILJS_USER_ID`: Your EmailJS User ID
     - `EMAILJS_SERVICE_ID`: Your EmailJS Service ID
     - `EMAILJS_TEMPLATE_ID`: Your EmailJS Template ID

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - Custom domain: `www.fastappspace.com`

### Development Environment

**Note**: GitHub Pages allows only one deployment per repository. For development testing, use local development with the `develop` branch:

#### **Local Development Workflow**

1. **Create develop branch**:
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

2. **Development workflow**:
   ```bash
   # Work on develop branch  
   git checkout develop
   
   # Test changes locally
   ./build.sh
   python -m http.server 3000
   # Test on http://localhost:3000
   
   # When satisfied, commit and merge to production
   git add . && git commit -m "feat: new feature"
   git checkout master
   git merge develop
   git push origin master  # Deploys to www.fastappspace.com
   ```

#### **Alternative: GitHub Codespaces**

For cloud-based development testing:
```bash
# In GitHub Codespaces or any dev environment
git checkout develop
./build.sh && python -m http.server 3000
# Test changes before merging to master
```

### Deployment Environments

| Environment | Platform | Branch | URL | Purpose |
|-------------|----------|--------|-----|---------|
| **Production** | GitHub Pages | `master` | `www.fastappspace.com` | Live site |
| **Development** | Local/Codespaces | `develop` | `localhost:3000` | Testing |

### Deployment Process

1. **Development**: Test locally on `develop` branch
2. **Production**: Merge to `master` → GitHub Actions → `www.fastappspace.com`

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

## 🎨 Customization

### Colors
The website uses a custom color scheme defined in the Tailwind configuration. Main colors:
- Primary: Purple (#6e8efb)
- Secondary: Indigo (#a777e3)
- Background: White and Gray shades

### Images
Replace the placeholder images in the following sections:
- Hero section mobile mockup
- App showcase cards
- Team member photos
- About section gallery

### Content
Update the content in `index.html`:
- Company information
- Services offered
- Team member details
- Contact information
- Social media links

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔒 Security Features

- Form validation with sanitization
- XSS protection
- CSRF protection
- Secure cookie handling
- Content Security Policy
- Environment variables for API keys
- Gitignored configuration files

## 🚀 Performance Optimizations

- Lazy loading images
- Preloaded critical assets
- Minified CSS and JavaScript
- Optimized images
- Browser caching

## 📈 SEO Features

- Meta tags optimization
- Structured data (JSON-LD)
- XML sitemap
- robots.txt
- Semantic HTML
- Open Graph tags
- Twitter Cards

## 🔍 Accessibility

- ARIA labels
- Keyboard navigation
- Skip to main content
- Focus management
- Color contrast
- Screen reader support

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Artem Senenko
- Website: [fastappspace.com](https://fastappspace.com)
- Email: fastappspace@gmail.com
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/artem-senenko-b3195927/)

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com)
- [Font Awesome](https://fontawesome.com)
- [Google Fonts](https://fonts.google.com)
- [Unsplash](https://unsplash.com) for placeholder images
- [Web3Forms](https://web3forms.com) for form handling
- [EmailJS](https://www.emailjs.com) for email functionality

## 📞 Support

For support, email fastappspace@gmail.com or open an issue in the repository.