import { GoogleGenAI } from "@google/genai"

// Initialize the Google Generative AI with your API key
export const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || ""
})

// Use a more stable model
export const modelId = "gemini-2.0-flash-thinking-exp-01-21"

// Function to generate content with streaming
export async function generateContentStream(
  prompt: string,
  systemInstruction?: string,
  onChunk?: (chunk: string) => void,
) {
  try {
    // Create a simple prompt that combines system instruction and user prompt
    const contents = systemInstruction 
      ? [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + prompt }] }]
      : [{ role: "user", parts: [{ text: prompt }] }]

    // Configure the model with appropriate settings
    const config = {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 65536,
      responseMimeType: 'text/plain',
    }

    // Generate content using the newer API
    const response = await genAI.models.generateContentStream({
      model: modelId,
      config,
      contents,
    })

    let fullResponse = ""

    for await (const chunk of response) {
      const chunkText = chunk.text
      if (chunkText) {
        fullResponse += chunkText

        if (onChunk) {
          onChunk(chunkText)
        }
      }
    }

    return fullResponse
  } catch (error) {
    console.error("Error generating content:", error)
    throw error
  }
}

// Function to generate JSON content
export async function generateJsonContent(prompt: string, systemInstruction?: string) {
  try {
    // Create a simple prompt that combines system instruction and user prompt
    const contents = systemInstruction 
      ? [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + prompt }] }]
      : [{ role: "user", parts: [{ text: prompt }] }]

    // Configure the model with appropriate settings for JSON generation
    const config = {
      temperature: 0.2, // Lower temperature for more deterministic JSON
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 65536,
      responseMimeType: 'text/plain',
    }

    // Generate content using the newer API
    const response = await genAI.models.generateContent({
      model: modelId,
      config,
      contents,
    })
    
    // Extract text from the response
    const text = response.text || ""

    // Try to extract JSON from the response
    try {
      // Look for JSON-like structure in the text
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      // If no JSON structure found, try parsing the whole text
      return JSON.parse(text)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      console.log("Raw response:", text)
      throw new Error("Failed to parse JSON response")
    }
  } catch (error) {
    console.error("Error generating JSON content:", error)
    throw error
  }
}

// Function to generate content with Google Search tools enabled
export async function generateContentWithSearch(
  prompt: string,
  systemInstruction?: string,
  onChunk?: (chunk: string) => void,
) {
  try {
    // Create a simple prompt that combines system instruction and user prompt
    const contents = systemInstruction 
      ? [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + prompt }] }]
      : [{ role: "user", parts: [{ text: prompt }] }]

    // Configure the model with appropriate settings and enable Google Search tool
    const tools = [
      { googleSearch: {} },
    ]
    
    const config = {
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 65536,
      tools,
      responseMimeType: 'text/plain',
    }

    // Generate content using the newer API with tools
    const response = await genAI.models.generateContentStream({
      model: modelId,
      config,
      contents,
    })

    let fullResponse = ""

    for await (const chunk of response) {
      const chunkText = chunk.text
      if (chunkText) {
        fullResponse += chunkText

        if (onChunk) {
          onChunk(chunkText)
        }
      }
    }

    return fullResponse
  } catch (error) {
    console.error("Error generating content with search:", error)
    throw error
  }
}
