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
├── assets/
│   ├── icons/             # Favicon and app icons
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── apple-touch-icon.png
│   │   └── rocket.svg
├── error-handler.js        # Error handling utility
├── site.webmanifest       # PWA manifest file
├── robots.txt             # Search engine crawler rules
└── sitemap.xml            # XML sitemap
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

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve
   ```

4. Visit `http://localhost:3000` in your browser

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

- Form validation
- XSS protection
- CSRF protection
- Secure cookie handling
- Content Security Policy

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

## 🛠️ Development

### Prerequisites
- Modern web browser
- Code editor (VS Code recommended)
- Git

### Local Development
1. Install dependencies (if any)
2. Make changes to the code
3. Test locally
4. Commit changes
5. Push to repository

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Your Name
- Website: [fastappspace.com](https://fastappspace.com)
- Email: fastappspace@gmail.com
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/artem-senenko-b3195927/)

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com)
- [Font Awesome](https://fontawesome.com)
- [Google Fonts](https://fonts.google.com)
- [Unsplash](https://unsplash.com) for placeholder images

## 📞 Support

For support, email fastappspace@gmail.com or open an issue in the repository.

## Setup Instructions

1. Clone the repository
2. Create a `config.js` file in the root directory with the following structure:
```javascript
const config = {
    web3forms: {
        accessKey: 'YOUR_ACCESS_KEY_HERE'
    }
};
```
3. Replace `YOUR_ACCESS_KEY_HERE` with your Web3Forms access key

## Development

- The main branch contains the source code
- The gh-pages branch contains the deployed version
- Never commit the `config.js` file to the main branch
- The `config.js` file should only exist in the gh-pages branch

## Contact Form

The contact form uses Web3Forms to handle submissions. To set up:
1. Sign up at https://web3forms.com/
2. Get your access key
3. Add it to the `config.js` file

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to either the main or gh-pages branch.