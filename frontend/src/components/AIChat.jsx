import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMessageSquare, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getBackendURL } from '../services/api';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Amazon AI Assistant. How can I help you today? I can help with product recommendations, delivery info, returns, payments, and more!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call backend AI API
  const generateResponse = async (userMessage) => {
    try {
      setLoading(true);
      const backendURL = getBackendURL();
      
      const response = await fetch(`${backendURL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      let botResponse = data.message || 'I can\'t generate a response right now. Please try again.';

      // Clean up response text
      botResponse = botResponse.trim();

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast.error('Failed to get response. Please try again.');
      
      // Fallback response
      const fallbackResponse = "I'm having trouble connecting to the AI service right now. Please try again in a moment, or you can email us at support@amazonclone.com for immediate assistance.";
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: fallbackResponse,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Generate bot response
    await generateResponse(inputValue);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-chat-button"
          title="Chat with AI Assistant"
        >
          <FiMessageSquare size={24} />
          <span className="chat-badge">?</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiMessageSquare size={20} />
              <span>Amazon Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px',
              }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-content">{msg.text}</div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}

            {loading && (
              <div className="chat-message bot">
                <div className="message-content">
                  <FiLoader size={16} style={{ animation: 'spin 2s linear infinite' }} /> Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="chat-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || !inputValue.trim()}
            >
              <FiSend size={18} />
            </button>
          </form>

          {/* Footer */}
          <div className="chat-footer">
            Tip: Ask about products, orders, shipping, returns, or payments!
          </div>
        </div>
      )}
    </>
  );
}
