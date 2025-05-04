'use server';

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime';

if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY });

export async function generateImageAction(prompt: string): Promise<string | null> {
  console.log(`Generating image for prompt: ${prompt.substring(0, 50)}...`);

  const config = {
    temperature: 2,
    topP: 1,
    responseModalities: ['TEXT', 'IMAGE'],
  };

  const contents = [
    {
      role: 'user',
      parts: [
        { text: prompt },
      ],
    },
  ];

  try {
    // Gunakan generateContentStream untuk streaming chunk
    const responseStream = await genAI.models.generateContentStream({
      model: 'gemini-2.0-flash-exp-image-generation',
      config,
      contents,
    });

    let imageInlineData: { mimeType: string; data: string } | null = null;
    for await (const chunk of responseStream) {
      if (
        chunk &&
        chunk.candidates &&
        chunk.candidates[0] &&
        chunk.candidates[0].content &&
        chunk.candidates[0].content.parts &&
        chunk.candidates[0].content.parts[0] &&
        chunk.candidates[0].content.parts[0].inlineData &&
        chunk.candidates[0].content.parts[0].inlineData.data
      ) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        imageInlineData = {
          mimeType: typeof inlineData.mimeType === "string" ? inlineData.mimeType : "image/png",
          data: typeof inlineData.data === "string" ? inlineData.data : ""
        };
        break; // Ambil hanya chunk pertama yang berisi gambar
      }
    }

    if (imageInlineData && imageInlineData.data) {
      const mimeType = imageInlineData.mimeType || 'image/png';
      const base64Data = imageInlineData.data;
      try {
        if (typeof base64Data !== 'string' || !base64Data.trim()) {
          throw new Error('Data gambar dari API kosong atau bukan string.');
        }
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const extension = typeof mimeType === 'string' ? mime.getExtension(mimeType) : 'png';
        const filename = `generated-image-${Date.now()}.${extension || 'png'}`;
        const outputDir = path.join(process.cwd(), 'public', 'generated-images');
        await fs.mkdir(outputDir, { recursive: true });
        const filePath = path.join(outputDir, filename);
        await fs.writeFile(filePath, imageBuffer);
        console.log(`Image saved to: ${filePath}`);
        return `/generated-images/${filename}`;
      } catch (saveError) {
        console.error('Error saving generated image:', saveError);
        return `data:${mimeType};base64,${base64Data}`;
      }
    } else {
      throw new Error('Data gambar tidak ditemukan pada respons API.');
    }
  } catch (error) {
    console.error('Error generating image via action:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred during image generation.');
    }
  }
}