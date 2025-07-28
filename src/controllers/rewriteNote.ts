// // controllers/rewriteNote.ts
// import { Request, Response } from "express";
// import axios from "axios";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// export const rewriteNote = async (req: Request, res: Response) => {
//   const { content } = req.body;

//   if (!content || content.trim() === "") {
//     return res.status(400).json({ message: "Content is required." });
//   }

//   try {
//     const prompt = `Rewrite the following note to improve clarity, grammar, and tone, while preserving the original meaning:\n\n"${content}"`;

//     const response = await axios.post(GEMINI_API_URL, {
//       contents: [
//         {
//           role: "user", // ✅ REQUIRED
//           parts: [{ text: prompt }],
//         },
//       ],
//     });

//     const rewritten =
//       response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//     res.status(200).json({
//       rewrittenContent: rewritten || content,
//     });
//   } catch (error: any) {
//     console.error("Gemini rewrite error:", error?.response?.data || error);
//     res.status(500).json({ message: "Gemini rewrite failed", error });
//     console.error(
//       "Gemini rewrite error:",
//       error?.response?.data || error.message || error
//     );
//   }
// };
// controllers/rewriteNote.ts
import { Request, Response } from "express";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// Updated to use gemini-1.5-flash or gemini-1.5-pro
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const rewritten =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rewritten) {
      throw new Error("No content returned from Gemini API");
    }

    res.status(200).json({
      rewrittenContent: rewritten,
    });
  } catch (error: any) {
    console.error(
      "Gemini rewrite error:",
      error?.response?.data || error.message || error
    );

    // More specific error handling
    if (error?.response?.status === 429) {
      res
        .status(429)
        .json({ message: "Rate limit exceeded. Please try again later." });
    } else if (error?.response?.status === 403) {
      res
        .status(403)
        .json({ message: "API key invalid or insufficient permissions." });
    } else if (error?.response?.status === 404) {
      res
        .status(500)
        .json({
          message: "Model not found. Please check the API configuration.",
        });
    } else {
      res.status(500).json({
        message: "Failed to rewrite note",
        error: error?.response?.data?.error?.message || error.message,
      });
    }
  }
};
