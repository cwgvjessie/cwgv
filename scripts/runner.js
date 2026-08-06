const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: "請回覆 hello"
});

console.log(response.text);
