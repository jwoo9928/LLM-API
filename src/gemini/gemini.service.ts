import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { Injectable, NotFoundException } from "@nestjs/common";
import {
  GEMINI_LEVEL_TEST,
  GEMINI_PROMPTS,
  LEVEL_TEST_VER_2,
  TEST_QESTIONS,
} from "src/types/prompts";
import { GeminiOutput, LVTOBJ, LlmSession } from "src/types/llmObjs";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import axios from "axios";

@Injectable()
export class GeminiService {
  private model: GenerativeModel;
  private LVTAI: ChatSession;
  private channels = new Map<string, LlmSession>();
  private LVChannels = new Map<string, LVTOBJ>();

  constructor(private readonly httpService: HttpService) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI);
    this.model = genAI.getGenerativeModel({
      model: process.env.GEMINI_FLASH,
      systemInstruction: GEMINI_PROMPTS,
    });
    // level test ai
    this.LVTAI = genAI
      .getGenerativeModel({
        model: process.env.GEMINI_FLASH,
        systemInstruction: LEVEL_TEST_VER_2,
      })
      .startChat({
        generationConfig: { maxOutputTokens: 100 },
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
    level,
    topic,
    conv_lan,
    ex_lan,
    ai_model,
    call_id,
    model_id,
  }): Promise<GeminiOutput> {
    try {
      const chat = this.model.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 256 },
      });
      const start = await chat.sendMessage(`role:friend
        topic: ${topic}
        conv_lan: ${conv_lan}
        ex_lan: ${ex_lan}`);
      const llmSession: LlmSession = {
        chat,
        topic,
        level,
        call_id,
        model_id,
        model: ai_model,
        time: new Date().toISOString(),
        startTime: new Date().toISOString(),
      };
      this.channels.set(id, llmSession);
      const text = start.response.text();
      console.log("response: ", text);
      return JSON.parse(text);
    } catch (e) {
      throw e;
    }
  }

  async chat(content: string, id: string): Promise<GeminiOutput> {
    const channel = this.channels.get(id);
    if (!channel) {
      throw new Error("Chat channel not found");
    }
    const result = await channel.chat.sendMessage(content);
    channel.time = new Date().toISOString();
    const text = result.response.text();
    return JSON.parse(text);
  }

  async chatTerminate(id: string): Promise<boolean> {
    const channel = this.channels.get(id);
    const usedTimes =
      new Date().getTime() - new Date(channel.startTime).getTime();
    const history = await channel.chat.getHistory();
    const JSONHistory = history.reduce((acc, curr, index) => {
      acc[index] = [curr];
      return acc;
    }, {});
    console.log("history:", JSONHistory);
    const basePayload = {
      user_id: id,
      ended: new Date().toISOString(),
      conversation: JSONHistory,
      usedTimes: usedTimes,
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
      // const response = await firstValueFrom(
      //   this.httpService.post(url, payload)
      // );
      const response = await axios.post(url, payload);
      console.log("data: ", response.data, response.status);
      const result = this.channels.delete(id);
      console.log("result", result);
      if (!result) {
        throw new NotFoundException("Chat channel not found for this ID.");
      }
      return true;
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
