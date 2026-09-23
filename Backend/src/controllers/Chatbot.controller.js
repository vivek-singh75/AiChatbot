const geminiResponse = require("../services/ai.service");

async function chatBotController(req, res) {

    const input = req.body;

    if (!input) {
        return res.status(400).json({
            message: "Input is not defined"
        });
    }

    try {

        const stream = await geminiResponse(input);

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Transfer-Encoding", "chunked");

        for await (const event of stream) {

            if (
                event.event_type === "step.delta" &&
                event.delta?.type === "text"
            ) {

                const chunk = event.delta.text;

                console.log("CHUNK:", chunk);

                res.write(chunk);
            }
        }

        res.end();

    } catch (error) {

        console.error("Gemini error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Gemini request failed",
                error: error.message
            });
        }

        res.end();
    }
}

module.exports = {
    chatBotController
};