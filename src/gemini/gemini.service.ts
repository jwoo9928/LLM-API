import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { Injectable, NotFoundException } from "@nestjs/common";
import {
  GEMINI_LEVEL_2,
  GEMINI_LOW_LEVEL,
  GEMINI_LEVEL_TEST,
  GEMINI_PROMPTS,
  LEVEL_TEST_VER_2,
  TEST_QESTIONS,
  LOW_LEVEL_HISTORY,
  GEMINI_PROMPTS_2,
} from "src/types/prompts";
import {
  GEMINIAIModels,
  GeminiOutput,
  LVTOBJ,
  LlmSession,
  Scores,
} from "src/types/llmObjs";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import axios from "axios";
import { conversation, fixSentense } from "src/types/rolePrompts";
import { outputToJson, outputToJsonWithScore } from "src/constants/constants";

@Injectable()
export class GeminiService {
  private HighLevelModel: GenerativeModel;
  private LowLevelModel: GenerativeModel;
  private AIFixter: ChatSession;
  private LVTAI: ChatSession;
  private tokenCounter: GenerativeModel;
  private channels = new Map<string, LlmSession>();
  private LVChannels = new Map<string, LVTOBJ>();

  constructor(private readonly httpService: HttpService) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    this.HighLevelModel = genAI.getGenerativeModel({
      model: process.env.GEMINI_FLASH,
      systemInstruction: GEMINI_PROMPTS,
    });
    this.LowLevelModel = genAI.getGenerativeModel({
      model: process.env.GEMINI_FLASH,
      systemInstruction: conversation,
      generationConfig: {
        maxOutputTokens:300,
      }
    });

    this.AIFixter = genAI
    .getGenerativeModel({
      model: process.env.GEMINI_FLASH,
      systemInstruction: fixSentense,
    })
    .startChat({
      generationConfig: { maxOutputTokens: 100 },
    });
    
    this.LVTAI = genAI
      .getGenerativeModel({
        model: process.env.GEMINI_FLASH,
        systemInstruction: LEVEL_TEST_VER_2,
      })
      .startChat({
        generationConfig: { maxOutputTokens: 100 },
      });

    this.tokenCounter = genAI.getGenerativeModel({
      model: process.env.GEMINI_FLASH,
    });

