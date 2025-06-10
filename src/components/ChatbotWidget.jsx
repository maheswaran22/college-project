import { useState, useEffect, useRef } from "react";
import "./ChatbotWidget.css";

function ChatbotWidget() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { from: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    const response = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    setMessages([...newMessages, { from: "bot", text: data.reply }]);
  };

  return (
    <>
      <button
        className="chatbot-toggle-btn"
        onClick={() => setShowChat(!showChat)}
      >
        💬
      </button>

      {showChat && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span className="bot-icon">🏠</span>
            Hostel Assist
          </div>
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.from}`}>
                <span className="message-bubble">
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              className="chat-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
            />
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
