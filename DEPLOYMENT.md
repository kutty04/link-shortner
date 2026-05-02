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

## GitHub Actions - Database Cron Job

### What's Configured
The `.github/workflows/database-cron.yml` runs daily at 2 AM UTC to perform database maintenance tasks.

### Configure the Cron Job
You need to set up GitHub Secrets first:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SUPABASE_API_KEY`: Your Supabase service role key (get from Supabase dashboard)
   - `SUPABASE_CRON_WEBHOOK`: The webhook endpoint to call (create in Supabase or your app)

### Edit the Cron Schedule
Edit `.github/workflows/database-cron.yml` to change the schedule. Cron syntax:
```
minute hour day month day-of-week
  0     2    *   *      *        # Daily at 2 AM UTC
```

---

## What You Need to Do

1. **Push to GitHub**: `git push origin main`
2. **Connect Vercel**: Follow Step 1-3 above
3. **Configure Cron Job**: Add GitHub secrets for database maintenance

Your app will auto-deploy when you push to GitHub! 🚀
