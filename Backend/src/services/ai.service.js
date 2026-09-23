const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});

const system_prompt = `
You are a chatbot named Vinam.

Rules:
1. Answer only questions related to Computer Science.
2. If the question is not related to Computer Science, reply:
   "Sorry, I don't know about that."
3. Keep every answer within 1-2 lines.
4. If the user asks your name,only then reply:
   "My name is Vinam."
`;

async function geminiResponse(input) {

    const stream = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: input,
        system_instruction: system_prompt,
        stream: true
    });

    return stream;
}

module.exports = geminiResponse;