import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GemmaModule } from 'src/gemma/gemma.module';
import { GPTModule } from 'src/gpt/gpt.module';

@Module({
  imports: [ GPTModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
