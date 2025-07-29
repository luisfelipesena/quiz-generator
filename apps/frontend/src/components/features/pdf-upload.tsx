'use client'

import React, { useState } from 'react'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  FileUpload, 
  FileUploadDropzone, 
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete
} from '@/components/ui/file-upload'
import { useUploadPdfMutation } from '@/hooks/useQuizMutations'

export function PdfUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const uploadMutation = useUploadPdfMutation()

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleFileAccept = (file: File) => {
    // Auto-start upload when file is accepted
    if (file && file.type === 'application/pdf') {
      uploadMutation.mutate(file)
    }
  }

  const handleFileReject = (file: File, message: string) => {
    console.error('File rejected:', file.name, message)
  }

  // Update progress based on mutation state
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (uploadMutation.isPending) {
      setProgress(10)
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            return 90
          }
          return prev + 10
        })
      }, 500)
    } else if (uploadMutation.isSuccess) {
      if (interval) clearInterval(interval)
      setProgress(100)
    } else if (uploadMutation.isError) {
      if (interval) clearInterval(interval)
      setProgress(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [uploadMutation.isPending, uploadMutation.isSuccess, uploadMutation.isError])

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <svg
              width="38"
              height="36"
              viewBox="0 0 38 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M19 0L23.09 13.82L37 9L23.18 13.09L37 23L23.09 18.18L19 32L14.91 18.18L1 23L14.82 18.91L1 9L14.91 13.82L19 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Unstuck Quiz Generator
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Generate quiz quiz your course materials, or textbooks to help you study faster and smarter.
        </p>
      </div>

      {/* File Upload Section */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <FileUpload
          accept="application/pdf"
          maxFiles={1}
          maxSize={10 * 1024 * 1024} // 10MB
          onValueChange={handleFilesChange}
          onFileAccept={handleFileAccept}
          onFileReject={handleFileReject}
          disabled={uploadMutation.isPending}
          className="p-8"
        >
          <FileUploadDropzone className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-accent/50 data-[dragging]:border-primary data-[dragging]:bg-primary/5 data-[invalid]:border-destructive">
            {/* PDF Stack Illustration */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-20">
                {/* Background PDFs */}
                <div className="absolute top-0 left-2 w-20 h-16 bg-gradient-to-b from-gray-200 to-gray-300 rounded-sm border border-gray-400 opacity-60" />
                <div className="absolute top-1 left-1 w-20 h-16 bg-gradient-to-b from-gray-200 to-gray-300 rounded-sm border border-gray-400 opacity-80" />
                
                {/* Front PDF */}
                <div className="absolute top-2 left-0 w-20 h-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-sm border border-gray-400">
                  {/* PDF Badge */}
                  <div className="absolute bottom-1 right-1 bg-red-600 text-white text-xs font-bold px-1 py-0.5 rounded text-[8px]">
                    PDF
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <FileUploadTrigger asChild>
                  <Button variant="default" className="px-6 py-2">
                    Click to upload
                  </Button>
                </FileUploadTrigger>
                <p className="text-muted-foreground">
                  or drag and drop files
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Drop Course Materials and start generating - for FREE
              </p>
            </div>
          </FileUploadDropzone>

          {/* File List */}
          <FileUploadList className="space-y-4 mt-6">
            {uploadedFiles.map((file) => (
              <FileUploadItem key={file.name} value={file}>
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border">
                  <FileUploadItemPreview className="w-10 h-10 flex-shrink-0" />
                  <FileUploadItemMetadata className="flex-1 min-w-0" />
                  {!uploadMutation.isPending && !uploadMutation.isSuccess && (
                    <FileUploadItemDelete asChild>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </FileUploadItemDelete>
                  )}
                </div>
              </FileUploadItem>
            ))}
          </FileUploadList>

          {/* Progress and Status */}
          {uploadMutation.isPending && (
            <div className="space-y-3 mt-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting text and generating questions...</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                This may take a moment depending on your PDF size
              </p>
            </div>
          )}

          {uploadMutation.isSuccess && (
            <div className="flex items-center space-x-2 text-green-600 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Questions generated successfully!</span>
            </div>
          )}

          {uploadMutation.error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Upload Failed</p>
                  <p className="text-sm text-destructive/80 mt-1">
                    {uploadMutation.error.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please ensure your PDF contains readable text and try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </FileUpload>
      </Card>
    </div>
  )
}