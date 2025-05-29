export const storageConfig = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || '',
  bucketName: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '',
  // Alternative: Use credentials directly
  credentials: process.env.GOOGLE_CLOUD_CREDENTIALS 
    ? JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS, 'base64').toString())
    : undefined,
}

export const validateConfig = () => {
  const required = ['projectId', 'bucketName']
  const missing = required.filter(key => !storageConfig[key as keyof typeof storageConfig])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  if (!storageConfig.keyFilename && !storageConfig.credentials) {
    throw new Error('Either GOOGLE_CLOUD_KEY_FILE or GOOGLE_CLOUD_CREDENTIALS must be provided')
  }
} 