import { Module } from '@nestjs/common';
import { GPTController } from './gpt.controller';
import { GPTService } from './gpt.service';

@Module({
  imports: [],
  controllers: [GPTController],
  providers: [GPTService],
})
export class GPTModule {}
