const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY 未設定");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: "請回答 hello"
  });

  console.log(response.text);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
