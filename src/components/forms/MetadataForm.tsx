"use client"

import type React from "react"

import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FaArrowRight, FaTags } from "react-icons/fa"
import { FiLoader, FiSettings } from "react-icons/fi"
import { RiMagicLine } from "react-icons/ri"
import { generateJsonContent } from "@/config/gemini"
import { getMetadataPrompt, getMetadataSystemPrompt } from "@/prompts/metadata"
import type { ArticleMetadata } from "@/hooks/use-article-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MetadataFormProps {
  onCompleteAction: () => void
}

export function MetadataForm({ onCompleteAction }: MetadataFormProps) {
  const { article, setMetadata } = useArticleStore()
  const [metadataState, setMetadataState] = useState<ArticleMetadata>(
    article.metadata || {
      description: "",
      categories: [],
      tags: [],
    },
  )
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
      const prompt = getMetadataPrompt(
        article.title,
        article.introduction,
        article.content.map((section) => section.title).join(", "),
      )
      const systemPrompt = getMetadataSystemPrompt()

      const result = await generateJsonContent(prompt, systemPrompt)

      // Validate the structure
      if (typeof result.description === "string" && Array.isArray(result.categories) && Array.isArray(result.tags)) {
        // Ensure description is not too long
        const description =
          result.description.length > 155 ? result.description.substring(0, 152) + "..." : result.description

        const metadata: ArticleMetadata = {
          description,
          categories: result.categories.slice(0, 3), // Limit to 3 categories
          tags: result.tags.slice(0, 10), // Limit to 10 tags
        }

        setMetadataState(metadata)
        setMetadata(metadata)
      } else {
        throw new Error("Invalid metadata structure")
      }
    } catch (err) {
      console.error("Error generating metadata:", err)
      setError("Failed to generate metadata. Please try again or enter your own metadata.")

      // Provide fallback metadata
      const fallbackMetadata: ArticleMetadata = {
        description: `An informative article about ${article.title} that provides valuable insights and practical information.`,
        categories: ["General", "Information", "Guide"],
        tags: ["guide", "information", "tips", "advice", "overview"],
      }

      setMetadataState(fallbackMetadata)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!metadataState.description || metadataState.categories.length === 0 || metadataState.tags.length === 0) {
      setError("Please generate metadata first or fill in all fields")
      return
    }

    setMetadata(metadataState)
    onCompleteAction()
  }

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FaTags className="h-4 w-4 text-primary" />
            SEO Metadata
          </CardTitle>
          <FiSettings className="h-4 w-4 text-primary" />
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Generate SEO-friendly metadata for your article based on the title: <strong className="text-foreground">{article.title}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-4">
            <Button 
              type="button" 
              onClick={handleGenerate} 
              disabled={isGenerating || !article.title} 
              className="w-full h-10 transition-colors text-sm bg-secondary hover:bg-secondary/90 rounded-md"
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
                  Generate Metadata
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
              <Label htmlFor="metaDescription" className="text-sm font-medium text-foreground">Meta Description (max 155 characters)</Label>
              <Textarea
                id="metaDescription"
                placeholder="Your meta description will appear here"
                value={metadataState.description}
                onChange={(e) =>
                  setMetadataState({
                    ...metadataState,
                    description: e.target.value.substring(0, 155),
                  })
                }
                maxLength={155}
                className="min-h-[80px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
              />
              <div className="text-xs text-muted-foreground text-right">{metadataState.description.length}/155</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories" className="text-sm font-medium text-foreground">Categories (comma-separated)</Label>
              <Textarea
                id="categories"
                placeholder="Your categories will appear here"
                value={metadataState.categories.join(", ")}
                onChange={(e) =>
                  setMetadataState({
                    ...metadataState,
                    categories: e.target.value
                      .split(",")
                      .map((cat) => cat.trim())
                      .filter(Boolean),
                  })
                }
                className="min-h-[60px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-foreground">Tags (comma-separated)</Label>
              <Textarea
                id="tags"
                placeholder="Your tags will appear here"
                value={metadataState.tags.join(", ")}
                onChange={(e) =>
                  setMetadataState({
                    ...metadataState,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                className="min-h-[60px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button
            type="submit"
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
            disabled={
              isGenerating ||
              !metadataState.description ||
              metadataState.categories.length === 0 ||
              metadataState.tags.length === 0
            }
          >
            Continue <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
