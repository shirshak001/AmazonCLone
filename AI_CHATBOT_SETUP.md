# AI Chatbot Setup Guide

## Overview
The Amazon Clone now features a **real AI chatbot** powered by Hugging Face's Mistral-7B model. The chatbot can answer questions about products, delivery, payments, returns, and more.

## Architecture
```
Frontend (React)
    ↓
    │ POST /api/ai/chat
    ↓
Backend (Express)
    ↓
    │ API Request with Hugging Face API Key
    ↓
Hugging Face Inference API (Mistral-7B-Instruct)
    ↓
    │ Response with AI-generated text
    ↓
Backend returns response to Frontend
    ↓
Frontend displays in Chat UI
```

## Setup Instructions

### Step 1: Get a Hugging Face API Key

1. Go to **https://huggingface.co/settings/tokens**
2. Sign up or log in with your Hugging Face account
3. Click **"New token"**
4. Choose a name (e.g., "Amazon Clone AI")
5. Set token type to **"Read"**
6. Click **"Create token"**
7. Copy the token (it starts with `hf_`)

### Step 2: Add API Key to .env

Open `backend/.env` and add:

```env
HUGGINGFACE_API_KEY=hf_YourActualTokenHere
```

**Example:**
```env
HUGGINGFACE_API_KEY=hf_wB8xYzA1C2dE3fG4hIjKlMnOpQrStUvWxYz
```

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

The server will reload and the chatbot will now use **real AI** for responses!

## Features

✨ **Smart Responses**
- Uses Mistral-7B language model
- Context-aware answers about e-commerce
- Professional and helpful tone

🛡️ **Fallback System**
- If API is unavailable, uses keyword-based responses
- Always provides helpful information
- No broken chat experience

⚡ **Performance**
- Responses in 2-5 seconds
- Asynchronous processing
- CORS enabled for secure requests

📱 **Mobile Friendly**
- Works on all devices
- Responsive chat UI
- Smooth animations

## Available Free Tier

Hugging Face offers:
- **Free tier**: Up to 30,000 API calls/month
- Perfect for development and testing
- Upgrade to paid for production use (unlimited calls)

## Endpoint Details

**URL:** `POST /api/ai/chat`

**Request:**
```json
{
  "message": "What are your delivery options?"
}
```

**Response:**
```json
{
  "message": "We offer standard, express, and priority delivery with FREE shipping on orders above ₹500.",
  "timestamp": "2024-04-16T10:30:00Z"
}
```

## Fallback Keywords

If the AI API fails, responses are based on these keywords:
- `hello/hi/hey` → Greeting
- `recommend/suggest/product` → Product recommendations
- `deliver/shipping` → Delivery options
- `return/refund` → Return policy
- `payment/pay` → Payment methods
- `account/login/security` → Account help
- `price/budget` → Pricing info

## Troubleshooting

### Issue: Chatbot shows error message
**Solution:** Check that `HUGGINGFACE_API_KEY` is set in `backend/.env`

### Issue: Chatbot responses are slow
**Solution:** Hugging Face free tier has rate limits. Upgrade to paid tier for faster responses.

### Issue: API key invalid
**Solution:** 
1. Go to https://huggingface.co/settings/tokens
2. Check if token is still valid (tokens can expire)
3. Generate a new token and update `.env`

### Issue: 401 Unauthorized
**Solution:** Ensure the API key starts with `hf_` and is correctly pasted (no extra spaces)

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to Git (it's in `.gitignore`)
- Never share your Hugging Face API key
- For production, use environment variables in deployment platform
- Render and Vercel both support environment variables

### Setting API Key on Render (Backend)

1. Go to your Render Backend service
2. Go to **Environment**
3. Add variable: `HUGGINGFACE_API_KEY` = your_key
4. Deploy

### Setting API Key on Vercel (Frontend)

The frontend doesn't need the key (it calls backend), but ensure `VITE_BACKEND_URL` points to your Render backend.

## Advanced Configuration

### Using Different Models

In `backend/routes/aichat.js`, change:
```javascript
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';
```

To other models:
- `meta-llama/Llama-2-7b-chat` (Meta Llama)
- `tiiuae/falcon-7b-instruct` (Falcon)
- `google/flan-t5-large` (Google FLAN)

### Rate Limiting

To add rate limiting, install:
```bash
npm install express-rate-limit
```

Then add to `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/ai', aiLimiter);
```

## Support

For issues with:
- **Hugging Face API**: Visit https://huggingface.co/support
- **Setup questions**: Check this guide again
- **Code issues**: Check `backend/routes/aichat.js` logs

## Next Steps

✅ Setup complete! Your AI chatbot is now live.

Test it by:
1. Opening the app
2. Clicking the chat button (bottom right)
3. Ask anything about products, delivery, payments, etc.
4. Watch the real AI respond!

Enjoy your intelligent e-commerce assistant! 🚀
