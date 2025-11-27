import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Brain, LogOut, Sparkles, MessageCircle, BarChart3, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

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

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('summarize', {
        body: { text }
      });

      if (error) throw error;

      setResult({ type: 'summary', content: data.summary });
      
      // Save to logs
      await supabase.from('contextiq_logs').insert({
        user_id: user?.id,
        text: text.substring(0, 500),
        result: data.summary,
        type: 'summary'
      });

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
      const { data, error } = await supabase.functions.invoke('analyze', {
        body: { text }
      });

      if (error) throw error;

      setResult({ type: 'analysis', content: data.analysis });
      
      await supabase.from('contextiq_logs').insert({
        user_id: user?.id,
        text: text.substring(0, 500),
        result: JSON.stringify(data.analysis),
        type: 'analyze'
      });

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

          <Card className="mb-8 shadow-elegant">
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>
                Paste or type any text you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSummarize} 
                  disabled={processing || !text.trim()}
                  className="flex-1"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Summarize
                </Button>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={processing || !text.trim()}
                  className="flex-1"
                  variant="secondary"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BarChart3 className="w-4 h-4 mr-2" />
                  )}
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>

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