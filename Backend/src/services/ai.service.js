const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});

const system_prompt = `
You are a Computer Science AI assistant.

Only answer questions related to Computer Science, Programming, Software Development, Data Science, AI/ML, Databases, Web Development, Networking, Operating Systems, Cybersecurity, and related technologies.

If a question is not related to Computer Science, politely say:
"Sorry, I can only help with Computer Science and technology-related questions."

Give clear, accurate, and concise answers. Explain technical concepts simply when needed.
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