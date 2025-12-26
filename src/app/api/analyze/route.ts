import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json(
            { error: 'Groq API Key is missing. Please add GROQ_API_KEY to .env.local and restart the server.' },
            { status: 500 }
        )
    }

    try {
        const { messages, partnerName, mode = 'chill', userPrompt, style } = await req.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        })

        let modeInstructions = ""
        switch (mode) {
            case 'work':
                modeInstructions = "Mode: WORK. Focus on SUPER PROFESSIONAL, clear, and efficient communication. Suggestions should be a mix of polite chat and relevant topic information/substance."
                break
            case 'love':
                modeInstructions = "Mode: LOVE. Focus on romantic, affectionate, and deep connection. Suggestions should be flirtatious, caring, or passionate."
                break
            case 'chill':
            default:
                modeInstructions = "Mode: CHILL. Focus on casual, friendly, and low-pressure communication. Suggestions should be laid back, using slang where appropriate, and fun."
                break
        }

        const prompt = `
You are a "Friend Engine" and Communication Coach AI. Your job is to analyze a chat conversation and provide real-time insights to the user.

**Context:**
The user is chatting with "${partnerName}".
${modeInstructions}

Here are the last 10 messages:
${JSON.stringify(messages, null, 2)}

${userPrompt ? `**USER REQUEST:** The user has a specific request for their next reply: "${userPrompt}". Please prioritize this request when generating suggestions.` : ''}
${style ? `**STYLE:** The user wants the suggestions to be in a "${style}" style. Please ensure all suggestions strictly follow this style.` : ''}

**Your Goal:**
1.  **Analyze Personality:** Briefly describe the partner's communication style.
2.  **Gauge Interest:** Estimate the partner's interest/engagement level (0-100) **based strictly on the current mode**:
    *   **Work Mode:** Interest = Professional engagement, responsiveness, and willingness to collaborate.
    *   **Chill Mode:** Interest = Friendliness, fun, and vibe matching.
    *   **Love Mode:** Interest = Romantic interest, flirtation, and emotional connection.
3.  **Vibe Check:** Describe the current atmosphere (max 5 words) **based on the mode** (e.g., "Productive", "Chill", "Flirty").
4.  **Summary:** Provide 3 short bullet points summarizing the key takeaways or context of the conversation so far.
5.  **Suggest Replies:** Generate 3 distinct reply options for the user based on the "${mode}" mode ${userPrompt ? `and the specific request: "${userPrompt}"` : ''} ${style ? `in a "${style}" style` : ''}:
    *   **Option 1:** Matches the mode, request, and style perfectly.
    *   **Option 2:** A slightly different take on the request and style.
    *   **Option 3:** A bold or creative approach related to the request and style.

**Output Format:**
Return ONLY a JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "interestScore": number, // 0-100 (Contextual to mode)
  "vibe": "string", // Short description (max 5 words)
  "summary": ["string", "string", "string"], // 3 bullet points
  "suggestions": ["string", "string", "string"] // The 3 reply options
}
`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", // Fast and free Llama model
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        })

        const responseText = completion.choices[0]?.message?.content || '{}'
        const analysis = JSON.parse(responseText)

        return NextResponse.json(analysis)

    } catch (error: any) {
        console.error('Analysis error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to analyze chat' },
            { status: 500 }
        )
    }
}
