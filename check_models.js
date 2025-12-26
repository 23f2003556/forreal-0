const Groq = require("groq-sdk");
require('dotenv').config({ path: '.env.local' });

async function main() {
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY not found in .env.local");
        console.log("\nGet your free API key from: https://console.groq.com");
        return;
    }

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    const candidates = [
        "llama-3.3-70b-versatile",      // Recommended - Best overall (70B params)
        "llama-3.1-8b-instant",         // Fastest - Smaller but quick (8B params)
        "llama3-70b-8192",              // Alternative 70B model
        "gemma2-9b-it",                 // Google's Gemma 2 (9B params)
    ];

    console.log("Testing Groq models (all are FREE!)...\n");

    for (const modelName of candidates) {
        try {
            process.stdout.write(`Testing ${modelName}... `);

            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: "Say 'Hello!' in a friendly way." }],
                model: modelName,
                max_tokens: 50
            });

            const response = completion.choices[0]?.message?.content || "No response";
            console.log(`✅ SUCCESS!`);
            console.log(`Response: ${response}`);
            console.log(`Tokens: ${completion.usage?.total_tokens || 'N/A'}\n`);

        } catch (error) {
            console.log(`❌ FAILED`);
            console.log(`Error: ${error.message.split('\n')[0]}\n`);
        }
    }

    console.log("\n✨ RECOMMENDATION: Use 'llama-3.3-70b-versatile' for best results");
    console.log("📊 All models are 100% FREE with generous rate limits!");
}

main();
