import OpenAI from "openai";

export type AIChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export type AITone = "formal" | "warm" | "plain";

export interface GenerateCommentParams {
  studentName: string;
  tone: AITone;
  highlights: string;
  improvements: string;
}

export interface GenerateCommentResult {
  comment: string;
  model: string;
}

let cachedClient: OpenAI | null = null;

export function getAiClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey) {
    throw new Error("缺少 OPENAI_API_KEY，请检查 .env.local");
  }

  if (cachedClient && cachedClient.baseURL === baseURL) {
    return cachedClient;
  }

  cachedClient = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
  return cachedClient;
}

export function resolveModel(): string {
  const configured = process.env.AI_MODEL?.trim();

  if (configured && configured.length > 0) {
    return configured;
  }

  return "step-3.7-flash";
}

export async function generateComment({
  studentName,
  tone,
  highlights,
  improvements,
}: GenerateCommentParams): Promise<GenerateCommentResult> {
  const client = getAiClient();
  const model = resolveModel();

  const toneLabel =
    tone === "formal" ? "正式稳重" : tone === "warm" ? "温暖鼓励" : "简洁朴实";

  const systemPrompt = `你是老师助手，请根据提供的要点，撰写一份适合放入学生年终评语的段落。`;
  const userPrompt = `学生姓名：${studentName}
语气：${toneLabel}
优点/亮点：${highlights || "无"}
待改进之处：${improvements || "无"}

请输出一段约 100-200 字的年终评语，直接输出正文，不要额外解释。`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  const comment =
    response.choices[0]?.message?.content?.trim() ??
    "抱歉，本次未能生成评语，请稍后重试。";

  return {
    comment,
    model,
  };
}
