import { ArticleGenerator } from "@/components/article-generator/index"
import { Separator } from "@/components/ui/separator"
import { MdAutoAwesome } from "react-icons/md"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="flex flex-col items-center space-y-6 text-center mb-12 fade-in">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-2 slide-up">
            Alpha Release v1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground slide-up" style={{ animationDelay: "0.1s" }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
              QuantaPress
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg slide-up" style={{ animationDelay: "0.2s" }}>
            Create AI-powered articles with a modular, step-by-step approach
          </p>
          
          <div className="flex items-center gap-2 slide-up" style={{ animationDelay: "0.3s" }}>
            <MdAutoAwesome className="text-primary h-5 w-5" />
            <span className="text-sm text-muted-foreground">Advanced content generation with industry-specific optimizations</span>
          </div>
          
          <Separator className="max-w-md mx-auto my-2 bg-border" />
        </div>
        
        <div className="scale-in" style={{ animationDelay: "0.4s" }}>
          <ArticleGenerator />
        </div>
      </div>
    </main>
  )
}
