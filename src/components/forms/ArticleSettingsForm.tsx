"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useArticleStore } from "@/hooks/use-article-store"
import { FaArrowRight, FaCog, FaIndustry, FaFont, FaRuler } from "react-icons/fa"
import type { IndustryType, WritingStyle, ContentLength } from "@/types/article"
import type { CompletableFormProps } from "@/types/components"
import { FormContainer } from "@/components/ui/form-container"
import { FormSelectItem } from "@/components/ui/form-select-item"

/**
 * Form pengaturan artikel untuk memilih jenis industri, gaya penulisan, dan panjang konten
 */
export function ArticleSettingsForm({ onCompleteAction }: CompletableFormProps) {
  const { article, setIndustryType, setWritingStyle, setContentLength } = useArticleStore()
  const [industryType, setIndustryTypeLocal] = useState<IndustryType>(article.industryType || "general")
  const [writingStyle, setWritingStyleLocal] = useState<WritingStyle>(article.writingStyle || "balanced")
  const [contentLength, setContentLengthLocal] = useState<ContentLength>(article.contentLength || "medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIndustryType(industryType)
    setWritingStyle(writingStyle)
    setContentLength(contentLength)
    
    toast.success("Pengaturan artikel berhasil disimpan", {
      description: "Pengaturan akan memengaruhi gaya dan panjang konten artikel."
    })
    
    onCompleteAction()
  }

  // Definisi opsi-opsi select
  const industryOptions = [
    // Umum
    { value: "general" as IndustryType, label: "Umum" },
    
    // Teknologi
    { value: "technology" as IndustryType, label: "Teknologi" },
    { value: "fintech" as IndustryType, label: "Teknologi Keuangan" },
    { value: "green_tech" as IndustryType, label: "Teknologi Hijau & Keberlanjutan" },
    { value: "blockchain" as IndustryType, label: "Blockchain & Cryptocurrency" },
    
    // Bisnis dan Keuangan
    { value: "finance" as IndustryType, label: "Keuangan & Perbankan" },
    { value: "startup_umkm" as IndustryType, label: "Startup & UMKM" },
    
    // Layanan
    { value: "healthcare" as IndustryType, label: "Layanan Kesehatan" },
    { value: "health_fitness" as IndustryType, label: "Kesehatan & Kebugaran" },
    { value: "education" as IndustryType, label: "Pendidikan" },
    { value: "tourism" as IndustryType, label: "Pariwisata & Perhotelan" },
    { value: "government" as IndustryType, label: "Pemerintahan & Layanan Publik" },
    
    // Retail dan Produk Konsumen
    { value: "retail" as IndustryType, label: "Ritel & E-Commerce" },
    { value: "food" as IndustryType, label: "Makanan & Minuman" },
    
    // Industri dan Infrastruktur
    { value: "manufacturing" as IndustryType, label: "Manufaktur" },
    { value: "energy_mining" as IndustryType, label: "Energi & Pertambangan" },
    { value: "construction" as IndustryType, label: "Konstruksi & Infrastruktur" },
    { value: "logistics" as IndustryType, label: "Logistik & Transportasi" },
    { value: "property" as IndustryType, label: "Properti & Real Estate" },
    { value: "automotive" as IndustryType, label: "Otomotif" },
    { value: "agriculture" as IndustryType, label: "Pertanian & Agribisnis" },
    
    // Media dan Hiburan
    { value: "media" as IndustryType, label: "Media & Jurnalisme" },
    { value: "entertainment" as IndustryType, label: "Hiburan & Konten" },
    { value: "creative" as IndustryType, label: "Ekonomi Kreatif & Digital" },
    { value: "esports" as IndustryType, label: "E-Sports & Gaming" }
  ]
  
  const writingStyleOptions = [
    { value: "balanced" as WritingStyle, label: "Seimbang (Profesional namun Mudah Dipahami)" },
    { value: "formal" as WritingStyle, label: "Formal (Akademis dan Profesional)" },
    { value: "santai" as WritingStyle, label: "Santai (Konversasional dan Ramah)" },
    { value: "teknis" as WritingStyle, label: "Teknis (Detail dan Spesifik)" }
  ]
  
  const contentLengthOptions = [
    { value: "short" as ContentLength, label: "Pendek (200-300 kata per bagian)" },
    { value: "medium" as ContentLength, label: "Sedang (500-700 kata per bagian)" },
    { value: "long" as ContentLength, label: "Panjang (1000-1500 kata per bagian)" }
  ]

  return (
    <FormContainer
      title="Pengaturan Artikel"
      description="Tetapkan pengaturan dasar yang akan memengaruhi seluruh artikel Anda"
      titleIcon={<FaCog className="h-4 w-4 text-primary" />}
      submitText="Lanjutkan"
      submitIcon={<FaArrowRight className="h-3.5 w-3.5" />}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormSelectItem<IndustryType>
            id="industryType"
            label="Jenis Industri"
            icon={<FaIndustry className="h-3.5 w-3.5" />}
            value={industryType}
            onValueChange={setIndustryTypeLocal}
            placeholder="Pilih jenis industri"
            helpText="Pilihan ini akan memengaruhi terminologi dan konteks spesifik yang digunakan dalam artikel Anda."
            options={industryOptions}
          />
          
          <FormSelectItem<WritingStyle>
            id="writingStyle"
            label="Gaya Penulisan"
            icon={<FaFont className="h-3.5 w-3.5" />}
            value={writingStyle}
            onValueChange={setWritingStyleLocal}
            placeholder="Pilih gaya penulisan"
            helpText="Gaya penulisan akan menentukan nada dan tingkat formalitas dalam artikel."
            options={writingStyleOptions}
          />
        </div>
        
        <div className="space-y-6">
          <FormSelectItem<ContentLength>
            id="contentLength"
            label="Panjang Konten"
            icon={<FaRuler className="h-3.5 w-3.5" />}
            value={contentLength}
            onValueChange={setContentLengthLocal}
            placeholder="Pilih panjang konten"
            helpText="Ini akan menentukan kedalaman dan detail setiap bagian dalam artikel."
            options={contentLengthOptions}
          />
        </div>
      </div>
    </FormContainer>
  )
}