import { Injectable, Req } from '@nestjs/common';
import Ollama from 'ollama'
import { ChatObject } from 'src/types/ollama';
import axios from 'axios'

const prompt = 'You and I are friends now. You find grammatical errors in the sentences I am talking about, correct them correctly, and write them in brackets. And answer what I said in a way that allows for a natural conversation.'
Ollama.embeddings({
    model:'llama2',
    prompt: prompt
})

@Injectable()
export class GemmaService {
  async chat(content: string): Promise<string> {
    console.log("ask",content)
    const DATA_URL = 'http://localhost:8020/grammer';
    const chatObj: ChatObject = {
        model: 'llama2',
        message:[{role:'user',content: "hello"}]
    }
    const correct_grammer = await axios.get(DATA_URL+"?text="+content)
    const response = await Ollama.chat({
        model: 'llama2',
        messages: [{ role: 'user', content: "Say it in one sentence"+content}],
      })
    console.log("response",response,correct_grammer)
    return response.message.content;
  }
}
