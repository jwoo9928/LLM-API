import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { Response } from "express";
import { XTTSService } from "./tts.service";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateChatDto } from "./dto/create-chat.dto";
import { GetResponseDto } from "./dto/get-response.dto";
import axios from "axios";
import { EXAMPLE_TEST_INPUT } from "src/types/prompts";
import { Scores } from "src/types/llmObjs";

@Controller("gemini")
export class GeminiController {
  constructor(
    private readonly gptService: GeminiService,
    private readonly ttsService: XTTSService
  ) {}
  @ApiTags("chat service")
  @Post("create")
  @ApiOperation({ summary: "Create a new chat" })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({ status: 200, description: "Chat created successfully." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  async createChat(@Body() body: CreateChatDto, @Res() clientRes: Response) {
    const { conv_lan, ex_lan, model, model_id, call_id = undefined } = body;
    if (conv_lan.length > 2 || ex_lan.length > 2) {
      throw new HttpException("조건에 맞지 않습니다.", HttpStatus.BAD_REQUEST);
    }
    console.log("body: ", body);
    const textResponse = await this.gptService.createChannel({
      ...body,
      call_id,
      ai_model: model,
    });
    clientRes.status(HttpStatus.OK).json(textResponse);
    // const boundary = "TTSBoundary";
    // clientRes.setHeader('Content-Type', `multipart/mixed; boundary=${boundary}`);
    // clientRes.write(JSON.stringify(text) + "\r\n");
    // await this.ttsService.streamFromXTTSToClient({
    //   response: clientRes,
    //   text: answer.conv,
    //   language: conv_lan,
    //   model: model
    // });
  }
  @ApiTags("chat service")
  @Post("chat/")
  @ApiOperation({ summary: "Get response for a chat" })
  @ApiBody({ type: GetResponseDto })
  @ApiResponse({ status: 200, description: "Response generated successfully." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  async getResponse(
    @Body() body: { answer: string; id: string; azure_scores?: Scores[] },
    @Res() clientRes: Response
  ) {
    const { answer, id, azure_scores = undefined } = body;
    const textResponse = await this.gptService.chat(answer, id, azure_scores);
    clientRes.status(HttpStatus.OK).json(textResponse);
    // await this.ttsService.streamFromXTTSToClient({
    //   response: clientRes,
    //   text: textResponse.conv,
    //   language: lan,
    //   model: model
    // });
  }

  @ApiTags("chat service")
  @Delete("terminate/:id/:scores?") 
  @ApiOperation({ summary: "Terminate a chat channel" })
  @ApiParam({ name: "id", description: "Unique identifier for the chat" })
  @ApiParam({
    name: "scores",
    description: "Scores (optional)",
    required: false,
  }) // 'required: false'로 설정
  @ApiResponse({ status: 200, description: "Chat terminated successfully." })
  @ApiResponse({
    status: 404,
    description: "Chat channel not found for this ID.",
  })
  async terminateChannel(
    @Param("id") id: string,
    @Param("scores") scores: Scores[],
    @Res() clientRes: Response
  ) {
    try {
      console.log("terminate scores: ", scores);
      const result = await this.gptService.chatTerminate(
        id,
        scores || undefined
      );
      clientRes.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.log(e);
      throw new NotFoundException("Chat channel not found for this ID.");
    }
  }

  @ApiTags("level test service")
  @Get("level-test/:user_id?:learn_lan")
  @ApiOperation({ summary: "Get response for a chat" })
  @ApiParam({ name: "user_id", description: "Unique identifier for the test" })
  @ApiParam({
    name: "learn_lan",
    description: "Unique identifier for the chat",
  })
  @ApiResponse({ status: 200, description: "Response generated successfully." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  async getLevelTest(
    @Param("user_id") userId: string,
    @Param("learn_lan") learnLan: string
  ) {
    return this.gptService.levelTest(userId, learnLan);
  }

  @ApiTags("level test service")
  @Get("test-result/:qna/:learn_lan")
  @ApiOperation({ summary: "Get response for a chat" })
  @ApiParam({ name: "qna", description: "qna text" })
  @ApiParam({ name: "learn_lan", description: "learn language" })
  @ApiResponse({ status: 200, description: "Response generated successfully." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  async getLevelTestResult(
    @Param("qna") qna: string,
    @Param("learn_lan") learnLan: string
  ) {
    return (await this.gptService.getLVTestResult(qna, learnLan)) ?? "faild";
  }

  // @Get("testing/tts_wav")
  // async testing() {
  //   const fs = require("fs");
  //   const wavEncoder = require("wav-encoder");

  //   const STREAM_URL =
  //     "http://211.216.233.107:90/tts/tts_stream_chunk?text=hi%20my%20name%20is%20posilping";

  //     const receiveAndSaveAudio = async (url, outputFilePath) => {
  //       try {
  //         const response = await axios.get(url, { responseType: 'arraybuffer' });
  //         // 받은 데이터를 Float32Array로 변환합니다.
  //         const audioBuffer = new Float32Array(response.data);

  //         // 받은 데이터를 WAV 파일 형식으로 인코딩합니다.
  //         const wavData = {
  //           sampleRate: 24000,
  //           channelData: [audioBuffer]
  //         };

  //         // wav-encoder를 사용하여 WAV 파일로 인코딩합니다.
  //         wavEncoder.encode(wavData).then((buffer) => {
  //           fs.writeFileSync(outputFilePath, Buffer.from(buffer));
  //         });
  //       } catch (error) {
  //         console.error(`Error: ${error}`);
  //       }
  //     };

  //   await receiveAndSaveAudio(STREAM_URL, "output_audio.wav");
  // }
}
