const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const candidates = [
        "gemini-2.0-flash-exp",
        "gemini-flash-latest",
        "gemini-2.0-flash-lite-preview-02-05",
        "gemini-1.5-flash-latest"
    ];

    console.log("Searching for a working model with free quota...");

    for (const modelName of candidates) {
        try {
            process.stdout.write(`Testing ${modelName}... `);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`✅ SUCCESS!`);
            console.log(`Response: ${result.response.text()}`);
            console.log(`\nRECOMMENDATION: Use '${modelName}'`);
            return;
        } catch (error) {
            console.log(`❌ FAILED`);
            console.log(`Error: ${error.message.split('\n')[0]}`);
        }
    }
    console.log("\nNo working models found in the candidate list.");
}

main();
