import { Module } from '@nestjs/common';
import { GemmaController } from './gemma.controller';
import { GemmaService } from './gemma.service';

@Module({
  imports: [],
  controllers: [GemmaController],
  providers: [GemmaService],
})
export class GemmaModule {}
