import type { NextRequest } from 'next/server';
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream';
import data from '../../public/prompts.json';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

const replyModeMap: any = data

const handler = async (req: NextRequest): Promise<Response> => {
  const { replyMode, text } = (await req.json()) as {
    replyMode?: string;
    text?: string;
  };

  if (!replyMode) {
    return new Response('No replyMode in the request', { status: 400 });
  }

  if (!text) {
    return new Response('No prompt in the request', { status: 400 });
  }

  const prompt = `${replyModeMap[replyMode]}：${text}`;

  console.log('prompt', prompt);

  const payload: OpenAIStreamPayload = {
    model: 'text-davinci-003',
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
