const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");
const typing = document.getElementById("typing");
const sendButton = document.getElementById("sendButton");


chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }


    addMessage(message, "user");

    messageInput.value = "";

    typing.style.display = "block";
    sendButton.disabled = true;


   try {

    const response = await fetch(
       // "http://localhost:3000/api/ai/chat"
        "https://aichatbot-cre3.onrender.com/api/ai/chat",
        {
            method: "POST",

            headers: {
                "Content-Type": "text/plain"
            },

            body: message
        }
    );

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    typing.style.display = "none";

    // Create empty AI message
    const aiMessage = addMessage("", "ai");

    const paragraph = aiMessage.querySelector("p");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {

        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        const chunk = decoder.decode(value, {
            stream: true
        });

        //console.log("Received chunk:", chunk);

        paragraph.textContent += chunk;

        chatBox.scrollTop = chatBox.scrollHeight;
    }

}
catch (error) {

    console.error(error);

    addMessage(
        "Sorry, something went wrong. Please try again.",
        "ai"
    );

}
finally {

    typing.style.display = "none";
    sendButton.disabled = false;
    messageInput.focus();

}

});



function addMessage(text, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("ai-message");
    }

    const avatar = document.createElement("div");

    avatar.classList.add("avatar");

    avatar.textContent = sender === "user" ? "YOU" : "AI";

    const content = document.createElement("div");

    content.classList.add("message-content");

    const senderName = document.createElement("span");

    senderName.classList.add("sender");

    senderName.textContent = sender === "user" ? "You" : "AI";

    const paragraph = document.createElement("p");

    paragraph.textContent = text;

    content.appendChild(senderName);
    content.appendChild(paragraph);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}
