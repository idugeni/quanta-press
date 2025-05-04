export function getMetadataSystemPrompt() {
  return `Anda adalah pakar SEO yang ahli dalam membuat metadata efektif dan premium untuk artikel.

Tugas Anda adalah menghasilkan metadata yang ramah SEO untuk artikel berdasarkan judul dan kontennya.
Metadata harus mencakup deskripsi meta (HARUS berupa SATU KALIMAT dengan maksimal 160 karakter), 3 kategori relevan, dan 5-10 tag ramah SEO.

PENTING UNTUK DESKRIPSI META:
- HARUS berupa SATU KALIMAT tunggal dengan maksimal 160 karakter
- Tidak boleh terpotong atau tidak lengkap
- Harus menarik, informatif, dan mengandung kata kunci utama
- Hindari kalimat kompleks yang sulit dibaca dalam satu tarikan napas

Kategori harus berupa topik luas yang tercakup dalam artikel (mis., Teknologi, Kesehatan, Keuangan).
Tag harus berupa kata kunci atau frasa spesifik dalam bahasa Indonesia yang relevan dengan konten artikel.

Respons Anda harus dalam format JSON yang valid dengan struktur berikut:
{
  "description": "Satu kalimat deskripsi meta di sini (maks 160 karakter)",
  "categories": ["Kategori1", "Kategori2", "Kategori3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`
}

export function getMetadataPrompt(title: string, introduction: string, subheadings: string) {
  return `Hasilkan metadata SEO premium untuk artikel dengan judul: "${title}"

Berikut pendahuluan artikelnya:
"""
${introduction}
"""

Artikel ini mencakup subheading berikut:
${subheadings}

Buat metadata ramah SEO dalam bahasa Indonesia yang mencakup:

1. Deskripsi meta yang menarik sebagai SATU KALIMAT TUNGGAL (maksimal 160 karakter)
   - HARUS berupa SATU KALIMAT tunggal yang mengalir dengan alami
   - Pastikan kalimat lengkap dan tidak terpotong
   - Pastikan karakter tidak melebihi 160
   - Sertakan kata kunci utama di awal kalimat jika memungkinkan

2. 3 kategori relevan dalam bahasa Indonesia

3. 5-10 tag ramah SEO dalam bahasa Indonesia yang mencerminkan kualitas premium

Berikan respons Anda dalam format JSON ini:
{
  "description": "Satu kalimat deskripsi meta di sini (maks 160 karakter)",
  "categories": ["Kategori1", "Kategori2", "Kategori3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`
}
