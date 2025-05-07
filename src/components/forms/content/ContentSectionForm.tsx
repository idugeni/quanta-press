"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaMagic } from "react-icons/fa"
import { FiLoader } from "react-icons/fi"
import { cn } from "@/lib/utils"
import type { ArticleSection } from "@/types/article"

interface ContentSectionFormProps {
  /**
   * Indeks bagian
   */
  index: number

  /**
   * Data bagian
   */
  section: ArticleSection

  /**
   * Status loading
   */
  isGenerating: boolean

  /**
   * Bagian yang sedang aktif
   */
  currentSection: number

  /**
   * Judul artikel
   */
  articleTitle: string

  /**
   * Handler perubahan judul
   */
  onTitleChange: (index: number, title: string) => void

  /**
   * Handler generate konten
   */
  onGenerateContent: (index: number) => void
}

/**
 * Komponen form untuk satu bagian konten
 */
export function ContentSectionForm({
  index,
  section,
  isGenerating,
  currentSection,
  articleTitle,
  onTitleChange,
  onGenerateContent
}: ContentSectionFormProps) {
  return (
    <div 
      className={cn(
        "space-y-3 border border-border/40 p-4 rounded-lg bg-card/50",
        "hover:border-primary/20 hover:bg-accent/5 transition-all"
      )}
    >
      <div className="space-y-2">
        <Label htmlFor={`section-title-${index}`} className="text-sm font-medium text-foreground">
          Subbagian {index + 1}
        </Label>
        <Input
          id={`section-title-${index}`}
          placeholder={`Masukkan subbagian ${index + 1}`}
          value={section.title}
          onChange={(e) => onTitleChange(index, e.target.value)}
          className={cn(
            "border-input/50 bg-background/60 text-foreground transition-all h-9 text-sm rounded-md"
          )}
        />
      </div>

      <Button
        type="button"
        onClick={() => onGenerateContent(index)}
        disabled={isGenerating || !articleTitle || !section.title.trim()}
        className={cn(
          "w-full bg-secondary text-secondary-foreground hover:bg-secondary/90",
          "transition-colors text-xs h-9 rounded-md"
        )}
        variant={isGenerating && currentSection === index ? "outline" : "secondary"}
      >
        {isGenerating && currentSection === index ? (
          <>
            <FiLoader className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Menghasilkan...
          </>
        ) : (
          <>
            <FaMagic className="mr-1.5 h-3.5 w-3.5" />
            Hasilkan Konten
          </>
        )}
      </Button>

      {section.content && (
        <div className="space-y-2">
          <Label htmlFor={`section-content-${index}`} className="text-xs font-medium text-foreground">
            Konten
          </Label>
          <div className="relative">
            <div 
              id={`section-content-${index}`}
              className={cn(
                "border border-border/40 rounded-md p-3 bg-background/60 text-foreground",
                "prose prose-xs max-w-none min-h-[80px] max-h-[150px] overflow-y-auto",
                "[&_p]:mt-1 [&_p]:first:mt-0 text-xs"
              )}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        </div>
      )}
    </div>
  )
}