import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GemmaModule } from 'src/gemma/gemma.module';

@Module({
  imports: [GemmaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
