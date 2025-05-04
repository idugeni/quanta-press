"use client"

import type React from "react"
import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaArrowRight, FaChartLine } from "react-icons/fa"
import { FiLoader } from "react-icons/fi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { generateContentStream } from "@/config/gemini"
import { getInfographicsPrompt, getInfographicsSystemPrompt } from "@/prompts/infographics"
import type { ArticleInfographics } from "@/hooks/use-article-store"

interface InfographicsFormProps {
  onCompleteAction: () => void
}

export function InfographicsForm({ onCompleteAction }: InfographicsFormProps) {
  const { article, setInfographics } = useArticleStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [infographicsData, setInfographicsData] = useState<ArticleInfographics | null>(article.infographics)

  const getArticleContent = (): string => {
    let content = article.introduction;
    
    article.content.forEach((section) => {
      content += `\n\n### ${section.title}\n${section.content}`;
    });
    
    return content;
  };

  const handleGenerateInfographics = async () => {
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
      const prompt = getInfographicsPrompt(article.title, getArticleContent())
      const systemPrompt = getInfographicsSystemPrompt()

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
        setInfographicsData(parsedData)
      } catch (parseError) {
        console.error("Final parse error:", parseError);
        console.error("Raw response received:", fullResponse);
        setError("Gagal mem-parsing data infografis. Respons tidak valid. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Error generating infographics:", err)
      setError("Failed to generate infographics. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!infographicsData) {
      setError("Please generate infographics data first")
      return
    }
    
    setInfographics(infographicsData)
    onCompleteAction()
  }

  const renderInfographicsPreview = () => {
    if (!infographicsData) return null;
    
    return (
      <div className="space-y-4 border border-border/40 p-4 rounded-lg bg-card/50">
        <h3 className="font-medium text-sm">{infographicsData.title}</h3>
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Layout Type:</span> {infographicsData.layout_type}
          </div>
          
          <Separator className="bg-border/40" />
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Key Elements:</h4>
            <div className="space-y-2">
              {infographicsData.key_elements.map((element, i) => (
                <div key={i} className="text-xs p-2 bg-background/60 rounded-md">
                  <p className="font-medium">{element.section}</p>
                  <p className="text-muted-foreground">{element.content}</p>
                  <p className="text-primary/70 text-[10px] mt-1">Visual: {element.visual_type}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-border/40" />
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Style Guide:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-background/60 rounded-md">
                <p className="font-medium">Color Palette</p>
                <p className="text-muted-foreground">{infographicsData.style_guide.color_palette}</p>
              </div>
              <div className="p-2 bg-background/60 rounded-md">
                <p className="font-medium">Typography</p>
                <p className="text-muted-foreground">{infographicsData.style_guide.typography}</p>
              </div>
              <div className="p-2 bg-background/60 rounded-md">
                <p className="font-medium">Visual Elements</p>
                <p className="text-muted-foreground">{infographicsData.style_guide.visual_elements}</p>
              </div>
            </div>
          </div>
          
          {infographicsData.data_visualization && infographicsData.data_visualization.length > 0 && (
            <>
              <Separator className="bg-border/40" />
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium">Data Visualization:</h4>
                <div className="space-y-2">
                  {infographicsData.data_visualization.map((viz, i) => (
                    <div key={i} className="text-xs p-2 bg-background/60 rounded-md">
                      <p className="font-medium">{viz.data_point}</p>
                      <p className="text-primary/70 text-[10px] mt-1">Viz Type: {viz.viz_type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FaChartLine className="h-4 w-4 text-primary" />
            Infografis
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Hasilkan petunjuk infografis untuk visualisasi artikel Anda
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
                  onClick={handleGenerateInfographics}
                  disabled={isGenerating || !article.title || article.content.length === 0}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-xs h-9 rounded-md w-2/3"
                  variant={isGenerating ? "outline" : "secondary"}
                >
                  {isGenerating ? (
                    <>
                      <FiLoader className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Membuat panduan infografis...
                    </>
                  ) : (
                    <>
                      <FaChartLine className="mr-1.5 h-3.5 w-3.5" />
                      Hasilkan Panduan Infografis
                    </>
                  )}
                </Button>
              </div>

              {renderInfographicsPreview()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button 
            type="submit" 
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md" 
            disabled={isGenerating || !infographicsData}
          >
            Lanjutkan <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}