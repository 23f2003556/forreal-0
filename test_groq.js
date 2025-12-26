#!/usr/bin/env node

/**
 * Quick test script to verify Groq API integration
 * Run with: node test_groq.js
 */

const Groq = require("groq-sdk");
require('dotenv').config({ path: '.env.local' });

async function testGroqIntegration() {
    console.log("🧪 Testing Groq API Integration...\n");

    // Check for API key
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ ERROR: GROQ_API_KEY not found in .env.local");
        console.log("\n📝 To fix this:");
        console.log("1. Go to https://console.groq.com");
        console.log("2. Create a free account (no credit card needed)");
        console.log("3. Generate an API key");
        console.log("4. Add it to your .env.local file:");
        console.log("   GROQ_API_KEY=gsk_your_key_here");
        process.exit(1);
    }

    try {
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        console.log("✅ API Key found");
        console.log("📡 Sending test request to Groq...\n");

        // Simulate a Friend Engine request
        const testMessages = [
            { role: "user", content: "Hey! How's it going?" },
            { role: "partner", content: "Good! Just finished work. You?" },
            { role: "user", content: "Same here, pretty tired" }
        ];

        const prompt = `
You are a "Friend Engine" AI. Analyze this conversation and provide insights.

Messages:
${JSON.stringify(testMessages, null, 2)}

Return ONLY a JSON object with this structure:
{
  "interestScore": 75,
  "vibe": "Casual and friendly",
  "summary": ["Partner just finished work", "Both seem tired", "Friendly casual chat"],
  "suggestions": ["Want to grab dinner?", "Same! Netflix tonight?", "Tell me about your day"]
}
`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 512,
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0]?.message?.content;
        const analysis = JSON.parse(response);

        console.log("✅ SUCCESS! Groq API is working correctly.\n");
        console.log("📊 Test Analysis Result:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Interest Score: ${analysis.interestScore}/100`);
        console.log(`Vibe: ${analysis.vibe}`);
        console.log(`\nSummary:`);
        analysis.summary.forEach((point, i) => console.log(`  ${i + 1}. ${point}`));
        console.log(`\nSuggested Replies:`);
        analysis.suggestions.forEach((suggestion, i) => console.log(`  ${i + 1}. "${suggestion}"`));
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        console.log("🎉 Your Friend Engine is ready to use!");
        console.log("💡 Start your dev server with: npm run dev");

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        console.log("\n🔍 Troubleshooting:");
        console.log("- Verify your API key is correct");
        console.log("- Check your internet connection");
        console.log("- Visit https://console.groq.com to check your account");
        process.exit(1);
    }
}

testGroqIntegration();
