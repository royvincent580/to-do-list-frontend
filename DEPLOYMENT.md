# Deploy Frontend to Vercel

## Quick Setup

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" 
   - Import your GitHub repo
   - Add environment variable:
     - `VITE_API_URL` = `https://to-do-list-backend-04i3.onrender.com`
   - Click "Deploy"

## Done!
Your frontend will connect to your Render backend automatically.