# Deployment Guide - LinkSnip

## Vercel Deployment (Frontend)

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New" → "Project"
3. Import your `linksnip` repository from GitHub
4. Click "Import"

### Step 2: Set Environment Variables
In Vercel project settings, add these environment variables:
- `VITE_SUPABASE_URL`: https://tipnjxnceiodekxvbxcq.supabase.co
- `VITE_SUPABASE_ANON_KEY`: sb_publishable_kxGdngUr4x-ligLhPUjH5g_zU2xWMzI

### Step 3: Deploy
Click "Deploy" and wait for the build to complete. Your site will be live!

---

## GitHub Actions - Keep Alive Ping

### What's Configured
The `.github/workflows/database-cron.yml` pings your app every 6 hours to keep it and the database alive (prevents Vercel free tier from going idle).

### Update After Deployment
Once your Vercel app is deployed, update the workflow:

1. Edit `.github/workflows/database-cron.yml`
2. Replace `https://your-app.vercel.app/api/ping` with your actual Vercel URL
   - Example: `https://linksnip.vercel.app/api/ping`
3. Push the update: `git push`

### How It Works
- Every 6 hours, GitHub Actions calls `/api/ping`
- The endpoint checks your database connection
- Returns `status: ok` if everything is working

**No GitHub secrets needed!** ✅

---

## What You Need to Do

1. **Push to GitHub**: `git push origin main`
2. **Connect Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Click Deploy
3. **Update Cron Job**: 
   - Once Vercel gives you a URL (e.g., `https://linksnip.vercel.app`), update `.github/workflows/database-cron.yml` with your actual app URL
   - Push the update

Your app will auto-deploy and auto-ping every 6 hours to stay alive! 🚀
