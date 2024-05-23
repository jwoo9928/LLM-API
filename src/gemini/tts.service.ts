import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { GEMINI_PROMPTS } from 'src/types/prompts';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class XTTSService {
  private model;
  private channels = new Map<string, any>();

  constructor() {
    
  }

  async streamFromXTTSToClient({
    response,
    text,
    language = 'en',
    model = 'winter'
  }: {
    response: Response;
    text: string;
    language: string;
    model: string;
  }) {
    const ttsUrl = `${process.env.TTS_URL}/tts/tts_stream_with_chunk`
    const params = {
      text,
      language,
      model,
    };
    try {
      const streamResponse = await axios.get(ttsUrl, {
        responseType: 'stream',
        params: params
      });
      const boundary = "TTSBoundary";
      streamResponse.data.on('data', (chunk) => {
        response.write(chunk);
      });

      streamResponse.data.on('end', () => {
        response.write(`\r\n--${boundary}--`);
        response.end();
      });

      streamResponse.data.on('error', (err) => {
        console.error('Error streaming TTS:', err);
        response.end();
      });

    } catch (error) {
      console.error('Request error:', error);
      response.status(500).send('Internal Server Error');
    }
  }


  
}
