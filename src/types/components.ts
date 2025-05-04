/**
 * Props untuk form dengan callback penyelesaian
 */
export interface CompletableFormProps {
  /** 
   * Callback yang dipanggil ketika form selesai diisi 
   * @description Biasanya digunakan untuk melanjutkan ke langkah berikutnya
   */
  onCompleteAction: () => void
}

/**
 * Props untuk form artikel
 */
export interface ArticleFormProps extends CompletableFormProps {
  /**
   * Status loading ketika data sedang diproses
   */
  isLoading?: boolean
  
  /**
   * Pesan error yang muncul pada form
   */
  error?: string
}

/**
 * Props untuk form input yang dapat di-submit
 */
export interface SubmittableFormProps {
  /**
   * Callback yang dipanggil saat form di-submit
   */
  onSubmit: (e: React.FormEvent) => void
  
  /**
   * Status loading saat form sedang diproses
   */
  isLoading?: boolean
  
  /**
   * Pesan error yang muncul pada form
   */
  error?: string
  
  /**
   * Teks pada tombol submit
   */
  submitText?: string
  
  /**
   * Status form apakah valid untuk di-submit
   */
  isValid?: boolean
  
  /**
   * Ikon untuk tombol submit (opsional)
   */
  submitIcon?: React.ReactNode
}

/**
 * Props untuk komponen yang menampilkan bagian artikel
 */
export interface ArticleSectionViewProps {
  /**
   * Judul bagian
   */
  title: string
  
  /**
   * Konten dalam format HTML
   */
  content: string
  
  /**
   * Flag untuk menampilkan garis pemisah
   */
  showSeparator?: boolean
}

/**
 * Props untuk komponen yang dapat diedit
 */
export interface EditableComponentProps {
  /**
   * Status apakah komponen sedang dalam mode edit
   */
  isEditing: boolean
  
  /**
   * Callback untuk mengubah status edit
   */
  onEditToggle: () => void
  
  /**
   * Callback yang dipanggil saat perubahan disimpan
   */
  onSave: () => void
}

/**
 * Props untuk komponen yang menangani generasi konten
 */
export interface ContentGenerationProps {
  /**
   * Status apakah konten sedang digenerate
   */
  isGenerating: boolean
  
  /**
   * Callback untuk memulai generasi konten
   */
  onGenerate: () => void
  
  /**
   * Callback saat generasi batal
   */
  onCancel?: () => void
} 