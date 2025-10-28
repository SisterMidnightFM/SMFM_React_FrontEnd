# Fixing Image Upload Issue on Render

## The Problem

Your Strapi backend on Render has:
- ✅ Database records for images (in Postgres)
- ❌ The actual image files (they're only on your local computer)

When you uploaded images through your local Strapi, they were saved to your local filesystem (usually in `public/uploads/`). The production Strapi on Render doesn't have access to these files.

## The Solution: Use Cloud Storage

Render's filesystem is **ephemeral** - files disappear when the service restarts. You need to store uploaded files in cloud storage.

### Recommended Approach: Cloudinary (Free Tier Available)

Cloudinary has a generous free tier perfect for a radio station website.

---

## Step-by-Step Fix

### Option A: Configure Cloudinary (Recommended)

#### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com
2. Sign up for a free account
3. After signup, you'll get:
   - Cloud Name
   - API Key
   - API Secret

#### Step 2: Install Cloudinary Provider in Your Strapi Backend

In your Strapi backend project (NOT the React frontend):

```bash
npm install @strapi/provider-upload-cloudinary
```

#### Step 3: Configure Strapi to Use Cloudinary

In your Strapi backend, create/edit `config/plugins.js`:

```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
```

#### Step 4: Add Environment Variables to Render

1. Go to your Render dashboard
2. Click on your **Strapi backend** service
3. Go to **Environment** tab
4. Add these variables:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   ```

#### Step 5: Re-upload Your Images

Since your local images aren't on Cloudinary yet, you need to:

1. Go to your production Strapi admin: `https://smfm-strapi-backend.onrender.com/admin`
2. For each episode/show/artist:
   - Edit the entry
   - Re-upload the image
   - Save

The images will now be stored in Cloudinary and accessible from anywhere!

---

### Option B: Use Render Disk Storage (Paid)

If you don't want to use Cloudinary, you can add persistent disk storage to your Render service:

1. Go to Render dashboard → Your Strapi service
2. Click "Disks" in the left sidebar
3. Add a new disk:
   - Name: `strapi-uploads`
   - Mount Path: `/opt/render/project/src/public/uploads`
   - Size: 1GB (or more as needed)

**Note:** This costs $1/month per GB.

Then re-upload all images through the Strapi admin panel.

---

### Option C: Quick Test with Public URL

For testing purposes only, you can temporarily use a public image URL:

1. Upload an image to a free service like https://imgur.com
2. In Strapi admin, edit an episode
3. Use the image URL from imgur

This is NOT recommended for production but helps you test that everything else works.

---

## Re-uploading Local Images

If you have many images and don't want to manually re-upload them all:

### Script to Upload Local Images to Cloudinary

You can create a script to bulk upload your local images. Here's a basic example:

```javascript
// upload-images.js (run in your Strapi backend folder)
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

const uploadDir = './public/uploads';

async function uploadImages() {
  const files = fs.readdirSync(uploadDir);

  for (const file of files) {
    const filePath = path.join(uploadDir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: file.split('.')[0],
        folder: 'strapi-uploads'
      });
      console.log(`✅ Uploaded: ${file} -> ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }
}

uploadImages();
```

Run with: `node upload-images.js`

**Note:** This uploads the files but doesn't update the database records. You'd still need to update the URLs in Strapi.

---

## Testing the Fix

After configuring Cloudinary and re-uploading images:

1. Visit an episode in Strapi admin
2. Check that the image URL now starts with `https://res.cloudinary.com/...`
3. Test on your frontend: `https://smfm-react-frontend.onrender.com`
4. Images should now load!

---

## Why This Happened

This is a common issue when deploying Strapi:

- **Local Development**: Uses local filesystem storage (easy, but not cloud-ready)
- **Production**: Needs persistent, shared storage (Cloudinary, S3, etc.)

Render's filesystem is ephemeral - it resets on each deploy, so uploaded files would disappear anyway.

---

## Summary

**Quick Fix (5 minutes):**
1. Sign up for Cloudinary (free)
2. Install `@strapi/provider-upload-cloudinary` in Strapi backend
3. Configure `config/plugins.js`
4. Add environment variables to Render
5. Re-upload images through Strapi admin

**Result:** Images stored in cloud, accessible forever, survive restarts ✅

---

## Need Help?

If you get stuck:
1. Check Cloudinary docs: https://cloudinary.com/documentation/node_integration
2. Check Strapi upload docs: https://docs.strapi.io/dev-docs/providers
3. Share any error messages and I'll help debug!
