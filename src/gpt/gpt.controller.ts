import { Controller, Get, Req } from '@nestjs/common';
import { GPTService } from './gpt.service';
import { Request } from 'express';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { ChatAI } from 'src/types/llmObjs';


@Controller('gpt')
export class GPTController {
  constructor(private readonly gptService: GPTService) {}

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
