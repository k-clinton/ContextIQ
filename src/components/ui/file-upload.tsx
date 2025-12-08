import React, { useRef, useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// PDF extraction helper function
const extractPDFText = async (file: File): Promise<string> => {
  try {
    // Dynamic import to avoid bundling issues
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
    
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      
      fullText += pageText + '\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.txt,.md,.pdf,.doc,.docx,.rtf,.csv',
  maxSize = 10,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileRead = async (file: File) => {
    setIsProcessing(true)
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      let content = ''
      
      // Handle different file types
      switch (fileExtension) {
        case 'pdf':
          try {
            content = await extractPDFText(file)
          } catch (pdfError) {
            toast.error('Failed to extract text from PDF. Please convert to text first.')
            setIsProcessing(false)
            return
          }
          break
        case 'doc':
        case 'docx':
          toast.error('Word documents are not yet supported. Please save as .txt first.')
          setIsProcessing(false)
          return
        case 'txt':
        case 'md':
        case 'csv':
        case 'rtf':
        default:
          // Read as text file
          content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string || '')
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsText(file, 'UTF-8')
          })
          break
      }
      
      // Basic content validation
      if (!content || content.trim().length === 0) {
        throw new Error('File appears to be empty or unreadable')
      }
      
      // Clean up content
      content = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim()
      
      if (content.length < 10) {
        throw new Error('File content is too short to process')
      }
      
      onFileSelect(content, file.name)
      setSelectedFile(file)
      toast.success(`Successfully loaded "${file.name}" (${content.length} characters)`)
      
    } catch (error) {
      console.error('File processing error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process file content')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (isProcessing) return

    const file = files[0]
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB. Current file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      return
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = accept.replace(/\./g, '').split(',')
    
    if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      toast.error(`File type not supported. Allowed formats: ${accept}`)
      return
    }

    handleFileRead(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        {selectedFile ? (
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({Math.round(selectedFile.size / 1024)}KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium">Processing file...</p>
              <p className="text-sm text-muted-foreground">
                Reading and validating content
              </p>
            </div>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop your document here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse files (max {maxSize}MB)
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: TXT, MD, CSV, RTF, PDF files
              </p>
              <div className="text-xs text-muted-foreground/80 mt-2">
                Note: Word files (.doc/.docx) need to be converted to text format first
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="file-upload" className="sr-only">
          Choose file
        </Label>
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </>
          )}
        </Button>
      </div>
    </div>
  )
}