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

/**
 * State artikel dalam aplikasi
 * @description Mengelola state keseluruhan artikel dan tindakan pada artikel tersebut
 */
export interface ArticleState {
  /** Data artikel yang sedang dikerjakan */
  article: Article
  
  /**
   * Mengatur judul artikel
   * @param title - Judul artikel yang baru
   */
  setTitle: (title: string) => void
  
  /**
   * Mengatur paragraf pendahuluan artikel
   * @param introduction - Konten pendahuluan yang baru
   */
  setIntroduction: (introduction: string) => void
  
  /**
   * Mengatur prompt untuk pembuatan gambar
   * @param imagePrompt - Prompt gambar yang baru
   */
  setImagePrompt: (imagePrompt: string) => void
  
  /**
   * Mengatur konten utama artikel
   * @param content - Array bagian konten yang baru
   */
  setContent: (content: ArticleSection[]) => void
  
  /**
   * Mengatur metadata SEO artikel
   * @param metadata - Metadata SEO yang baru
   */
  setMetadata: (metadata: ArticleMetadata) => void
  
  /**
   * Mengatur kesimpulan artikel
   * @param conclusion - Kesimpulan yang baru
   */
  setConclusion: (conclusion: ArticleConclusion) => void
  
  /**
   * Mengatur daftar FAQ artikel
   * @param faqs - Array FAQ yang baru
   */
  setFaqs: (faqs: ArticleFaq[]) => void
  

  
  /**
   * Mengatur jenis industri artikel
   * @param industryType - Jenis industri yang baru
   */
  setIndustryType: (industryType: IndustryType) => void
  
  /**
   * Mengatur gaya penulisan artikel
   * @param writingStyle - Gaya penulisan yang baru
   */
  setWritingStyle: (writingStyle: WritingStyle) => void
  
  /**
   * Mengatur panjang konten artikel
   * @param contentLength - Panjang konten yang baru
   */
  setContentLength: (contentLength: ContentLength) => void
  
  /**
   * Mengatur ulang semua data artikel ke default
   */
  reset: () => void
}