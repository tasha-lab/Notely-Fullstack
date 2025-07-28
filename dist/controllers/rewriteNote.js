"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteNote = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1", // ✅ Required for OpenRouter
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173", // ✅ Your frontend URL
        "X-Title": "Notely App", // ✅ Optional but recommended
    },
});
const rewriteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { content } = req.body;
    if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Content is required." });
    }
    try {
        const prompt = `Rewrite the following note to improve clarity, grammar, and tone, while preserving the original meaning:\n\n"${content}"\n\nRewritten:`;
        const completion = yield openai.chat.completions.create({
            model: "openchat/openchat-3.5-1210", // ✅  fast, good
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });
        const rewritten = (_d = (_c = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim();
        res.status(200).json({
            rewrittenContent: rewritten || content,
        });
    }
    catch (error) {
        console.error("Rewrite error:", ((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) || error);
        res.status(500).json({ message: "AI rewrite failed", error });
    }
});
exports.rewriteNote = rewriteNote;
