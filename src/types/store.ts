import type { 
  Article, 
  ArticleSection, 
  ArticleMetadata, 
  ArticleConclusion, 
  ArticleFaq, 
  ArticleInfographics,
  ArticleConversionOptimization,
  PlagiarismResult,
  IndustryType,
  WritingStyle,
  ContentLength
} from "./article"

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
   * Mengatur data infografis artikel
   * @param infographics - Data infografis yang baru
   */
  setInfographics: (infographics: ArticleInfographics) => void
  
  /**
   * Mengatur strategi optimasi konversi
   * @param conversionOptimization - Data optimasi konversi yang baru
   */
  setConversionOptimization: (conversionOptimization: ArticleConversionOptimization) => void
  
  /**
   * Mengatur hasil pemeriksaan plagiarisme
   * @param plagiarismCheck - Hasil pemeriksaan plagiarisme yang baru
   */
  setPlagiarismCheck: (plagiarismCheck: PlagiarismResult) => void
  
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