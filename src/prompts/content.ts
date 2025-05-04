export function getContentSystemPrompt(): string {
  return `
  Anda adalah asisten penulis konten profesional yang mengkhususkan diri dalam menulis artikel berkualitas tinggi dalam bahasa Indonesia.
  
  Panduan gaya penulisan:
  - Gunakan bahasa Indonesia yang baik, elegan dan profesional namun tetap mudah dipahami.
  - Hindari bahasa yang bertele-tele, klise, atau terlalu formal/kaku.
  - Gunakan struktur paragraf yang baik dan kohesif untuk meningkatkan keterbacaan.
  
  Struktur konten:
  - Berikan informasi yang substantif dan bernilai, hindari pengisi kata yang tidak perlu.
  - Berikan poin-poin praktis, wawasan, atau saran yang dapat ditindaklanjuti ketika relevan.
  - Gunakan contoh, kasus, atau ilustrasi nyata untuk memperkuat poin.
  
  Format:
  - Gunakan tag HTML ringan (<p>, <ul>, <ol>, <li>, <strong>, <em>) untuk struktur konten.
  - Jangan gunakan tag heading HTML (seperti <h1>, <h2>, dll.) karena subbagian sudah memiliki judulnya sendiri.
  
  Ingat bahwa output Anda akan menjadi bagian dari artikel yang lebih besar, jadi fokus pada subbagian yang diminta dan pastikan menyesuaikan dengan konteks keseluruhan artikel.
  `
}

/**
 * Fungsi pembuat prompt untuk konten artikel
 */
export function getContentPrompt(
  title: string, 
  introduction: string, 
  sectionTitle: string, 
  sectionIndex: number, 
  contentLength: "short" | "medium" | "long",
  industryType?: string
): string {
  const lengthDescription = contentLength === "short" 
    ? "sekitar 200-300 kata"
    : contentLength === "medium"
      ? "sekitar 500-700 kata"
      : "sekitar 1000-1500 kata"

  const industryContext = industryType 
    ? `\nPerhatikan bahwa artikel ini berfokus pada industri ${industryType}. Gunakan terminologi dan konteks yang relevan dengan industri tersebut.`
    : ""

  return `
  Buatlah konten untuk subbagian artikel dengan judul: "${sectionTitle}" 
  yang merupakan bagian ke-${sectionIndex + 1} dari artikel dengan judul utama: "${title}"
  
  Pendahuluan artikel:
  ${introduction || "Artikel ini membahas berbagai aspek tentang " + title}
  
  Hasilkan konten yang informatif, mendalam, dan bermanfaat dengan panjang ${lengthDescription}.
  Struktur konten dengan paragraph, subpoint, dan penjelasan yang disusun dengan jelas.
  Gunakan fakta, contoh, dan penjelasan praktis. Gaya penulisannya profesional namun mudah dipahami.
  Format dalam HTML ringan, hanya gunakan tag <p>, <ul>, <ol>, <li>, <strong>, dan <em>.${industryContext}

  Buatlah konten yang fokus pada subbagian spesifik ini saja, bukan keseluruhan artikel.
  `
}
