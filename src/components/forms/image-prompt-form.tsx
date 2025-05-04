"use client"

import type React from "react"

import { useState } from "react"
import Image from 'next/image'; // Impor komponen Image
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { FaArrowRight, FaImage as FaImageIcon } from "react-icons/fa" // Ganti nama ikon jika perlu
import { FiImage, FiLoader } from "react-icons/fi"
import { RiMagicLine } from "react-icons/ri"
import { generateContentStream } from "@/config/gemini"
import { getImagePromptPrompt, getImagePromptSystemPrompt } from "@/prompts/image-prompt"
import { generateImageAction } from '@/actions/image-generation'; // Impor server action

interface ImagePromptFormProps {
  onCompleteAction: () => void
}

export function ImagePromptForm({ onCompleteAction }: ImagePromptFormProps) {
  const { article, setImagePrompt } = useArticleStore()
  const [imagePromptText, setImagePromptText] = useState(article.imagePrompt)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false); // State untuk loading gambar
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null); // State untuk data gambar base64
  const [promptError, setPromptError] = useState("")
  const [imageError, setImageError] = useState(""); // State untuk error gambar

  const handleGeneratePrompt = async () => {
    if (!article.title) {
      setPromptError("Please go back and enter a title first")
      return
    }

    setIsGeneratingPrompt(true)
    setPromptError("")
    setImageError(""); // Reset error gambar juga
    setGeneratedImageData(null); // Reset gambar saat generate prompt baru

    try {
      const prompt = getImagePromptPrompt(article.title, article.introduction)
      const systemPrompt = getImagePromptSystemPrompt()

      let generatedImagePrompt = ""

      await generateContentStream(prompt, systemPrompt, (chunk) => {
        generatedImagePrompt += chunk
        setImagePromptText(generatedImagePrompt)
      })

      setImagePrompt(generatedImagePrompt)
    } catch (err) {
      console.error("Error generating image prompt:", err)
      setPromptError("Failed to generate image prompt. Please try again or enter your own prompt.")

      // Provide a fallback image prompt if generation fails
      const fallbackPrompt = `A professional, high-quality image representing "${article.title}". Clean composition with soft lighting and a modern aesthetic. The image should be visually appealing and relevant to the article topic.`

      setImagePromptText(fallbackPrompt)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  // Fungsi baru untuk generate gambar
  const handleGenerateImage = async () => {
    if (!imagePromptText.trim()) {
      setImageError("Please generate or enter an image prompt first.");
      return;
    }

    setIsGeneratingImage(true);
    setImageError("");
    setPromptError(""); // Reset error prompt
    setGeneratedImageData(null);

    try {
      const imageData = await generateImageAction(imagePromptText);
      if (imageData) {
        setGeneratedImageData(imageData);
        // Mungkin Anda ingin menyimpan URL/data ini ke store juga?
        // setArticleImage(imageData); // Contoh jika ada fungsi di store
      } else {
        throw new Error('Image generation returned no data.');
      }
    } catch (err) {
      console.error("Error generating image:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setImageError(`Failed to generate image: ${errorMessage}. Please try again.`);
      setGeneratedImageData(null); // Pastikan tidak ada gambar lama yang ditampilkan
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!imagePromptText.trim()) {
      setPromptError("Please generate an image prompt first")
      return
    }

    setImagePrompt(imagePromptText)
    // Mungkin Anda ingin memastikan gambar sudah digenerate sebelum lanjut?
    // if (!generatedImageData) {
    //   setImageError("Please generate an image before continuing.");
    //   return;
    // }
    onCompleteAction()
  }

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FiImage className="h-4 w-4 text-primary" />
            Image Prompt & Generation
          </CardTitle>
          <FiImage className="h-4 w-4 text-primary" />
        </div>
        <CardDescription className="text-sm text-muted-foreground flex items-center flex-wrap gap-1">
          Generate a prompt and then generate the image directly.
          <Badge variant="outline" className="font-normal text-xs py-0.5 px-1.5 border-border/40 bg-background/60">Gemini</Badge>
          {/* Hapus badge lain jika hanya pakai Gemini */}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-4">
            {/* Tombol Generate Prompt */}
            <Button
              type="button"
              onClick={handleGeneratePrompt}
              disabled={isGeneratingPrompt || isGeneratingImage || !article.title}
              className="w-full h-10 transition-colors text-sm bg-secondary hover:bg-secondary/90 rounded-md"
              variant="secondary"
            >
              {isGeneratingPrompt ? (
                <>
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <RiMagicLine className="mr-2 h-4 w-4" />
                  Generate Image Prompt
                </>
              )}
            </Button>

            {promptError && (
              <Alert variant="destructive" className="border-destructive/50 text-destructive py-2">
                <AlertTitle className="text-xs font-medium">Prompt Error</AlertTitle>
                <AlertDescription className="text-xs">{promptError}</AlertDescription>
              </Alert>
            )}

            {/* Textarea untuk Prompt */}
            <div className="space-y-2">
              <Label htmlFor="imagePrompt" className="text-sm font-medium text-foreground">Image Prompt (English)</Label>
              <div className="relative">
                <Textarea
                  id="imagePrompt"
                  placeholder="Your image prompt will appear here"
                  value={imagePromptText}
                  onChange={(e) => {
                    setImagePromptText(e.target.value);
                    setPromptError(""); // Hapus error saat user mengetik
                    setImageError("");
                    setGeneratedImageData(null); // Hapus gambar jika prompt diubah manual
                  }}
                  className="min-h-[100px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
                  disabled={isGeneratingPrompt || isGeneratingImage}
                />
                {imagePromptText && !isGeneratingPrompt && !isGeneratingImage && (
                  <div className="absolute right-2 bottom-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 text-xs py-0.5 px-1.5">
                      {imagePromptText.length} chars
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Generate Image */}
            <Button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingPrompt || isGeneratingImage || !imagePromptText.trim()}
              className="w-full h-10 transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              variant="default" // Atau sesuaikan varian
            >
              {isGeneratingImage ? (
                <>
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <FaImageIcon className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>

            {/* Tampilkan Gambar Hasil Generate */}
            {generatedImageData && (
              <div className="mt-4 border border-border/40 rounded-md p-2 bg-background/50">
                <Label className="text-xs font-medium text-muted-foreground mb-1 block">Generated Image Preview</Label>
                <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded">
                  <Image
                    src={generatedImageData}
                    alt="Generated Image"
                    layout="fill" // Atau 'intrinsic', 'fixed', 'responsive'
                    objectFit="contain" // Atau 'cover'
                    className="rounded"
                  />
                </div>
              </div>
            )}

            {imageError && (
              <Alert variant="destructive" className="border-destructive/50 text-destructive py-2 mt-4">
                <AlertTitle className="text-xs font-medium">Image Error</AlertTitle>
                <AlertDescription className="text-xs">{imageError}</AlertDescription>
              </Alert>
            )}

            {/* Area Tampilan Gambar */}
            {generatedImageData && (
              <div className="mt-4 p-4 border border-border/40 rounded-lg bg-background/60 flex flex-col items-center">
                <Label className="text-sm font-medium text-foreground mb-2">Generated Image:</Label>
                <Image
                  src={generatedImageData} // Langsung gunakan data base64
                  alt="Generated image based on prompt"
                  width={256} // Sesuaikan ukuran
                  height={256}
                  className="rounded-md object-cover border border-border/20"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button
            type="submit"
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
            disabled={isGeneratingPrompt || isGeneratingImage || !imagePromptText.trim()}
          >
            Continue <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
