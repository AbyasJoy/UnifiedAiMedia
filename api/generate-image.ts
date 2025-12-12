import { GoogleGenAI } from "@google/genai";

// Force Node.js runtime (REQUIRED for Vercel)
export const config = {
  runtime: "nodejs"
};

export default async function handler(
  req: { method: string; body: any; query: any },
  res: { status: (code: number) => any; json: (data: any) => void }
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.VITE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key missing" });
  }

  try {
    const { prompt, aspectRatio } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "image/png",
        aspectRatio
      }
    });

    let imageBase64 = undefined;

    const parts = response?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = data:image/png;base64,${part.inlineData.data};
        break;
      }
    }

    if (!imageBase64) {
      throw new Error("No image data returned from Gemini");
    }

    return res.status(200).json({ image: imageBase64 });

  } catch (error: any) {
    console.error("Image Generation Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}