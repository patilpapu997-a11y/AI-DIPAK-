import { GoogleGenAI } from "@google/genai";

// We don't initialize here because we need to wait for the key from window.aistudio
// or use the process.env if we were on a server. Since we are client-side and 
// using the paid model, we rely on the user selecting a key.

export const generateImage = async (
  prompt: string, 
  size: '1K' | '2K' | '4K' = '1K'
): Promise<{ imageUrl: string }> => {
  
  if (!process.env.API_KEY) {
     // If we are in the special mode where user selects key via window.aistudio
     // The SDK actually picks it up automatically if we don't pass one? 
     // Or we need to fetch it? 
     // Based on prompt instructions: "The selected API key is available via process.env.API_KEY. It is injected automatically"
     // But wait, the prompt says "Users must select their own paid API key... This is a mandatory step... The selected API key is available via process.env.API_KEY"
     // This implies the environment (browser runtime provided by the tool) injects it.
  }

  // Create a new instance right before making the call as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // Use the specific model requested
  const modelName = 'gemini-3-pro-image-preview';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Default to square
          imageSize: size
        }
      }
    });

    let imageUrl = '';
    
    // Iterate to find image part
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                imageUrl = `data:image/png;base64,${base64EncodeString}`;
                break;
            }
        }
    }

    if (!imageUrl) {
        throw new Error("No image generated in response");
    }

    return { imageUrl };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};