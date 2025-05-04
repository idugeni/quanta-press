"use client"

import type React from "react"

import { useState } from "react"
import { useArticleStore } from "@/hooks/use-article-store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Tambahkan AlertTitle
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaQuestion, FaArrowRight } from "react-icons/fa"
import { MdQuestionAnswer } from "react-icons/md"
import { BiSolidMessageRoundedDetail } from "react-icons/bi"
import { RiLoaderLine, RiMagicLine } from "react-icons/ri"
import { generateContentStream } from "@/config/gemini" // Ganti import
import { getFaqPrompt, getFaqSystemPrompt } from "@/prompts/faq"
import type { ArticleFaq } from "@/hooks/use-article-store"

interface FaqFormProps {
  onCompleteAction: () => void
}

export function FaqForm({ onCompleteAction }: FaqFormProps) {
  const { article, setFaqs } = useArticleStore()
  const [numFaqs, setNumFaqs] = useState<string>("5")
  const [faqs, setFaqsState] = useState<ArticleFaq[]>(article.faqs.length > 0 ? article.faqs : [])
  const [streamingFaqs, setStreamingFaqs] = useState(''); // State untuk teks streaming
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!article.title) {
      setError("Please go back and enter a title first")
      return
    }

    setIsGenerating(true)
    setError("")
    setStreamingFaqs(''); // Reset teks streaming
    setFaqsState([]); // Reset state FAQ

    try {
      const prompt = getFaqPrompt(
        article.title,
        article.introduction,
        article.content.map((section) => section.title).join(", "),
        Number.parseInt(numFaqs),
      )
      const systemPrompt = getFaqSystemPrompt()

      let fullResponse = '';
      await generateContentStream(prompt, systemPrompt, (chunk) => {
        fullResponse += chunk;
        setStreamingFaqs(fullResponse); // Update teks streaming secara real-time
      });

      // Parse JSON setelah stream selesai
      try {
        const cleanedResponse = fullResponse.replace(/^```json\n?|\n?```$/g, '');
        const parsedData = JSON.parse(cleanedResponse);

        // Validate the structure
        if (Array.isArray(parsedData)) {
          const validFaqs = parsedData
            .filter((faq: { question?: string; answer?: string }) => typeof faq.question === 'string' && typeof faq.answer === 'string')
            .map((faq: { question: string; answer: string }) => ({
              question: faq.question,
              answer: faq.answer,
            }));

          if (validFaqs.length > 0) {
            setFaqsState(validFaqs);
            setFaqs(validFaqs);
          } else {
            // Jika array kosong setelah filter, lempar error
            throw new Error('No valid FAQs found in the response');
          }
        } else {
          // Jika bukan array, lempar error
          throw new Error('Invalid FAQs structure received (not an array)');
        }
      } catch (parseError) {
        console.error('Error parsing FAQs JSON:', parseError);
        console.error('Raw response:', fullResponse);
        setError('Failed to parse FAQs data. Invalid format received. Using fallback FAQs.');
        // Gunakan fallback jika parsing gagal
        generateFallbackFaqs();
      }
    } catch (err) {
      console.error('Error generating FAQs:', err);
      setError('Failed to generate FAQs. Please try again or use the provided fallback FAQs.');
      // Gunakan fallback jika generasi gagal
      generateFallbackFaqs();
    } finally {
      setIsGenerating(false);
    }
  };

  // Fungsi untuk generate fallback FAQs
  const generateFallbackFaqs = () => {
    const numFaqsInt = Number.parseInt(numFaqs);
    const fallbackFaqs: ArticleFaq[] = [
      {
        question: `What is the main benefit of understanding ${article.title}? (Fallback)`, 
        answer:
          'Understanding this topic provides valuable insights that can be applied in various contexts, improving decision-making and outcomes. (Fallback)',
      },
      {
        question: `How can I learn more about ${article.title}? (Fallback)`, 
        answer:
          'You can deepen your knowledge by reading books, taking courses, following industry experts, and applying the concepts in practical situations. (Fallback)',
      },
      {
        question: `Why is ${article.title} important? (Fallback)`, 
        answer:
          'This topic is important because it impacts multiple aspects of the field and provides a foundation for further development and innovation. (Fallback)',
      },
    ];

    while (fallbackFaqs.length < numFaqsInt && fallbackFaqs.length < 7) {
      fallbackFaqs.push({
        question: `What are common misconceptions about ${article.title}? (Fallback)`, 
        answer:
          'Many people misunderstand key aspects of this topic, often confusing it with related concepts or oversimplifying its complexity. (Fallback)',
      });
    }
    const finalFallback = fallbackFaqs.slice(0, numFaqsInt);
    setFaqsState(finalFallback);
    setStreamingFaqs(JSON.stringify(finalFallback, null, 2)); // Tampilkan fallback di area streaming juga
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (faqs.length === 0) {
      setError('Please generate FAQs first or add your own');
      return;
    }

    setFaqs(faqs);
    onCompleteAction();
  };

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <MdQuestionAnswer className="h-4 w-4 text-primary" />
          SEO FAQs
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Generate SEO-friendly FAQs for your article based on the title: <strong>{article.title}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="numFaqs" className="text-sm font-medium text-foreground flex items-center gap-2">
                <FaQuestion className="h-3.5 w-3.5 text-muted-foreground" />
                Number of FAQs
              </Label>
              <Select value={numFaqs} onValueChange={setNumFaqs} disabled={isGenerating}>
                <SelectTrigger id="numFaqs" className="h-10 text-sm bg-background/60 text-foreground focus-visible:ring-primary border-input/50 transition-all rounded-md">
                  <SelectValue placeholder="Select number of FAQs" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} FAQs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !article.title}
              className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
            >
              {isGenerating ? (
                <>
                  <RiLoaderLine className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RiMagicLine className="mr-2 h-3.5 w-3.5" />
                  Generate FAQs
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="border-destructive/50 text-destructive py-2">
                <AlertTitle className="text-xs font-medium">Error</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {/* Tampilkan teks streaming mentah jika sedang generate */}
            {isGenerating && streamingFaqs && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Generating...</Label>
                <Textarea
                  readOnly
                  value={streamingFaqs}
                  className="min-h-[150px] p-3 text-sm bg-background/60 text-muted-foreground border-input/50 transition-all resize-y rounded-md font-mono text-xs"
                  placeholder="Receiving FAQ data..."
                />
              </div>
            )}

            {/* Tampilkan editor FAQ setelah selesai generate atau jika ada data awal */}
            {!isGenerating && faqs.length > 0 && (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border/50 bg-background/60 p-4 rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`faq-question-${index}`}
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <FaQuestion className="h-3.5 w-3.5 text-muted-foreground" />
                        Question {index + 1}
                      </Label>
                      <Textarea
                        id={`faq-question-${index}`}
                        value={faq.question}
                        onChange={(e) => {
                          const updatedFaqs = [...faqs];
                          updatedFaqs[index] = {
                            ...updatedFaqs[index],
                            question: e.target.value,
                          };
                          setFaqsState(updatedFaqs);
                        }}
                        className="min-h-[60px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
                        disabled={isGenerating}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`faq-answer-${index}`}
                        className="text-sm font-medium text-foreground flex items-center gap-2"
                      >
                        <BiSolidMessageRoundedDetail className="h-3.5 w-3.5 text-muted-foreground" />
                        Answer {index + 1}
                      </Label>
                      <Textarea
                        id={`faq-answer-${index}`}
                        value={faq.answer}
                        onChange={(e) => {
                          const updatedFaqs = [...faqs];
                          updatedFaqs[index] = {
                            ...updatedFaqs[index],
                            answer: e.target.value,
                          };
                          setFaqsState(updatedFaqs);
                        }}
                        className="min-h-[100px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button
            type="submit"
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
            disabled={isGenerating || faqs.length === 0}
          >
            Continue <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
