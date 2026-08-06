const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY 未設定");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  const title = process.env.ISSUE_TITLE || "";
  const body = process.env.ISSUE_BODY || "";

  console.log("Issue Title:", title);
  console.log("Issue Body:", body);

  const prompt = `
你是一位資深軟體工程師。

請根據以下 GitHub Issue 輸出 JSON。

Issue Title:
${title}

Issue Body:
${body}

請只輸出 JSON，不要輸出 Markdown。

格式：

{
  "filename": "hello.txt",
  "content": "Hello from Gemini API!"
}
`;

  const candidateModels = [
    "gemini-2.5-pro",
    "gemini-2.5-flash"
  ];

  let response = null;
  let lastError = null;

  for (const model of candidateModels) {
    try {
      console.log(`🚀 嘗試模型: ${model}`);

      response = await ai.models.generateContent({
        model,
        contents: prompt
      });

      console.log(`✅ 成功使用模型: ${model}`);
      break;

    } catch (err) {
      console.log(`❌ 模型失敗: ${model}`);
      console.log(err.message);
      lastError = err;
    }
  }

  if (!response) {
    console.error("所有模型皆失敗");
    console.error(lastError);
    process.exit(1);
  }

  const text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("===== Gemini 回應 =====");
  console.log(text);
  console.log("======================");

  const result = JSON.parse(text);

  fs.writeFileSync(
    result.filename,
    result.content,
    "utf8"
  );

  console.log(`✅ 已建立檔案: ${result.filename}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
