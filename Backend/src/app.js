const express = require("express");
const cors = require("cors");

const app = express();

const chatbotCont = require("./routes/chatbot.route");

// CORS
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "https://vivek-singh75.github.io"
    ]
}));

// Body parser
app.use(express.json());

// Routes
app.use("/api/ai", chatbotCont);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "AI Chatbot Backend is running"
    });
});

module.exports = app;