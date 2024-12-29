import { ChatSession, GenerativeModel } from "@google/generative-ai";

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
  level: number;
  topic: string;
  startTime: string;
  model_id: number;
  call_id?: number;
  azure_scores: Scores[];
  used_tokens: number;
  language: string;
  history: Array<any>;
}

export interface Scores {
  text: string;
  Accuracy_score: number;
  Prosody_score: number;
  Pronunciation_score: number;
  Completeness_Score: number;
  Fluency_score: number;
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

export interface GEMINIAIModels {
  lv1: GenerativeModel;
  lv2: GenerativeModel;
  lv3: GenerativeModel;
  lv4: GenerativeModel;
  lv5: GenerativeModel;
}
