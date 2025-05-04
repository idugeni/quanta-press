/**
 * Definisi jenis industri untuk konten
 * @description Menentukan fokus dan terminologi yang digunakan dalam konten artikel
 */
export type IndustryType = 
  | "general" 
  | "fintech" 
  | "finance"       // Keuangan tradisional
  | "healthcare" 
  | "health_fitness" // Kesehatan & kebugaran
  | "technology" 
  | "education" 
  | "retail" 
  | "manufacturing" 
  | "food" 
  | "tourism" 
  | "property" 
  | "automotive" 
  | "agriculture" 
  | "media"
  | "entertainment" // Hiburan (terpisah dari media)
  | "energy_mining" // Energi & pertambangan
  | "construction"  // Konstruksi & infrastruktur
  | "logistics"     // Logistik & transportasi
  | "startup_umkm"  // Startup & UMKM
  | "government"    // Pemerintahan & layanan publik
  | "creative"      // Ekonomi kreatif & digital
  | "green_tech"    // Teknologi hijau & keberlanjutan
  | "esports"       // E-Sports & Gaming
  | "blockchain"    // Blockchain & Cryptocurrency

/**
 * Definisi gaya penulisan untuk konten
 * @description Menentukan nada dan formalitas bahasa yang digunakan dalam artikel
 */
export type WritingStyle = 
  | "balanced" // Seimbang (Profesional namun Mudah Dipahami)
  | "formal" // Formal (Akademis dan Profesional)
  | "santai" // Santai (Konversasional dan Ramah)
  | "teknis" // Teknis (Detail dan Spesifik)

/**
 * Definisi panjang konten
 * @description Menentukan kedalaman dan detail yang digunakan dalam setiap bagian artikel
 */
export type ContentLength = 
  | "short" // Pendek (200-300 kata per bagian)
  | "medium" // Sedang (500-700 kata per bagian)
  | "long" // Panjang (1000-1500 kata per bagian)

/**
 * Struktur bagian artikel
 * @description Mendefinisikan struktur data untuk satu bagian artikel
 */
export interface ArticleSection {
  /** Judul subbagian artikel */
  title: string
  /** Konten subbagian dalam format HTML */
  content: string
}

/**
 * Metadata artikel untuk SEO dan kategorisasi
 */
export interface ArticleMetadata {
  /** Deskripsi meta untuk SEO, biasanya 150-160 karakter */
  description: string
  /** Kategori utama artikel */
  categories: string[]
  /** Tag-tag terkait untuk indeksasi dan pengelompokan */
  tags: string[]
}

/**
 * Struktur bagian kesimpulan
 */
export interface ArticleConclusion {
  /** Ringkasan akhir dari artikel */
  summary: string
  /** Call-to-action untuk pembaca */
  cta: string
}

/**
 * Struktur pertanyaan dan jawaban untuk bagian FAQ
 */
export interface ArticleFaq {
  /** Pertanyaan yang sering diajukan */
  question: string
  /** Jawaban untuk pertanyaan */
  answer: string
}

/**
 * Struktur data untuk infografis
 * @description Mendefinisikan elemen visual dan data untuk infografis
 */
export interface ArticleInfographics {
  /** Judul infografis */
  title: string
  /** Jenis layout yang digunakan */
  layout_type: string
  /** Elemen-elemen utama yang ditampilkan dalam infografis */
  key_elements: {
    /** Nama bagian */
    section: string
    /** Konten atau poin utama */
    content: string
    /** Jenis visual yang digunakan */
    visual_type: string
  }[]
  /** Panduan gaya untuk desain infografis */
  style_guide: {
    /** Palet warna yang digunakan */
    color_palette: string
    /** Tipografi dan elemen teks */
    typography: string
    /** Elemen visual tambahan */
    visual_elements: string
  }
  /** Visualisasi data dalam infografis */
  data_visualization: {
    /** Titik data yang divisualisasikan */
    data_point: string
    /** Jenis visualisasi (grafik, diagram, dll) */
    viz_type: string
  }[]
}

/**
 * Struktur data untuk optimasi konversi
 * @description Mendefinisikan strategi dan elemen call-to-action
 */
export interface ArticleConversionOptimization {
  /** Tujuan utama konversi */
  tujuan_utama: string
  /** Nilai proposisi yang ditawarkan */
  nilai_proposisi: string
  /** CTA utama dalam artikel */
  cta_utama: {
    /** Teks CTA */
    teks: string
    /** Lokasi penempatan */
    penempatan: string
    /** Format penampilan (button, link, dll) */
    format: string
  }
  /** CTA sekunder dalam artikel */
  cta_sekunder: {
    /** Teks CTA sekunder */
    teks: string
    /** Lokasi penempatan */
    penempatan: string
    /** Format penampilan */
    format: string
  }[]
  /** Strategi konversi tambahan */
  strategi_konversi: string[]
}

/**
 * Hasil pemeriksaan plagiarisme
 */
export interface PlagiarismResult {
  /** Persentase plagiarisme terdeteksi (0-100) */
  score: number
  /** Tingkat risiko plagiarisme (rendah, sedang, tinggi) */
  plagiarism_risk: string
  /** Masalah plagiarisme terdeteksi */
  issues: string[]
  /** Saran perbaikan */
  suggestions: string[]
}

/**
 * Struktur data artikel lengkap
 * @description Berisi semua informasi dan konten artikel
 */
export interface Article {
  /** Judul artikel */
  title: string
  /** Paragraf pembuka artikel */
  introduction: string
  /** Prompt untuk pembuatan gambar */
  imagePrompt: string
  /** Data gambar yang dihasilkan (base64 atau URL) */
  generatedImage?: string | null
  /** Bagian-bagian utama artikel */
  content: ArticleSection[]
  /** Metadata untuk SEO */
  metadata: ArticleMetadata | null
  /** Kesimpulan artikel */
  conclusion: ArticleConclusion | null
  /** Bagian FAQ */
  faqs: ArticleFaq[]
  /** Infografis artikel */
  infographics: ArticleInfographics | null
  /** Optimasi konversi */
  conversionOptimization: ArticleConversionOptimization | null
  /** Hasil pemeriksaan plagiarisme */
  plagiarismCheck: PlagiarismResult | null
  /** Jenis industri konten */
  industryType: IndustryType
  /** Gaya penulisan yang digunakan */
  writingStyle: WritingStyle
  /** Panjang konten yang digunakan */
  contentLength: ContentLength
}