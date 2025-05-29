# Developer Documentation

## Architecture Overview

This application follows a modern full-stack architecture using Next.js with the App Router pattern, providing both client-side and server-side functionality in a single codebase.

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  Google Cloud   │
│   (React)       │◄──►│   (Next.js API) │◄──►│   Storage       │
│                 │    │                 │    │                 │
│ - File Upload   │    │ - File Handler  │    │ - File Storage  │
│ - Progress UI   │    │ - GCS Client    │    │ - Public URLs   │
│ - Drag & Drop   │    │ - Validation    │    │ - Permissions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technical Stack

### Frontend Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **react-dropzone**: File drag-and-drop functionality
- **Lucide React**: Modern icon library

### Backend Technologies

- **Next.js API Routes**: Serverless API endpoints
- **Google Cloud Storage SDK**: Official GCS client
- **Multer**: File upload middleware (types only)
- **Node.js Buffer**: File data handling

### Development Tools

- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Turbopack**: Fast development bundler

## Component Architecture

### FileUpload Component

The main upload component handles:

- **File Selection**: Drag-and-drop and click-to-select
- **Upload Management**: Multiple file uploads with progress tracking
- **State Management**: File status (uploading, completed, error)
- **UI Updates**: Real-time progress and status indicators

```typescript
interface FileWithProgress {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}
```

### API Route Architecture

The upload API route (`/api/upload`) handles:

- **File Validation**: Type and size checking
- **GCS Integration**: Direct upload to Google Cloud Storage
- **Error Handling**: Comprehensive error responses
- **Response Format**: Standardized JSON responses

## Data Flow

### Upload Process

1. **File Selection**: User selects files via drag-and-drop or file picker
2. **Client Processing**: Files are added to local state with initial status
3. **API Request**: Each file is uploaded via FormData to `/api/upload`
4. **Server Processing**: 
   - File validation
   - Buffer conversion
   - GCS upload
   - Public URL generation
5. **Response Handling**: Client updates UI based on response
6. **Progress Updates**: Real-time progress simulation (can be enhanced with actual progress)

## Google Cloud Storage Integration

### Configuration

The application supports two authentication methods:

1. **Service Account Key File**:
   ```typescript
   const storage = new Storage({
     projectId: 'your-project',
     keyFilename: './service-account.json'
   })
   ```

2. **Environment Credentials**:
   ```typescript
   const storage = new Storage({
     projectId: 'your-project',
     credentials: JSON.parse(base64Credentials)
   })
   ```

### Upload Process

```typescript
// File upload to GCS
const fileUpload = bucket.file(fileName)
await fileUpload.save(buffer, {
  metadata: { contentType: file.type }
})
await fileUpload.makePublic()
```

## API Endpoints

### POST /api/upload

Handles file uploads to Google Cloud Storage.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `file` field

**Response**:
```typescript
// Success (200)
{
  message: string
  url: string
  fileName: string
  size: number
  type: string
}

// Error (400/500)
{
  error: string
}
```

## Environment Variables

### Required Variables

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
```

### Authentication (choose one)

```env
# Option 1: Service Account Key File
GOOGLE_CLOUD_KEY_FILE=./path/to/key.json

# Option 2: Base64 Encoded Credentials
GOOGLE_CLOUD_CREDENTIALS=base64-encoded-json
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries
- Add JSDoc comments for complex functions

### Component Guidelines

- Keep components focused and single-purpose
- Use composition over inheritance
- Implement proper prop types
- Handle loading and error states
- Make components accessible (a11y)

### State Management

- Use React hooks for local state
- Consider Context API for global state
- Implement proper error handling
- Use TypeScript for type safety

## Security Considerations

### File Upload Security

- Implement file type validation
- Add file size limits
- Sanitize file names
- Scan for malware (production)

### Authentication & Authorization

- Implement user authentication
- Add upload permissions
- Rate limiting for uploads
- CORS configuration

### Environment Security

- Never commit secrets to version control
- Use environment variables for all config
- Implement proper IAM roles in GCS
- Regular security audits

## Performance Optimization

### Client-Side

- Implement file chunking for large files
- Add upload cancellation
- Use Web Workers for file processing
- Implement retry logic

### Server-Side

- Stream file uploads
- Implement proper error handling
- Add request validation
- Use connection pooling

### Google Cloud Storage

- Configure proper bucket policies
- Use CDN for file delivery
- Implement lifecycle policies
- Monitor storage costs

## Future Enhancements

### Features

- [ ] User authentication
- [ ] File organization (folders)
- [ ] File sharing and permissions
- [ ] Image preview and thumbnails
- [ ] Bulk operations
- [ ] Upload history
- [ ] File versioning

### Technical Improvements

- [ ] Real upload progress (not simulated)
- [ ] File chunking for large files
- [ ] Upload resumption
- [ ] Background uploads
- [ ] Offline support
- [ ] PWA capabilities

### Performance

- [ ] CDN integration
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Virtual scrolling for large file lists
- [ ] Compression before upload

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check service account permissions
   - Verify environment variables
   - Ensure GCS API is enabled

2. **Upload Failures**:
   - Check file size limits
   - Verify bucket permissions
   - Check network connectivity

3. **Build Errors**:
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

### Debug Mode

Enable debug logging:

```env
NODE_ENV=development
DEBUG=gcs:*
```

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Set up environment variables
5. Start development server: `npm run dev`

### Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add changeset if needed
4. Request review from maintainers 