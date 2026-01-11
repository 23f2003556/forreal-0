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
2.  **Gauge Interest:** Estimate the partner's interest/engagement level (0-100) **based strictly on the current mode**.
3.  **Vibe Check:** Describe the current atmosphere (max 5 words).
4.  **Flags Analysis:**
    *   **Red Flags 🚩:** Identify potential issues, toxic behavior, or lack of professionalism/interest based on the mode. Return empty array if none.
    *   **Green Flags 🟢:** Identify positive signals, compatibility, or good professional/social etiquette. Return empty array if none.
5.  **Icebreaker 🧊:** A specific conversation starter or topic change if the conversation seems dry or stalled.
6.  **Summary:** Provide 3 short bullet points summarizing the key takeaways.
7.  **Suggest Replies:** Generate 3 distinct reply options.

**Output Format:**
Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "interestScore": number, // 0-100
  "vibe": "string", // Short description
  "redFlags": ["string", "string"], // Max 2 items
  "greenFlags": ["string", "string"], // Max 2 items
  "icebreaker": "string", // A specific question or topic to bring up
  "summary": ["string", "string", "string"],
  "suggestions": ["string", "string", "string"]
}
`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
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
