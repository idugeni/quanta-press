import { Article, ArticleSection, ArticleFaq } from '@/types/article';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent));
  element.setAttribute('download', finalFilename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function exportArticleAsPdf(article: Article, filename?: string): void {
  const doc = new jsPDF();
  const finalFilename = `${filename || article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  
  // Judul
  doc.setFontSize(20);
  doc.text(article.title, 20, 20);
  
  // Pendahuluan
  doc.setFontSize(12);
  doc.text('Pendahuluan', 20, 35);
  doc.setFontSize(10);
  const introLines = doc.splitTextToSize(article.introduction, 170);
  doc.text(introLines, 20, 45);
  
  let yPos = 45 + (introLines.length * 7);
  
  // Konten
  article.content.forEach((section: ArticleSection) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.text(section.title, 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    const contentText = section.content.replace(/<[^>]*>/g, '');
    const contentLines = doc.splitTextToSize(contentText, 170);
    doc.text(contentLines, 20, yPos);
    yPos += (contentLines.length * 7) + 10;
  });
  
  // FAQ
  if (article.faqs && article.faqs.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.text('FAQ', 20, yPos);
    yPos += 10;
    
    article.faqs.forEach((faq: ArticleFaq) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(10);
      doc.setFont('', 'bold');
      const questionLines = doc.splitTextToSize(`T: ${faq.question}`, 170);
      doc.text(questionLines, 20, yPos);
      yPos += (questionLines.length * 7);
      
      doc.setFont('', 'normal');
      const answerLines = doc.splitTextToSize(`J: ${faq.answer}`, 170);
      doc.text(answerLines, 20, yPos);
      yPos += (answerLines.length * 7) + 7;
    });
  }
  
  doc.save(finalFilename);
}

export function exportArticleAsWord(article: Article, filename?: string): void {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: article.title, bold: true, size: 32 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: '\n' })]
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Pendahuluan', bold: true, size: 24 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: article.introduction })]
        }),
        ...article.content.flatMap(section => [
          new Paragraph({
            children: [new TextRun({ text: '\n' })]
          }),
          new Paragraph({
            children: [new TextRun({ text: section.title, bold: true, size: 24 })]
          }),
          new Paragraph({
            children: [new TextRun({ text: section.content.replace(/<[^>]*>/g, '') })]
          })
        ]),
        ...(article.faqs && article.faqs.length > 0 ? [
          new Paragraph({
            children: [new TextRun({ text: '\n' })]
          }),
          new Paragraph({
            children: [new TextRun({ text: 'FAQ', bold: true, size: 24 })]
          }),
          ...article.faqs.flatMap(faq => [
            new Paragraph({
              children: [new TextRun({ text: `T: ${faq.question}`, bold: true })]
            }),
            new Paragraph({
              children: [new TextRun({ text: `J: ${faq.answer}` })]
            }),
            new Paragraph({
              children: [new TextRun({ text: '\n' })]
            })
          ])
        ] : [])
      ]
    }]
  });

  const finalFilename = `${filename || article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
  
  Packer.toBlob(doc).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', finalFilename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });
}