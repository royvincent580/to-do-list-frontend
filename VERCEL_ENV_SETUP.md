# Vercel Environment Variable Setup

## Fix the 405 Error on Vercel

Your app works locally but fails on Vercel because the environment variable is missing.

### Steps to Fix:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your `to-do-list-frontend` project

2. **Add Environment Variable**
   - Go to **Settings** → **Environment Variables**
   - Add:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://to-do-list-backend-04i3.onrender.com`
     - **Environments**: Check all (Production, Preview, Development)

3. **Redeploy**
   - Go to **Deployments** tab
   - Click the **3 dots** on latest deployment
   - Click **Redeploy**

### That's it!
Your app will now work on Vercel with the correct backend URL.