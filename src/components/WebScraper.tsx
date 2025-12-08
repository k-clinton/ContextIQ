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
      // Using a CORS proxy for web scraping in development
      // In production, you'd want to implement this server-side
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      
      const response = await fetch(proxyUrl)
      const data = await response.json()

      if (!response.ok) {
        throw new Error('Failed to fetch the webpage')
      }

      // Parse HTML content
      const parser = new DOMParser()
      const doc = parser.parseFromString(data.contents, 'text/html')

      // Remove script and style elements
      const scripts = doc.querySelectorAll('script, style, nav, header, footer')
      scripts.forEach(el => el.remove())

      // Extract text content from main content areas
      let content = ''
      const contentSelectors = [
        'main',
        'article', 
        '.content',
        '#content',
        '.post-content',
        '.entry-content',
        '[role="main"]'
      ]

      for (const selector of contentSelectors) {
        const element = doc.querySelector(selector)
        if (element) {
          content = element.textContent || element.innerText || ''
          break
        }
      }

      // Fallback to body if no main content found
      if (!content) {
        content = doc.body?.textContent || doc.body?.innerText || ''
      }

      // Clean up the content
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim()

      if (!content || content.length < 50) {
        throw new Error('Could not extract meaningful content from this webpage')
      }

      onContentExtracted(content, url)
      
      toast({
        title: "Success",
        description: "Webpage content extracted successfully!",
      })

    } catch (error) {
      console.error('Scraping error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape webpage. Please try a different URL.",
        variant: "destructive"
      })
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