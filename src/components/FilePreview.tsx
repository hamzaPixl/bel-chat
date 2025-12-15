import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import type { Ressource } from '@/api'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface FilePreviewProps {
  resource: Ressource | null
  onClose: () => void
  className?: string
}

type FileType = 'pdf' | 'markdown' | 'unknown'

function getFileType(url: string): FileType {
  const lowercaseUrl = url.toLowerCase()
  if (lowercaseUrl.includes('.pdf') || lowercaseUrl.includes('application/pdf')) {
    return 'pdf'
  }
  if (lowercaseUrl.includes('.md') || lowercaseUrl.includes('.markdown') || lowercaseUrl.includes('text/markdown')) {
    return 'markdown'
  }
  return 'unknown'
}

export function FilePreview({ resource, onClose, className }: FilePreviewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fileType = resource ? getFileType(resource.link) : 'unknown'

  // Reset state when resource changes
  useEffect(() => {
    if (resource) {
      setError(null)
      setIsLoading(true)

      // Set initial page if page_number is provided
      if (resource.page_number) {
        setPageNumber(resource.page_number)
      } else {
        setPageNumber(1)
      }

      // Fetch markdown content if needed
      if (fileType === 'markdown') {
        fetch(resource.link)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to fetch markdown')
            return res.text()
          })
          .then((text) => {
            setMarkdownContent(text)
            setIsLoading(false)
          })
          .catch((err) => {
            setError(err.message)
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    }
  }, [resource, fileType])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsLoading(false)
  }

  function onDocumentLoadError(err: Error) {
    setError(err.message)
    setIsLoading(false)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages))
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))

  if (!resource) {
    return null
  }

  return (
    <div className={cn('flex flex-col h-full bg-background border-l', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{resource.title}</h3>
          {resource.page_number && (
            <span className="text-xs text-muted-foreground">Page {resource.page_number}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(resource.link, '_blank')}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            title="Close preview"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
            <p className="text-destructive text-center">Failed to load file</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <Button variant="outline" onClick={() => window.open(resource.link, '_blank')}>
              Open in new tab
            </Button>
          </div>
        )}

        {!isLoading && !error && fileType === 'pdf' && (
          <div className="flex flex-col items-center p-4">
            <Document
              file={resource.link}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}

        {!isLoading && !error && fileType === 'markdown' && (
          <div className="p-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold text-foreground mt-4 mb-2">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-sm text-foreground/90 mb-4 space-y-1 ml-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-sm text-foreground/90 mb-4 space-y-1 ml-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground/90">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-muted/70 p-4 rounded-lg text-xs font-mono text-foreground overflow-x-auto mb-4">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-muted/70 p-4 rounded-lg overflow-x-auto mb-4 border border-border">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 text-sm text-muted-foreground italic bg-muted/30 rounded-r">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse border border-border rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-3 py-2 text-foreground/90">
                    {children}
                  </td>
                ),
                hr: () => <hr className="my-6 border-border" />,
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="max-w-full h-auto rounded-lg my-4 border border-border"
                  />
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-foreground/90">{children}</em>
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        )}

        {!isLoading && !error && fileType === 'unknown' && (
          <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
            <p className="text-muted-foreground text-center">
              Preview not available for this file type
            </p>
            <Button variant="outline" onClick={() => window.open(resource.link, '_blank')}>
              Open in new tab
            </Button>
          </div>
        )}
      </div>

      {/* PDF Controls */}
      {fileType === 'pdf' && numPages > 0 && (
        <div className="flex items-center justify-between p-3 border-t bg-muted/30">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={zoomIn}
              disabled={scale >= 2.5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {pageNumber} / {numPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
