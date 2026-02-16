import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Brain, LogOut, Sparkles, MessageCircle, BarChart3, Loader2, Upload, Globe, FileText } from 'lucide-react';
import { ChatInterface } from '@/components/ChatInterface';
import { FileUpload } from '@/components/ui/file-upload';
import { WebScraper } from '@/components/WebScraper';
import { SimpleThemeToggle } from '@/components/ui/theme-toggle';
import { analyzeText, summarizeText } from '@/lib/openai';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('text');
  const [contentSource, setContentSource] = useState<{
    type: 'text' | 'file' | 'web';
    source?: string;
  }>({ type: 'text' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleFileUpload = (content: string, fileName: string) => {
    setText(content);
    setContentSource({ type: 'file', source: fileName });
    setActiveTab('analysis');
    toast.success(`File "${fileName}" loaded successfully!`);
  };

  const handleWebContent = (content: string, url: string) => {
    setText(content);
    setContentSource({ type: 'web', source: url });
    setActiveTab('analysis');
    toast.success('Web content extracted successfully!');
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const data = await summarizeText(text);

      setResult({ type: 'summary', content: data.summary });
      
      // Save to logs (will fail silently if table doesn't exist)
      try {
        await supabase.from('contextiq_logs').insert({
          user_id: user?.id,
          text: text.substring(0, 500),
          result: data.summary,
          type: 'summary'
        });
      } catch (logError) {
        console.warn('Failed to save log:', logError);
      }

      toast.success('Summary generated!');
    } catch (error: any) {
      console.error('Summarize error:', error);
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const data = await analyzeText(text);

      setResult({ type: 'analysis', content: data.analysis });
      
      // Save to logs (will fail silently if table doesn't exist)
      try {
        await supabase.from('contextiq_logs').insert({
          user_id: user?.id,
          text: text.substring(0, 500),
          result: JSON.stringify(data.analysis),
          type: 'analyze'
        });
      } catch (logError) {
        console.warn('Failed to save log:', logError);
      }

      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error('Analyze error:', error);
      toast.error(error.message || 'Failed to analyze text');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-accent to-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-accent to-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ContextIQ
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-muted">{user?.email}</span>
            <SimpleThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">AI Text Analysis</h2>
            <p className="text-foreground-muted">
              Analyze, summarize, and chat with any text using advanced AI
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Text Input
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Web Scraper
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Manual Text Input</CardTitle>
                  <CardDescription>
                    Paste or type any text you want to analyze
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text here..."
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setContentSource({ type: 'text' });
                    }}
                    className="min-h-[300px] resize-none"
                  />
                  {text && (
                    <div className="text-sm text-muted-foreground">
                      {text.length} characters • {text.split(/\s+/).length} words
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <FileUpload onFileSelect={handleFileUpload} />
            </TabsContent>

            <TabsContent value="web" className="mt-6">
              <WebScraper onContentExtracted={handleWebContent} />
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              <div className="space-y-6">
                {contentSource.source && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Content loaded from:
                      </div>
                      <div className="flex items-center gap-2">
                        {contentSource.type === 'file' && <Upload className="w-4 h-4" />}
                        {contentSource.type === 'web' && <Globe className="w-4 h-4" />}
                        {contentSource.type === 'text' && <FileText className="w-4 h-4" />}
                        <span className="font-medium truncate">{contentSource.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-2 items-start">
                  <Card className="shadow-elegant">
                    <CardHeader>
                      <CardTitle>AI Analysis & Actions</CardTitle>
                      <CardDescription>
                        Choose how you want to process your content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {text && (
                        <div className="p-4 bg-muted/50 rounded-lg max-h-32 overflow-y-auto">
                          <div className="text-sm text-muted-foreground mb-2">Preview:</div>
                          <p className="text-sm line-clamp-3">{text.substring(0, 200)}...</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          onClick={handleSummarize} 
                          disabled={processing || !text.trim()}
                          className="h-auto py-4 flex-col gap-2"
                        >
                          {processing ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Sparkles className="w-6 h-6" />
                          )}
                          <div>
                            <div className="font-semibold">Summarize</div>
                            <div className="text-xs opacity-80">Get a concise summary</div>
                          </div>
                        </Button>
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={processing || !text.trim()}
                          variant="secondary"
                          className="h-auto py-4 flex-col gap-2"
                        >
                          {processing ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <BarChart3 className="w-6 h-6" />
                          )}
                          <div>
                            <div className="font-semibold">Analyze</div>
                            <div className="text-xs opacity-80">Extract insights & themes</div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {text && (
                    <Card className="shadow-elegant flex flex-col h-[500px]">
                      <CardHeader className="flex-shrink-0 pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          Chat with AI
                        </CardTitle>
                        <CardDescription>
                          Ask questions about your content
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 min-h-0 p-4 pt-0">
                        <ChatInterface context={text} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {result && (
            <Card className="shadow-elegant animate-in slide-in-from-bottom-4">
              <CardHeader>
                <CardTitle>
                  {result.type === 'summary' ? 'Summary' : 'Analysis Results'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.type === 'summary' ? (
                  <p className="text-foreground leading-relaxed">{result.content}</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Sentiment:</h4>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {result.content.sentiment}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Themes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.content.themes?.map((theme: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.content.keywords?.map((keyword: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;