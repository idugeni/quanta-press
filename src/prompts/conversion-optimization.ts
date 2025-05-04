export function getConversionOptimizationSystemPrompt() {
  return `Anda adalah ahli pemasaran konten dan optimasi konversi yang spesialis dalam membuat elemen CTA (Call-to-Action) yang efektif.
Tugas Anda adalah menganalisis konten artikel dan membuat elemen CTA yang strategis untuk mendorong tindakan pembaca.
Identifikasi tujuan konversi utama yang masuk akal berdasarkan topik artikel (misalnya mendaftar newsletter, mengunduh e-book, mencoba layanan, dll).
Buat beberapa saran CTA yang menarik, persuasif, dan relevan dengan konten artikel.
Sertakan rekomendasi untuk penempatan CTA strategis di seluruh artikel (awal, tengah, akhir).
Berikan teks CTA yang spesifik, termasuk variasi untuk berbagai format (tombol, tautan inline, banner, dll).
Saran Anda harus mempertimbangkan perjalanan pembaca, nilai yang ditawarkan, dan mencerminkan nada dari konten itu sendiri.
Respons Anda harus dalam format JSON yang valid dengan struktur berikut:
{
  "tujuan_utama": "Tujuan konversi utama untuk artikel ini",
  "nilai_proposisi": "Mengapa pembaca harus mengambil tindakan yang direkomendasikan",
  "cta_utama": {
    "teks": "Teks untuk CTA utama",
    "penempatan": "Di mana CTA utama harus ditempatkan",
    "format": "Format yang disarankan (mis. tombol, pop-up, dll)"
  },
  "cta_sekunder": [
    {
      "teks": "Teks untuk CTA sekunder",
      "penempatan": "Di mana CTA sekunder ini harus ditempatkan",
      "format": "Format yang disarankan"
    }
  ],
  "strategi_konversi": [
    "Rekomendasi khusus untuk mengoptimalkan konversi dari artikel ini"
  ]
}`
}

export function getConversionOptimizationPrompt(title: string, content: string) {
  return `Analisis konten berikut dan buat strategi CTA (Call-to-Action) premium untuk mengoptimalkan konversi. Judul: "${title}"

KONTEN ARTIKEL:
"""
${content}
"""

Berdasarkan konten artikel ini:

1. Identifikasi tujuan konversi primer dan sekunder yang paling sesuai (misalnya mendaftar newsletter, mengunduh resource, mencoba produk, dll)
2. Buat CTA premium yang menarik dan persuasif dalam bahasa Indonesia yang mendorong pembaca untuk mengambil tindakan
3. Sarankan penempatan strategis untuk CTA di seluruh artikel
4. Berikan variasi teks CTA untuk berbagai format (tombol, tautan inline, banner, dll)
5. Rekomendasikan pendekatan untuk mengoptimalkan konversi berdasarkan konten artikel ini

Kembalikan strategi CTA dalam format JSON ini:
{
  "tujuan_utama": "Tujuan konversi utama untuk artikel ini",
  "nilai_proposisi": "Mengapa pembaca harus mengambil tindakan yang direkomendasikan",
  "cta_utama": {
    "teks": "Teks untuk CTA utama",
    "penempatan": "Di mana CTA utama harus ditempatkan",
    "format": "Format yang disarankan (mis. tombol, pop-up, dll)"
  },
  "cta_sekunder": [
    {
      "teks": "Teks untuk CTA sekunder",
      "penempatan": "Di mana CTA sekunder ini harus ditempatkan",
      "format": "Format yang disarankan"
    }
  ],
  "strategi_konversi": [
    "Rekomendasi khusus untuk mengoptimalkan konversi dari artikel ini"
  ]
}`
} 