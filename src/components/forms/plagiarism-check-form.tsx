"use client"

import type React from "react"
import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaArrowRight, FaClipboardCheck } from "react-icons/fa"
import { FiLoader } from "react-icons/fi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { generateContentStream } from "@/config/gemini"
import { getPlagiarismCheckPrompt, getPlagiarismCheckSystemPrompt } from "@/prompts/plagiarism-check"
import type { PlagiarismResult } from "@/hooks/use-article-store"

interface PlagiarismCheckFormProps {
  onCompleteAction: () => void
}

export function PlagiarismCheckForm({ onCompleteAction }: PlagiarismCheckFormProps) {
  const { article, setPlagiarismCheck } = useArticleStore()
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState("")
  const [checkResult, setCheckResult] = useState<PlagiarismResult | null>(article.plagiarismCheck)

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

  const handleCheckPlagiarism = async () => {
    if (!article.title) {
      setError("Please go back and enter a title first")
      return
    }
    
    if (article.content.length === 0) {
      setError("Please go back and generate content first")
      return
    }

    setIsChecking(true)
    setError("")

    try {
      const prompt = getPlagiarismCheckPrompt(article.title, getArticleContent())
      const systemPrompt = getPlagiarismCheckSystemPrompt()

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
        setCheckResult(parsedData)
      } catch (parseError) {
        console.error("Final parse error:", parseError);
        console.error("Raw response received:", fullResponse);
        setError("Gagal mem-parsing data pemeriksaan plagiarisme. Respons tidak valid. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Error checking plagiarism:", err)
      setError("Failed to check plagiarism. Please try again.")
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!checkResult) {
      setError("Please check for plagiarism first")
      return
    }
    
    setPlagiarismCheck(checkResult)
    onCompleteAction()
  }

  const getPlagiarismRiskColor = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'rendah':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'sedang':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'tinggi':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const renderPlagiarismResults = () => {
    if (!checkResult) return null;
    
    const riskColor = getPlagiarismRiskColor(checkResult.plagiarism_risk);
    
    return (
      <div className="space-y-4 border border-border/40 p-4 rounded-lg bg-card/50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Hasil Pemeriksaan Plagiarisme</h3>
            <Badge variant="outline" className={`text-xs py-0 px-2 ${riskColor}`}>
              Risiko: {checkResult.plagiarism_risk}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Skor Keaslian:</span>
              <span className="text-xs font-medium">{checkResult.score}/100</span>
            </div>
            <Progress value={checkResult.score} className="h-2" />
          </div>
        </div>
        
        <Separator className="bg-border/40" />
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Masalah Terdeteksi:</h4>
          {checkResult.issues.length > 0 ? (
            <ul className="space-y-1">
              {checkResult.issues.map((issue, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start">
                  <span className="text-amber-500 mr-1.5 mt-0.5">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-green-500">Tidak ada masalah terdeteksi!</p>
          )}
        </div>
        
        <Separator className="bg-border/40" />
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Saran Perbaikan:</h4>
          <ul className="space-y-1">
            {checkResult.suggestions.map((suggestion, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start">
                <span className="text-primary mr-1.5 mt-0.5">•</span>
                <span>{suggestion}</span>
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
            <FaClipboardCheck className="h-4 w-4 text-primary" />
            Pemeriksaan Plagiarisme
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Periksa konten artikel untuk memastikan keaslian dan keunikan
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
              <p className="text-xs text-muted-foreground">
                Periksa keaslian konten artikel dengan mengidentifikasi potensi masalah plagiarisme dan mendapatkan saran untuk meningkatkan keunikan konten.
              </p>
              
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleCheckPlagiarism}
                  disabled={isChecking || !article.title || article.content.length === 0}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors text-xs h-9 rounded-md w-2/3"
                  variant={isChecking ? "outline" : "secondary"}
                >
                  {isChecking ? (
                    <>
                      <FiLoader className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Memeriksa plagiarisme...
                    </>
                  ) : (
                    <>
                      <FaClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                      Periksa Plagiarisme
                    </>
                  )}
                </Button>
              </div>

              {renderPlagiarismResults()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button 
            type="submit" 
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md" 
            disabled={isChecking || !checkResult}
          >
            Selesai <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}