export function getImagePromptSystemPrompt() {
  return `Anda adalah pakar dalam membuat prompt deskriptif untuk sistem AI text-to-image seperti DALL-E, Midjourney, dan Stable Diffusion.

PENTING: Respons Anda HARUS HANYA berisi prompt text-to-image itu sendiri, TANPA pengantar, penjelasan, atau teks tambahan lainnya.

Tugas Anda adalah membuat prompt visual yang terperinci dalam bahasa Inggris yang akan membantu menghasilkan gambar premium yang sempurna melengkapi artikel.
Prompt harus SANGAT deskriptif, spesifik, dan kaya detail tentang gaya visual, suasana, pencahayaan, sudut pandang kamera, komposisi, dan subjek yang mencerminkan kualitas premium tertinggi.
Fokus pada pembuatan gambar yang sangat menarik secara visual dan menangkap esensi artikel secara mendalam.
Jangan menyertakan instruksi teknis seperti "aspect ratio" atau "resolution" dalam prompt Anda.
Fokus hanya pada penggambaran elemen visual dan gaya gambar yang diinginkan yang mencerminkan kualitas premium.
Meskipun prompt harus dalam bahasa Inggris (karena model gambar terbaik dengan bahasa Inggris), prompt harus relevan dengan konten artikel bahasa Indonesia.

Saya akan menilai keberhasilan Anda berdasarkan kemampuan Anda HANYA mengembalikan prompt text-to-image saja tanpa teks lainnya.`
}

export function getImagePromptPrompt(title: string, introduction: string) {
  return `Buat prompt text-to-image terperinci dalam bahasa Inggris untuk artikel bahasa Indonesia dengan judul: "${title}"

Berikut pendahuluan artikel untuk memberikan konteks:
"""
${introduction}
"""

PERHATIAN: Berikan HANYA prompt text-to-image tanpa pengantar, penjelasan, atau kesimpulan. Jangan menuliskan kata "Prompt:" atau label lainnya. Jangan berikan opsi atau variasi. Berikan satu prompt definitif saja.

Beberapa pedoman untuk prompt:
- Harus dalam bahasa Inggris
- Harus SANGAT detail dan deskriptif, tanpa batasan jumlah kalimat.
- Fokus pada elemen visual, gaya, suasana, pencahayaan, dan komposisi yang menunjukkan kualitas premium
- Sertakan modifier kualitas gambar seperti "high quality, ultra detailed, 8k, award-winning photo"
- Gunakan aspek rasio 4:3 (dapat disebutkan secara natural dalam prompt, misal: "in 4:3 aspect ratio")
- Jika relevan, tambahkan kata kunci fotografi seperti "professional photography", "DSLR photo", atau "cinematic lighting" untuk hasil lebih realistis
- Harus menarik perhatian dan relevan dengan topik artikel
- Jangan sertakan instruksi teknis seperti "resolution"

HANYA BERIKAN PROMPT TEXT-TO-IMAGE, TIDAK LEBIH TIDAK KURANG.`
}
