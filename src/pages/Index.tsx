import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Brain, BarChart3, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ContextIQ
              </span>
            </div>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Make the Web
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Intelligent</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Summarize, analyze, and chat with any webpage content using advanced AI. 
              Your personal assistant for understanding the internet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 shadow-glow" onClick={() => navigate('/auth')}>
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand and interact with web content intelligently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 hover:shadow-glow transition-all duration-300 border-2 animate-slide-up">
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Summarization</h3>
            <p className="text-muted-foreground leading-relaxed">
              Instantly condense lengthy articles and documents into concise, 
              actionable summaries powered by advanced language models.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-glow transition-all duration-300 border-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Contextual Chat</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ask questions and get intelligent answers based on the webpage 
              content. Your AI assistant understands context and nuance.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-glow transition-all duration-300 border-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your interactions, analyze sentiment, extract keywords, 
              and gain insights from your browsing patterns.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24">
        <Card className="relative overflow-hidden bg-gradient-primary p-12 md:p-16 text-center shadow-glow">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <Lock className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Browsing?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already using ContextIQ to make sense of the web.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 shadow-xl" onClick={() => navigate('/auth')}>
              Start Free Trial
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ContextIQ
              </span>
            </div>
            <p className="text-muted-foreground text-center md:text-left">
              © 2025 ContextIQ. Empowering intelligent web interactions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
