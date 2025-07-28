// controllers/rewriteNote.ts
import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1", // ✅ Required for OpenRouter
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // ✅ Your frontend URL
    "X-Title": "Notely App", // ✅ Optional but recommended
  },
});

export const rewriteNote = async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required." });
  }

  try {
    const prompt = `Rewrite the following note to improve clarity, grammar, and tone, while preserving the original meaning:\n\n"${content}"\n\nRewritten:`;

    const completion = await openai.chat.completions.create({
      model: "openchat/openchat-3.5-1210", // ✅  fast, good
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rewritten = completion.choices?.[0]?.message?.content?.trim();

    res.status(200).json({
      rewrittenContent: rewritten || content,
    });
  } catch (error: any) {
    console.error("Rewrite error:", error?.response?.data || error);
    res.status(500).json({ message: "AI rewrite failed", error });
  }
};
