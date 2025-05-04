export function getPlagiarismCheckSystemPrompt() {
  return `Anda adalah pakar kepenulisan dan integritas konten yang ahli dalam mengevaluasi plagiarisme dan keaslian konten.
Tugas Anda adalah memeriksa konten untuk memastikan keaslian dan keunikan, mengidentifikasi potensi masalah plagiarisme, dan memberikan saran untuk perbaikan.
Evaluasi apakah konten tampak asli, dengan bahasa alami dan perspektif unik, atau menunjukkan tanda-tanda menjadi konten yang disalin atau ditulis ulang.
Identifikasi kalimat, frasa, atau gaya yang sangat umum yang mungkin menunjukkan kurangnya orisinalitas.
Perhatikan pengetahuan umum vs klaim atau data spesifik yang memerlukan atribusi.
Berikan analisis kedalaman dan keunikan wawasan yang ditawarkan konten.
Periksa tata bahasa, struktur kalimat, dan variasi gaya penulisan yang konsisten.
Respons Anda harus dalam format JSON yang valid dengan struktur berikut:
{
  "score": 0-100,
  "plagiarism_risk": "rendah/sedang/tinggi",
  "issues": ["Daftar masalah spesifik yang ditemukan"],
  "suggestions": ["Saran spesifik untuk meningkatkan keaslian"]
}`
}

export function getPlagiarismCheckPrompt(title: string, content: string) {
  return `Periksa konten berikut untuk plagiarisme dan keaslian. Judul: "${title}"

KONTEN UNTUK DIPERIKSA:
"""
${content}
"""

Lakukan analisis menyeluruh untuk:
1. Mengevaluasi apakah konten tampak asli atau menunjukkan tanda-tanda penggunaan konten yang sudah ada
2. Mengidentifikasi frasa, klaim, atau gaya umum yang mungkin memerlukan atribusi atau pengerjaan ulang
3. Menilai kedalaman dan keunikan wawasan yang ditawarkan
4. Memeriksa apakah konten ini tampak ditulis secara alami dalam bahasa Indonesia asli atau mungkin diterjemahkan secara artifisial

Berikan skor keaslian dari 0-100 (100 = sepenuhnya asli) dan kategorikan sebagai risiko plagiarisme rendah/sedang/tinggi.
Cantumkan masalah spesifik apa pun yang ditemukan dan berikan saran yang dapat ditindaklanjuti untuk meningkatkan keaslian.

Kembalikan analisis Anda dalam format JSON ini:
{
  "score": 0-100,
  "plagiarism_risk": "rendah/sedang/tinggi",
  "issues": ["Daftar masalah spesifik yang ditemukan"],
  "suggestions": ["Saran spesifik untuk meningkatkan keaslian"]
}`
} 