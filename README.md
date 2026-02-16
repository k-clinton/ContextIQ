# 🧠 ContextIQ

<div align="center">

![ContextIQ Banner](https://img.shields.io/badge/ContextIQ-AI%20Text%20Analysis-blue?style=for-the-badge&logo=brain)

**Transform any text into actionable insights with AI-powered analysis**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Features](#features) • [🏗️ Architecture](#architecture) • [💡 Usage](#usage) • [📋 Roadmap](#roadmap)

</div>

---

## ✨ Features

### 🔍 **AI-Powered Text Analysis**

- **Sentiment Analysis** - Detect emotional tone (positive, negative, neutral, mixed) using GPT-4o-mini
- **Theme Extraction** - Automatically identify key topics and subjects from your content
- **Keyword Discovery** - Extract important terms and phrases with AI precision
- **Structured Analysis** - Get organized results with sentiment, themes, and keywords in JSON format
- **Real-time Processing** - Instant analysis powered by OpenAI's latest models

### 💬 **Intelligent Chat Interface**

- **Context-Aware Conversations** - Chat with AI about your uploaded or scraped content
- **Conversation History** - AI maintains context throughout the entire conversation
- **Interactive Q&A** - Ask follow-up questions and get detailed explanations
- **Real-time Responses** - Seamless streaming chat experience
- **Smart Contextual Understanding** - AI references the content you're analyzing

### 📝 **Multiple Input Methods**

#### Direct Text Input
- Type or paste content directly into the editor
- Real-time character and word count
- Support for any plain text content

#### Advanced File Upload
- **Documents**: TXT, MD, CSV, RTF files
- **PDF Support**: Automatic text extraction from PDF documents
- **Word Documents**: DOCX file processing (legacy .doc not supported)
- **Image OCR**: Extract text from JPG, PNG, GIF, BMP, WEBP images using Tesseract.js
- **Drag & Drop**: Easy file handling with visual feedback
- **File Validation**: Size limits (15MB) and format checking
- **Progress Indicators**: Real-time processing status

#### Web Scraping
- **URL Content Extraction**: Scrape and analyze any webpage
- **Multiple Proxy Support**: Fallback mechanisms for reliability
- **Smart Content Parsing**: Extracts main content areas (article, main, content divs)
- **Clean Text Extraction**: Removes scripts, styles, navigation, headers, and footers
- **Edge Function Integration**: Primary scraping via Supabase Edge Functions
- **CORS Proxy Fallback**: Multiple proxy services for broader website compatibility

### 📊 **Smart Content Processing**

- **AI Summarization** - Generate concise summaries (under 150 words) of any text
- **Content Preview** - See extracted content before processing
- **Source Tracking** - Visual indicators showing content origin (text, file, or web)
- **Word & Character Count** - Real-time content statistics
- **Multi-tab Interface** - Organized workflow: Text Input → File Upload → Web Scraper → Analysis

### 🎨 **Beautiful User Experience**

- **Modern UI** - Clean, professional design with shadcn/ui components
- **Dark/Light Mode** - Adaptive theme system with system preference detection
- **Smooth Animations** - Elegant transitions and loading states
- **Mobile Responsive** - Fully responsive design works on all devices
- **Gradient Accents** - Eye-catching gradient backgrounds and effects
- **Intuitive Navigation** - Tab-based interface for easy content switching

### 🔐 **Secure & Scalable**

- **User Authentication** - Secure email/password login with Supabase Auth
- **Row Level Security** - Database policies ensure users only access their own data
- **Data Privacy** - Content processed securely through edge functions
- **Serverless Architecture** - Scalable Deno-based Edge Functions
- **Analysis History** - Store and retrieve past analyses in PostgreSQL
- **Activity Logging** - Track summaries, analyses, and chat interactions

---

## 💡 Usage

### Getting Started

1. **Sign Up/Sign In** - Create an account or log in to access the dashboard
2. **Choose Your Input Method** - Select from text input, file upload, or web scraping
3. **Process Content** - Use AI to summarize or analyze your content
4. **Chat with AI** - Ask questions and get insights about your content

### 📄 Text Analysis Workflow

1. **Input Content**
   - **Text Tab**: Paste or type directly (includes character/word count)
   - **Upload Tab**: Drop files or browse (.txt, .md, .pdf, .docx, images)
   - **Web Tab**: Enter any URL to scrape content

2. **View Content**
   - Navigate to the **Analysis Tab** to see your loaded content
   - Preview shows content source (file name or URL)
   - See content statistics before processing

3. **Choose Analysis Type**
   - **Summarize**: Get a concise summary (under 150 words)
   - **Analyze**: Extract sentiment, themes, and keywords

4. **Chat with AI**
   - Use the integrated chat interface to ask questions
   - AI has full context of your content
   - Get explanations, insights, and deeper understanding

### 🌐 Web Scraping Example

```typescript
// Simply enter a URL in the Web Scraper tab
const url = "https://example.com/article";
// ContextIQ automatically:
// 1. Fetches the webpage
// 2. Extracts main content (removes nav, ads, scripts)
// 3. Cleans and formats the text
// 4. Makes it ready for analysis
```

### 📁 File Upload Examples

```typescript
// Supported file types:
// Text files: .txt, .md, .csv, .rtf
// Documents: .pdf, .docx (extracts text automatically)
// Images: .jpg, .png, .gif, .bmp, .webp (uses OCR)

// Just drag and drop or click to browse
// Max file size: 15MB
```

### 💬 AI Chat Examples

```typescript
// Ask specific questions about your content
"What are the main themes in this article?"
"Can you explain the sentiment analysis?"
"Summarize the key points in bullet form"
"What tone does the author use?"
"Are there any controversial points mentioned?"
```

---

## 🏗️ Architecture

### Frontend Stack

- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.8.3** - Type-safe development with full type coverage
- **Vite 7.2.4** - Lightning-fast build tool and dev server with HMR
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library built on Radix UI
- **React Router 6.30.1** - Client-side routing and navigation
- **TanStack Query 5.83.0** - Powerful async state management
- **next-themes** - Dark/light mode with system preference support

### Document Processing Libraries

- **pdfjs-dist** - PDF text extraction
- **mammoth** - DOCX file processing
- **tesseract.js** - OCR for image text extraction

### Backend Stack

- **Supabase** - Complete Backend-as-a-Service platform
  - **PostgreSQL** - Robust relational database with RLS policies
  - **Supabase Auth** - Email/password authentication
  - **Edge Functions** - Serverless Deno runtime functions
  - **Row Level Security** - Database-level access control
- **OpenAI GPT-4o-mini** - AI-powered text analysis and chat
- **Deno Runtime** - Secure, modern runtime for edge functions

### Edge Functions (Serverless)

1. **`/analyze`** - Sentiment analysis, theme extraction, keyword identification
2. **`/summarize`** - Text summarization (under 150 words)
3. **`/chat`** - Context-aware conversational AI
4. **`/scrape`** - Web content extraction and cleaning

### Database Schema

```sql
-- User profiles with authentication
profiles (id, email, full_name, avatar_url, created_at, updated_at)

-- Analysis history logs
contextiq_logs (id, user_id, text, result, type, metadata, created_at)
  - Types: 'summary', 'chat', 'analyze'
  
-- Role-based access control
user_roles (id, user_id, role, created_at)
  - Roles: 'admin', 'user'
```

---

## 🎯 Use Cases

### 📰 Content Research & Analysis

Perfect for researchers, journalists, and students:
- Quickly summarize lengthy articles and research papers
- Extract key themes and topics from academic content
- Analyze sentiment in news articles or social media content
- Compare perspectives across multiple sources

### 📚 Document Processing

Streamline document workflows:
- Extract and summarize content from PDFs and Word documents
- Convert scanned documents to searchable text with OCR
- Analyze contracts, reports, and business documents
- Get quick insights from lengthy documents

### 🌐 Web Content Intelligence

Make sense of online content:
- Summarize blog posts and news articles
- Extract key information from product pages
- Analyze competitor websites and content
- Research topics across multiple web sources

### 💼 Business & Productivity

Enhance your workflow:
- Summarize meeting notes and transcripts
- Analyze customer feedback and reviews
- Extract action items from documents
- Get quick insights for decision-making

### 🎓 Education & Learning

Support learning and comprehension:
- Summarize study materials and textbooks
- Get AI explanations of complex topics
- Extract key concepts from lectures
- Interactive Q&A for deeper understanding

---

## 📋 Roadmap

### ✅ Completed Features

- [x] AI-powered text analysis (sentiment, themes, keywords)
- [x] AI summarization with GPT-4o-mini
- [x] Context-aware chat interface
- [x] PDF and DOCX document processing
- [x] Image OCR text extraction
- [x] Web scraping with multiple fallbacks
- [x] User authentication and profiles
- [x] Analysis history logging
- [x] Dark/light mode theme
- [x] Responsive mobile design

### 🚀 Planned Features

- [ ] **Export Functionality** - Download analysis results as PDF, JSON, or Markdown
- [ ] **Batch Processing** - Analyze multiple documents simultaneously
- [ ] **Analysis History Dashboard** - View and search past analyses
- [ ] **Advanced Visualizations** - Word clouds, sentiment graphs, theme charts
- [ ] **Browser Extension** - Analyze web content directly from your browser
- [ ] **API Access** - RESTful API for third-party integrations
- [ ] **Team Collaboration** - Share analyses with team members
- [ ] **Multi-language Support** - Support for non-English text analysis
- [ ] **Custom AI Prompts** - User-defined analysis parameters
- [ ] **File Comparison** - Compare and contrast multiple documents
- [ ] **Audio Transcription** - Transcribe and analyze audio files
- [ ] **Video Subtitle Analysis** - Extract and analyze video subtitles
- [ ] **Integration Webhooks** - Connect with Slack, Discord, and other platforms

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ClintoKe/contextiq.git
   cd contextiq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/` to set up the database
   - Deploy the edge functions in `supabase/functions/`
   - Add your OpenAI API key to Supabase secrets:
     ```bash
     supabase secrets set OPENAI_API_KEY=your_openai_api_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

### Deployment

The project is configured for easy deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

See [README_DEPLOYMENT.md](README_DEPLOYMENT.md) for detailed deployment instructions.

---

## 🙏 Acknowledgments

- **OpenAI** for providing powerful GPT-4o-mini language models
- **Supabase** for the excellent backend-as-a-service platform
- **shadcn/ui** for the beautiful component library
- **Radix UI** for accessible, unstyled component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for hosting and deployment inspiration
- **Mozilla PDF.js** for PDF text extraction
- **Tesseract.js** for OCR capabilities

---

## 📞 Support

Having issues? We're here to help!

- 📧 **Email**: kingclinn40931@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ClintoKe/contextiq/issues)
- 💬 **Questions**: Use GitHub Discussions for community support

---

## 📄 License

This project is open source and available for educational and commercial use.

---

<div align="center">

**Made with ❤️ by KCTech**

⭐ Star us on GitHub if you find ContextIQ helpful!

[Report Bug](https://github.com/ClintoKe/contextiq/issues) • [Request Feature](https://github.com/ClintoKe/contextiq/issues)

</div>
