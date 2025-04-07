document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat');
    const modelSelect = document.getElementById('model-select');
    
    // Groq API key (as provided)
    const apiKey = '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';
    
    // Chat history
    let chatHistory = [
        { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
    ];
    
    // Function to add a message to the chat UI
    function addMessageToChat(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = content;
        
        messageContent.appendChild(messageParagraph);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to add a loading indicator
    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.id = 'loading-indicator';
        
        const loadingContent = document.createElement('div');
        loadingContent.className = 'message-content';
        
        const loadingText = document.createElement('p');
        loadingText.innerHTML = 'Thinking<span class="loading-dots"></span>';
        
        loadingContent.appendChild(loadingText);
        loadingDiv.appendChild(loadingContent);
        chatMessages.appendChild(loadingDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to remove loading indicator
    function removeLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Function to send message to Groq API
    async function sendMessageToGroq(userMessage) {
        const selectedModel = modelSelect.value;
        
        // Add user message to chat history
        chatHistory.push({ role: "user", content: userMessage });
        
        try {
            addLoadingIndicator();
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: chatHistory,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Remove loading indicator
            removeLoadingIndicator();
            
            // Add AI response to chat
            addMessageToChat(aiResponse, false);
            
            // Add AI response to chat history
            chatHistory.push({ role: "assistant", content: aiResponse });
            
        } catch (error) {
            console.error('Error:', error);
            removeLoadingIndicator();
            addMessageToChat("Sorry, I encountered an error. Please try again later.", false);
        }
    }
    
    // Event listener for send button
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat(message, true);
            userInput.value = '';
            sendMessageToGroq(message);
        }
    });
    
    // Event listener for Enter key
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Event listener for clear chat button
    clearChatButton.addEventListener('click', () => {
        // Clear chat UI except for the first welcome message
        while (chatMessages.children.length > 1) {
            chatMessages.removeChild(chatMessages.lastChild);
        }
        
        // Reset chat history to just the welcome message
        chatHistory = [
            { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
        ];
    });
});
