'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { Upload, Mic, Link as LinkIcon, Loader2 } from 'lucide-react'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file')
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const audioFile = acceptedFiles[0]
      if (audioFile.type.startsWith('audio/')) {
        setFile(audioFile)
      } else {
        toast.error('Please upload an audio file')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.webm']
    },
    maxFiles: 1,
    disabled: uploadType === 'url'
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!title) {
      toast.error('Please enter a meeting title')
      return
    }

    if (uploadType === 'file' && !file) {
      toast.error('Please upload an audio file')
      return
    }

    if (uploadType === 'url' && !audioUrl) {
      toast.error('Please enter an audio URL')
      return
    }

    setIsUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let finalAudioUrl = audioUrl

      // Upload file to Supabase Storage if file upload
      if (uploadType === 'file' && file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError, data } = await supabase.storage
          .from('meeting-audio')
          .upload(fileName, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('meeting-audio')
          .getPublicUrl(fileName)

        finalAudioUrl = publicUrl
      }

      // Create meeting record
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          title,
          audio_url: finalAudioUrl,
        })
        .select()
        .single()

      if (meetingError) {
        throw meetingError
      }

      // Trigger processing
      const response = await fetch('/api/meetings/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: meeting.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process meeting')
      }

      toast.success('Meeting uploaded successfully! Processing...')
      router.push(`/dashboard/meetings/${meeting.id}`)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload meeting')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload New Meeting</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Q4 Planning Meeting"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label>Upload Type</Label>
          <div className="mt-2 flex gap-4">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                uploadType === 'file'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-4 h-4" />
              File Upload
            </button>
            <button
              type="button"
              onClick={() => setUploadType('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                uploadType === 'url'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Audio URL
            </button>
          </div>
        </div>

        {uploadType === 'file' ? (
          <div>
            <Label>Audio File</Label>
            <div
              {...getRootProps()}
              className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {file ? (
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Drop the audio file here'
                      : 'Drag & drop your audio file here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports MP3, WAV, M4A, OGG, WEBM (max 100MB)
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="audioUrl">Audio URL</Label>
            <Input
              id="audioUrl"
              type="url"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/meeting-recording.mp3"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a direct link to your audio file (e.g., from Zoom, Google Meet, etc.)
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Upload & Process'
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/dashboard')}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}