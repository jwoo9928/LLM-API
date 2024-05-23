import { ChatSession } from "@google/generative-ai";

export type UserPrompt = {
  role: string;
  content: string;
};

export interface ChatObject {
  model: string;
  message: Array<UserPrompt>;
}

export interface ChatAI {
  fix: string;
  purpose: string;
  conversation: string;
}

export interface LlmSession {
  chat: ChatSession;
  time: string;
  model: string;
  level: string;
  topic: string;
  startTime: string;
  model_id: number;
  call_id?: number;
}

export interface LVTOBJ {
  user_id: string;
  step: number;
  time: string;
}

export interface GeminiOutput {
  conv: string;
  explain: string;
  eval: string;
  fix: string;
}
