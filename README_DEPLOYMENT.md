# ContextIQ Deployment Guide

## 🚀 Vercel Deployment Setup

### Prerequisites
- GitHub repository connected to Vercel
- Supabase project configured
- Environment variables ready

### Environment Variables Required

Add these to your Vercel project settings:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Supabase Edge Functions (Set in Supabase Dashboard)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### Deployment Steps

1. **Automatic Deployment**: 
   - Vercel will auto-deploy when you push to main branch
   - Check deployment status at: https://vercel.com/dashboard

2. **Manual Deployment**:
   ```bash
   npx vercel --prod
   ```

### Features Included
- ✅ Web scraping with multiple proxy fallbacks
- ✅ Chat interface with OpenAI integration
- ✅ File upload with support for:
  - 📄 Documents: TXT, MD, CSV, RTF, PDF, DOCX
  - 🖼️ Images: JPG, PNG, GIF, BMP, WEBP (OCR)
- ✅ Google OAuth authentication
- ✅ Responsive design
- ✅ Production optimizations

### Build Configuration
- Framework: Vite + React + TypeScript
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Runtime: 18.x

### Supabase Edge Functions
Ensure these functions are deployed:
- `scrape` - Web content extraction
- `chat` - AI chat functionality
- `summarize` - Content summarization
- `analyze` - Content analysis

### Troubleshooting
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure Supabase functions are deployed
- Check CORS settings for your domain