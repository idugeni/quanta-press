"use client"

import type React from "react"

import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FaPen, FaArrowRight } from "react-icons/fa"
import { FiStar } from "react-icons/fi"

interface TitleFormProps {
  onCompleteAction: () => void
}

export function TitleForm({ onCompleteAction }: TitleFormProps) {
  const { article, setTitle } = useArticleStore()
  const [titleInput, setTitleInput] = useState(article.title)
  const [error, setError] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!titleInput.trim()) {
      setError("Please enter a title for your article")
      return
    }

    setTitle(titleInput)
    onCompleteAction()
  }

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FaPen className="h-4 w-4 text-primary" />
            Article Title
          </CardTitle>
          <button 
            type="button" 
            onClick={() => setIsFavorite(!isFavorite)} 
            className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center text-primary hover:text-primary/80 transition-colors"
          >
            <FiStar className={`h-4 w-4 ${isFavorite ? 'fill-primary' : ''}`} />
          </button>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Enter a title for your article. This will be used as the main context for all subsequent steps.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">Title</Label>
              <Input
                id="title"
                placeholder="Enter your article title"
                value={titleInput}
                onChange={(e) => {
                  setTitleInput(e.target.value)
                  setError("")
                }}
                className="h-10 text-sm bg-background/60 text-foreground focus-visible:ring-primary border-input/50 transition-all rounded-md"
              />
              {error && <p className="text-xs font-medium text-destructive mt-1">{error}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button 
            type="submit" 
            disabled={!titleInput.trim()}
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
