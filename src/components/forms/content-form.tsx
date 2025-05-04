"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useArticleStore } from "@/hooks/use-article-store"
import { Label } from "@/components/ui/label"
import { FaArrowRight, FaAlignLeft, FaPen, FaMagic } from "react-icons/fa"
import { FiLoader, FiFileText } from "react-icons/fi"
import { generateContentStream } from "@/config/gemini"
import { getContentPrompt, getContentSystemPrompt } from "@/prompts/content"
import { 
  getFinanceTechPrompt, 
  getHealthcarePrompt, 
  getTechnologyPrompt,
  getEducationPrompt,
  getRetailPrompt,
  getManufacturingPrompt,
  getFoodPrompt,
  getTourismPrompt,
  getPropertyPrompt,
  getAutomotivePrompt,
  getAgriculturePrompt,
  getMediaPrompt
} from "@/prompts/industry-specific"
import { applyWritingStyle } from "@/prompts/writing-style"
import { Input } from "@/components/ui/input"
import type { ArticleSection } from "@/types/article"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FormContainer } from "@/components/ui/form-container"
import { FormSelectItem } from "@/components/ui/form-select-item"
import { cn } from "@/lib/utils"
import type { CompletableFormProps } from "@/types/components"

/**
 * Komponen untuk form konten artikel
 */
