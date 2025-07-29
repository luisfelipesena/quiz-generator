'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuizStore } from '@/stores/quiz-store'

export function PdfUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { setQuestions, setCurrentStep } = useQuizStore()

  const uploadMutation = useMutation({
    mutationFn: api.uploadPdf,
    onSuccess: (data) => {
      setQuestions(data.questions)
      setCurrentStep('edit')
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: uploadMutation.isPending,
  })

  const handleUpload = () => {
    if (uploadedFile) {
      uploadMutation.mutate(uploadedFile)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    uploadMutation.reset()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">PDF Quiz Generator</h1>
        <p className="text-muted-foreground">
          Upload a PDF document to generate quiz questions automatically
        </p>
      </div>

      <Card className="p-8">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${uploadMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop your PDF here' : 'Upload your PDF'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop a PDF file here, or click to select one
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                disabled={uploadMutation.isPending}
              >
                Remove
              </Button>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="flex-1"
              >
                {uploadMutation.isPending ? 'Generating Questions...' : 'Generate Quiz'}
              </Button>
            </div>
          </div>
        )}

        {uploadMutation.error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Upload Failed</p>
              <p className="text-sm text-destructive/80">
                {uploadMutation.error.message}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}