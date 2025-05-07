"use client"

import { useState } from "react"
import { toast } from "sonner"
import { FaAlignLeft, FaArrowRight } from "react-icons/fa"
import { FiFileText } from "react-icons/fi"
import { Separator } from "@/components/ui/separator"
import { FormContainer } from "@/components/ui/form-container"
import { useArticleStore } from "@/hooks/use-article-store"
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
import type { ArticleSection } from "@/types/article"
import type { CompletableFormProps } from "@/types/components"
import { ContentFormHeader } from "./ContentFormHeader"
import { ContentSectionForm } from "./ContentSectionForm"

/**
 * Komponen utama untuk form konten artikel
 */
export function ContentFormContainer({ onCompleteAction }: CompletableFormProps) {
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

    if (num > sections.length) {
      setSections([
        ...sections,
        ...Array(num - sections.length)
          .fill(null)
          .map(() => ({ title: "", content: "" })),
      ])
    } else if (num < sections.length) {
      setSections(sections.slice(0, num))
    }
  }

  const handleTitleChange = (index: number, title: string) => {
    const updatedSections = [...sections]
    updatedSections[index] = {
      ...updatedSections[index],
      title,
    }
    setSections(updatedSections)
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
        prompt = getContentPrompt(
          article.title, 
          article.introduction, 
          sectionTitle, 
          index, 
          article.contentLength, 
          article.industryType
        )
      } else {
        prompt = getContentPrompt(article.title, article.introduction, sectionTitle, index, article.contentLength)
      }
      
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
    
    const validSections = sections.filter((section) => {
      const contentLength = section.content.trim().length
      const titleLength = section.title.trim().length
      
      // Validasi panjang minimum untuk judul (3 karakter) dan konten (50 karakter)
      return titleLength >= 3 && contentLength >= 50
    })
    
    if (validSections.length === 0) {
      setError("Silakan tambahkan setidaknya satu subbagian dengan judul (min. 3 karakter) dan konten (min. 50 karakter)")
      toast.error("Konten tidak memenuhi syarat", {
        description: "Setiap subbagian harus memiliki judul minimal 3 karakter dan konten minimal 50 karakter."
      })
      return
    }
    
    setContent(validSections)
    
    toast.success("Konten artikel berhasil disimpan", {
      description: `${validSections.length} subbagian telah disimpan untuk artikel Anda.`
    })
    
    onCompleteAction()
  }

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
      disabled={sections.some(section => !section.content || !section.title.trim() || section.title.trim().length < 3 || section.content.trim().length < 50)}
      onDisabledClick={() => {
        toast.warning("Konten belum lengkap", {
          description: "Pastikan setiap subbagian memiliki judul (min. 3 karakter) dan konten (min. 50 karakter)."
        })
      }}
    >
      <div className="space-y-5">
        <ContentFormHeader
          numSubheadings={numSubheadings}
          onNumSubheadingsChange={handleNumSubheadingsChange}
          error={error}
        />

        <Separator className="bg-border/40" />

        <div className="space-y-4">
          {sections.map((section, index) => (
            <ContentSectionForm
              key={index}
              index={index}
              section={section}
              isGenerating={isGenerating}
              currentSection={currentSection}
              articleTitle={article.title}
              onTitleChange={handleTitleChange}
              onGenerateContent={handleGenerateSection}
            />
          ))}
        </div>
      </div>
    </FormContainer>
  )
}