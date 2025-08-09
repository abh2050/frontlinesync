# FrontLine Sync - Domain Configuration

## Custom Domain Setup

This application is configured to work with the custom domain: **https://frontlinesync.com**

### Configuration Files

The domain configuration is centralized in the following files:

- **`src/config/app.ts`** - Main app configuration including domain, branding, and contact information
- **`src/config/env.ts`** - Environment detection and domain validation
- **`index.html`** - Meta tags, SEO, and PWA configuration
- **`public/manifest.json`** - Progressive Web App manifest

### Domain References

The application includes your domain in several places:

1. **HTML Meta Tags**: SEO optimization with canonical URLs
2. **Login Screen**: Footer link to your website
3. **Layout Header**: Development domain indicator
4. **User Profile**: Direct link to your website
5. **Footer Component**: Copyright and domain link
6. **PWA Manifest**: App metadata for mobile installation

### Development vs Production

- **Development**: Shows domain indicator for easy identification
- **Production**: Clean UI with subtle domain references
- **Domain Detection**: Automatically detects if running on correct domain

### Deployment Notes

When deploying to production:

1. Ensure DNS is pointed to your hosting provider
2. Configure SSL certificate for HTTPS
3. Set up domain redirects (www → non-www or vice versa)
4. Update any backend API endpoints if needed

### Environment Variables

Currently, domain configuration is hardcoded in the config files. To make it dynamic, you can:

1. Set `VITE_DOMAIN` environment variable
2. Update `src/config/app.ts` to read from environment
3. Use different configurations for staging vs production

### SEO Optimization

The app includes proper meta tags for:
- Search engine optimization
- Social media sharing (Open Graph)
- Mobile app installation prompts
- Canonical URL specification

All pointing to your custom domain: **frontlinesync.com**