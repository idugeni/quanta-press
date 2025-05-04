"use client"

import Image from 'next/image'; // Tambahkan impor ini
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FaIndustry, FaFont, FaRuler, FaBook, FaFolderOpen, FaTags } from "react-icons/fa"
import type { Article } from "@/hooks/use-article-store"

interface ArticlePreviewProps {
  article: Article
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <Card className="border border-input rounded-md overflow-hidden bg-card shadow-card transition-all hover:shadow-lg duration-300" hoverable={true}>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-6 p-4">
            {article.title && <h1 className="text-2xl font-bold tracking-tight scroll-m-20 text-foreground text-center">{article.title}</h1>}
            
            {/* Display Settings Information */}
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {article.industryType && (
                <Badge variant="outline" className="text-xs font-medium">
                  <FaIndustry className="mr-1 h-3 w-3" />
                  {article.industryType === "general" ? "Umum" : 
                   article.industryType === "fintech" ? "Teknologi Keuangan" : 
                   article.industryType === "finance" ? "Keuangan & Perbankan" :
                   article.industryType === "healthcare" ? "Layanan Kesehatan" : 
                   article.industryType === "health_fitness" ? "Kesehatan & Kebugaran" :
                   article.industryType === "technology" ? "Teknologi" :
                   article.industryType === "education" ? "Pendidikan" :
                   article.industryType === "retail" ? "Ritel & E-Commerce" :
                   article.industryType === "manufacturing" ? "Manufaktur" :
                   article.industryType === "food" ? "Makanan & Minuman" :
                   article.industryType === "tourism" ? "Pariwisata & Perhotelan" :
                   article.industryType === "property" ? "Properti & Real Estate" :
                   article.industryType === "automotive" ? "Otomotif" :
                   article.industryType === "agriculture" ? "Pertanian & Agribisnis" :
                   article.industryType === "media" ? "Media & Jurnalisme" :
                   article.industryType === "entertainment" ? "Hiburan & Konten" :
                   article.industryType === "energy_mining" ? "Energi & Pertambangan" :
                   article.industryType === "construction" ? "Konstruksi & Infrastruktur" :
                   article.industryType === "logistics" ? "Logistik & Transportasi" :
                   article.industryType === "startup_umkm" ? "Startup & UMKM" :
                   article.industryType === "government" ? "Pemerintahan & Layanan Publik" :
                   article.industryType === "creative" ? "Ekonomi Kreatif & Digital" :
                   article.industryType === "green_tech" ? "Teknologi Hijau & Keberlanjutan" :
                   article.industryType === "esports" ? "E-Sports & Gaming" :
                   article.industryType === "blockchain" ? "Blockchain & Cryptocurrency" : "Umum"}
                </Badge>
              )}
              {article.writingStyle && (
                <Badge variant="outline" className="text-xs font-medium">
                  <FaFont className="mr-1 h-3 w-3" />
                  {article.writingStyle === "balanced" ? "Seimbang" : 
                   article.writingStyle === "formal" ? "Formal" : 
                   article.writingStyle === "santai" ? "Santai" : "Teknis"}
                </Badge>
              )}
              {article.contentLength && (
                <Badge variant="outline" className="text-xs font-medium">
                  <FaRuler className="mr-1 h-3 w-3" />
                  {article.contentLength === "short" ? "Pendek" : 
                   article.contentLength === "medium" ? "Sedang" : "Panjang"}
                </Badge>
              )}
            </div>
            
            {/* Display Generated Image */}
            {article.generatedImage && (
              <div className="my-4 rounded-md overflow-hidden border border-input shadow-sm">
                <Image
                  src={article.generatedImage} // Assuming base64 or URL
                  alt={article.title || 'Generated article image'}
                  width={800} // Set appropriate width
                  height={450} // Set appropriate height based on aspect ratio
                  className="w-full h-auto object-cover"
                  priority // Load image faster if it's above the fold
                />
              </div>
            )}
            
