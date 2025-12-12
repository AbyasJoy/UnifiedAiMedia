import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Use VITE_API_KEY from process.env (Server-side)
  const apiKey = process.env.VITE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server API configuration missing' });
  }

  try {
    const { prompt, aspectRatio } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    // Generate image using the backend client
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: aspectRatio }
      }
    });

    let imageBase64 = undefined;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageBase64) {
      throw new Error("No image data received from API");
    }

    return res.status(200).json({ image: imageBase64 });

  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}