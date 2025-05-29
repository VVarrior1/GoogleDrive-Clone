'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Download, RefreshCw, File, Image, Video, Music } from 'lucide-react'
import { toast } from 'sonner'

interface FileItem {
  name: string
  size: string
  contentType: string
  timeCreated: string
  updated: string
  url: string
}

interface FileListResponse {
  files: FileItem[]
  count: number
}

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/files')
      if (!response.ok) throw new Error('Failed to fetch files')
      
      const data: FileListResponse = await response.json()
      setFiles(data.files)
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (fileName: string) => {
    try {
      setDeleting(fileName)
      const response = await fetch(`/api/files?file=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete file')
      
      setFiles(files.filter(file => file.name !== fileName))
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes)
    if (size === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(size) / Math.log(k))
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />
    if (contentType.startsWith('video/')) return <Video className="h-4 w-4" />
    if (contentType.startsWith('audio/')) return <Music className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getFileTypeColor = (contentType: string) => {
    if (contentType.startsWith('image/')) return 'bg-green-100 text-green-800'
    if (contentType.startsWith('video/')) return 'bg-blue-100 text-blue-800'
    if (contentType.startsWith('audio/')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>Loading files...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            {files.length} file{files.length !== 1 ? 's' : ''} in your storage bucket
          </CardDescription>
        </div>
        <Button onClick={fetchFiles} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No files uploaded yet. Upload your first file above!
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.contentType)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{new Date(file.timeCreated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className={getFileTypeColor(file.contentType)}>
                    {file.contentType.split('/')[0]}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => window.open(file.url, '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteFile(file.name)}
                    variant="outline"
                    size="sm"
                    disabled={deleting === file.name}
                  >
                    {deleting === file.name ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 