import FileUpload from '@/components/FileUpload'
import { FileList } from '@/components/file-list'
import { Toaster } from 'sonner'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cloud File Storage
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Securely upload and store your files in Google Cloud Storage with our modern, 
            intuitive interface. Drag, drop, and done.
          </p>
        </div>
        
        <div className="space-y-8">
          <FileUpload />
          <FileList />
        </div>
      </div>
      <Toaster />
    </main>
  )
}
