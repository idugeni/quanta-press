export function getWritingStyleGuide(style: string = "balanced"): string {
  switch (style.toLowerCase()) {
    case "formal":
      return `Gunakan gaya penulisan formal dengan bahasa Indonesia yang tata bahasanya sangat baik dan tepat.
Hindari penggunaan bahasa sehari-hari, slang, atau ekspresi informal.
Gunakan struktur kalimat lengkap dan teratur dengan tingkat formalitas yang konsisten.
Sajikan argumen secara logis dan objektif dengan bukti yang mendukung.
Jaga nada profesional dan akademis sepanjang konten.
Gunakan istilah teknis yang tepat saat diperlukan dengan penjelasan yang jelas.
Hindari penggunaan persona pertama ("saya", "kami") dan lebih memilih perspektif orang ketiga.`;

    case "santai":
      return `Gunakan gaya penulisan santai dan konversasional yang ramah namun tetap profesional.
Gunakan bahasa yang lebih informal dan alami seperti dalam percakapan sehari-hari.
Merasa bebas untuk menggunakan persona pertama ("saya", "kita") untuk menciptakan hubungan dengan pembaca.
Gunakan kalimat yang lebih singkat dan lebih sederhana untuk kemudahan membaca.
Anda bisa bertanya langsung kepada pembaca dan menggunakan bahasa yang lebih personal.
Sertakan analogi dan contoh kehidupan nyata yang relatif untuk membuat konten lebih mudah diakses.
Tetap pertahankan ketepatan dan kejelasan, meskipun dalam nada yang lebih santai.`;

    case "teknis":
      return `Gunakan gaya penulisan teknis yang presisi dan rinci dengan terminologi spesifik.
Sertakan definisi teknis dan penjelasan proses terperinci saat diperlukan.
Gunakan data, spesifikasi, dan metrik kuantitatif untuk mendukung poin-poin Anda.
Sajikan informasi dalam format terstruktur, menggunakan daftar, tabel, atau diagram jika memungkinkan.
Fokus pada fakta dan detail objektif daripada pendapat atau penilaian subjektif.
Rujuk secara spesifik ke standar industri, protokol, atau praktik terbaik yang relevan.
Pertahankan nada profesional dan informatif yang sesuai untuk audiens berpengetahuan teknis.`;

    case "balanced":
    default:
      return `Gunakan gaya penulisan seimbang yang menggabungkan ketepatan profesional dengan keterbacaan.
Jelaskan konsep teknis dalam bahasa yang dapat diakses oleh pembaca umum.
Gunakan bahasa yang jelas dan ringkas yang menemukan keseimbangan antara formal dan konversasional.
Sertakan detail teknis saat relevan tetapi jelaskan signifikansinya dalam istilah praktis.
Berikan contoh kehidupan nyata dan aplikasi untuk membuat konsep kompleks lebih mudah dipahami.
Pertahankan nada profesional tetapi ramah yang menarik bagi berbagai pembaca.
Pertimbangkan audiens yang memiliki minat pada topik tetapi mungkin tidak memiliki keahlian mendalam.`;
  }
}

export function applyWritingStyle(contentPrompt: string, style: string = "balanced"): string {
  const styleGuide = getWritingStyleGuide(style);
  return `${contentPrompt}

PANDUAN GAYA PENULISAN:
${styleGuide}`;
} 