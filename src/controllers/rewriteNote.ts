// controllers/rewriteNote.ts
import { Request, Response } from "express";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export const rewriteNote = async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required." });
  }

  try {
    const prompt = `Rewrite the following note to improve clarity, grammar, and tone, while preserving the original meaning:\n\n"${content}"`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const rewritten =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    res.status(200).json({
      rewrittenContent: rewritten || content,
    });
  } catch (error: any) {
    console.error("Gemini rewrite error:", error?.response?.data || error);
    res.status(500).json({ message: "Gemini rewrite failed", error });
  }
};
