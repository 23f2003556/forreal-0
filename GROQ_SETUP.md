# Setting up Groq API (Free Alternative)

## What is Groq?

Groq is a **completely free** AI inference platform that provides access to powerful open-source models like **Llama 3.3 70B** with extremely fast response times. Unlike other providers, Groq offers generous free tier limits with no credit card required.

## Why Groq?

- ✅ **100% Free** - No credit card required
- ✅ **Fast Inference** - Responses in milliseconds
- ✅ **Generous Limits** - 30 requests/minute, 14,400 requests/day
- ✅ **Powerful Models** - Llama 3.3 70B, Mixtral, and more
- ✅ **Easy Setup** - Simple API, compatible with OpenAI SDK

## How to Get Your Free Groq API Key

1. **Visit Groq Console**: Go to [https://console.groq.com](https://console.groq.com)

2. **Sign Up**: Create a free account (no credit card needed)

3. **Generate API Key**:
   - Click on "API Keys" in the left sidebar
   - Click "Create API Key"
   - Give it a name (e.g., "ForReal Chat App")
   - Copy the API key (it starts with `gsk_...`)

4. **Add to Your Project**:
   - Open your `.env.local` file in the project root
   - Add this line (replace with your actual key):
     ```
     GROQ_API_KEY=gsk_your_actual_api_key_here
     ```
   - Save the file

5. **Restart the Dev Server**:
   ```bash
   npm run dev
   ```

## What Changed?

I've replaced Google Gemini with Groq in your chat analysis feature:

- **Old**: Google Gemini (`gemini-flash-latest`)
- **New**: Groq Llama 3.3 70B (`llama-3.3-70b-versatile`)

The AI coaching features (Friend Engine, interest score, vibe check, suggested replies) will now use Groq's free API.

## Rate Limits (Free Tier)

- **Requests per minute**: 30
- **Requests per day**: 14,400
- **Tokens per minute**: 20,000

These limits are very generous for a chat application!

## Troubleshooting

If you see an error about missing API key:
1. Make sure `.env.local` exists in your project root
2. Verify the key starts with `gsk_`
3. Restart your dev server after adding the key
4. Check the console for any error messages

## Alternative Free Models

If you want to try different models, you can change the model in `/src/app/api/analyze/route.ts`:

- `llama-3.3-70b-versatile` - Best overall (current)
- `llama-3.1-70b-versatile` - Fast and reliable
- `mixtral-8x7b-32768` - Good for longer contexts

Just replace the model name on line 79 of the route file.
