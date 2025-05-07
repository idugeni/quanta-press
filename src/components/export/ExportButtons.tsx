'use client'

import { Button } from '@/components/ui/button'
import { FaFilePdf, FaFileWord, FaFileAlt, FaDownload } from 'react-icons/fa'
import { exportArticleAsPdf, exportArticleAsWord, exportArticleAsText, exportArticleAsMarkdown } from '@/utils/export'
import type { Article } from '@/hooks/use-article-store'

interface ExportButtonsProps {
  article: Article
  disabled?: boolean
}

export function ExportButtons({ article, disabled = false }: ExportButtonsProps) {
  const handleExport = (format: 'pdf' | 'word' | 'text' | 'markdown') => {
    switch (format) {
      case 'pdf':
        exportArticleAsPdf(article)
        break
      case 'word':
        exportArticleAsWord(article)
        break
      case 'text':
        exportArticleAsText(article)
        break
      case 'markdown':
        exportArticleAsMarkdown(article)
        break
    }
  }

  return (
    <div className="flex justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => handleExport('pdf')}
        disabled={!article.title || disabled}
        className="flex-1 text-sm"
        title="Ekspor sebagai PDF"
      >
        <FaFilePdf className="mr-2 h-4 w-4" />
        PDF
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleExport('word')}
        disabled={!article.title || disabled}
        className="flex-1 text-sm"
        title="Ekspor sebagai Word"
      >
        <FaFileWord className="mr-2 h-4 w-4" />
        Word
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleExport('text')}
        disabled={!article.title || disabled}
        className="flex-1 text-sm"
        title="Ekspor sebagai Text"
      >
        <FaFileAlt className="mr-2 h-4 w-4" />
        Text
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleExport('markdown')}
        disabled={!article.title || disabled}
        className="flex-1 text-sm"
        title="Ekspor sebagai Markdown"
      >
        <FaDownload className="mr-2 h-4 w-4" />
        MD
      </Button>
    </div>
  )
}