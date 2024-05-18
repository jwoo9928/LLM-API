import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiModule } from 'src/gemini/gemini.module';
import { LangchainModule } from 'src/langchain/langchain.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    GeminiModule,
    LangchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
