# Security Guidelines for SMFM React App

## Overview

This document outlines the security measures implemented in this project and best practices for maintaining security.

## Environment Variables

### What's Secure

All sensitive configuration is stored in environment variables:
- `VITE_STRAPI_URL` - The URL of your Strapi backend
- `VITE_STRAPI_API_TOKEN` - The API token for accessing Strapi

These are **never** hardcoded in the source code and are loaded from:
- Local development: `.env` file (not committed to git)
- Production: Render.com environment variables dashboard

### Security Best Practices

1. **Never commit `.env` files** - Already configured in `.gitignore`
2. **Use READ-ONLY API tokens** - The frontend only needs to read data from Strapi
3. **Rotate tokens regularly** - Generate new tokens periodically
4. **Use different tokens for different environments** - Local vs Production

## API Token Security

### Creating a Secure API Token in Strapi

1. Log in to your Strapi admin panel
2. Go to **Settings > API Tokens > Create new API Token**
3. Configure:
   - **Name**: "Frontend Read-Only" or similar
   - **Token type**: Read-only (recommended for frontend)
   - **Token duration**: Unlimited or set expiration as needed
4. Copy the token and save it securely
5. Add to your `.env` file locally or Render environment variables

### Why Read-Only?

Frontend applications run in the browser where code can be inspected. A read-only token limits potential damage if the token is exposed:
- ✅ Can read public content
- ❌ Cannot create, update, or delete content
- ❌ Cannot modify settings
- ❌ Cannot access admin functions

## CORS Configuration

### Strapi CORS Setup

Your Strapi backend must be configured to accept requests from your frontend domain:

```javascript
// config/middlewares.js in your Strapi project
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:5173',  // Local development
        'https://your-frontend-app.onrender.com',  // Production
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
  // ... other middlewares
];
```

### Why CORS Matters

CORS (Cross-Origin Resource Sharing) prevents unauthorized websites from accessing your API. Only domains you explicitly allow can make requests to your Strapi backend.

## Git Security

### Files Excluded from Git

The following are automatically excluded via `.gitignore`:
- `.env` - Environment variables
- `.env.local` - Local overrides
- `.env.*.local` - Environment-specific local overrides
- `.env.production` - Production environment file
- `.env.development` - Development environment file
- `node_modules/` - Dependencies
- `dist/` - Build output

### Before Pushing to GitHub

Always check what you're about to commit:

```bash
# See what files are staged
git status

# See the actual changes
git diff --cached

# Make sure no .env files are included
git diff --cached | grep -i "VITE_STRAPI"
```

If you accidentally committed sensitive data, see "Emergency: Token Exposed" below.

## Third-Party Services

This app connects to these external services:
- **Strapi (Your Backend)** - Content management system
- **Radio.co** - Live stream and station status (public API, no auth needed)
- **SoundCloud** - Episode embeds (public embeds)
- **MixCloud** - Episode embeds (public embeds)
- **Discord** - Chat room link (no integration, just a link)

None of these require secrets in the frontend except Strapi.

## Common Security Mistakes to Avoid

### ❌ DON'T Do This:
```typescript
// NEVER hardcode API tokens
const API_TOKEN = "ba28f92a96164aeb0f9d423b...";
const STRAPI_URL = "http://localhost:1337";
```

### ✅ DO This Instead:
```typescript
// Always use environment variables
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
```

### ❌ DON'T Do This:
```bash
# Don't commit .env files
git add .env
git commit -m "Add configuration"
```

### ✅ DO This Instead:
```bash
# Commit the example file only
git add .env.example
git commit -m "Add environment configuration example"
```

## Emergency: Token Exposed

If you accidentally committed your `.env` file or API token to GitHub:

### 1. Revoke the Token Immediately
1. Log in to Strapi admin
2. Go to Settings > API Tokens
3. Delete the exposed token
4. Create a new token

### 2. Update Your Environments
- Update `.env` file locally with new token
- Update Render environment variables with new token

### 3. Remove from Git History
```bash
# Remove the file from git but keep it locally
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from version control"

# Push the change
git push origin main
```

**Important**: Simply deleting the file in a new commit doesn't remove it from history. If the token was in previous commits, it's still accessible. In that case, you MUST rotate the token.

### 4. Consider Repository Cleanup (Advanced)
If sensitive data is in git history, consider:
- Using `git filter-branch` or `BFG Repo-Cleaner` to remove it
- Or creating a new repository and migrating (if history isn't important)

## Security Checklist for Deployment

Before deploying to production:

- [ ] `.env` file is in `.gitignore`
- [ ] `.env` file is not in git history (run `git log --all --full-history -- .env`)
- [ ] Using READ-ONLY Strapi API token for frontend
- [ ] Different API tokens for local vs production
- [ ] CORS properly configured in Strapi
- [ ] Environment variables configured in Render dashboard
- [ ] No API tokens visible in browser DevTools Console logs
- [ ] No API tokens in client-side error messages

## Monitoring and Maintenance

### Regular Security Tasks

1. **Monthly**: Review API token usage in Strapi
2. **Quarterly**: Rotate API tokens
3. **After Team Changes**: Rotate tokens when developers leave
4. **After Security Concerns**: Immediately rotate if breach suspected

### Signs of Potential Issues

Watch for:
- Unexpected API usage in Strapi logs
- CORS errors in production (might indicate misconfiguration)
- 401/403 errors (might indicate token issues)

## Additional Resources

- [Strapi Security Guide](https://docs.strapi.io/dev-docs/security)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Render Security Best Practices](https://render.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Contact

If you discover a security vulnerability, please:
1. **Do NOT** create a public GitHub issue
2. Revoke any exposed tokens immediately
3. Contact the development team directly
