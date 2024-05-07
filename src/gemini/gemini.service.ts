import { Injectable, Req } from '@nestjs/common';
import Ollama from 'ollama'
import { ChatAI, ChatObject } from 'src/types/llmObjs';
import  { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
import { GEMINI_PROMPTS } from 'src/types/prompts';
import { splitIntoJSON } from 'src/constants/constants';


const genAI = new GoogleGenerativeAI(process.env.GEMINI);
console.log
const model = genAI.getGenerativeModel({model: 'gemini-pro'})
const channels = {};


@Injectable()
export class GeminiService {
  async createChannel(id: string): Promise<boolean> {
    try {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: GEMINI_PROMPTS }],
          },
          {
            role: "model",
            parts: [{ text: "Ok." }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 30,
        },
      });
      channels[id] = chat;
      return true;
    } catch(e) {
      throw new Error(e)
    }

  }

  async chat(content: string, id: string): Promise<ChatAI> {
    const chat = channels[id];
    const result = await chat.sendMessage(content);
    const chatObject: ChatAI = splitIntoJSON(result.response.text())
    return chatObject
  }

  async getHistory(): Promise<string> {
    return '';
  }
}
