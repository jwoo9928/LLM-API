import { Module } from "@nestjs/common";
import { GeminiController } from "./gemini.controller";
import { GeminiService } from "./gemini.service";
import { XTTSService } from "./tts.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [GeminiController],
  providers: [GeminiService, XTTSService],
})
export class GeminiModule {}
