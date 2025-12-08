import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Globe, Loader2, ExternalLink } from 'lucide-react'
import { useToast } from './ui/use-toast'

interface WebScraperProps {
  onContentExtracted: (content: string, url: string) => void
  className?: string
}

export const WebScraper: React.FC<WebScraperProps> = ({ 
  onContentExtracted, 
  className = '' 
}) => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const scrapeWebsite = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      })
      return
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL (include http:// or https://)",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Use Supabase Edge Function as primary method
      try {
        console.log('Using Supabase scrape function...');
        const { supabase } = await import('@/integrations/supabase/client')
        
        const { data, error } = await supabase.functions.invoke('scrape', {
          body: { url }
        })

        if (error) {
          throw new Error(error.message || 'Supabase function failed')
        }

        if (data?.content) {
          onContentExtracted(data.content, url)
          
          toast({
            title: "Success",
            description: "Webpage content extracted successfully!",
          })
          return // Exit early on success
        } else {
          throw new Error('No content returned from Supabase function')
        }
      } catch (supabaseError) {
        console.log('Supabase function failed, falling back to CORS proxies:', supabaseError.message)
      }

      // Fallback to multiple CORS proxy services for better reliability
      const proxyServices = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      ];

      let content = '';
      let success = false;

      for (let i = 0; i < proxyServices.length && !success; i++) {
        try {
          console.log(`Trying proxy service ${i + 1}:`, proxyServices[i]);
          
          const response = await fetch(proxyServices[i], {
            headers: {
              'Accept': 'application/json, text/html, */*',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (!response.ok) {
            console.log(`Proxy ${i + 1} failed with status:`, response.status);
            continue;
          }

          let htmlContent = '';
          
          // Handle different response formats
          if (proxyServices[i].includes('allorigins')) {
            const data = await response.json();
            htmlContent = data.contents || '';
          } else if (proxyServices[i].includes('codetabs')) {
            htmlContent = await response.text();
          } else {
            // For other services, try both JSON and text
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const data = await response.json();
              htmlContent = data.contents || data.data || data.response || '';
            } else {
              htmlContent = await response.text();
            }
          }

          if (!htmlContent) {
            console.log(`Proxy ${i + 1} returned empty content`);
            continue;
          }

          // Parse HTML content
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');

          // Remove script and style elements
          const scripts = doc.querySelectorAll('script, style, nav, header, footer');
          scripts.forEach(el => el.remove());

          // Extract text content from main content areas
          const contentSelectors = [
            'main',
            'article', 
            '.content',
            '#content',
            '.post-content',
            '.entry-content',
            '[role="main"]',
            '.main-content',
            '#main'
          ];

          for (const selector of contentSelectors) {
            const element = doc.querySelector(selector);
            if (element) {
              content = element.textContent || element.innerText || '';
              break;
            }
          }

          // Fallback to body if no main content found
          if (!content) {
            content = doc.body?.textContent || doc.body?.innerText || '';
          }

          // Clean up the content
          content = content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();

          if (content && content.length >= 50) {
            console.log(`Successfully extracted content using proxy ${i + 1}`);
            success = true;
            break;
          } else {
            console.log(`Proxy ${i + 1} content too short:`, content.length);
          }

        } catch (proxyError) {
          console.log(`Proxy ${i + 1} error:`, proxyError.message);
          continue;
        }
      }

      if (!success || !content) {
        throw new Error('Could not extract content from this webpage. The site may be blocking automated access or have no readable content.');
      }

      onContentExtracted(content, url);
      
      toast({
        title: "Success",
        description: "Webpage content extracted successfully!",
      });

    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to scrape webpage. Please try a different URL.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      scrapeWebsite()
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Web Scraper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url-input">Website URL</Label>
          <div className="flex gap-2">
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={scrapeWebsite}
              disabled={!url.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Enter a webpage URL to extract and analyze its content.</p>
          <p className="text-xs mt-1">
            Note: Some websites may block content extraction due to CORS policies.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}