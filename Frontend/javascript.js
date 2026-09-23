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


    // -------------------------
    // Add user message
    // -------------------------

    addMessage(message, "user");

    messageInput.value = "";


    // -------------------------
    // UI state
    // -------------------------

    typing.style.display = "block";
    sendButton.disabled = true;


    try {

        // -------------------------
        // Send request
        // -------------------------

        const response = await fetch(
            "https://aichatbot-cre3.onrender.com/api/ai/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(message)
            }
        );


        // -------------------------
        // Check response
        // -------------------------

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Server error:",
                errorText
            );

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        // -------------------------
        // Check stream
        // -------------------------

        if (!response.body) {

            throw new Error(
                "Streaming is not supported by this response"
            );
        }


        // -------------------------
        // Create AI message
        // -------------------------

        typing.style.display = "none";

        const aiMessage = addMessage("", "ai");

        const paragraph =
            aiMessage.querySelector("p");


        // -------------------------
        // Read stream
        // -------------------------

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder("utf-8");


        while (true) {

            const {
                value,
                done
            } = await reader.read();


            if (done) {
                break;
            }


            const chunk =
                decoder.decode(
                    value,
                    {
                        stream: true
                    }
                );


            console.log(
                "Received chunk:",
                chunk
            );


            // Add streamed text
            paragraph.textContent += chunk;


            // Keep chat at bottom
            chatBox.scrollTop =
                chatBox.scrollHeight;
        }


        // Flush decoder
        const remaining =
            decoder.decode();

        if (remaining) {

            paragraph.textContent +=
                remaining;

        }


    } catch (error) {

        console.error(
            "Chat error:",
            error
        );


        typing.style.display = "none";


        addMessage(
            "Sorry, something went wrong. Please try again.",
            "ai"
        );

    } finally {

        typing.style.display = "none";

        sendButton.disabled = false;

        messageInput.focus();

    }

});



function addMessage(text, sender) {

    const messageDiv =
        document.createElement("div");

    messageDiv.classList.add(
        "message"
    );


    if (sender === "user") {

        messageDiv.classList.add(
            "user-message"
        );

    } else {

        messageDiv.classList.add(
            "ai-message"
        );

    }


    // -------------------------
    // Avatar
    // -------------------------

    const avatar =
        document.createElement("div");

    avatar.classList.add(
        "avatar"
    );

    avatar.textContent =
        sender === "user"
            ? "YOU"
            : "AI";


    // -------------------------
    // Content
    // -------------------------

    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );


    // -------------------------
    // Sender
    // -------------------------

    const senderName =
        document.createElement("span");

    senderName.classList.add(
        "sender"
    );

    senderName.textContent =
        sender === "user"
            ? "You"
            : "AI";


    // -------------------------
    // Message
    // -------------------------

    const paragraph =
        document.createElement("p");

    paragraph.textContent = text;


    // -------------------------
    // Build message
    // -------------------------

    content.appendChild(
        senderName
    );

    content.appendChild(
        paragraph
    );

    messageDiv.appendChild(
        avatar
    );

    messageDiv.appendChild(
        content
    );

    chatBox.appendChild(
        messageDiv
    );


    // Scroll down

    chatBox.scrollTop =
        chatBox.scrollHeight;


    return messageDiv;
}