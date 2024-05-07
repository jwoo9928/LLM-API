import { Controller, Get, Req } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Request } from 'express';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { ChatAI } from 'src/types/llmObjs';


@Controller('gpt')
export class GeminiController {
  constructor(private readonly gptService: GeminiService) {}

  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    description: 'The id of the chat',
  })
  @Get('/chat/create')
  async createChannel(@Req() request: Request): Promise<boolean> {
    const id = request.query.id as string;
    return await this.gptService.createChannel(id);
  }

  @ApiQuery({
    name: 'contents',
    required: true,
    type: String,
    description: 'The contents of the chat',
  })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    description: 'The id of the chat',
  })
  @Get('/chat/talk')
  async getHello(@Req() request: Request): Promise<ChatAI> {
    const contents = request.query.contents as string;
    const id = request.query.id as string;
    return await this.gptService.chat(contents, id);
  }


  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    description: 'The id of the chat',
  })
  @Get('/chat/history')
  async getHistory(): Promise<string> {
    return await this.gptService.getHistory();
  }
}
