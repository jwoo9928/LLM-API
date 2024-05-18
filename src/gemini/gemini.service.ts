import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { GEMINI_PROMPTS } from 'src/types/prompts';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeminiService {
  private model: GenerativeModel;
  private channels = new Map<string, any>();

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest",
      systemInstruction: GEMINI_PROMPTS
    });
  }

  async createChannel({ id, topic, conv_lan, ex_lan}): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 256 },
      });
      const start = await chat.sendMessage(`role:friend
        topic: ${topic}
        conv_lan: ${conv_lan}
        ex_lan: ${ex_lan}`
      )
      this.channels.set(id, chat);
      return start.response.text();
    } catch (e) {
      throw new Error(`Failed to create channel: ${e.message}`);
    }
  }

  async chat(content: string, id: string): Promise<any> {
    const chat = this.channels.get(id);
    if (!chat) {
      throw new Error("Chat channel not found");
    }
    const result = await chat.sendMessage(content);
    const text = result.response.text()
    return text
  }

  async chatTerminate(id: string): Promise<boolean> {
    try {
      this.channels.delete(id);
      return true;
    } catch(e) {
      return false;
    }
  }

  getHistory(id: string): string {
    return "Chat history functionality not implemented yet.";
  }
}
