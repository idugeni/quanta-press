import { Article, ArticleSection, ArticleFaq } from '@/types/article';

/**
 * Memformat konten artikel menjadi teks biasa.
 * @param article Objek artikel yang akan diformat.
 * @returns String berisi konten artikel dalam format teks biasa.
 */
function formatArticleAsText(article: Article): string {
  let textContent = `# ${article.title}\n\n`;
  textContent += `## Pendahuluan\n${article.introduction}\n\n`;

  article.content.forEach((section: ArticleSection) => {
    textContent += `## ${section.title}\n`;
    // Menghapus tag HTML sederhana untuk teks biasa
    const cleanContent = section.content.replace(/<[^>]*>/g, '');
    textContent += `${cleanContent}\n\n`;
  });

  if (article.conclusion) {
    textContent += `## Kesimpulan\n`;
    textContent += `${article.conclusion.summary}\n`;
    textContent += `${article.conclusion.cta}\n\n`;
  }

  if (article.faqs && article.faqs.length > 0) {
    textContent += `## FAQ\n`;
    article.faqs.forEach((faq: ArticleFaq) => {
      textContent += `**T:** ${faq.question}\n`;
      textContent += `**J:** ${faq.answer}\n\n`;
    });
  }

  // Tambahkan bagian lain jika perlu (Metadata, Infografis, dll.)

  return textContent;
}

/**
 * Memicu unduhan file teks di browser.
 * @param filename Nama file yang akan diunduh.
 * @param text Konten teks untuk file tersebut.
 */
function downloadTextFile(filename: string, text: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Mengekspor artikel sebagai file teks (.txt).
 * @param article Objek artikel yang akan diekspor.
 * @param filename Nama file (tanpa ekstensi). Default: judul artikel.
 */
export function exportArticleAsText(article: Article, filename?: string): void {
  const formattedText = formatArticleAsText(article);
  const finalFilename = `${filename || article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
  downloadTextFile(finalFilename, formattedText);
}

/**
 * Memformat konten artikel menjadi Markdown.
 * @param article Objek artikel yang akan diformat.
 * @returns String berisi konten artikel dalam format Markdown.
 */
function formatArticleAsMarkdown(article: Article): string {
  let markdownContent = `# ${article.title}\n\n`;
  markdownContent += `## Pendahuluan\n${article.introduction}\n\n`;

  article.content.forEach((section: ArticleSection) => {
    markdownContent += `## ${section.title}\n`;
    // Di sini kita asumsikan section.content adalah HTML, perlu konversi dasar
    // Untuk konversi yang lebih baik, pertimbangkan library seperti Turndown
    const markdownSectionContent = section.content
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n') // Ganti paragraf
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**') // Ganti bold
      .replace(/<em>(.*?)<\/em>/g, '*$1*') // Ganti italic
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)') // Ganti link
      .replace(/<[^>]*>/g, ''); // Hapus tag lain yang tersisa
    markdownContent += `${markdownSectionContent.trim()}\n\n`;
  });

  if (article.conclusion) {
    markdownContent += `## Kesimpulan\n`;
    markdownContent += `${article.conclusion.summary}\n`;
    markdownContent += `${article.conclusion.cta}\n\n`;
  }

  if (article.faqs && article.faqs.length > 0) {
    markdownContent += `## FAQ\n`;
    article.faqs.forEach((faq: ArticleFaq) => {
      markdownContent += `**T:** ${faq.question}\n`;
      markdownContent += `**J:** ${faq.answer}\n\n`;
    });
  }

  // Tambahkan bagian lain jika perlu (Metadata, Infografis, dll.)

  return markdownContent.trim();
}

// TODO: Implement exportArticleAsMarkdown
/**
 * Mengekspor artikel sebagai file Markdown (.md).
 * (Fungsi ini belum diimplementasikan)
 * @param _article Objek artikel yang akan diekspor (parameter saat ini tidak digunakan).
 * @param _filename Nama file (tanpa ekstensi). Default: judul artikel (parameter saat ini tidak digunakan).
 */
export function exportArticleAsMarkdown(article: Article, filename?: string): void {
  const markdownContent = formatArticleAsMarkdown(article);
  const finalFilename = `${filename || article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  // Menggunakan kembali fungsi downloadTextFile, tapi sesuaikan tipe data jika perlu
  // Untuk Markdown, 'data:text/markdown;charset=utf-8,' mungkin lebih tepat, tapi 'text/plain' umumnya bekerja
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent));
  element.setAttribute('download', finalFilename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}