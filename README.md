# 🧠 ContextIQ

<div align="center">

![ContextIQ Banner](https://img.shields.io/badge/ContextIQ-AI%20Text%20Analysis-blue?style=for-the-badge&logo=brain)

**Transform any text into actionable insights with AI-powered analysis**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🛠️ Installation](#installation) • [💡 Examples](#usage)

</div>

---

## ✨ Features

### 🔍 **AI-Powered Text Analysis**

- **Sentiment Analysis** - Detect emotional tone (positive, negative, neutral, mixed)
- **Theme Extraction** - Identify key topics and subjects
- **Keyword Discovery** - Extract important terms and phrases
- **Real-time Processing** - Instant analysis with OpenAI GPT-4o-mini

### 💬 **Intelligent Chat Interface**

- **Context-Aware Conversations** - Chat about your analyzed content
- **Memory Retention** - AI remembers conversation history
- **Interactive Q&A** - Ask questions about your text
- **Real-time Responses** - Seamless chat experience

### 📝 **Multiple Input Methods**

- **Direct Text Input** - Type or paste content directly
- **File Upload** - Support for text files (.txt, .md, .rtf)
- **Web Scraping** - Extract content from any URL
- **Drag & Drop** - Easy file handling

### 📊 **Smart Content Processing**

- **Auto-summarization** - Generate concise summaries
- **Content Preview** - See processed content before analysis
- **Source Tracking** - Track where your content came from
- **Word & Character Count** - Real-time content statistics

### 🎨 **Beautiful User Experience**

- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Dark/Light Mode** - Adaptive theme system
- **Smooth Animations** - Elegant transitions and interactions
- **Mobile Responsive** - Works perfectly on all devices

### 🔐 **Secure & Scalable**

- **User Authentication** - Secure login with Supabase Auth
- **Data Privacy** - Your content is processed securely
- **Serverless Functions** - Scalable Edge Functions
- **Real-time Database** - Store and retrieve analysis history

---

## 💡 Usage

### 📄 Text Analysis

1. **Input your content** via text, file upload, or web scraping
2. **Choose analysis type** - Summary or detailed analysis
3. **Get instant insights** - Sentiment, themes, and keywords
4. **Chat with AI** about your content for deeper understanding

### 🌐 Web Scraping

```typescript
// Automatically extracts content from web pages
const url = "https://example.com/article";
// ContextIQ handles parsing and cleaning
```

### 💬 AI Chat

```typescript
// Context-aware conversations
"What are the main themes in this article?";
"Can you explain the sentiment analysis?";
"Summarize the key points for me";
```

---

## 🏗️ Architecture

### Frontend Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **React Query** - Server state management
- **Vite** - Fast build tool and dev server

### Backend Stack

- **Supabase** - Backend-as-a-Service
  - Authentication & user management
  - PostgreSQL database
  - Real-time subscriptions
  - Edge Functions (Deno runtime)
- **OpenAI GPT-4o-mini** - AI text processing
- **CORS Proxy** - Web scraping capabilities

---

## 🎯 Examples

### Analyzing a Blog Post

```typescript
const content = `
Artificial intelligence is revolutionizing how we work and live.
From automated customer service to advanced medical diagnostics,
AI is making our world more efficient and innovative.
`;

// Results:
// Sentiment: positive
// Themes: ["technology", "automation", "innovation"]
// Keywords: ["artificial intelligence", "AI", "automation", "efficiency"]
```

### Web Content Analysis

```typescript
// Scrape and analyze any webpage
const url = "https://techcrunch.com/latest-ai-article";
// Automatically extracts main content and provides insights
```

---

## 📋 Roadmap

- [ ] **Multi-language Support** - Support for non-English text
- [ ] **Document Analysis** - PDF and Word document processing
- [ ] **Batch Processing** - Analyze multiple documents at once
- [ ] **Export Features** - Download analysis results
- [ ] **Team Collaboration** - Share analyses with team members
- [ ] **API Access** - RESTful API for integration
- [ ] **Advanced Visualizations** - Charts and graphs for insights
- [ ] **Custom Models** - Fine-tuned AI models for specific domains

---

---

## 🙏 Acknowledgments

- **OpenAI** for providing powerful language models
- **Supabase** for the excellent backend platform
- **Vercel** for inspiration on modern web development
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first approach

---

## 📞 Support

Having issues? We're here to help!

- 📧 **Email**: kingclinn40931@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ClintoKe/contextiq/issues)

---

<div align="center">

**Made with ❤️ by CKTech**

⭐ Star us on GitHub if you find ContextIQ helpful!

</div>
