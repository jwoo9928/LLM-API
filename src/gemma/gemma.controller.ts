import { Controller, Get, Req } from '@nestjs/common';
import { GemmaService } from './gemma.service';
import { Request } from 'express';


@Controller('gemma')
export class GemmaController {
  constructor(private readonly gemmaService: GemmaService) {}

  @Get('/chat')
  async getHello(@Req() request: Request): Promise<string> {
    const contents = request.query.contents as string
    return await this.gemmaService.chat(contents);
  }
}
