import React, { useRef, useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Upload, File, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.txt,.md,.pdf,.doc,.docx',
  maxSize = 5,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileRead = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileSelect(content, file.name)
      setSelectedFile(file)
    }
    reader.readAsText(file)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = accept.replace(/\./g, '').split(',')
    
    if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      alert(`File type not supported. Allowed: ${accept}`)
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
              <File className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">
                ({Math.round(selectedFile.size / 1024)}KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
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
                Supported: {accept}
              </p>
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
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
      </div>
    </div>
  )
}