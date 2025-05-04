import { useState } from 'react';
import { useArticleStore } from '@/hooks/use-article-store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { FiFileText, FiLoader } from 'react-icons/fi';
import { RiMagicLine } from 'react-icons/ri';
import { generateContentStream } from '@/config/gemini'; // Ganti import
import { getConclusionPrompt, getConclusionSystemPrompt } from '@/prompts/conclusion';
import type { ArticleConclusion } from '@/hooks/use-article-store';

interface ConclusionFormProps {
  onCompleteAction: () => void
}

export function ConclusionForm({ onCompleteAction }: ConclusionFormProps) {
  const { article, setConclusion } = useArticleStore();
  const [conclusionData, setConclusionData] = useState<ArticleConclusion | null>(article.conclusion);
  const [streamingConclusion, setStreamingConclusion] = useState(''); // State untuk teks streaming
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!article.title || article.content.length === 0) {
      setError('Please go back and enter a title and generate content first');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStreamingConclusion(''); // Reset teks streaming
    setConclusionData(null); // Reset data kesimpulan

    try {
      const prompt = getConclusionPrompt(
        article.title,
        article.introduction,
        article.content.map((section) => section.title).join(', '),
      );
      const systemPrompt = getConclusionSystemPrompt();

      let fullResponse = '';
      await generateContentStream(prompt, systemPrompt, (chunk) => {
        fullResponse += chunk;
        setStreamingConclusion(fullResponse); // Update teks streaming secara real-time
      });

      // Parse JSON setelah stream selesai
      try {
        const cleanedResponse = fullResponse.replace(/^```json\n?|\n?```$/g, '');
        const parsedData: ArticleConclusion = JSON.parse(cleanedResponse);

        // Validasi struktur dasar
        if (typeof parsedData.summary === 'string' && typeof parsedData.cta === 'string') {
          setConclusionData(parsedData);
          setConclusion(parsedData);
        } else {
          throw new Error('Invalid conclusion structure received');
        }
      } catch (parseError) {
        console.error('Error parsing conclusion JSON:', parseError);
        console.error('Raw response:', fullResponse);
        setError('Failed to parse conclusion data. Invalid format received. Please try again.');
        // Set fallback data if parsing fails
        const fallbackConclusion: ArticleConclusion = {
          summary: `This article provided an overview of ${article.title}. Key takeaways include... (Fallback summary due to generation error)`, 
          cta: 'Consider exploring further resources to deepen your understanding. (Fallback CTA due to generation error)',
        };
        setConclusionData(fallbackConclusion);
        setStreamingConclusion(JSON.stringify(fallbackConclusion, null, 2)); // Tampilkan fallback di area streaming
      }
    } catch (err) {
      console.error('Error generating conclusion:', err);
      setError('Failed to generate conclusion. Please try again.');
       // Set fallback data if generation fails
       const fallbackConclusion: ArticleConclusion = {
        summary: `This article provided an overview of ${article.title}. Key takeaways include... (Fallback summary due to generation error)`, 
        cta: 'Consider exploring further resources to deepen your understanding. (Fallback CTA due to generation error)',
      };
      setConclusionData(fallbackConclusion);
      setStreamingConclusion(JSON.stringify(fallbackConclusion, null, 2)); // Tampilkan fallback di area streaming
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!conclusionData || !conclusionData.summary.trim() || !conclusionData.cta.trim()) {
      setError('Please generate a conclusion first or ensure both fields are filled');
      return;
    }

    setConclusion(conclusionData);
    onCompleteAction();
  };

  // Helper untuk menghitung karakter
  const calculateLength = (text: string | undefined): number => text?.length || 0;

  return (
    <Card className="border-none bg-card transition-all rounded-xl overflow-hidden shadow-md">
      <CardHeader className="space-y-2 pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-primary" />
            Conclusion
          </CardTitle>
          <FiFileText className="h-4 w-4 text-primary" />
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Generate a concise summary and call-to-action for your article based on the title and content.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 pb-3">
          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !article.title || article.content.length === 0}
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
                  Generate Conclusion
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
            {isGenerating && streamingConclusion && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Generating...</Label>
                <Textarea
                  readOnly
                  value={streamingConclusion}
                  className="min-h-[150px] p-3 text-sm bg-background/60 text-muted-foreground border-input/50 transition-all resize-y rounded-md font-mono text-xs"
                  placeholder="Receiving conclusion data..."
                />
              </div>
            )}

            {/* Tampilkan form input setelah selesai generate atau jika ada data awal */}
            {(!isGenerating || conclusionData) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summary" className="text-sm font-medium text-foreground">Summary</Label>
                  <div className="relative">
                    <Textarea
                      id="summary"
                      placeholder="Your article summary will appear here"
                      value={conclusionData?.summary || ''}
                      onChange={(e) => setConclusionData(prev => ({ ...prev!, summary: e.target.value }))}
                      className="min-h-[100px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
                      disabled={isGenerating}
                    />
                    {!isGenerating && conclusionData?.summary && (
                      <div className="absolute right-2 bottom-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 text-xs py-0.5 px-1.5">
                          {calculateLength(conclusionData?.summary)} chars
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta" className="text-sm font-medium text-foreground">Call to Action (CTA)</Label>
                  <div className="relative">
                    <Textarea
                      id="cta"
                      placeholder="Your call to action will appear here"
                      value={conclusionData?.cta || ''}
                      onChange={(e) => setConclusionData(prev => ({ ...prev!, cta: e.target.value }))}
                      className="min-h-[60px] p-3 text-sm focus-visible:ring-primary bg-background/60 text-foreground border-input/50 transition-all resize-y rounded-md"
                      disabled={isGenerating}
                    />
                    {!isGenerating && conclusionData?.cta && (
                      <div className="absolute right-2 bottom-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 text-xs py-0.5 px-1.5">
                          {calculateLength(conclusionData?.cta)} chars
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pb-5">
          <Button
            type="submit"
            className="w-full h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md"
            disabled={isGenerating || !conclusionData || !conclusionData.summary.trim() || !conclusionData.cta.trim()}
          >
            Continue <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
