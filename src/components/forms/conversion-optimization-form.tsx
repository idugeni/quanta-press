"use client"

import type React from "react"
import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaArrowRight, FaMousePointer } from "react-icons/fa"
import { FiLoader } from "react-icons/fi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { generateContentStream } from "@/config/gemini"
import { getConversionOptimizationPrompt, getConversionOptimizationSystemPrompt } from "@/prompts/conversion-optimization"
import type { ArticleConversionOptimization } from "@/hooks/use-article-store"

interface ConversionOptimizationFormProps {
  onCompleteAction: () => void
}

export function ConversionOptimizationForm({ onCompleteAction }: ConversionOptimizationFormProps) {
  const { article, setConversionOptimization } = useArticleStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [conversionData, setConversionData] = useState<ArticleConversionOptimization | null>(article.conversionOptimization)

  const getArticleContent = (): string => {
    let content = article.introduction;
    
    article.content.forEach((section) => {
      content += `\n\n### ${section.title}\n${section.content}`;
    });
    
    if (article.conclusion) {
      content += `\n\n### Conclusion\n${article.conclusion.summary}\n${article.conclusion.cta}`;
    }
    
    return content;
  };

  const handleGenerateOptimization = async () => {
    if (!article.title) {
      setError("Please go back and enter a title first")
      return
    }
    
    if (article.content.length === 0) {
      setError("Please go back and generate content first")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const prompt = getConversionOptimizationPrompt(article.title, getArticleContent())
      const systemPrompt = getConversionOptimizationSystemPrompt()

      let fullResponse = ""

      // Stream the content without parsing chunks
      await generateContentStream(prompt, systemPrompt, (chunk) => {
        fullResponse += chunk
        // Optionally update a loading state or preview raw text here if needed
      })

      // Parse the complete JSON response after the stream finishes
      try {
        // Attempt to clean potential markdown code block fences
        const cleanedResponse = fullResponse.replace(/^```json\n?|\n?```$/g, '');
        const parsedData = JSON.parse(cleanedResponse)
        setConversionData(parsedData)
      } catch (parseError) {
        console.error("Final parse error:", parseError);
        console.error("Raw response received:", fullResponse);
        setError("Gagal mem-parsing data optimasi konversi. Respons tidak valid. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Error generating conversion optimization:", err)
      setError("Failed to generate conversion optimization. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!conversionData) {
      setError("Please generate conversion optimization data first")
      return
    }
    
    setConversionOptimization(conversionData)
    onCompleteAction()
  }

  const renderCTAPreview = () => {
    if (!conversionData) return null;
    
    return (
      <div className="space-y-4 border border-border/40 p-4 rounded-lg bg-card/50">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Tujuan Utama</h3>
            <Badge variant="outline" className="text-xs py-0 px-2 bg-primary/10 text-primary border-primary/20">
              {conversionData.tujuan_utama}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{conversionData.nilai_proposisi}</p>
        </div>
        
        <Separator className="bg-border/40" />
        
        <div className="space-y-3">
          <h4 className="text-xs font-medium">CTA Utama</h4>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-primary">{conversionData.cta_utama.teks}</p>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-background text-muted-foreground border-input">
                {conversionData.cta_utama.format}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Penempatan:</span> {conversionData.cta_utama.penempatan}
            </p>
          </div>
        </div>
        
        {conversionData.cta_sekunder && conversionData.cta_sekunder.length > 0 && (
          <>
            <Separator className="bg-border/40" />
            
            <div className="space-y-3">
              <h4 className="text-xs font-medium">CTA Sekunder</h4>
              <div className="space-y-2">
                {conversionData.cta_sekunder.map((cta, i) => (
                  <div key={i} className="p-2 bg-secondary/10 border border-secondary/20 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium">{cta.teks}</p>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-background text-muted-foreground border-input">
                        {cta.format}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Penempatan:</span> {cta.penempatan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <Separator className="bg-border/40" />
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Strategi Konversi</h4>
          <ul className="space-y-1">
            {conversionData.strategi_konversi.map((strategi, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start">
                <span className="text-primary mr-1.5 mt-0.5">•</span>
                <span>{strategi}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FaMousePointer className="h-4 w-4 text-primary" />
            Optimasi Konversi
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Buat strategi call-to-action (CTA) yang efektif untuk meningkatkan konversi dari artikel
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-destructive/50 text-destructive py-2">
                <AlertTitle className="text-xs font-medium">Error</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleGenerateOptimization}
                  disabled={isGenerating || !article.title || article.content.length === 0}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-xs h-9 rounded-md w-2/3"
                  variant={isGenerating ? "outline" : "secondary"}
                >
                  {isGenerating ? (
                    <>
                      <FiLoader className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Menghasilkan strategi konversi...
                    </>
                  ) : (
                    <>
                      <FaMousePointer className="mr-1.5 h-3.5 w-3.5" />
                      Buat Strategi CTA
                    </>
                  )}
                </Button>
              </div>

              {renderCTAPreview()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button 
            type="submit" 
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md" 
            disabled={isGenerating || !conversionData}
          >
            Lanjutkan <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}