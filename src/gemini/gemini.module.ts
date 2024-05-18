import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { XTTSService } from './tts.service';

@Module({
  imports: [],
  controllers: [GeminiController],
  providers: [GeminiService, XTTSService],
})
export class GeminiModule {}
