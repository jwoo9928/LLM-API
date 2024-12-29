import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { XTTSService } from "src/gemini/tts.service";
import { LangchainService } from "./langchain.service";

@Controller("langchain")
export class LangChainController {
  constructor(
    private readonly langchainService: LangchainService,
    private readonly ttsService: XTTSService
  ) {}

  @Post("create")
  async createChannel(
    @Body()
    body: {
      id: string;
      topic: string;
      conv_lan: string;
      ex_lan: string;
    }
  ): Promise<{ result: string }> {
    const { id, topic, conv_lan, ex_lan } = body;
    const result = await this.langchainService.createChannel(
      id,
      topic,
      conv_lan,
      ex_lan
    );
    return { result };
  }

  // @Post('message/:id')
  // async sendMessage(@Body('content') content: string, @Param('id') id: string): Promise<string> {
  //   try {
  //     return await this.gptService.chat(content, id);
  //   } catch (error) {
  //     throw new NotFoundException(error.message);
  //   }
  // }

  //   @Get('history/:id')
  //   async getChatHistory(@Param('id') id: string): Promise<string> {

  //   }

  //   @Get('response/')
  //   async getResponse(
  //     @Body('content') content: { answer: string; id: string, lan: string, model: string },
  //     @Res() clientRes: Response,
  //   ) {
  //     // 클라이언트에게 먼저 메시지 전송 (예: 요청받은 ID와 답변)
  //     const {answer, id, lan, model} = content;
  //     const textResponse = this.gptService.chat(answer, id, lan, model);
  //     clientRes.write(`response: ${textResponse}`);
  //     // StreamingService를 통해 S_2 서버로부터의 스트리밍 데이터를 받아 클라이언트에게 전송
  //     await this.ttsService.streamFromXTTSToClient(clientRes);
  //   }
}
