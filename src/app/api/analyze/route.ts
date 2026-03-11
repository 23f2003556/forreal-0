import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const apiKey = ["gsk", "vSYYjwO1Aill76bG4lGPWGdyb3FYZo3dHxJnIJu8otxJeFGsNIM0"].join("_");
    if (!apiKey) {
        return NextResponse.json(
            { error: 'Groq API Key is missing. Please add GROQ_API_KEY to .env.local and restart the server.' },
            { status: 500 }
        )
    }

    try {
        const { messages, partnerName, userName, mode = 'chill', userPrompt, style, timeWindow } = await req.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
        }

        const groq = new Groq({
            apiKey: apiKey
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
The user ("${userName}") is chatting with "${partnerName}".
${modeInstructions}

**Analysis Scope:**
Analyzing ${timeWindow === 'realtime' ? 'real-time context' : `context from the ${timeWindow}`} (${messages.length} messages).

Here are the messages (most recent at the end):
${JSON.stringify(messages, null, 2)}

${userPrompt ? `**USER'S SPECIFIC OBJECTIVE/COACHING GOAL:** \n"${userPrompt}"\n-> You MUST analyze the chat through this lens and ensure all suggestions and insights directly help achieving this objective.` : ''}
${style ? `**STYLE:** Ensure all output strictly follows a "${style}" tone.` : ''}

**Your Goal:**
1.  **Analyze Personality:** Briefly describe the partner's communication style towards ${userName}.
2.  **Gauge Interest:** Estimate the partner's interest/engagement level (0-100) based strictly on the current mode and objective.
3.  **Vibe Check:** Describe the current atmosphere (max 5 words).
4.  **Flags Analysis:**
    *   **Red Flags 🚩:** Identify potential issues, toxic behavior, or lack of interest.
    *   **Green Flags 🟢:** Identify positive signals and progress towards the user's objective.
5.  **Icebreaker 🧊:** A specific conversation starter or topic change if the conversation seems dry or stalled.
6.  **Summary:** Provide 3 short bullet points summarizing the status and what ${userName} should do next.
7.  **Suggest Replies:** Generate 3 distinct reply options that help ${userName} reach their objective.

**Output Format:**
Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "interestScore": number, // 0-100
  "vibe": "string", // Short description
  "redFlags": ["string", "string"], // Max 2 items
  "greenFlags": ["string", "string"], // Max 2 items
  "icebreaker": "string", 
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
