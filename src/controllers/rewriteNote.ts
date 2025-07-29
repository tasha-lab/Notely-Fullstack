import { Request, Response } from "express";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const rewriteNote = async (req: Request, res: Response) => {
  const { content } = req.body;

  // Debug logging
  console.log("=== REWRITE REQUEST START ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Content received:", content);
  console.log("Has API Key:", !!GEMINI_API_KEY);
  console.log("API Key length:", GEMINI_API_KEY?.length);
  console.log("Gemini API URL:", GEMINI_API_URL);

  if (!content || content.trim() === "") {
    console.log("ERROR: No content provided");
    return res.status(400).json({ message: "Content is required." });
  }

  try {
    const prompt = `Rewrite the following note to improve clarity, grammar, and tone, while preserving the original meaning:\n\n"${content}"`;

    console.log("Making request to Gemini API...");
    console.log("Prompt length:", prompt.length);

    const response = await axios.post(
      GEMINI_API_URL,
      {
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
      },
      {
        timeout: 30000, // 30 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API Response Status:", response.status);
    console.log(
      "Gemini API Response Data:",
      JSON.stringify(response.data, null, 2)
    );

    const rewritten =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rewritten) {
      console.log("ERROR: No rewritten content returned");
      throw new Error("No content returned from Gemini API");
    }

    console.log("SUCCESS: Rewritten content length:", rewritten.length);
    console.log("=== REWRITE REQUEST END ===");

    res.status(200).json({
      rewrittenContent: rewritten,
    });
  } catch (error: any) {
    console.error("=== REWRITE ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Response status:", error?.response?.status);
    console.error("Response statusText:", error?.response?.statusText);
    console.error("Response data:", error?.response?.data);
    console.error("Request config URL:", error?.config?.url);
    console.error("Full error:", error);
    console.error("=== END ERROR ===");

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
      res.status(500).json({
        message: "Model not found. Please check the API configuration.",
      });
    } else {
      res.status(500).json({
        message: "Failed to rewrite note",
        error: error?.response?.data?.error?.message || error.message,
        details: {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          hasApiKey: !!GEMINI_API_KEY,
        },
      });
    }
  }
};
