# Deployment Guide for SMFM React App

This guide explains how to deploy the SMFM React frontend to Render.com and connect it to your Strapi backend.

## Prerequisites

1. A Render.com account (free tier works)
2. Your Strapi backend hosted on Render.com
3. A Strapi API token (READ-ONLY recommended for security)

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and set your local Strapi connection:
```
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_local_strapi_token
```

### 3. Run Locally
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Production Deployment to Render.com

### Step 1: Prepare Your Repository

1. **Verify .gitignore** - Ensure `.env` is in your `.gitignore` (it already is!)
2. **Push to GitHub** - Push your code to a public GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Create Render Web Service

1. Log in to [Render.com](https://render.com)
2. Click **"New +"** and select **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `smfm-frontend` (or your preferred name)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or set if your React app is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### Step 3: Configure Environment Variables

In the Render dashboard for your static site:

1. Go to **"Environment"** section
2. Add these environment variables:

   | Key | Value |
   |-----|-------|
   | `VITE_STRAPI_URL` | `https://your-strapi-app.onrender.com` |
   | `VITE_STRAPI_API_TOKEN` | Your production Strapi API token |

   **Important Notes:**
   - Replace `https://your-strapi-app.onrender.com` with your actual Strapi Render URL
   - Get the API token from your Strapi admin panel: Settings > API Tokens
   - Use a **READ-ONLY** token for security (the frontend only needs to read data)

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your app
   - Deploy it to a URL like `https://smfm-frontend.onrender.com`

### Step 5: Configure CORS in Strapi

Your Strapi backend needs to allow requests from your Render frontend:

1. Log in to your Strapi admin panel
2. Go to **Settings > Global settings > Security**
3. Update the CORS configuration to include your Render frontend URL:
   ```json
   {
     "origin": [
       "http://localhost:5173",
       "https://your-frontend-app.onrender.com"
     ]
   }
   ```

Or edit your Strapi `config/middlewares.js`:
```javascript
module.exports = [
  // ... other middlewares
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:5173',
        'https://your-frontend-app.onrender.com'
      ]
    }
  }
];
```

## Switching Between Local and Production

The app automatically uses the environment variables configured in your `.env` file (local) or Render dashboard (production).

### For Local Development:
```bash
# .env file
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_local_token
```

### For Production:
Configure environment variables in Render dashboard:
- `VITE_STRAPI_URL=https://your-strapi.onrender.com`
- `VITE_STRAPI_API_TOKEN=your_production_token`

## Automatic Deployments

Render will automatically redeploy your app when you push to your GitHub repository's main branch.

To disable auto-deploy:
1. Go to your Render dashboard
2. Click on your static site
3. Go to **Settings**
4. Disable **"Auto-Deploy"**

## Custom Domain (Optional)

To use your own domain:

1. Go to your Render dashboard
2. Click on your static site
3. Go to **"Settings" > "Custom Domains"**
4. Click **"Add Custom Domain"**
5. Follow the instructions to configure your DNS

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify your `vite.config.ts` is correct

### Can't Connect to Strapi
- Verify `VITE_STRAPI_URL` is correct (no trailing slash)
- Verify `VITE_STRAPI_API_TOKEN` is correct
- Check CORS settings in Strapi
- Ensure your Strapi backend is running

### Environment Variables Not Working
- Environment variables in Vite must start with `VITE_`
- After changing env vars in Render, trigger a manual deploy
- Clear your browser cache

### API Token Invalid
- Generate a new token in Strapi: Settings > API Tokens > Create new API Token
- Use type: **Read-only** for security
- Update the token in Render environment variables

## Security Checklist

Before deploying:
- [ ] `.env` file is in `.gitignore`
- [ ] No API tokens hardcoded in source files
- [ ] Using READ-ONLY Strapi API token for frontend
- [ ] CORS configured in Strapi to only allow your domains
- [ ] `.env` file is NOT committed to GitHub

## Support

For issues specific to:
- **Render.com**: Check [Render Docs](https://render.com/docs)
- **Strapi**: Check [Strapi Docs](https://docs.strapi.io/)
- **Vite**: Check [Vite Docs](https://vitejs.dev/)
