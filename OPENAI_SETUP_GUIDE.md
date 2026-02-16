# OpenAI Integration Setup Guide

## ✅ Current Status

Your ContextIQ app is now **fully functional** with OpenAI integration!

### What's Working Now:
- ✅ Text Analysis (Sentiment, Themes, Keywords)
- ✅ Text Summarization
- ✅ AI Chat Interface
- ✅ File Upload (PDF, DOCX, Images with OCR)
- ✅ Web Scraping
- ✅ Authentication

### Current Implementation:
The app is calling OpenAI **directly from the frontend** using your API key. This is a working solution for development and testing.

---

## 🎯 How It Works Now

### Environment Variables (.env)
```env
VITE_SUPABASE_URL=https://nnfxkyihmcvlmpjxmlfl.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
```

### OpenAI Client (`src/lib/openai.ts`)
This file contains three main functions:
- `analyzeText(text)` - Analyzes sentiment, themes, and keywords
- `summarizeText(text)` - Generates concise summaries
- `chatWithAI(message, context, history)` - Powers the chat interface

---

## ⚠️ Important Security Note

**Current Setup (Frontend Direct Calls):**
- ✅ **Pros:** Easy to set up, works immediately, good for development
- ⚠️ **Cons:** API key is exposed in the browser (visible in DevTools)
- 💡 **Recommendation:** This is fine for development, but for production, use edge functions

---

## 🚀 Production Setup (Optional - Future Enhancement)

For production deployment, you should move the OpenAI calls to Supabase Edge Functions to keep your API key secure.

### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

### Step 2: Link Your Project

```bash
npx supabase link --project-ref nnfxkyihmcvlmpjxmlfl
```

### Step 3: Set OpenAI API Key as Secret

```bash
npx supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

### Step 4: Deploy Edge Functions

```bash
npx supabase functions deploy analyze
npx supabase functions deploy chat
npx supabase functions deploy summarize
npx supabase functions deploy scrape
```

### Step 5: Update Code to Use Edge Functions

Revert the changes in `src/pages/Dashboard.tsx` and `src/components/ChatInterface.tsx` to use:

```typescript
// Instead of:
const data = await analyzeText(text);

// Use:
const { data, error } = await supabase.functions.invoke('analyze', {
  body: { text }
});
```

---

## 🧪 Testing Your Current Setup

### Test Analysis Feature:
1. Open http://localhost:8081/
2. Sign up or sign in
3. Go to the "Text Input" tab
4. Enter some text (e.g., "I love this amazing product!")
5. Click "Analyze" - should show sentiment, themes, and keywords

### Test Summarize Feature:
1. Enter a longer text
2. Click "Summarize" - should generate a concise summary

### Test Chat Feature:
1. After entering text, you'll see the chat interface
2. Ask questions like "What is the main theme?"
3. AI should respond based on your content

### Test File Upload:
1. Go to "Upload File" tab
2. Upload a PDF, DOCX, or image file
3. Content should be extracted automatically

### Test Web Scraper:
1. Go to "Web Scraper" tab
2. Enter a URL (e.g., https://example.com)
3. Content should be extracted and ready for analysis

---

## 🔧 Troubleshooting

### If you get "OpenAI API error: 401"
- Your API key is invalid or expired
- Get a new key from https://platform.openai.com/api-keys
- Update `.env` with the new key
- Restart the dev server: `npm run dev`

### If you get "OpenAI API error: 429"
- You've exceeded your rate limit
- Wait a few moments and try again
- Consider upgrading your OpenAI plan

### If features don't work after sign-in
- Check browser console for errors (F12)
- Ensure `.env` file has the correct API key
- Restart the dev server

### If authentication fails
- The current Supabase key is a demo key
- For production, get your real Supabase anon key from:
  https://supabase.com/dashboard/project/nnfxkyihmcvlmpjxmlfl/settings/api

---

## 📊 Database Setup (Optional)

To enable activity logging, run the database migration:

```bash
npx supabase db push
```

This creates the `contextiq_logs` table to track user activities.

---

## 🎉 You're All Set!

Your app is now fully functional with:
- ✅ OpenAI GPT-4o-mini integration
- ✅ Text analysis and summarization
- ✅ Intelligent chat interface
- ✅ File upload support (PDF, DOCX, images)
- ✅ Web scraping capabilities

### Access your app:
🔗 **http://localhost:8081/**

### Next Steps:
1. Test all features thoroughly
2. Customize the UI/UX as needed
3. When ready for production, follow the "Production Setup" guide above
4. Deploy to Vercel (instructions in README_DEPLOYMENT.md)

---

## 💡 Tips

- **API Key Security:** Never commit `.env` to git (it's already in `.gitignore`)
- **OpenAI Costs:** Monitor your usage at https://platform.openai.com/usage
- **Rate Limits:** GPT-4o-mini has generous limits, but consider implementing rate limiting
- **Context Length:** Keep text under 4000 characters for best results

---

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Check the terminal for server errors
3. Verify your API keys are correct
4. Ensure you have internet connectivity

Happy analyzing! 🎉
