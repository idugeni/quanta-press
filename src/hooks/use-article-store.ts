import { create } from "zustand"
import type { 
  Article,
  ArticleSection, 
  ArticleMetadata, 
  ArticleConclusion, 
  ArticleFaq, 

  IndustryType, 
  WritingStyle, 
  ContentLength 
} from "@/types/article"
import type { ArticleState } from "@/types/store"

// Re-export all types for backward compatibility
export type { 
  Article,
  ArticleSection, 
  ArticleMetadata, 
  ArticleConclusion, 
  ArticleFaq, 

  IndustryType, 
  WritingStyle, 
  ContentLength,
  ArticleState
}

/**
 * Store zustand untuk mengelola state artikel
 * @description Menyimpan data artikel dan menyediakan fungsi untuk manipulasi state
 */
export const useArticleStore = create<ArticleState>((set) => ({
  article: {
    title: "",
    introduction: "",
    imagePrompt: "",
    generatedImage: null,
    content: [],
    metadata: null,
    conclusion: null,
    faqs: [],

    industryType: "general",
    writingStyle: "balanced",
    contentLength: "medium"
  },
  
  setTitle: (title) =>
    set((state) => ({
      article: { ...state.article, title },
    })),
    
  setIntroduction: (introduction) =>
    set((state) => ({
      article: { ...state.article, introduction },
    })),
    
  setImagePrompt: (imagePrompt) =>
    set((state) => ({
      article: { ...state.article, imagePrompt },
    })),
  setGeneratedImage: (generatedImage: string | null) =>
    set((state) => ({
      article: { ...state.article, generatedImage },
    })),
    
  setContent: (content) =>
    set((state) => ({
      article: { ...state.article, content },
    })),
    
  setMetadata: (metadata) =>
    set((state) => ({
      article: { ...state.article, metadata },
    })),
    
  setConclusion: (conclusion) =>
    set((state) => ({
      article: { ...state.article, conclusion },
    })),
    
  setFaqs: (faqs) =>
    set((state) => ({
      article: { ...state.article, faqs },
    })),
    

    
  setIndustryType: (industryType) =>
    set((state) => ({
      article: { ...state.article, industryType },
    })),
    
  setWritingStyle: (writingStyle) =>
    set((state) => ({
      article: { ...state.article, writingStyle },
    })),
    
  setContentLength: (contentLength) =>
    set((state) => ({
      article: { ...state.article, contentLength },
    })),
    
  reset: () =>
    set({
      article: {
        title: "",
        introduction: "",
        imagePrompt: "",
        generatedImage: null,
        content: [],
        metadata: null,
        conclusion: null,
        faqs: [],

        industryType: "general",
        writingStyle: "balanced",
        contentLength: "medium"
      },
    }),
}))
