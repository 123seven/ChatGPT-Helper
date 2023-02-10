import type { NextRequest } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const replyModeMap = {
  "聊天": "",
  "英语老师": "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is : ",
  "周报生成器": "请帮我把以下的工作内容填充为一篇完整的周报,以分点叙述的形式输出: ",
  "书籍讲解": "这本书主要讲述的是什么: ",
  "翻译英文": "翻译成中文: ",
  "翻译中文": "翻译成英文: ",
  "菜谱": "如何在家自制: "
}

const handler = async (req: NextRequest): Promise<Response> => {
  const { replyMode, text } = (await req.json()) as {
    replyMode?: string;
    text?: string;
  };

  if (!replyMode) {
    return new Response("No replyMode in the request", { status: 400 });
  }
  
  if (!text) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const prompt = `${replyModeMap[replyMode]}${text}`

  console.log("prompt",prompt)

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
