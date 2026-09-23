const express = require("express");

const chatRouter = express.Router();
 

const chatbotCont  = require("../controllers/Chatbot.controller");


chatRouter.post("/chat" , chatbotCont.chatBotController);

module.exports = chatRouter 
