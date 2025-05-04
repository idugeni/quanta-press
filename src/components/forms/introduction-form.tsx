"use client"

import type React from "react"

import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FaArrowRight, FaBook } from "react-icons/fa"
import { FiFileText, FiLoader } from "react-icons/fi"
import { RiMagicLine } from "react-icons/ri"
import { generateContentStream } from "@/config/gemini"
import { getIntroductionPrompt, getIntroductionSystemPrompt } from "@/prompts/introduction"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface IntroductionFormProps {
  onCompleteAction: () => void
}

export function IntroductionForm({ onCompleteAction }: IntroductionFormProps) {
  const { article, setIntroduction } = useArticleStore()
  const [introduction, setIntroductionText] = useState(article.introduction)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!article.title) {
      setError("Please go back and enter a title first")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const prompt = getIntroductionPrompt(article.title)
      const systemPrompt = getIntroductionSystemPrompt()

      let generatedIntroduction = ""

      await generateContentStream(prompt, systemPrompt, (chunk) => {
        generatedIntroduction += chunk
        setIntroductionText(generatedIntroduction)
      })

      setIntroduction(generatedIntroduction)
    } catch (err) {
      console.error("Error generating introduction:", err)
      setError("Failed to generate introduction. Please try again.")

      // Provide a fallback introduction if generation fails
      const fallbackIntro = `This article explores ${article.title}. It will provide valuable insights and practical information on this important topic.

By reading this article, you'll gain a deeper understanding of ${article.title} and learn how to apply this knowledge in practical situations.`

      setIntroductionText(fallbackIntro)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!introduction.trim()) {
      setError("Please generate an introduction first")
      return
    }

    setIntroduction(introduction)
    onCompleteAction()
  }

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FaBook className="h-4 w-4 text-primary" />
            Introduction
          </CardTitle>
          <FiFileText className="h-4 w-4 text-primary" />
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Generate a compelling introduction for your article based on the title: <strong className="text-foreground">{article.title}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-4">
            <Button 
              type="button" 
              onClick={handleGenerate} 
              disabled={isGenerating || !article.title} 
              className="w-full h-10 transition-colors text-sm bg-secondary hover:bg-secondary/90"
              variant="secondary"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RiMagicLine className="mr-2 h-4 w-4" />
                  Generate Introduction
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="border-destructive/50 text-destructive py-2">
                <AlertTitle className="text-xs font-medium">Error</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="introduction" className="text-sm font-medium text-foreground">Introduction</Label>
              <div className="relative">
                <Textarea
                  id="introduction"
                  placeholder="Your introduction will appear here"
                  value={introduction}
                  onChange={(e) => setIntroductionText(e.target.value)}
                  className="min-h-[150px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
                />
                {introduction && !isGenerating && (
                  <div className="absolute right-2 bottom-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 text-xs py-0.5 px-1.5">
                      {introduction.length} chars
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button 
            type="submit" 
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md" 
            disabled={isGenerating || !introduction.trim()}
          >
            Continue <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
