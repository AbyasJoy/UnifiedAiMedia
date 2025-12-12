import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "nodejs"
};

export default async function handler(
  req: { method: string; body: any },
  res: { status: (code: number) => any; json: (data: any) => void }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ensure VITE_API_KEY is available in the environment
  const apiKey = process.env.VITE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API key missing' });
  }

  try {
    const { prompt, aspectRatio } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    // Use the correct model and config for the @google/genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { 
          aspectRatio: aspectRatio || "1:1" 
        }
      }
    });

    let imageBase64: string | undefined;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageBase64) {
      throw new Error("No image data returned from Gemini");
    }

    // Construct the data URL using a template literal
    const finalImage = `data:image/png;base64,${imageBase64}`;

    return res.status(200).json({ image: finalImage });

  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}