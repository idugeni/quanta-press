'use server';

import { promises as fs } from 'fs';
import path from 'path';

import { GoogleGenAI } from '@google/genai';
import mime from 'mime';

// Pastikan variabel lingkungan GEMINI_API_KEY sudah diatur
if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY });

/**
 * Menghasilkan gambar berdasarkan prompt teks menggunakan Gemini Image Generation API.
 * @param prompt Teks prompt untuk menghasilkan gambar.
 * @returns Promise yang resolve dengan URL publik gambar yang disimpan atau null jika gagal.
 */
export async function generateImageAction(prompt: string): Promise<string | null> {
  console.log(`Generating image for prompt: ${prompt.substring(0, 50)}...`);

  const config = {
    temperature: 2, // Sesuaikan sesuai kebutuhan, 1.0 adalah nilai umum
    topP: 1,
    // responseMimeType: 'image/png', // Dihapus karena menyebabkan error 400
  };

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  try {
    // Gunakan generateContent langsung dari genAI.models
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation', // Gunakan model yang mendukung image generation
      config: config, // Corrected property name
      contents: contents
    });

    // Check if response and necessary nested properties exist
    if (
      response &&
      response.candidates &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts[0].inlineData
    ) {
      const inlineData = response.candidates[0].content.parts[0].inlineData;
      const mimeType = inlineData.mimeType;
      const base64Data = inlineData.data;
      
      console.log(`Image generated successfully. Mime type: ${mimeType}`);

      // Menyimpan gambar ke sistem file
      try {
        // Pastikan base64Data adalah string sebelum digunakan
        if (typeof base64Data !== 'string') {
          throw new Error('Invalid base64 data received from API.');
        }
        const imageBuffer = Buffer.from(base64Data, 'base64');
        // Pastikan mimeType adalah string sebelum digunakan, default ke 'png' jika tidak
        const extension = typeof mimeType === 'string' ? mime.getExtension(mimeType) : 'png';
        const filename = `generated-image-${Date.now()}.${extension || 'png'}`;
        // Simpan di dalam folder public agar bisa diakses
        const outputDir = path.join(process.cwd(), 'public', 'generated-images');
        await fs.mkdir(outputDir, { recursive: true }); // Pastikan direktori ada
        const filePath = path.join(outputDir, filename);

        await fs.writeFile(filePath, imageBuffer);
        console.log(`Image saved to: ${filePath}`);

        // Kembalikan URL publik
        return `/generated-images/${filename}`;
      } catch (saveError) {
        console.error('Error saving generated image:', saveError);
        // Fallback: Kembalikan base64 jika penyimpanan gagal, atau lemparkan error spesifik
        // throw new Error('Failed to save the generated image.');
        // Untuk sementara, kita kembalikan base64 sebagai fallback
        console.warn('Falling back to returning base64 data due to save error.');
        return `data:${mimeType};base64,${base64Data}`;
      }
    } else {
      console.error('No valid image data found in the response:', JSON.stringify(response, null, 2));
      // Check safety ratings if available
      if (response?.promptFeedback?.blockReason) {
        console.error('Image generation blocked:', response.promptFeedback.blockReason);
        throw new Error(`Image generation blocked due to: ${response.promptFeedback.blockReason}`);
      }
      throw new Error('Failed to extract image data from the response.');
    }
  } catch (error) {
    console.error('Error generating image via action:', error);
    // Melempar kembali error agar bisa ditangkap di client
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred during image generation.');
    }
  }
}