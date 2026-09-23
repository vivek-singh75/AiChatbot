const express = require('express');
const cors = require("cors")

const app  = express();
const chatbotCont = require("./routes/chatbot.route");

app.use(express.json());
app.use(express.text());
app.use(cors());

app.use("/api/ai" , chatbotCont);

module.exports = app