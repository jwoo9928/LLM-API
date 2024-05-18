import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, Res } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Response } from 'express';
import { XTTSService } from './tts.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetResponseDto } from './dto/get-response.dto';


@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly gptService: GeminiService, 
    private readonly ttsService: XTTSService
  ){ }

  @Post('create')
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiBody({ type: CreateChatDto})
  @ApiResponse({ status: 200, description: 'Chat created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createChat(
    @Body() body: { id: string, topic: string, conv_lan: string, ex_lan: string, model: string },
    @Res() clientRes: Response,
  ) {
    const { id, topic, conv_lan, ex_lan, model} = body;
    const answer = await this.gptService.createChannel({
      id, topic, conv_lan, ex_lan
    });
    clientRes.write(`response: ${answer}`);
    await this.ttsService.streamFromXTTSToClient({
      response: clientRes,
      text: answer,
      language: conv_lan,
      model: model
    });
  }

  @Get('history/:id')
  @ApiOperation({ summary: 'Get chat history by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier for the chat' })
  @ApiResponse({ status: 200, description: 'Chat history retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Chat channel not found for this ID.' })
  async getChatHistory(@Param('id') id: string): Promise<string> {
    try {
      return this.gptService.getHistory(id);
    } catch (error) {
      throw new NotFoundException('Chat channel not found for this ID.');
    }
  }

  @Post('chat/')
  @ApiOperation({ summary: 'Get response for a chat' })
  @ApiBody({ type: GetResponseDto })
  @ApiResponse({ status: 200, description: 'Response generated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async getResponse(
    @Body() body: { answer: string; id: string, lan: string, model: string },
    @Res() clientRes: Response,
  ) {
    // 클라이언트에게 먼저 메시지 전송 (예: 요청받은 ID와 답변)
    const {answer, id, lan, model} = body;
    const textResponse = this.gptService.chat(answer, id);
    clientRes.write(`response: ${textResponse}`);
    // StreamingService를 통해 S_2 서버로부터의 스트리밍 데이터를 받아 클라이언트에게 전송
    await this.ttsService.streamFromXTTSToClient({
      response: clientRes,
      text: answer,
      language: lan,
      model: model
    });
  }

  @Delete('terminate/: id')
  @ApiOperation({ summary: 'Terminate a chat channel' })
  @ApiParam({ name: 'id', description: 'Unique identifier for the chat' })
  @ApiResponse({ status: 200, description: 'Chat terminated successfully.' })
  @ApiResponse({ status: 404, description: 'Chat channel not found for this ID.' })
  async terminateChannel(@Param('id') id: string): Promise<boolean> {
    try {
      return this.gptService.chatTerminate(id);
    } catch (e) {
      throw new NotFoundException('Chat channel not found for this ID.');
    }
  }
}
