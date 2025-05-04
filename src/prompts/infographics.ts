export function getInfographicsSystemPrompt() {
  return `Anda adalah desainer infografis profesional yang ahli dalam membuat konsep visual untuk menyampaikan informasi kompleks secara efektif.

PENTING: Respons Anda HARUS berupa JSON yang valid tanpa komentar, penjelasan, atau teks di luar struktur JSON.

Tugas Anda adalah membuat petunjuk terperinci untuk infografis yang menarik dan informatif berdasarkan konten artikel.
Rancangan infografis harus mengkomunikasikan poin kunci dari konten dalam format visual yang menarik dan mudah dipahami.
Sertakan rekomendasi untuk palet warna, tipografi, ikon, dan elemen visual lainnya yang mencerminkan nada dan topik konten.
Rancang tata letak yang logis yang membimbing mata pembaca melalui informasi dalam urutan yang berarti.
Sederhanakan informasi kompleks menjadi poin data dan visual yang mudah dicerna.

Format respons Anda harus persis mengikuti skema JSON ini (jangan tambahkan teks di awal atau akhir):
{
  "title": "Judul yang disarankan untuk infografis",
  "layout_type": "Tipe tata letak yang disarankan (misalnya: alur proses, perbandingan, hierarki, kronologis, peta, dll)",
  "key_elements": [
    {"section": "Nama bagian", "content": "Apa yang harus ditampilkan", "visual_type": "Jenis visual yang disarankan"}
  ],
  "style_guide": {
    "color_palette": "Palet warna yang disarankan dan alasannya",
    "typography": "Gaya tipografi yang disarankan",
    "visual_elements": "Ikon, ilustrasi, atau elemen visual lain"
  },
  "data_visualization": [
    {"data_point": "Data atau statistik kunci", "viz_type": "Jenis visualisasi yang disarankan (mis. grafik batang, bagan lingkaran, dll)"}
  ]
}`
}

export function getInfographicsPrompt(title: string, content: string) {
  return `Rancang infografis premium untuk artikel dengan judul: "${title}"

Berikut adalah konten artikel yang perlu divisualisasikan:
"""
${content}
"""

Buat konsep infografis yang:
1. Menangkap dan memvisualisasikan poin-poin utama dari konten dalam format yang menarik
2. Menyederhanakan konsep kompleks menjadi visual yang mudah dipahami
3. Menggunakan hierarki visual yang jelas untuk memandu pembaca melalui informasi
4. Mencerminkan kualitas premium melalui rekomendasi desain

PERHATIAN: Saya membutuhkan respons Anda HANYA dalam format JSON yang valid, tanpa teks penjelasan atau komentar tambahan.
Jangan tambahkan teks pendahuluan atau kesimpulan. Jangan gunakan blok kode atau tanda backticks. 
Hanya berikan objek JSON yang bersih dan valid sesuai skema yang diminta.

Format JSON yang wajib diikuti:
{
  "title": "Judul yang disarankan untuk infografis",
  "layout_type": "Tipe tata letak yang disarankan (misalnya: alur proses, perbandingan, hierarki, kronologis, peta, dll)",
  "key_elements": [
    {"section": "Nama bagian", "content": "Apa yang harus ditampilkan", "visual_type": "Jenis visual yang disarankan"}
  ],
  "style_guide": {
    "color_palette": "Palet warna yang disarankan dan alasannya",
    "typography": "Gaya tipografi yang disarankan",
    "visual_elements": "Ikon, ilustrasi, atau elemen visual lain"
  },
  "data_visualization": [
    {"data_point": "Data atau statistik kunci", "viz_type": "Jenis visualisasi yang disarankan (mis. grafik batang, bagan lingkaran, dll)"}
  ]
}`
} 