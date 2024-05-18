import { Module } from '@nestjs/common';
import { LangChainController } from './langchain.controller';
import { XTTSService } from 'src/gemini/tts.service';
import { LangchainService } from './langchain.service';

@Module({
  imports: [],
  controllers: [LangChainController],
  providers: [LangchainService, XTTSService],
})
export class LangchainModule {}
