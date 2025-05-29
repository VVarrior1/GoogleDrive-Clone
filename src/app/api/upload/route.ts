import { NextRequest, NextResponse } from 'next/server'
import { Storage, Bucket } from '@google-cloud/storage'
import { storageConfig, validateConfig } from '@/config/storage'

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variables (without sensitive data)
    console.log('Environment check:', {
      projectId: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      bucketName: !!process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      keyFile: !!process.env.GOOGLE_CLOUD_KEY_FILE,
      credentials: !!process.env.GOOGLE_CLOUD_CREDENTIALS,
    })
    
    // Validate configuration
    validateConfig()
    
    // Initialize Google Cloud Storage
    const storage = new Storage({
      projectId: storageConfig.projectId,
      keyFilename: storageConfig.keyFilename || undefined,
      credentials: storageConfig.credentials || undefined,
    })
    
    const bucket = storage.bucket(storageConfig.bucketName)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Google Cloud Storage
    const fileUpload = bucket.file(fileName)
    
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    })

    // Try to make the file publicly accessible, but handle uniform bucket-level access
    try {
      await fileUpload.makePublic()
      console.log('File made public successfully')
    } catch (publicError) {
      const errorMessage = publicError instanceof Error ? publicError.message : 'Unknown error'
      console.log('Could not make file public (likely due to uniform bucket-level access):', errorMessage)
      // This is expected if uniform bucket-level access is enabled
    }

    // Get the public URL (this will work if the bucket is publicly accessible)
    const publicUrl = `https://storage.googleapis.com/${storageConfig.bucketName}/${fileName}`

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 