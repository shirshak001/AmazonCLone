const express = require('express');
const router = express.Router();
const axios = require('axios');

// Hugging Face Inference API for text generation
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * POST /api/ai/chat
 * Send a message to AI chat and get response
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!HF_API_KEY) {
      return res.status(500).json({ message: 'AI API key not configured' });
    }

    // Amazon context system prompt
    const systemPrompt = `You are a helpful Amazon Clone customer support AI assistant. You help customers with:
- Product recommendations and searches
- Delivery and shipping information
- Returns and refunds policy
- Payment methods and questions
- Account and security help
- Pricing and discounts
- Product quality and authenticity questions
- Customer support

Keep responses concise, friendly, and relevant to e-commerce. Always be helpful and professional.`;

    const response = await axios.post(
      HF_API_URL,
      {
        inputs: `${systemPrompt}\n\nCustomer: ${message}\n\nAI Assistant:`,
        parameters: {
          max_length: 256,
          temperature: 0.7,
          top_p: 0.95,
          top_k: 50,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let botResponse = '';

    // Extract response from Hugging Face API
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      botResponse = response.data[0].generated_text || 'I can\'t generate a response right now. Please try again.';
    } else if (response.data && response.data.generated_text) {
      botResponse = response.data.generated_text;
    } else {
      botResponse = 'I can\'t generate a response right now. Please try again.';
    }

    // Clean up response
    botResponse = botResponse.trim();
    if (botResponse.length > 500) {
      botResponse = botResponse.substring(0, 500) + '...';
    }

    res.status(200).json({
      message: botResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('AI Chat Error:', error.message);

    // Fallback to contextual response if API fails
    const { message } = req.body;
    const fallbackResponse = getFallbackResponse(message);

    res.status(200).json({
      message: fallbackResponse,
      timestamp: new Date(),
      fallback: true,
    });
  }
});

/**
 * Fallback responses if API is unavailable
 */
function getFallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to Amazon Clone! I'm your AI assistant. I can help you with product recommendations, delivery details, returns, payments, and more. What can I assist you with today?";
  } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('product')) {
    return "I'd love to help you find the perfect product! Tell me:\n• What category interests you? (Electronics, Books, Clothing, etc.)\n• What's your budget?\n• Any specific features or brands you prefer?\n\nLet me know and I'll find the best options!";
  } else if (lowerMessage.includes('deliver') || lowerMessage.includes('shipping')) {
    return "📦 Our Delivery Options:\n• Standard: 5-7 days (FREE)\n• Express: 2-3 days (₹99)\n• Priority: 1-2 days (₹199)\n• FREE on orders above ₹500\n\nTrack your order anytime in order history!";
  } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    return "↩️ Return Policy:\n• 30-day return window\n• Free return shipping\n• Full refund in 5-7 days\n• No questions asked!\n\nGo to Orders > Select item > Click 'Return'";
  } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
    return "💳 Payment Methods:\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• UPI (Google Pay, PhonePe, BHIM)\n• Net Banking\n• Wallets\n• Buy Now Pay Later (0% EMI)\n\n🔒 100% Secure with SSL encryption";
  } else if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('security')) {
    return "👤 Account Security:\n• Secure login with email\n• 2-Factor Authentication available\n• View order history\n• Save addresses\n• Manage payment methods\n\n🔐 Never share your password!";
  } else {
    return "I'd be happy to help! You can ask me about:\n• Product recommendations\n• Delivery & shipping\n• Returns & refunds\n• Payment methods\n• Account security\n• Pricing & discounts\n• Customer support\n\nWhat would you like to know?";
  }
}

module.exports = router;