export function ContentForm({ onCompleteAction }: CompletableFormProps) {
  const { article, setContent } = useArticleStore()
  const [numSubheadings, setNumSubheadings] = useState<string>("6")
  const [sections, setSections] = useState<ArticleSection[]>(
    article.content.length > 0
      ? article.content
      : Array(Number.parseInt(numSubheadings))
          .fill(null)
          .map(() => ({ title: "", content: "" })),
  )
  const [currentSection, setCurrentSection] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleNumSubheadingsChange = (value: string) => {
    const num = Number.parseInt(value)
    setNumSubheadings(value)

    // Resize the sections array based on the new number
    if (num > sections.length) {
      // Add new empty sections
      setSections([
        ...sections,
        ...Array(num - sections.length)
          .fill(null)
          .map(() => ({ title: "", content: "" })),
      ])
    } else if (num < sections.length) {
      // Remove excess sections
      setSections(sections.slice(0, num))
    }
  }

  const handleGenerateSection = async (index: number) => {
    if (!article.title) {
      setError("Silahkan kembali dan masukkan judul terlebih dahulu")
      toast.error("Judul artikel dibutuhkan", {
        description: "Anda harus mengisi judul artikel sebelum menghasilkan konten."
      })
      return
    }

    if (!sections[index].title.trim()) {
      setError(`Silahkan masukkan judul untuk bagian ${index + 1} terlebih dahulu`)
      toast.error("Judul subbagian dibutuhkan", {
        description: "Anda harus mengisi judul subbagian sebelum menghasilkan konten."
      })
      return
    }

    setIsGenerating(true)
    setError("")
    setCurrentSection(index)

    try {
      const sectionTitle = sections[index].title
      let prompt = ""
      
      // Select the appropriate prompt based on industry type
      if (article.industryType === "fintech") {
        prompt = getFinanceTechPrompt(article.title, article.contentLength)
      } else if (article.industryType === "finance") {
        prompt = getFinanceTechPrompt(article.title, article.contentLength) // Re-use fintech prompt for now
      } else if (article.industryType === "healthcare") {
        prompt = getHealthcarePrompt(article.title, article.contentLength)
      } else if (article.industryType === "health_fitness") {
        prompt = getHealthcarePrompt(article.title, article.contentLength) // Re-use healthcare prompt for now
      } else if (article.industryType === "technology") {
        prompt = getTechnologyPrompt(article.title, article.contentLength)
      } else if (article.industryType === "education") {
        prompt = getEducationPrompt(article.title, article.contentLength)
      } else if (article.industryType === "retail") {
        prompt = getRetailPrompt(article.title, article.contentLength)
      } else if (article.industryType === "manufacturing") {
        prompt = getManufacturingPrompt(article.title, article.contentLength)
      } else if (article.industryType === "food") {
        prompt = getFoodPrompt(article.title, article.contentLength)
      } else if (article.industryType === "tourism") {
        prompt = getTourismPrompt(article.title, article.contentLength)
      } else if (article.industryType === "property") {
        prompt = getPropertyPrompt(article.title, article.contentLength)
      } else if (article.industryType === "automotive") {
        prompt = getAutomotivePrompt(article.title, article.contentLength)
      } else if (article.industryType === "agriculture") {
        prompt = getAgriculturePrompt(article.title, article.contentLength)
      } else if (article.industryType === "media") {
        prompt = getMediaPrompt(article.title, article.contentLength)
      } else if (article.industryType === "entertainment") {
        prompt = getMediaPrompt(article.title, article.contentLength) // Re-use media prompt for now
      } else if (article.industryType === "energy_mining" || 
                article.industryType === "construction" || 
                article.industryType === "logistics" || 
                article.industryType === "startup_umkm" || 
                article.industryType === "government" || 
                article.industryType === "creative" || 
                article.industryType === "green_tech" || 
                article.industryType === "esports" || 
                article.industryType === "blockchain") {
        // For new industries without specific prompts, use the general content prompt
        // with the industry type added in the prompt
        prompt = getContentPrompt(
          article.title, 
          article.introduction, 
          sectionTitle, 
          index, 
          article.contentLength, 
          article.industryType // Pass industry type to adjust the prompt
        )
      } else {
        prompt = getContentPrompt(article.title, article.introduction, sectionTitle, index, article.contentLength)
      }
      
      // Apply the writing style
      prompt = applyWritingStyle(prompt, article.writingStyle)
      
      const systemPrompt = getContentSystemPrompt()

      let generatedContent = ""

      await generateContentStream(prompt, systemPrompt, (chunk) => {
        generatedContent += chunk
        const updatedSections = [...sections]
        updatedSections[index] = {
          ...updatedSections[index],
          content: generatedContent,
        }
        setSections(updatedSections)
      })

      // Update the final content
      const updatedSections = [...sections]
      updatedSections[index] = {
        ...updatedSections[index],
        content: generatedContent,
      }
      setSections(updatedSections)
      
      toast.success("Konten berhasil dibuat", {
        description: `Konten untuk "${sectionTitle}" telah berhasil dibuat.`
      })
    } catch (err) {
      console.error("Error generating content section:", err)
      setError("Gagal menghasilkan konten. Silakan coba lagi atau masukkan konten Anda sendiri.")
      toast.error("Gagal menghasilkan konten", {
        description: "Ada masalah saat menghasilkan konten. Kami berikan konten sementara."
      })

      // Provide a fallback content if generation fails
      const fallbackContent = `<p>Bagian ini membahas aspek penting dari ${sections[index].title}.</p>
<p>Poin-poin utama yang perlu dipertimbangkan meliputi pemahaman dasar-dasar, penerapan praktik terbaik, dan tetap up-to-date dengan perkembangan terbaru di bidang ini.</p>
<p>Penelitian lebih lanjut dan aplikasi praktis akan membantu memperdalam pengetahuan Anda tentang topik ini.</p>`

      const updatedSections = [...sections]
      updatedSections[index] = {
        ...updatedSections[index],
        content: fallbackContent,
      }
      setSections(updatedSections)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validSections = sections.filter(
      (section) => section.title.trim() !== "" && section.content.trim() !== ""
    )
    
    if (validSections.length === 0) {
      setError("Silakan tambahkan setidaknya satu subbagian dengan judul dan konten")
      return
    }
    
    setContent(validSections)
    
    toast.success("Konten artikel berhasil disimpan", {
      description: `${validSections.length} subbagian telah disimpan untuk artikel Anda.`
    })
    
    onCompleteAction()
  }

  // Definisi opsi-opsi select
  const subheadingOptions = [
    { value: "6", label: "6 Subbagian" },
    { value: "7", label: "7 Subbagian" },
    { value: "8", label: "8 Subbagian" },
    { value: "9", label: "9 Subbagian" },
    { value: "10", label: "10 Subbagian" }
  ]

  return (
    <FormContainer
      title="Konten Artikel"
      description={`Buat konten artikel dengan subbagian berdasarkan judul: ${article.title || "..."}`}
      titleIcon={<FaAlignLeft className="h-4 w-4 text-primary" />}
      headerRightIcon={<FiFileText className="h-4 w-4" />}
      submitText="Lanjutkan"
      submitIcon={<FaArrowRight className="h-3.5 w-3.5" />}
      onSubmit={handleSubmit}
      isLoading={isGenerating}
    >
      <div className="space-y-5">
        <FormSelectItem
          id="numSubheadings"
          label="Jumlah Subbagian"
          icon={<FaPen className="h-3.5 w-3.5" />}
          value={numSubheadings}
          onValueChange={handleNumSubheadingsChange}
          placeholder="Pilih jumlah subbagian"
          options={subheadingOptions}
        />

        {error && (
          <Alert variant="destructive" className="border-destructive/50 text-destructive py-2">
            <AlertTitle className="text-xs font-medium">Error</AlertTitle>
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <Separator className="bg-border/40" />

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={index} 
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
                  onChange={(e) => {
                    const updatedSections = [...sections]
                    updatedSections[index] = {
                      ...updatedSections[index],
                      title: e.target.value,
                    }
                    setSections(updatedSections)
                  }}
                  className={cn(
                    "border-input/50 bg-background/60 text-foreground transition-all h-9 text-sm rounded-md"
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={() => handleGenerateSection(index)}
                disabled={isGenerating || !article.title || !sections[index].title.trim()}
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

              {sections[index].content && (
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
                      dangerouslySetInnerHTML={{ __html: sections[index].content }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </FormContainer>
  )
}