    setInterval(() => {
      const now = new Date().getTime();

      this.channels.forEach((session, id) => {
        const lastActive = new Date(session.time).getTime();
        if (now - lastActive > 5 * 60 * 1000) {
          // 5분 체크
          this.chatTerminate(id).catch(console.error);
        }
      });

      this.LVChannels.forEach((session, id) => {
        const lastActive = new Date(session.time).getTime();
        if (now - lastActive > 1 * 60 * 1000) {
          // 1분 체크
          this.chatTerminate(id).catch(console.error);
        }
      });
    }, 60 * 1000); // 1분마다 체크
  }

  async createChannel({
    id,
    level = 5,
    topic,
    conv_lan,
    ex_lan,
    ai_model,
    call_id,
    model_id,
  }): Promise<GeminiOutput> {
    try {
      const model = level > 3 ? this.HighLevelModel : this.LowLevelModel;
      const chat = model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 256 },
      });
      const start = await chat.sendMessage(`
        topic: ${topic}
        conv_lan: ${conv_lan}
        ex_lan: ${ex_lan}`);
      const tokens = await this.tokenCounter.countTokens(`
      topic: ${topic}
      conv_lan: ${conv_lan}
      ex_lan: ${ex_lan}`);
      const llmSession: LlmSession = {
        chat,
        topic,
        level,
        call_id,
        model_id,
        language: conv_lan,
        model: ai_model,
        time: new Date().toISOString(),
        startTime: new Date().toISOString(),
        azure_scores: [],
        used_tokens: tokens.totalTokens,
        history: await chat.getHistory()
      };
      this.channels.set(id, llmSession);
      const text = outputToJson( start.response.text());
      console.log('text',text)
      return JSON.parse(text);
    } catch (e) {
      throw e;
    }
  }

  async chat(
    content: string,
    id: string,
    azure_scores?: Scores[]
  ): Promise<GeminiOutput> {
    const channel = this.channels.get(id);
    if (!channel) {
      throw new Error("Chat channel not found");
    }
    const tokens = await this.tokenCounter.countTokens(content);
    const result = await this.AIFixter.sendMessage(`langauge:${channel.language}\nsentences:${content}`);
    channel.time = new Date().toISOString();
    channel.used_tokens += tokens.totalTokens;

    if (azure_scores?.length > 0) {
      channel.azure_scores.push(...azure_scores);
    }

    const text = outputToJsonWithScore( result.response.text());
    const data = JSON.parse(text);

    channel.history = [
      ...channel.history,
      {
        role: "user",
        parts: [{text: content}],
      }
    ]

    if (
      channel.level < 4 &&
      data?.score &&
      data?.eval &&
      data?.fix &&
      data.score <= 6
    ) {
      console.log("chat1: ", text);
      channel.history = [
        ...channel.history,
        {
          role: "model",
          parts: [{ text: text }],
        },
      ];
      return data;
    } else {
      const result = await channel.chat.sendMessage(content);
      const text = outputToJson(result.response.text());
      console.log("chat2: ", text);
      channel.history = [
        ...channel.history,
        {
          role: "model",
          parts: [{ text: text }],
        },
      ];
      return JSON.parse(text);
    }
  }

  async chatTerminate(id: string, azure_scores?: Scores[]): Promise<Object> {
    const channel = this.channels.get(id);
    if (azure_scores?.length > 0) {
      channel.azure_scores.push(...azure_scores);
    }
    const azures = channel.azure_scores;
    const usedTimes =
      new Date().getTime() - new Date(channel.startTime).getTime();
    const history = channel.history;
    const basePayload = {
      user_id: id,
      ended: new Date().toISOString(),
      conversation: history,
      usedTimes: usedTimes,
      azure_scores: azures,
      used_tokens: channel.used_tokens,
    };

    const payload = channel.call_id
      ? { ...basePayload, call_id: channel.call_id }
      : {
          ...basePayload,
          model_id: channel.model_id,
          topic: channel.topic,
        };

    const url = !channel.call_id
      ? process.env.SUPA_CREATE_RECORD
      : process.env.SUPA_ADD_RECORD;

    try {
      const response = await axios.post(url, payload);
      console.log("data: ", response.data, response.status);
      const totalScores = {
        Accuracy_score: 0,
        Prosody_score: 0,
        Pronunciation_score: 0,
        Completeness_Score: 0,
        Fluency_score: 0,
      };

      if (azures?.length > 0) {
        azures.forEach((azure) => {
          totalScores.Accuracy_score += azure?.Accuracy_score ?? 0;
          totalScores.Prosody_score += azure?.Prosody_score ?? 0;
          totalScores.Pronunciation_score += azure?.Pronunciation_score ?? 0;
          totalScores.Completeness_Score += azure?.Completeness_Score ?? 0;
          totalScores.Fluency_score += azure?.Fluency_score ?? 0;
        });
        const numScores = azures.length;
        if (numScores > 0) {
          totalScores.Accuracy_score = totalScores.Accuracy_score / numScores;
          totalScores.Prosody_score = totalScores.Prosody_score / numScores;
          totalScores.Pronunciation_score =
            totalScores.Pronunciation_score / numScores;
          totalScores.Completeness_Score =
            totalScores.Completeness_Score / numScores;
          totalScores.Fluency_score = totalScores.Fluency_score / numScores;
        }
      }
      const result = this.channels.delete(id);
      if (!result) {
        throw new NotFoundException("Chat channel not found for this ID.");
      }
      return {
        ...response.data,
        azure_avg_score: totalScores,
      };
    } catch (error) {
      console.error("HTTP request failed:", error);
      throw new Error("Failed to communicate with the Supabase service.");
    }
  }

  levelTest(user_id, learn_lan) {
    let LVT = this.LVChannels.get(user_id);

    if (!LVT) {
      LVT = {
        user_id,
        step: 1,
        time: new Date().toISOString(),
      };
      this.LVChannels.set(user_id, LVT);
    }

    let answer;
    switch (LVT.step) {
      case 1:
        answer = TEST_QESTIONS.first?.[learn_lan] ?? "error: learn_lan.";
        LVT.step += 1;
        break;
      case 2:
        answer = TEST_QESTIONS.second?.[learn_lan] ?? "error: learn_lan.";
        LVT.step += 1;
        break;
      case 3:
        answer = TEST_QESTIONS.third?.[learn_lan] ?? "error: learn_lan.";
        this.LVChannels.delete(user_id);
        break;
      default:
        answer = "Invalid step.";
    }

    return answer;
  }

  async getLVTestResult(qna, learn_lan) {
    try {
      console.group("qna, lan:", qna, learn_lan);
      const result = await this.LVTAI.sendMessage(
        `learn_lan: ${learn_lan}
        ${qna}`
      );
      console.log("text: ", result.response.text());
      return result.response.text();
    } catch (e) {
      throw new Error(e);
    }
  }

  async getHisoryList(user_id, call_id) {}

  getHistory(id: string): string {
    return "Chat history functionality not implemented yet.";
  }
}
