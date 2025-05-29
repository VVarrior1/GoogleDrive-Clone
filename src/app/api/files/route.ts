import { NextRequest, NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'
import { storageConfig, validateConfig } from '@/config/storage'

export async function GET(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig()
    
    // Initialize Google Cloud Storage
    const storage = new Storage({
      projectId: storageConfig.projectId,
      keyFilename: storageConfig.keyFilename || undefined,
      credentials: storageConfig.credentials || undefined,
    })
    
    const bucket = storage.bucket(storageConfig.bucketName)

    // Get list of files
    const [files] = await bucket.getFiles()
    
    const fileList = files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      timeCreated: file.metadata.timeCreated,
      updated: file.metadata.updated,
      url: `https://storage.googleapis.com/${storageConfig.bucketName}/${file.name}`,
    }))

    return NextResponse.json({
      files: fileList,
      count: fileList.length,
    })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('file')
    
    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 })
    }

    // Validate configuration
    validateConfig()
    
    // Initialize Google Cloud Storage
    const storage = new Storage({
      projectId: storageConfig.projectId,
      keyFilename: storageConfig.keyFilename || undefined,
      credentials: storageConfig.credentials || undefined,
    })
    
    const bucket = storage.bucket(storageConfig.bucketName)
    const file = bucket.file(fileName)

    // Delete the file
    await file.delete()

    return NextResponse.json({
      message: 'File deleted successfully',
      fileName: fileName,
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
} 