            {article.introduction && (
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                {article.introduction.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            {article.imagePrompt && (
              <div className="bg-accent/30 p-3 rounded-md border border-input text-xs">
                <h3 className="font-medium mb-1 text-xs text-foreground">Image Prompt:</h3>
                <p className="text-xs italic text-muted-foreground">{article.imagePrompt}</p>
              </div>
            )}

            {article.content && article.content.length > 0 && (
              <div className="space-y-6">
                {article.content.map((section, i) => (
                  <div key={i} className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">{section.title}</h2>
                    <Separator className="my-1 bg-border" />
                    <div className="prose prose-sm max-w-none text-muted-foreground text-sm space-y-3 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ 
                        __html: section.content
                          .replace(/<p>/g, '<p class="text-sm text-muted-foreground mb-3">')
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {article.infographics && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">Infografis</h2>
                <Separator className="my-1 bg-border" />
                <div className="bg-accent/30 p-3 rounded-md border border-input space-y-2">
                  <h3 className="font-medium text-sm text-foreground">{article.infographics.title}</h3>
                  <div className="text-xs text-muted-foreground">
                    <p><span className="font-medium">Layout:</span> {article.infographics.layout_type}</p>
                    <div className="mt-2">
                      <span className="font-medium">Elemen Kunci:</span>
                      <ul className="mt-1 space-y-1 pl-4">
                        {article.infographics.key_elements.map((element, i) => (
                          <li key={i}>{element.section}: {element.content} ({element.visual_type})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {article.conversionOptimization && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">Optimasi Konversi</h2>
                <Separator className="my-1 bg-border" />
                <div className="bg-accent/30 p-3 rounded-md border border-input space-y-2">
                  <p className="text-xs text-muted-foreground"><span className="font-medium">Tujuan:</span> {article.conversionOptimization.tujuan_utama}</p>
                  <p className="text-xs text-muted-foreground"><span className="font-medium">Nilai Proposisi:</span> {article.conversionOptimization.nilai_proposisi}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium">CTA Utama:</p>
                    <p className="text-xs text-muted-foreground">{article.conversionOptimization.cta_utama.teks} - {article.conversionOptimization.cta_utama.penempatan}</p>
                  </div>
                </div>
              </div>
            )}

            {article.metadata && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">Metadata SEO</h2>
                <Separator className="my-1 bg-border" />
                <div className="bg-gradient-to-br from-accent/30 to-accent/10 p-4 rounded-md border border-input shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <FaBook className="text-primary w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        {/* Meta Description
                        <h3 className="font-medium text-xs text-foreground mb-1">Meta Description:</h3>
                        */}
                        <div className="p-2 bg-background/60 rounded-md border border-border/30">
                          <p className="text-xs text-muted-foreground">{article.metadata.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaFolderOpen className="text-primary w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        {/* Kategori
                        <h3 className="font-medium text-xs text-foreground mb-1">Kategori:</h3>
                        */}
                        <div className="flex flex-wrap gap-1.5">
                          {article.metadata.categories.map((category, i) => (
                            <Badge key={i} variant="secondary" className="px-2 py-0.5 text-xs bg-secondary/90 text-secondary-foreground shadow-sm">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FaTags className="text-primary w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        {/* Tag
                        <h3 className="font-medium text-xs text-foreground mb-1">Tag:</h3>
                        */}
                        <div className="flex flex-wrap gap-1.5">
                          {article.metadata.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="px-2 py-0.5 text-xs border-input/50 bg-background/60 text-muted-foreground shadow-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {article.conclusion && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">Kesimpulan</h2>
                <Separator className="my-1 bg-border" />
                <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                  {article.conclusion.summary && (
                    <p>{article.conclusion.summary}</p>
                  )}
                  {article.conclusion.cta && (
                    <p className="text-sm">{article.conclusion.cta}</p>
                  )}
                </div>
              </div>
            )}

            {article.faqs && article.faqs.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">Frequently Asked Questions</h2>
                <Separator className="my-1 bg-border" />
                <div className="space-y-3">
                  {article.faqs.map((faq, i) => (
                    <div key={i} className="border border-input p-3 rounded-md hover:bg-accent/30 transition-colors">
                      <h3 className="font-medium mb-1 text-sm text-foreground">{faq.question}</h3>
                      <p className="text-xs text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {article.plagiarismCheck && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight scroll-m-20 text-foreground">Pemeriksaan Plagiarisme</h2>
                <Separator className="my-1 bg-border" />
                <div className="bg-accent/30 p-3 rounded-md border border-input space-y-2">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                      ${article.plagiarismCheck.score < 20 ? 'bg-green-500/20 text-green-700' : 
                       article.plagiarismCheck.score < 50 ? 'bg-yellow-500/20 text-yellow-700' : 
                       'bg-red-500/20 text-red-700'}`}>
                      <span className="text-sm font-bold">{article.plagiarismCheck.score}%</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium">{article.plagiarismCheck.plagiarism_risk}</p>
                      <p className="text-xs text-muted-foreground">Skor Plagiarisme</p>
                    </div>
                  </div>
                  {article.plagiarismCheck.issues.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Masalah Terdeteksi:</p>
                      <ul className="mt-1 space-y-1 pl-4 text-xs text-muted-foreground">
                        {article.plagiarismCheck.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}