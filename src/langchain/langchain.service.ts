
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { GEMINI_PROMPTS } from 'src/types/prompts';
import { HttpService } from '@nestjs/axios';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

@Injectable()
export class LangchainService {
  private geminiModel;
  private gptModel;
  private channels = new Map<string, any>();

  constructor() {
    this.geminiModel = new ChatGoogleGenerativeAI({
        model: process.env.GEMINI_FLASH,
        maxOutputTokens: 2048,
        streaming: false,
        apiKey: process.env.GEMINI
    })
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    // this.geminiModel = genAI.getGenerativeModel({ 
    //   model: "gemini-1.5-pro-latest",
    //   systemInstruction: GEMINI_PROMPTS
    // });
  }

  async getMemory () {
    const memory = new BufferMemory()
    return memory
  }

  async createChannel(id: string, topic: string, conv_lan: string, ex_lan: string ): Promise<string> {
    try {
      const systemInstruction = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
          GEMINI_PROMPTS
        ),
        new MessagesPlaceholder("history"),
        HumanMessagePromptTemplate.fromTemplate("{text}"),
      ]);
      const memory = await this.getMemory();
      const chatChain = new ConversationChain({
        llm: this.geminiModel,
        memory: memory,
        prompt: systemInstruction
      });
      const role = "friend"
      const result = await chatChain.call({
        role,
        input: `
        role: ${role}
        topic: ${topic}
        conv_lan: ${conv_lan}
        ex_lan: ${ex_lan}
        `,
      })
      this.channels.set(id, chatChain);
      return `${result}`;
    } catch (e) {
      console.log("error:",e)
      throw new Error(`Failed to create channel for ${id}`);
    }
  }

  async chat(content: string, id: string, language: string, model: string): Promise<any> {
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
