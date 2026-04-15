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

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        botResponse = "Hello! Welcome to Amazon Clone! I'm your AI assistant. I can help you with:\n• Finding products and recommendations\n• Checking delivery and shipping info\n• Understanding our return policy\n• Payment and account questions\n\nHow can I assist you?";
      } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('product')) {
        botResponse = "Great! I'd love to help you find the perfect product! To give you better recommendations, could you tell me:\n\n• What category interests you? (Electronics, Books, Clothing, Home & Kitchen, Sports)\n• What's your budget? (₹500-1000, ₹1000-5000, ₹5000-10000, ₹10000+)\n• Any specific features or brands you prefer?\n\nLet me know and I'll find the best options for you!";
      } else if (lowerMessage.includes('headphone') || lowerMessage.includes('speaker') || lowerMessage.includes('audio')) {
        botResponse = "Great choice! For audio products, we have:\n\n🎧 Popular Options:\n• Sony WH-1000XM5 - ₹24,990 (Best Noise Cancellation)\n• Bose QuietComfort - ₹23,000 (Premium Sound)\n• JBL Flip 6 - ₹12,999 (Portable Speaker)\n\n💡 Would you like recommendations in a specific price range?";
      } else if (lowerMessage.includes('deliver') || lowerMessage.includes('shipping') || lowerMessage.includes('dispatch')) {
        botResponse = "📦 Our Delivery Options:\n\n• Standard Delivery: 5-7 business days (FREE)\n• Express Delivery: 2-3 business days (₹99)\n• Priority Delivery: 1-2 days (₹199)\n• FREE delivery on orders above ₹500\n\n✅ Track your order anytime from the order history section. Need help with a specific order?";
      } else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('cancel')) {
        botResponse = "↩️ Our Return & Refund Policy:\n\n✅ Easy Returns:\n• 30-day return window\n• Free return shipping\n• Full refund within 5-7 business days\n• No questions asked!\n\n📋 How to Return:\n• Go to 'Orders' > Select item > Click 'Return'\n• Print label and drop at nearest courier\n• Get refund once item is received\n\nNeed help with a specific return?";
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
        botResponse = "💳 Payment Methods Accepted:\n\n💰 Cards:\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• UPI (Google Pay, PhonePe, BHIM)\n• Net Banking (All major banks)\n• Digital Wallets\n• Buy Now Pay Later (0% EMI available)\n\n🔒 100% Secure - SSL encrypted with VeriSign\n\nAny payment issues? Let me know!";
      } else if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('2fa') || lowerMessage.includes('security')) {
        botResponse = "👤 Account & Security Help:\n\n✅ Account Features:\n• Secure login with email\n• 2-Factor Authentication (2FA) available\n• View order history\n• Save delivery addresses\n• Manage payment methods\n• Download invoices\n\n🔐 Security Tips:\n• Never share your password\n• Enable 2FA for extra protection\n• Check your orders regularly\n• Report suspicious activity immediately\n\nNeed to reset your password?";
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cheap') || lowerMessage.includes('expensive') || lowerMessage.includes('cost')) {
        botResponse = "💰 Price & Budget Help:\n\n📊 Price Ranges Available:\n• Budget: ₹500-2000\n• Mid-Range: ₹2000-10000\n• Premium: ₹10000-50000\n• Luxury: ₹50000+\n\n🎯 We have options for every budget!\n\nWhat's your budget and what are you looking for?";
      } else if (lowerMessage.includes('discount') || lowerMessage.includes('offer') || lowerMessage.includes('promo') || lowerMessage.includes('coupon')) {
        botResponse = "🎉 Special Offers:\n\n✨ Current Deals:\n• Up to 40% off on Electronics\n• Free shipping on orders above ₹500\n• Exclusive discounts for newsletter subscribers\n• Seasonal sales & flash deals\n\n💌 Subscribe to our newsletter for exclusive offers!\n\nWhat category are you interested in?";
      } else if (lowerMessage.includes('quality') || lowerMessage.includes('authentic') || lowerMessage.includes('genuine')) {
        botResponse = "✅ Product Quality & Authenticity:\n\nWe guarantee:\n• 100% Authentic products from authorized sellers\n• Quality checks before shipping\n• Buyer protection guarantee\n• Easy returns if not satisfied\n• Customer reviews from verified buyers\n\n🛡️ Your satisfaction is our priority!\n\nWould you like product recommendations with top ratings?";
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
        botResponse = "📞 Customer Support:\n\n💬 Chat: Available 24/7 (You're chatting with me now!)\n📧 Email: support@amazonclone.com\n📱 Phone: +91-XXXX-XXXX-XXXX (Monday-Friday, 9 AM-6 PM)\n🌐 Live Chat: Visit our Help Center\n\nI'm here to help! What's your concern?";
      } else if (lowerMessage.includes('wishlist') || lowerMessage.includes('save') || lowerMessage.includes('bookmark')) {
        botResponse = "❤️ Wishlist & Save for Later:\n\n💝 Features:\n• Save products to your wishlist\n• Get price drop notifications\n• Share wishlist with friends\n• Move items between wishlist and cart\n• Access wishlist anytime\n\n🎁 Perfect for gift planning!\n\nReady to start shopping?";
      } else {
        botResponse = "I'd be happy to help! 😊\n\nYou can ask me about:\n• Product recommendations & catalogs\n• Delivery & shipping details\n• Returns & refunds\n• Payment methods\n• Account & security\n• Pricing & discounts\n• Product quality & authenticity\n• Customer support\n\nWhat would you like to know?";
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
