'use client'

import React, { useState } from 'react'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UnstuckIcon, PdfIcon } from '@/components/icons'
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


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <UnstuckIcon 
            width={32} 
            height={32} 
            className="text-primary" 
          />
          <h1 className="text-3xl font-semibold text-foreground">
            Unstuck Quiz Generator
          </h1>
        </div>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          Generate quiz from your course materials, or textbooks to help you study faster and smarter.
        </p>
      </div>

      {/* File Upload Section */}
      <div>
        <FileUpload
          accept="application/pdf"
          maxFiles={1}
          maxSize={10 * 1024 * 1024} // 10MB
          onValueChange={handleFilesChange}
          onFileAccept={handleFileAccept}
          onFileReject={handleFileReject}
          disabled={uploadMutation.isPending}
        >
          <FileUploadDropzone className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center cursor-pointer transition-all duration-200 hover:border-primary/60 hover:bg-gray-50/50 bg-white">
            {/* PDF Icon */}
            <div className="flex justify-center mb-6">
              <PdfIcon 
                width={64} 
                height={64} 
                className="text-muted-foreground" 
              />
            </div>

            {/* Upload Content */}
            <div className="space-y-3">
              <FileUploadTrigger asChild>
                <Button variant="link" className="text-primary hover:text-primary/80 font-medium text-base p-0 h-auto">
                  Click to upload
                </Button>
              </FileUploadTrigger>
              <p className="text-gray-500 text-base">
                or drag and drop files
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Drop Course Materials and start generating - for <span className="uppercase font-medium">FREE</span>
              </p>
            </div>
          </FileUploadDropzone>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <FileUploadList className="mt-6">
              {uploadedFiles.map((file) => (
                <FileUploadItem key={file.name} value={file}>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <FileUploadItemPreview className="w-10 h-10 flex-shrink-0" />
                    <FileUploadItemMetadata className="flex-1 min-w-0 text-sm" />
                    {!uploadMutation.isPending && !uploadMutation.isSuccess && (
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          Remove
                        </Button>
                      </FileUploadItemDelete>
                    )}
                  </div>
                </FileUploadItem>
              ))}
            </FileUploadList>
          )}

          {/* Progress and Status */}
          {uploadMutation.isPending && (
            <div className="mt-8 space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-foreground">Generating Quiz Questions</h3>
                <p className="text-sm text-muted-foreground">Reading your materials...</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                        <span className="text-xs font-medium">1</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-400">2</span>
                      </div>
                      <span className="text-xs text-gray-400">Process</span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-400">3</span>
                      </div>
                      <span className="text-xs text-gray-400">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadMutation.isSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Questions generated successfully!</span>
              </div>
            </div>
          )}

          {uploadMutation.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-900">Upload Failed</p>
                  <p className="text-sm text-red-700 mt-1">
                    {uploadMutation.error.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Please ensure your PDF contains readable text and try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </FileUpload>
      </div>
    </div>
  )
}