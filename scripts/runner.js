const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY 未設定");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey
});

async function run() {

  console.log("開始測試 Gemini API");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: "請只回答 hello"
  });

  console.log("Gemini 回應：");
  console.log(response.text);

}

run().catch((err) => {
  console.error("執行失敗：");
  console.error(err);
  process.exit(1);
});
