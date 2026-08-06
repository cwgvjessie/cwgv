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

根據以下 GitHub Issue，請輸出 JSON。

Issue Title:
${title}

Issue Body:
${body}

請只輸出 JSON。

格式如下：

{
  "filename": "hello.txt",
  "content": "Hello CWGV"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt
  });

  const text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini 回應：");
  console.log(text);

  const result = JSON.parse(text);

  fs.writeFileSync(
    result.filename,
    result.content
  );

  console.log(`✅ 已建立檔案 ${result.filename}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
