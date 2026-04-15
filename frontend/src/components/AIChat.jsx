import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMessageSquare, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Amazon assistant. How can I help you today? I can help you find products, answer questions about orders, or provide shopping tips!",
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

  // Simulated AI responses (since we're using OpenAI API)
  const generateResponse = async (userMessage) => {
    try {
      setLoading(true);

      // For demo purposes, return contextual responses
      const lowerMessage = userMessage.toLowerCase();

      let botResponse = '';

      if (
        lowerMessage.includes('hello') ||
        lowerMessage.includes('hi') ||
        lowerMessage.includes('hey')
      ) {
        botResponse =
          "Hello! Welcome to Amazon.in. How can I assist you today? You can ask me about:\n• Product recommendations\n• Shipping and delivery\n• Returns and refunds\n• Account issues\n• Payment help";
      } else if (
        lowerMessage.includes('recommend') ||
        lowerMessage.includes('suggest')
      ) {
        botResponse =
          "I'd be happy to help! To give you the best recommendations, could you tell me:\n• What category are you interested in? (Electronics, Books, Clothing, etc.)\n• What's your budget range?\n• Any specific features you're looking for?";
      } else if (
        lowerMessage.includes('deliver') ||
        lowerMessage.includes('shipping')
      ) {
        botResponse =
          "Here's our delivery info:\n• Standard Delivery: 5-7 business days\n• Express Delivery: 2-3 business days\n• Prime Delivery: 1-2 days (for Prime members)\n• Free delivery on orders above ₹500\n\nWant to check your order status?";
      } else if (
        lowerMessage.includes('return') ||
        lowerMessage.includes('refund')
      ) {
        botResponse =
          "Our return policy:\n• 30 days easy returns\n• Free return shipping\n• Full refund within 5-7 days\n• No questions asked\n\nNeed help with a specific order?";
      } else if (lowerMessage.includes('payment')) {
        botResponse =
          'We accept:\n• Credit/Debit Cards\n• UPI (Google Pay, PhonePe, BHIM)\n• Net Banking\n• Wallet\n• Buy Now Pay Later (BNPL)\n\nAll payments are 100% secure with SSL encryption.';
      } else if (
        lowerMessage.includes('account') ||
        lowerMessage.includes('login')
      ) {
        botResponse =
          'Account help:\n• Safe login with email\n• 2-step verification available\n• Check your orders in "Returns & Orders"\n• Update address anytime\n\nNeed to reset your password?';
      } else {
        botResponse =
          "That's a great question! I'm here to help with:\n[OK] Product recommendations\n[OK] Order tracking\n[OK] Returns and refunds\n[OK] Payment options\n[OK] Shipping info\n\nFeel free to ask me anything!";
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

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
      toast.error('Failed to get response');
      console.error('Chat error:', error);
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
