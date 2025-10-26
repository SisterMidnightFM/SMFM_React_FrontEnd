# Pre-Deployment Checklist

Use this checklist before pushing to GitHub and deploying to Render.com.

## Security Verification

### Environment Variables
- [ ] `.env` file exists locally with correct values
- [ ] `.env` is listed in `.gitignore`
- [ ] `.env` is NOT tracked by git (verify with `git status`)
- [ ] `.env.example` exists and has no real secrets (safe to commit)

### Git Status Check
```bash
# Run these commands to verify:
git status                           # Should NOT show .env
git check-ignore .env                # Should output: .gitignore:27:.env
git log --all --full-history -- .env # Should show nothing (file never committed)
```

### Code Review
- [ ] No hardcoded API tokens in TypeScript files
- [ ] No hardcoded URLs (except third-party public APIs)
- [ ] All sensitive config uses `import.meta.env.VITE_*`

## Strapi Backend Preparation

### API Token
- [ ] Created READ-ONLY API token in Strapi (Settings > API Tokens)
- [ ] Saved token securely for Render environment variables
- [ ] Token is different from local development token (recommended)

### CORS Configuration
- [ ] Updated Strapi CORS to allow your Render frontend URL
- [ ] Verified localhost is allowed for local development
- [ ] Tested CORS by making a request from browser console

### Strapi Deployment
- [ ] Strapi is deployed to Render.com
- [ ] Strapi is accessible at its Render URL
- [ ] Strapi admin panel is accessible
- [ ] Test API endpoint works: `https://your-strapi.onrender.com/api/episodes`

## GitHub Preparation

### Repository Setup
- [ ] Created public GitHub repository
- [ ] Added meaningful repository description
- [ ] Added repository topics (optional): `react`, `vite`, `strapi`, `radio`, `typescript`

### Files to Commit
These files are safe to commit:
- [ ] All source code in `src/`
- [ ] `package.json` and `package-lock.json`
- [ ] `.env.example` (template only)
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `DEPLOYMENT.md`
- [ ] `SECURITY.md`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json` and other config files
- [ ] `public/` folder contents

### Files to NEVER Commit
These are already in `.gitignore`:
- [ ] `.env` (contains real secrets)
- [ ] `node_modules/` (dependencies)
- [ ] `dist/` (build output)
- [ ] Any file with real API tokens or secrets

### First Push
```bash
# Initialize git if not already done
git init

# Add all files (gitignore will exclude sensitive ones)
git add .

# Verify what you're about to commit
git status
git diff --cached

# Create initial commit
git commit -m "Initial commit: SMFM Radio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

## Render.com Setup

### Create Static Site
- [ ] Logged in to Render.com
- [ ] Connected GitHub account
- [ ] Selected "Static Site" service type
- [ ] Connected your repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`

### Environment Variables in Render
- [ ] Added `VITE_STRAPI_URL` with production Strapi URL
- [ ] Added `VITE_STRAPI_API_TOKEN` with READ-ONLY token
- [ ] Double-checked URLs have NO trailing slashes
- [ ] Saved environment variables

### Deployment Settings
- [ ] Auto-deploy enabled (deploys on git push)
- [ ] Branch set to `main` (or your default branch)
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`

## Testing

### Local Testing (Before Deployment)
```bash
# Test local build
npm run build

# Preview production build locally
npm run preview
```

- [ ] Local build succeeds without errors
- [ ] Preview works correctly
- [ ] All pages load
- [ ] API connections work
- [ ] Images load properly

### Post-Deployment Testing
Once deployed to Render:
- [ ] Visit your Render URL (e.g., `https://smfm-frontend.onrender.com`)
- [ ] Homepage loads successfully
- [ ] Check browser console for errors
- [ ] Test navigation to different pages
- [ ] Test search functionality
- [ ] Verify episodes load with images
- [ ] Test show and artist pages
- [ ] Verify live stream player works
- [ ] Check that episode embeds work (SoundCloud/MixCloud)

### API Connection Testing
```javascript
// Open browser console on your deployed site and run:
fetch('https://your-strapi.onrender.com/api/episodes', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(r => r.json())
.then(d => console.log(d))
```

- [ ] API request succeeds (status 200)
- [ ] Data is returned correctly
- [ ] No CORS errors

## Troubleshooting

### If Build Fails
1. Check Render build logs
2. Ensure all dependencies are in `package.json`
3. Try building locally: `npm run build`
4. Check for TypeScript errors: `npm run lint`

### If API Doesn't Connect
1. Verify `VITE_STRAPI_URL` in Render environment variables
2. Check CORS settings in Strapi
3. Verify API token is correct
4. Check browser console for specific errors

### If Environment Variables Don't Work
1. Ensure they start with `VITE_` prefix
2. Trigger manual redeploy after changing env vars
3. Check for typos in variable names

## Final Verification

### Security Double-Check
```bash
# Make absolutely sure .env is not in your repo:
git log --all --full-history -- .env
# Should return nothing

# Check what will be pushed:
git log origin/main..HEAD
git diff origin/main..HEAD

# Search for any potential secrets in committed files:
git grep -i "api.*token"
git grep -i "ba28f92a"  # Your actual token
# Should only find env.example and documentation
```

### Smoke Test Checklist
After deployment:
- [ ] Site loads at Render URL
- [ ] No JavaScript errors in console
- [ ] Episodes page shows content
- [ ] Shows page shows content
- [ ] Artists page shows content
- [ ] Search works
- [ ] Images load correctly
- [ ] Live stream player works
- [ ] Episode embeds work
- [ ] Mobile responsive design works

## Common Mistakes to Avoid

1. ❌ Committing `.env` file to git
2. ❌ Using full-access token instead of read-only
3. ❌ Forgetting to configure CORS in Strapi
4. ❌ Having trailing slashes in URLs
5. ❌ Not setting environment variables in Render
6. ❌ Using wrong build command or publish directory

## Ready to Deploy?

If all boxes are checked:
- ✅ Push to GitHub: `git push origin main`
- ✅ Deploy on Render: Automatic or trigger manually
- ✅ Monitor deployment logs
- ✅ Test the live site
- ✅ Celebrate! 🎉

## After Deployment

### Monitoring
- Check Render logs for errors
- Monitor Strapi API usage
- Watch for CORS or authentication errors

### Maintenance
- Update dependencies regularly: `npm update`
- Rotate API tokens quarterly
- Keep Strapi updated
- Monitor performance in Render dashboard

## Need Help?

- **Deployment issues**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Security concerns**: See [SECURITY.md](./SECURITY.md)
- **Render support**: https://render.com/docs
- **Strapi support**: https://docs.strapi.io/
